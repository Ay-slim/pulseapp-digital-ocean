import { objectType, list } from 'nexus'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

type JwtPayloadWithId = JwtPayload & {
    user_id?: number
    athlete_id?: number
}

export const month_map = (month_num: number) => {
    switch (month_num) {
        case 1:
            return 'January'
        case 2:
            return 'February'
        case 3:
            return 'March'
        case 4:
            return 'April'
        case 5:
            return 'May'
        case 6:
            return 'June'
        case 7:
            return 'July'
        case 8:
            return 'August'
        case 9:
            return 'September'
        case 10:
            return 'October'
        case 11:
            return 'November'
        case 12:
            return 'December'
        default:
            throw new Error('Invalid month number')
    }
}

export type SuggestionsDataType = {
    id: number
    name: string
    image_url: string
    sport: string
}
export type ProductsDataType = {
    id: number
    name: string
    media_url: string
    price: number
    currency: string
    quantity: number
}
export type AthleteDataType = SuggestionsDataType & {
    metadata: string
}

export type AthleteBioType = {
    name: string
    follower_count: number
    fixed_items_count: number
    variable_items_count: number
    image_url: string
}

export type TopFollowersType = {
    name: string
    id: number
    email: string
}

export type UserActivityType = {
    name: string
    status: string
    media_url: string
    athlete: string
    id: number
    created_at: string
}

export type SalesType = {
    year: number
    month: number
    total_sales: number
}

export type SalesRetType = {
    year: number
    month: string
    total_sales: number
}

const AthleteData = list(
    objectType({
        name: 'AthleteData',
        definition(t) {
            t.int('id')
            t.string('name')
            t.string('image_url')
            t.string('sport')
            t.string('description')
            t.list.string('incentives')
        },
    })
)

const AthleteBio = objectType({
    name: 'AthleteBio',
    definition(t) {
        t.string('name')
        t.string('image_url')
        t.int('follower_count')
        t.int('posts_count')
        t.int('events_count')
    },
})

const TopFollowers = objectType({
    name: 'TopFollowers',
    definition(t) {
        t.string('name')
        t.int('id')
        t.string('email')
    },
})

const Sales = objectType({
    name: 'Sales',
    definition(t) {
        t.int('year')
        t.string('month')
        t.float('total_sales')
    },
})
const SuggestionsData = list(
    objectType({
        name: 'SuggestionsData',
        definition(t) {
            t.int('id')
            t.string('name')
            t.string('image_url')
            t.string('sport')
        },
    })
)

const UserContent = list(
    objectType({
        name: 'UserContent',
        definition(t) {
            t.string('athlete_name')
            t.string('athlete_image_url')
            t.string('content_media_url')
            t.string('content_caption')
            t.string('distance')
        },
    })
)

const Products = list(
    objectType({
        name: 'Products',
        definition(t) {
            t.string('name'),
                t.string('media_url'),
                t.float('price'),
                t.string('currency')
            t.int('quantity')
        },
    })
)

const AthleteSettings = objectType({
    name: 'AthleteSettings',
    definition(t) {
        t.string('description')
        t.list.string('notifications_preference')
    },
})

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
                    t.field('suggestions', {
                        type: SuggestionsData,
                    })
                    t.list.string('sports')
                    t.list.string('incentives')
                    t.string('signed_url')
                    t.field('athlete_bio', {
                        type: AthleteBio,
                    })
                    t.list.field('top_followers', {
                        type: TopFollowers,
                    })
                    t.list.field('sales', {
                        type: Sales,
                    })
                    t.field('products', {
                        type: Products,
                    })
                    t.field('settings', {
                        type: AthleteSettings,
                    })
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

export const login_auth = async (
    bearer_token: string,
    sign_key: string
): Promise<JwtPayloadWithId> => {
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

export const err_return = (status = 400): ServerReturnType => {
    return {
        status,
        error: true,
        message: 'Something went wrong',
    }
}
