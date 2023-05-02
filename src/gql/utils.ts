import { objectType } from 'nexus'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const MutationAuthResponse = objectType({
    name: 'MutationResponse',
    definition(t) {
        t.nonNull.int('status')
        t.nonNull.boolean('error')
        t.nonNull.string('message')
        t.field('data', {
            type: objectType({
                name: 'AuthData',
                definition(t) {
                    t.nonNull.string('token')
                },
            }),
        })
    },
})

export const create_jwt_token = (username: string): string => {
    const jwt_secret = process.env.JWT_SECRET_KEY
    const token = jwt_secret ? jwt.sign({ username }, jwt_secret) : ''
    if (!token)
        throw {
            status: 400,
            messsage: 'Undefined JWT secret!',
        }
    return token
}

export const err_return = (status = 400, message: string): ServerReturnType => {
    return {
        status,
        error: true,
        message,
    }
}

export type ServerReturnType = {
    status: number
    error: boolean
    message: string
}
