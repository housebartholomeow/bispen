import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Define the Role Enum
// By default, users are attendants. They upgrade to hosts upon creating a show.
export const userRoleEnum = pgEnum('user_role', ['attendant', 'host']);

// 2. Users Table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').default('attendant').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Shows Table
export const shows = pgTable('shows', {
  id: uuid('id').defaultRandom().primaryKey(),
  hostId: uuid('host_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  eventDate: timestamp('event_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Tickets Table
// Acts as the junction table between Users (attendees) and Shows.
export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  showId: uuid('show_id')
    .notNull()
    .references(() => shows.id, { onDelete: 'cascade' }),
  attendeeId: uuid('attendee_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  ticketCode: text('ticket_code').notNull().unique(), // The special code
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ==========================================
// DRIZZLE RELATIONS (For easy querying)
// ==========================================

export const usersRelations = relations(users, ({ many }) => ({
  hostedShows: many(shows),
  purchasedTickets: many(tickets),
}));

export const showsRelations = relations(shows, ({ one, many }) => ({
  host: one(users, {
    fields: [shows.hostId],
    references: [users.id],
  }),
  tickets: many(tickets), // Allows the host to easily pull all tickets for their show
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  show: one(shows, {
    fields: [tickets.showId],
    references: [shows.id],
  }),
  attendee: one(users, {
    fields: [tickets.attendeeId],
    references: [users.id],
  }),
}));