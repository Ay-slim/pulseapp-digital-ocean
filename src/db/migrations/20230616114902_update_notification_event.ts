import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'notifications',
        (table: Knex.TableBuilder) => {
            table
                .enum('event', ['alert', 'point', 'sale', 'drop'])
                .notNullable()
                .alter()
            table.string('message', 500).notNullable().alter()
        }
    )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable(
        'notifications',
        (table: Knex.TableBuilder) => {
            table
                .enum('event', ['signup', 'sale', 'drop'])
                .notNullable()
                .alter()
            table.string('message').notNullable().alter()
        }
    )
}
