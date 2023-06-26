import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'sales_products',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('sale_id').unsigned().notNullable()
            table.integer('product_id').unsigned().notNullable()
            table.integer('quantity')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.timestamp('deleted_at')
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('sales_products')
}
