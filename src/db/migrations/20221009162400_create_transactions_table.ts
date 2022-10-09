import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary()
    table.decimal('amount').notNullable()
    table.integer('senderId').unsigned().references('users.id')
    table.integer('receiverId').unsigned().references('users.id')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('transactions')
}
