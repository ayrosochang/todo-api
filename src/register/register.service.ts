import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../db/database.service';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { JwtPayload, User } from './types/register.types';

@Injectable()
export class RegisterService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length > 0) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await this.databaseService.db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.username,
      });

    const user = newUser[0];

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      username: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.email,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Find user by username
    const user = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const foundUser = user[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: foundUser.id,
      username: foundUser.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: foundUser.id,
        username: foundUser.username,
      },
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.databaseService.db
      .select({
        id: users.id,
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (user.length === 0) {
      throw new UnauthorizedException('User not found');
    }

    return user[0];
  }
}
