import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('content', (table: Knex.TableBuilder) => {
        table.timestamp('start_time')
        table.timestamp('end_time')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('content', (table: Knex.TableBuilder) => {
        table.dropColumn('start_time')
        table.dropColumn('end_time')
    })
}
