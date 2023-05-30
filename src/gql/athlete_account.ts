import { extendType, nonNull, stringArg, intArg, floatArg } from 'nexus'
import {
    GQLResponse,
    ServerReturnType,
    login_auth,
    AthleteBioType,
    TopFollowersType,
    SalesType,
} from './utils'
import { err_return } from './utils'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { create_jwt_token } from './utils'

dotenv.config()
const AUTO_NOTIFICATION_CONTENT = ['draw', 'poll']

/* ALL CONTRACTS RELATED TO USER ACCOUNT MANAGEMENT*/
export const AthleteSigninMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('athlete_signin', {
            type: GQLResponse,
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { email, password } = args
                try {
                    const db_resp = await context.knex_client
                        .select('password', 'id')
                        .from('athletes')
                        .where({
                            email: email,
                        })
                    if (db_resp?.length != 1) {
                        throw {
                            status: 400,
                            message: 'Athlete does not exist!',
                        }
                    }
                    const { password: hashed_password, id } = db_resp?.[0]
                    const pw_match = hashed_password
                        ? await bcrypt.compare(password, hashed_password)
                        : false
                    if (!pw_match) {
                        throw {
                            status: 401,
                            message: 'Invalid password!',
                        }
                    }
                    const token = create_jwt_token(id, 'athlete_id')
                    return {
                        status: 200,
                        error: false,
                        message: 'Success',
                        data: {
                            token,
                        },
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(Error?.message)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteSignupMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('athlete_signup', {
            type: GQLResponse,
            args: {
                password: nonNull(stringArg()),
                phone: nonNull(stringArg()),
                email: nonNull(stringArg()),
                name: nonNull(stringArg()),
                sport: nonNull(stringArg()),
                country: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { password, phone, email, name, sport, country } = args
                try {
                    const existing_email_check = await context.knex_client
                        .select('email')
                        .from('athletes')
                        .where({
                            email: email,
                        })
                    if (existing_email_check?.length > 0)
                        throw new Error(
                            'Another athlete already signed up with this email!'
                        )
                    const salt = bcrypt.genSaltSync(10)
                    const hashed_password = bcrypt.hashSync(password, salt)
                    const insert_ret = await context
                        .knex_client('athletes')
                        .insert(
                            {
                                password: hashed_password,
                                phone,
                                email,
                                name,
                                sport,
                                country,
                            },
                            ['id']
                        )
                    const token = create_jwt_token(
                        insert_ret?.[0],
                        'athlete_id'
                    )
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            token,
                        },
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteUpdateInfoMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('athlete_update_info', {
            type: GQLResponse,
            args: {
                description: nonNull(stringArg()),
                image_url: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { description, image_url } = args
                try {
                    const athlete_id = login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )?.athlete_id
                    const metadata = JSON.stringify({
                        description,
                    })
                    await context
                        .knex_client('athletes')
                        .where('id', '=', athlete_id)
                        .update({ metadata, image_url })
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteAddContent = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('add_content', {
            type: GQLResponse,
            args: {
                media_url: stringArg(),
                caption: nonNull(stringArg()),
                category: nonNull(stringArg()),
                start_time: stringArg(),
                end_time: stringArg(),
            },
            async resolve(_, args, context) {
                try {
                    const {
                        media_url,
                        caption,
                        category,
                        start_time,
                        end_time,
                    } = args
                    const athlete_id = login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )?.athlete_id

                    const content_db_resp = await context
                        .knex_client('content')
                        .insert(
                            {
                                athlete_id,
                                media_url,
                                caption,
                                category,
                                start_time,
                                end_time,
                            },
                            ['id']
                        )
                    const sub_db_resp = await context
                        .knex_client('athletes')
                        .select('subscribers')
                        .where({ id: athlete_id })
                    //console.log(sub_db_resp?.[0]?.subscribers)
                    let subscribers: number[] = JSON.parse(
                        sub_db_resp?.[0]?.subscribers
                    )
                    //console.log(subscribers, 'SUBSCRIBERSSSSS')
                    if (AUTO_NOTIFICATION_CONTENT.includes(category)) {
                        const all_athlete_followers: { user_id: number }[] =
                            await context
                                .knex_client('interests')
                                .select('user_id')
                                .whereRaw(
                                    'JSON_CONTAINS(athletes, CAST(? AS JSON), "$")',
                                    [JSON.stringify(athlete_id)]
                                )
                        subscribers = [
                            ...new Set([
                                ...subscribers,
                                ...all_athlete_followers.map(
                                    (follower) => follower?.user_id
                                ),
                            ]),
                        ]
                    }
                    const content_insertion_array = subscribers.map((user_id) =>
                        context.knex_client('notifications').insert({
                            user_id,
                            content_id: content_db_resp?.[0],
                        })
                    )
                    Promise.all(content_insertion_array)
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteFetchBasics = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_athlete_basics', {
            type: GQLResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const athlete_id = login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )?.athlete_id
                    const { knex_client } = context
                    const stats: AthleteBioType[] = await knex_client
                        .select(
                            'athletes.name',
                            'athletes.image_url',
                            knex_client.raw(
                                '(SELECT COUNT(*) FROM interests WHERE JSON_CONTAINS(athletes, CAST(? AS JSON), "$")) AS follower_count',
                                [athlete_id]
                            ),
                            knex_client.raw(
                                '(SELECT COUNT(*) FROM content WHERE content.athlete_id = ?) AS posts_count',
                                [athlete_id]
                            ),
                            knex_client.raw(
                                '(SELECT COUNT(*) FROM events WHERE events.athlete_id = ?) AS events_count',
                                [athlete_id]
                            )
                        )
                        .from('athletes')
                        .leftJoin('interests', (join: any) => {
                            join.on(
                                knex_client.raw(
                                    'JSON_CONTAINS(athletes, CAST(athletes.id AS JSON), "$")'
                                )
                            )
                        })
                        .whereRaw('athletes.id = ?', [athlete_id])
                    console.log(stats)
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            athlete_bio: stats?.[0],
                        },
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteFetchTopFollowers = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_athlete_top_followers', {
            type: GQLResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const athlete_id = login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )?.athlete_id
                    const { knex_client } = context
                    const top_followers: TopFollowersType[] = await knex_client
                        .select('users.name', 'users.id', 'users.email')
                        .from('interests')
                        .join('athletes', (join: any) => {
                            join.on(
                                knex_client.raw(
                                    'JSON_CONTAINS(athletes, CAST(athletes.id AS JSON), "$")'
                                )
                            )
                        })
                        .join('users', 'users.id', '=', 'interests.user_id')
                        .whereRaw('athletes.id = ?', [athlete_id])
                        .orderBy('interests.created_at', 'asc')
                        .limit(5)
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            top_followers,
                        },
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteFetchSales = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_athlete_sales', {
            type: GQLResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const athlete_id = login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )?.athlete_id
                    const { knex_client } = context
                    const total_sales: SalesType[] = await knex_client('sales')
                        .join(
                            'products',
                            'sales.product_id',
                            '=',
                            'products.id'
                        )
                        .select(
                            knex_client.raw(
                                'YEAR(sales.created_at) AS year, MONTH(sales.created_at) AS month, SUM(sales.total_value) AS total_sales'
                            )
                        )
                        .where('products.athlete_id', athlete_id)
                        .groupByRaw(
                            'YEAR(sales.created_at), MONTH(sales.created_at)'
                        )
                        .orderByRaw(
                            'YEAR(sales.created_at), MONTH(sales.created_at)'
                        )
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            sales: total_sales,
                        },
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteCreateProduct = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('create_product', {
            type: GQLResponse,
            args: {
                media_url: stringArg(),
                name: nonNull(stringArg()),
                price: nonNull(floatArg()),
                quantity: nonNull(intArg()),
                currency: stringArg(),
            },
            async resolve(_, args, context) {
                try {
                    const athlete_id = login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )?.athlete_id
                    const { media_url, name, price, quantity, currency } = args
                    const { knex_client } = context
                    await knex_client('products').insert({
                        athlete_id,
                        media_url,
                        name,
                        price,
                        quantity,
                        currency,
                    })
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})

export const AthleteFetchProducts = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_products', {
            type: GQLResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const athlete_id = login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )?.athlete_id
                    const { knex_client } = context
                    const products = await knex_client('products')
                        .select(
                            'name',
                            'media_url',
                            'price',
                            'currency',
                            'quantity'
                        )
                        .where({ athlete_id })
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            products,
                        },
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status)
                }
            },
        })
    },
})
