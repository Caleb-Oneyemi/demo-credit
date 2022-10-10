import { Knex } from 'knex'

export async function up(knex: Knex) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.dropTimestamps()
      table.timestamps(true, true, true)
    }),
    knex.schema.table('accounts', function (table) {
      table.dropTimestamps()
      table.timestamps(true, true, true)
    }),
    knex.schema.table('transfers', function (table) {
      table.dropTimestamps()
      table.timestamps(true, true, true)
    }),
  ])
}

export async function down(knex: Knex) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.dropTimestamps(true)
      table.timestamps(true, true)
    }),
    knex.schema.table('accounts', function (table) {
      table.dropTimestamps(true)
      table.timestamps(true, true)
    }),
    knex.schema.table('transfers', function (table) {
      table.dropTimestamps(true)
      table.timestamps(true, true)
    }),
  ])
}
