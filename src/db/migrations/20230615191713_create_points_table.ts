import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('points', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table.integer('user_id').unsigned().notNullable()
        table.integer('units').unsigned().notNullable()
        table.enum('event', ['signup', 'sale']).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('points')
}
