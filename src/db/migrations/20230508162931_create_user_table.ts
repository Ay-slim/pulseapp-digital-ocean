import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
        table.increments('id').notNullable()
        table.string('email').notNullable().index().unique()
        table.string('name', 60).notNullable()
        table.string('password').notNullable()
        table.string('phone').notNullable()
        table
            .enum('info_completion', ['partial', 'complete'])
            .defaultTo('partial')
            .notNullable()
        table.enum('age_range', [
            'under_18',
            'eighteen_to_twentyfour',
            'twentyfive_to_thirtyfour',
            'thirtyfive_to_fortyfour',
            'above_fortyfive',
        ])
        table.enum('gender', ['male', 'female', 'nonbinary', 'other'])
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users')
}
