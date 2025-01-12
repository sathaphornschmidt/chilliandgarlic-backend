import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('reservation_emails', (table) => {
        table.uuid('id').primary();
        table.uuid('reservation_id').references('id').inTable('reservations').notNullable();
        table.string('email').notNullable();
        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at').notNullable()
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('reservation_emails');
}

