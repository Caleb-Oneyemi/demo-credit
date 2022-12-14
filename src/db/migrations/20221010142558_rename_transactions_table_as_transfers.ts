import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.renameTable('transactions', 'transfers')
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.renameTable('transfers', 'transactions')
}
