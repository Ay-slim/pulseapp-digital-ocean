import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.string('start_time_raw')
        table.string('end_time_raw')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.dropColumn('start_time_raw')
        table.dropColumn('end_time_raw')
    })
}
