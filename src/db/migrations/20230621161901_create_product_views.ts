import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'product_views',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('user_id').unsigned().notNullable()
            table.integer('product_id').unsigned().notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.timestamp('deleted_at')
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('product_views')
}
