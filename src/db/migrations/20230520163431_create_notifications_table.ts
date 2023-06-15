import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'notifications',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('user_id').unsigned().notNullable()
            table.integer('product_id').unsigned()
            table.integer('sale_id').unsigned()
            table.string('message').notNullable()
            table.enum('status', ['read', 'unread']).defaultTo('unread')
            table.enum('event', ['signup', 'sale', 'drop']).notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('notifications')
}
