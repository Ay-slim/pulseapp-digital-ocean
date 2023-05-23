import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('interests', (table: Knex.TableBuilder) => {
        table.jsonb('notifications_preference')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('interests', (table: Knex.TableBuilder) => {
        table.dropColumn('notifications_preference')
    })
}
