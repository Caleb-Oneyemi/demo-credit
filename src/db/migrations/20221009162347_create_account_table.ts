import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('accounts', function (table) {
    table.increments('id').primary()
    table.decimal('balance').notNullable()
    table.integer('ownerId').unsigned().references('users.id')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('accounts')
}
