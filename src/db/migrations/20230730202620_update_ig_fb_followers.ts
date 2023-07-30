import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'ig_fb_followers',
        (table: Knex.TableBuilder) => {
            table.jsonb('posts_sentiments')
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'ig_fb_followers',
        (table: Knex.TableBuilder) => {
            table.dropColumn('posts_sentiments')
        }
    )
}
