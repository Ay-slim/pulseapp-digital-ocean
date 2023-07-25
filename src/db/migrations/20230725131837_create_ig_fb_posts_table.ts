import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        'ig_fb_posts',
        (table: Knex.TableBuilder) => {
            table.increments('id').notNullable()
            table.integer('athlete_id').unsigned().notNullable()
            table.integer('batch_id').notNullable()
            table.integer('post_batch_position').unsigned().notNullable()
            table.string('post_id').notNullable()
            table.jsonb('post_metadata')
            table.jsonb('comments')
            table.timestamp('created_at').defaultTo(knex.fn.now())
            table.timestamp('updated_at').defaultTo(knex.fn.now())
            table.timestamp('deleted_at')
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('ig_fb_posts')
}
