import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { knex, Knex } from 'knex'
import knex_config from './db/knexfile'
import dotenv from 'dotenv'
import { schema } from './schema'

dotenv.config({
    path: '../.env',
})
interface Context {
    knex_client: Knex
    auth_token: string | undefined
}
const env = process.env.NODE_ENV
if (!env) throw new Error('No env value set for NODE_ENV')
const knex_client = knex(knex_config[env])

export const startApolloServer = async () => {
    const server = new ApolloServer({
        schema,
    })
    const { url } = await startStandaloneServer(server, {
        context: async ({ req }): Promise<Context> => {
            return {
                auth_token: req?.headers?.authorization,
                knex_client,
            }
        },
    })
    console.log(`server running on ${url} 🚀`)
}

startApolloServer()
