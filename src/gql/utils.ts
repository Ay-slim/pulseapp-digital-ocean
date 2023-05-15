import { objectType, list } from 'nexus'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

type JwtPayloadWithId = JwtPayload & {
    user_id?: number
    athlete_id?: number
}

export type AthleteDataType = {
    id: number
    display_name: string
    image_url: string
    sport: string
    metadata: string
}

export type UserContentType = {
    display_name: string
    image_url: string
    media_url: string
    caption: string
    id: number
    created_at: string
}

const AthleteData = list(
    objectType({
        name: 'AthleteData',
        definition(t) {
            t.int('id')
            t.string('display_name')
            t.string('image_url')
            t.string('sport')
            t.string('description')
            t.list.string('incentives')
        },
    })
)

const UserContent = list(
    objectType({
        name: 'UserContent',
        definition(t) {
            t.string('athlete_display_name')
            t.string('athlete_image_url')
            t.string('content_media_url')
            t.string('content_caption')
            t.string('distance')
        },
    })
)
export const GQLResponse = objectType({
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
                    t.field('athlete_data', {
                        type: AthleteData,
                    })
                    t.field('content_data', {
                        type: UserContent,
                    })
                    t.int('max_id')
                    t.field('athletes', {
                        type: AthleteData,
                    })
                    t.list.string('sports')
                    t.list.string('incentives')
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

export const create_jwt_token = (id: number, sign_key: string): string => {
    const jwt_secret = process.env.JWT_SECRET_KEY
    const token = jwt_secret ? jwt.sign({ [sign_key]: id }, jwt_secret) : ''
    if (!token)
        throw {
            status: 400,
            messsage: 'Undefined JWT secret!',
        }
    return token
}

export const login_auth = (
    bearer_token: string,
    sign_key: string
): JwtPayloadWithId => {
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
        if (!jwt_payload || !(jwt_payload as JwtPayloadWithId)?.[sign_key]) {
            throw new Error('Unable to extract value from token')
        }

        return jwt_payload as JwtPayloadWithId
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
