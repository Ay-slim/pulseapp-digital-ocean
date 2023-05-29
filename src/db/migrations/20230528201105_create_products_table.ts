import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('products', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table.integer('athlete_id')
        table.string('media_url')
        table.string('name')
        table.double('price')
        table.jsonb('metadata')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('products')
}
