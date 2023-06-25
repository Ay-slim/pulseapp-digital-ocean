import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'delivery_info',
        (table: Knex.TableBuilder) => {
            table.integer('user_id').unsigned().notNullable().unique().alter()
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'delivery_info',
        (table: Knex.TableBuilder) => {
            table.integer('user_id').unsigned().notNullable().alter()
        }
    )
}
