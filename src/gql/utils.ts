import { objectType } from 'nexus'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

type JwtPayloadWithId = JwtPayload & {
    user_id?: number
}

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
                    t.string('token')
                    t.string('email')
                    t.string('completion_status')
                },
            }),
        })
    },
})

//Throwing this when auth errors occur so as to expose as little API info as possible
export const laconic_unauthorized_error = {
    status: 401,
    message: 'Unauthorized',
}

export type ServerReturnType = {
    status: number
    error: boolean
    message: string
}

export const create_jwt_token = (id: number): string => {
    const jwt_secret = process.env.JWT_SECRET_KEY
    const token = jwt_secret ? jwt.sign({ user_id: id }, jwt_secret) : ''
    if (!token)
        throw {
            status: 400,
            messsage: 'Undefined JWT secret!',
        }
    return token
}

export const login_auth = (bearer_token: string) => {
    try {
        const token = bearer_token.replace('Bearer ', '')
        if (!token) {
            throw new Error('No login token passed')
        }
        const jwt_secret = process.env.JWT_SECRET_KEY
        if (!jwt_secret) {
            throw new Error('No jwt_secret set')
        }
        const jwt_payload: JwtPayloadWithId | string = jwt.verify(
            token,
            jwt_secret
        )
        if (!jwt_payload || !(jwt_payload as JwtPayloadWithId)?.user_id)
            throw new Error('Unable to extract user id from')
        return (jwt_payload as JwtPayloadWithId)?.user_id
    } catch (err) {
        const Error = err as ServerReturnType
        console.error(`Jwt decryption failure: ${Error?.message ?? ''}`)
        throw laconic_unauthorized_error
    }
}

export const err_return = (status = 400, message: string): ServerReturnType => {
    return {
        status,
        error: true,
        message,
    }
}
