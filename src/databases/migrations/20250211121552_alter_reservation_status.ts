import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('reservations', (table) => {
    table
      .enum('status', ['booked', 'canceled'], {
        useNative: true,
        enumName: 'reservation_status',
      })
      .notNullable()
      .defaultTo('booked');

    table.string('canceled_by').nullable();
    table.timestamp('canceled_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('reservations', (table) => {
      table.dropColumn('canceled_by');
      table.dropColumn('canceled_at');
      table.dropColumn('status');
    })
    .raw('DROP TYPE IF EXISTS reservation_status');
}
