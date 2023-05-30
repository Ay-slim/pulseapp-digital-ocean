import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.integer('quantity').notNullable()
        table.string('currency')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.dropColumn('quantity')
        table.dropColumn('currency')
    })
}
