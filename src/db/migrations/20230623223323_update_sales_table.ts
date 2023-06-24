import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
        table.dropColumn('product_id')
        table.dropColumn('quantity')
        table.timestamp('deleted_at')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
        table.integer('product_id').unsigned().notNullable()
        table.integer('quantity').defaultTo(1)
        table.dropColumn('deleted_at')
    })
}
