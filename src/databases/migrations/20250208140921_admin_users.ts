import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('admin_users', (table) => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.string('username').unique();
    table.string('password').notNullable();
    table.timestamp('created_at').notNullable();
    table.timestamp('updated_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('admin_users');
}
