import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'users_athletes',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('user_id').unsigned().notNullable()
            table.integer('athlete_id').unsigned().notNullable()
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.unique(['user_id', 'athlete_id'])
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users_athletes')
}
