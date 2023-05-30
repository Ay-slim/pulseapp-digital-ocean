import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('athletes', (table) => {
        table.string('country').nullable().alter()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('athletes', (table) => {
        table.string('country').notNullable().alter()
    })
}
