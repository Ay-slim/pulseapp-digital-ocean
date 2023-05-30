import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('sales', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table.integer('product_id')
        table.integer('quantity')
        table.double('total_value')
        table.jsonb('metadata')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('sales')
}
