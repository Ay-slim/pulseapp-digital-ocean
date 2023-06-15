import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('sales', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table.integer('user_id').unsigned().notNullable()
        table.integer('product_id').unsigned().notNullable()
        table.integer('quantity').defaultTo(1)
        table.double('total_value')
        table.jsonb('metadata')
        table
            .enum('status', ['pending', 'delivered', 'processing', 'shipped'])
            .defaultTo('pending')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('sales')
}
