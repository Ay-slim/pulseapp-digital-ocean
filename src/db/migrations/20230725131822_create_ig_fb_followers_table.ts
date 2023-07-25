import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'ig_fb_followers',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('athlete_id').unsigned().notNullable()
            table.integer('batch_id').unsigned().notNullable()
            table.jsonb('profile_details')
            table.jsonb('followers')
            table.jsonb('fan_rankings')
            table.enum('scraped_comments', ['true', 'false']).defaultTo('false')
            table
                .enum('scraped_followers', ['true', 'false'])
                .defaultTo('false')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.timestamp('deleted_at')
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('ig_fb_followers')
}
