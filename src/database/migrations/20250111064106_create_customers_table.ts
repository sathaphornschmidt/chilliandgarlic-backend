// src\database\migrations\20230901105501_create_tickets_table.ts

import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTableIfNotExists(
    "customers",
    (table: Knex.TableBuilder) => {
      table.uuid("id").primary().notNullable().unique();
      table.string("email").notNullable();
      table.string("name").notNullable().unique();
      table.string("country_code").notNullable();
      table.string("phonenumber").notNullable();
      table.timestamp("created_at").notNullable();
      table.timestamp("update_at").notNullable();
    },
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("customers");
}
