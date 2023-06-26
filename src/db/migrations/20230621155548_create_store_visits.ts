import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'store_visits',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('user_id').unsigned().notNullable()
            table.integer('athlete_id').unsigned().notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.timestamp('deleted_at')
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('store_visits')
}
