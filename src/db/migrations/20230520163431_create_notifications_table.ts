import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'notifications',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('user_id').unsigned().notNullable()
            table.integer('content_id').unsigned().notNullable()
            table.enum('status', ['read', 'unread']).defaultTo('unread')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('notifications')
}
