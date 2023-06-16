import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('athletes', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table.string('email').notNullable().index().unique()
        table.string('name', 60).notNullable()
        table.string('password').notNullable()
        table.string('phone').notNullable()
        table.string('sport').notNullable()
        table.string('country')
        table.jsonb('metadata') //Incentives, description
        table.string('image_url')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('athletes')
}
