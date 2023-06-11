import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.string('currency').defaultTo('$').alter()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
        table.string('currency').alter()
    })
}
