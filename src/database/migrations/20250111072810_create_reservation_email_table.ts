import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists(
    "reservation_emails",
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().notNullable().unique();
      table.uuid("reservation_id").references("id").inTable("reservations");
      table.string("email").notNullable();
      table.timestamp("created_at").notNullable();
      table.timestamp("update_at").notNullable();
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("reservation_emails");
}
