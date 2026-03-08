import { pgTable, serial, varchar, text, decimal, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('user_role', ['admin', 'user']);

export const users = pgTable('users', {
  id:         serial('id').primaryKey(),
  name:       varchar('name',  { length: 100 }).notNull(),
  email:      varchar('email', { length: 255 }).notNull().unique(),
  password:   text('password').notNull(),
  role:       roleEnum('role').default('user').notNull(),
  location:   varchar('location', { length: 100 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const predictions = pgTable('predictions', {
  id:              serial('id').primaryKey(),
  user_id:         integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  location:        varchar('location',    { length: 100 }).notNull(),
  temperature:     decimal('temperature', { precision: 5,  scale: 2 }).notNull(),
  rainfall:        decimal('rainfall',    { precision: 7,  scale: 2 }).notNull(),
  humidity:        decimal('humidity',    { precision: 5,  scale: 2 }).notNull(),
  soil_type:       varchar('soil_type',   { length: 20 }).notNull(),
  crop_type:       varchar('crop_type',   { length: 20 }).notNull(),
  fertilizer:      varchar('fertilizer',  { length: 20 }),
  area:            decimal('area',        { precision: 8, scale: 2 }),
  predicted_yield: decimal('predicted_yield', { precision: 10, scale: 3 }).notNull(),
  total_yield:     decimal('total_yield',     { precision: 10, scale: 3 }),
  yield_category:  varchar('yield_category',  { length: 20 }),
  actual_yield:    decimal('actual_yield',    { precision: 10, scale: 3 }),
  notes:           text('notes'),
  created_at:      timestamp('created_at').defaultNow().notNull(),
});

export const hadoop_logs = pgTable('hadoop_logs', {
  id:                serial('id').primaryKey(),
  job_type:          varchar('job_type', { length: 50 }).notNull(),
  status:            varchar('status',   { length: 20 }).notNull(),
  records_processed: integer('records_processed'),
  execution_time_ms: integer('execution_time_ms'),
  created_at:        timestamp('created_at').defaultNow().notNull(),
});

export type User       = typeof users.$inferSelect;
export type NewUser    = typeof users.$inferInsert;
export type Prediction = typeof predictions.$inferSelect;
