import {
  text,
  uuid,
  index,
  decimal,
  pgTable,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    todoId: uuid('todo_id')
      .notNull()
      .references(() => todos.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    completed: boolean('completed').notNull().default(false),
    // Using decimal for flexible ordering - allows inserting between any two items
    // without having to renumber existing items
    position: decimal('position', { precision: 20, scale: 10 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    // Index for efficient querying by user and position
    index('tasks_user_position_idx').on(table.todoId, table.position),
    // Index for efficient querying by user and completion status
    index('tasks_user_completed_idx').on(table.todoId, table.completed),
  ],
);

export const todosRelations = relations(todos, ({ one, many }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  todo: one(todos, {
    fields: [tasks.todoId],
    references: [todos.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  todos: many(todos),
}));
