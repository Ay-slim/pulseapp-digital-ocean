import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
        table.string('sale_ref').notNullable()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
        table.dropColumn('sale_ref')
    })
}
