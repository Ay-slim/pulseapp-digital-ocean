import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('events', (table: Knex.TableBuilder) => {
        table.enum('category', ['draw', 'sale', 'poll', 'post'])
        table.string('media_url')
        table.jsonb('product_id').alter()
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('events', (table: Knex.TableBuilder) => {
        table.dropColumn('category')
        table.dropColumn('media_url')
        table.integer('product_id').unsigned().notNullable().alter()
    })
}
