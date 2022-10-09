import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary()
    table.string('name', 255).notNullable()
    table.string('email', 255).unique().notNullable()
    table.string('password', 1000).notNullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users')
}
