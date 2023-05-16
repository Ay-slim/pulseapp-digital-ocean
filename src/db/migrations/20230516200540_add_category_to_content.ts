import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('content', (table: Knex.TableBuilder) => {
        table.enum('category', ['draw', 'text', 'poll', 'image', 'video'])
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('content', (table: Knex.TableBuilder) => {
        table.dropColumn('category')
    })
}
