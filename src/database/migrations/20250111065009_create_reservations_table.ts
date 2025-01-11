import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists(
    "reservations",
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().notNullable().unique();
      table.uuid("customer_id").references("id").inTable("customers");
      table.string("number_of_guests").notNullable();
      table.string("booking_date").notNullable().unique();
      table.string("booking_time").notNullable();
      table.string("status").nullable();
      table.timestamp("created_at").notNullable();
      table.timestamp("update_at").notNullable();
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("reservations");
}
