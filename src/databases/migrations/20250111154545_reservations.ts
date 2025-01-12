import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('reservations', (table) => {
        table.uuid('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string("counter_code").notNullable();
        table.string('phone').notNullable();
        table.date('date').notNullable();
        table.string('time').notNullable();
        table.integer('number_of_guests').notNullable();
        table.timestamp('created_at').notNullable()
        table.timestamp('updated_at').notNullable()
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('reservations');
}

