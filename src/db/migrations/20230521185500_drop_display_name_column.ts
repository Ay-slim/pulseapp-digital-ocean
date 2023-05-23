import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('athletes', (table: Knex.TableBuilder) => {
        table.dropColumn('display_name')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('athletes', (table: Knex.TableBuilder) => {
        table.string('display_name').notNullable()
    })
}
