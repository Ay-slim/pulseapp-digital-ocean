import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('events', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table.integer('athlete_id').unsigned().notNullable()
        table.integer('product_id').unsigned().notNullable()
        table.string('caption')
        table.jsonb('metadata')
        table.timestamp('start_time')
        table.timestamp('end_time')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('events')
}
