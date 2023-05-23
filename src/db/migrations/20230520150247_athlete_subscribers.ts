import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('athletes', (table: Knex.TableBuilder) => {
        table.jsonb('subscribers')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('content', (table: Knex.TableBuilder) => {
        table.dropColumn('subscribers')
    })
}
