import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { PrismaClient } from '@prisma/client'
import { schema } from './schema'

const prisma = new PrismaClient()

export const startApolloServer = async () => {
    const server = new ApolloServer({
        schema,
    })
    await startStandaloneServer(server, {
        context: async () => {
            return {
                prisma,
            }
        },
    })
}

startApolloServer()
