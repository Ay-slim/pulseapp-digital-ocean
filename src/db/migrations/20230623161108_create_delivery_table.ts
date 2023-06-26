import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'delivery_info',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('user_id').unsigned().notNullable()
            table.string('address').notNullable()
            table.string('city').notNullable()
            table.string('zipcode').notNullable()
            table.string('card_email')
            table.string('card_name')
            table.string('card_number')
            table.string('card_expiry')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.timestamp('deleted_at')
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('delivery_info')
}
