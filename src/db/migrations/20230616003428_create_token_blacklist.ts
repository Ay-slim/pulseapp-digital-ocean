import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'blacklisted_tokens',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.string('token').notNullable()
            table.integer('user_id')
            table.integer('athlete_id')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('blacklisted_tokens')
}
