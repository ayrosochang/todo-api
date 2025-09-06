import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../db/database.module';
import { jwtConstants } from './constants';

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [RegisterController],
  providers: [RegisterService, JwtStrategy],
  exports: [RegisterService],
})
export class RegisterModule {}
