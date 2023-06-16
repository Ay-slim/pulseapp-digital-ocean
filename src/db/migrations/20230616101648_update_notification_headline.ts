import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'notifications',
        (table: Knex.TableBuilder) => {
            table.string('headline').notNullable()
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'notifications',
        (table: Knex.TableBuilder) => {
            table.dropColumn('headline')
        }
    )
}
