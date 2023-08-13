import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.float('discount').defaultTo(0)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.dropColumn('discount')
    })
}
