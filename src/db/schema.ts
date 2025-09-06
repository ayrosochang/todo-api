import { pgTable, uuid, varchar, boolean, text, timestamp, decimal, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
});

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  completed: boolean('completed').notNull().default(false),
  // Using decimal for flexible ordering - allows inserting between any two items
  // without having to renumber existing items
  position: decimal('position', { precision: 20, scale: 10 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  // Index for efficient querying by user and position
  index('todos_user_position_idx').on(table.userId, table.position),
  // Index for efficient querying by user and completion status
  index('todos_user_completed_idx').on(table.userId, table.completed),
]);
