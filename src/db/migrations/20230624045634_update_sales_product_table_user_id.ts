import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'sales_products',
        (table: Knex.TableBuilder) => {
            table.integer('user_id').unsigned().notNullable()
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'sales_products',
        (table: Knex.TableBuilder) => {
            table.dropColumn('user_id')
        }
    )
}
