import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('interests', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table
            .integer('user_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('users')
        table.jsonb('athletes')
        table.jsonb('sports')
        table.jsonb('incentives')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('interests')
}
