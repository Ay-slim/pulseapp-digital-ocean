import { extendType, nonNull, stringArg, intArg, floatArg, list } from 'nexus'
import {
    ServerReturnType,
    login_auth,
    AthleteBioType,
    TopFollowersType,
    SalesType,
    SalesRetType,
    month_map,
    create_product_notifications,
    ProductNotifArgs,
    rank_kizuna_followers,
} from './utils'
import { err_return, create_jwt_token } from './utils'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import {
    TokenResponse,
    BaseResponse,
    AthleteFetchBasicsResponse,
    AthleteTopFollowersResponse,
    AthleteSalesResponse,
    AthleteSettingsFetchResponse,
    AthleteProductsFetchResponse,
    AthleteFetchRankingsResponse,
} from './response_types'

dotenv.config()

/* ALL CONTRACTS RELATED TO USER ACCOUNT MANAGEMENT*/
export const AthleteSigninMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('athlete_signin', {
            type: TokenResponse,
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { email, password } = args
                try {
                    const db_resp = await context.knex_client
                        .select('password', 'id', 'name')
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
                    const { password: hashed_password, id, name } = db_resp?.[0]
                    const pw_match = hashed_password
                        ? await bcrypt.compare(password, hashed_password)
                        : false
                    if (!pw_match) {
                        throw {
                            status: 401,
                            message: 'Invalid password!',
                        }
                    }
                    const token = create_jwt_token(
                        id,
                        'athlete_id',
                        name,
                        email
                    )
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
            type: TokenResponse,
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
                                metadata: JSON.stringify({
                                    notifications_preference: [
                                        'email',
                                        'phone',
                                    ],
                                }),
                            },
                            ['id']
                        )
                    const token = create_jwt_token(
                        insert_ret?.[0],
                        'athlete_id',
                        name,
                        email
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
            type: BaseResponse,
            args: {
                description: nonNull(stringArg()),
                image_url: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { description, image_url } = args
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
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

export const AthleteFetchBasics = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_athlete_basics', {
            type: AthleteFetchBasicsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
                    const { knex_client } = context
                    const stats: AthleteBioType[] = await knex_client
                        .select(
                            'athletes.name',
                            'athletes.image_url',
                            knex_client.raw(
                                '(SELECT COUNT(*) FROM users_athletes WHERE athlete_id = ?) AS follower_count',
                                [athlete_id]
                            ),
                            knex_client.raw(
                                `(SELECT COUNT(*) FROM products WHERE athlete_id = ? AND exclusive = 'false') AS fixed_items_count`,
                                [athlete_id]
                            ),
                            knex_client.raw(
                                `(SELECT COUNT(*) FROM products WHERE athlete_id = ? AND exclusive = 'true') AS variable_items_count`,
                                [athlete_id]
                            )
                        )
                        .from('athletes')
                        .leftJoin(
                            'users_athletes',
                            'athletes.id',
                            'users_athletes.athlete_id'
                        )
                        .leftJoin(
                            'products',
                            'athletes.id',
                            'products.athlete_id'
                        )
                        .whereRaw('athletes.id = ?', [athlete_id])
                    //console.log(stats)
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
            type: AthleteTopFollowersResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
                    const { knex_client } = context
                    const top_followers: TopFollowersType[] = await knex_client
                        .select('users.name', 'users.id', 'users.email')
                        .from('users')
                        .join(
                            'users_athletes',
                            'users.id',
                            '=',
                            'users_athletes.user_id'
                        )
                        .whereRaw('users_athletes.athlete_id = ?', [athlete_id])
                        .orderBy('users_athletes.created_at', 'asc')
                        .limit(10)
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
            type: AthleteSalesResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
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
                    const normalized_sales: SalesRetType[] = total_sales.map(
                        (sale) => {
                            return {
                                year: sale.year,
                                month: month_map(sale.month),
                                total_sales: sale.total_sales,
                            }
                        }
                    )
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            sales: normalized_sales,
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
            type: BaseResponse,
            args: {
                media_urls: nonNull(list(stringArg())),
                name: nonNull(stringArg()),
                price: nonNull(floatArg()),
                quantity: nonNull(intArg()),
                description: nonNull(stringArg()),
                currency: stringArg(),
                category: stringArg(),
                end_time: stringArg(),
                start_time: stringArg(),
            },
            async resolve(_, args, context) {
                try {
                    const { athlete_id, name: athlete_name } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
                    const {
                        media_urls,
                        name,
                        price,
                        quantity,
                        currency,
                        description,
                        category,
                        end_time,
                        start_time,
                    } = args
                    const media_len = media_urls?.length
                    if (media_len! < 2 || media_len! > 5) {
                        throw new Error(
                            'Ensure there are between 2 and 5 media files uploaded for this product'
                        )
                    }
                    const { knex_client } = context
                    const metadata = JSON.stringify({ category })
                    const insert_object: {
                        athlete_id?: number
                        media_urls: string | null
                        name: string
                        price: number
                        quantity: number
                        description: string
                        metadata: string
                        currency?: string
                        end_time?: string | null
                        exclusive: string
                        start_time: Date
                    } = {
                        athlete_id,
                        media_urls: JSON.stringify(media_urls),
                        name,
                        price,
                        quantity,
                        description,
                        exclusive: end_time ? 'true' : 'false',
                        metadata,
                        start_time: start_time
                            ? new Date(start_time)
                            : new Date(),
                        end_time,
                    }
                    if (currency) {
                        insert_object['currency'] = currency
                    }
                    const [product_id]: number[] = await knex_client(
                        'products'
                    ).insert(insert_object)
                    const notifications_args: ProductNotifArgs = {
                        athlete_id: athlete_id!,
                        knex_client,
                        product_id,
                        headline: end_time
                            ? 'Limited time product drop!'
                            : 'New product drop!',
                        message: end_time
                            ? `${athlete_name} who you follow on Scientia has just dropped a new product which will no longer be available soon. Head to the stores for details and shop now!`
                            : `${athlete_name} who you follow on Scientia has just dropped a new product. Click here or visit the store to shop now!`,
                    }
                    create_product_notifications(notifications_args)
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
        t.nonNull.field('athlete_fetch_products', {
            type: AthleteProductsFetchResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
                    const { knex_client } = context
                    const products: {
                        id: number
                        name: string
                        price: number
                        currency: string
                        end_time: string | null
                        exclusive: string
                        quantity: number
                        media_urls: string
                        description: string
                        total_views: number
                        unique_views: number
                    }[] = await knex_client
                        .select(
                            'id',
                            'name',
                            'media_urls',
                            'price',
                            'currency',
                            'quantity',
                            'exclusive',
                            'end_time',
                            'description',
                            knex_client.raw(
                                `(SELECT COUNT(*) FROM product_views WHERE product_id = products.id) AS total_views`
                            ),
                            knex_client.raw(
                                `(SELECT COUNT(DISTINCT user_id) FROM product_views WHERE product_id = products.id) AS unique_views`
                            )
                        )
                        .from('products')
                        .where('athlete_id', athlete_id)
                        .whereRaw('deleted_at IS NULL')
                    //console.log(products)
                    // console.log({
                    //     athlete_name: products[0]?.athlete_name,
                    //     image_url: products[0]?.image_url,
                    //     products: JSON.parse(products[0].products)
                    // })
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            products: products.map((product) => {
                                return {
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    currency: product.currency,
                                    end_time: product.end_time,
                                    exclusive: product.exclusive === 'true',
                                    quantity: product.quantity,
                                    media_urls: JSON.parse(product.media_urls),
                                    description: product.description,
                                    total_views: product.total_views,
                                    unique_views: product.unique_views,
                                }
                            }),
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

export const AthleteDeleteProducts = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('athlete_delete_products', {
            type: BaseResponse,
            args: {
                product_ids: nonNull(list(intArg())),
            },
            async resolve(_, args, context) {
                try {
                    const { knex_client, auth_token } = context
                    await login_auth(auth_token, 'athlete_id')
                    const { product_ids } = args
                    await knex_client('products')
                        .update({ deleted_at: new Date() })
                        .whereIn('id', product_ids)
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

export const AthleteUpdateSettingsMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('athlete_update_settings', {
            type: BaseResponse,
            args: {
                description: stringArg(),
                notifications_preference: list(stringArg()),
            },
            async resolve(_, args, context) {
                const { description, notifications_preference } = args
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
                    const { knex_client } = context
                    let raw_sql: string
                    if (notifications_preference) {
                        const notif_len = notifications_preference.length
                        let notif_string = ''
                        for (let i = 0; i < notif_len; i++) {
                            if (i == notif_len - 1) {
                                notif_string += `"${
                                    notifications_preference[notif_len - 1]
                                }"`
                            } else {
                                notif_string += `"${notifications_preference}", `
                            }
                        }
                        if (!description) {
                            raw_sql = `UPDATE athletes SET metadata = JSON_SET(metadata, '$.notifications_preference', '[${notif_string}]') WHERE id = ${athlete_id};`
                        } else {
                            raw_sql = `UPDATE athletes SET metadata = JSON_SET(JSON_SET(metadata, '$.notifications_preference', '[${notif_string}]'), '$.description', '${description}') WHERE id = ${athlete_id};`
                        }
                    } else {
                        raw_sql = `UPDATE athletes SET metadata = JSON_SET(metadata, '$.description', '${description}') WHERE id = ${athlete_id};`
                    }
                    await knex_client.raw(raw_sql)
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

export const AthleteFetchSettingsQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('athlete_fetch_settings', {
            type: AthleteSettingsFetchResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
                    const { knex_client } = context
                    const metadata_resp: { metadata: string } =
                        await knex_client('athletes')
                            .select('metadata')
                            .where('id', '=', athlete_id)
                            .first()
                    const metadata: {
                        description: string
                        notifications_preference: string[]
                    } = JSON.parse(metadata_resp?.metadata)
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            settings: {
                                description: metadata.description,
                                notifications_preference:
                                    metadata.notifications_preference,
                            },
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

export const AthleteFetchFollowersRanking = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('athlete_fetch_rankings', {
            type: AthleteFetchRankingsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { athlete_id } = await login_auth(
                        context?.auth_token,
                        'athlete_id'
                    )
                    const { knex_client } = context
                    const insta_fan_rankings_raw: { fan_rankings: string }[][] =
                        await knex_client.raw(`
                        SELECT fan_rankings
                        FROM ig_fb_followers
                        WHERE athlete_id = ${athlete_id}
                        AND batch_id = (
                            SELECT MAX(batch_id)
                            FROM ig_fb_followers
                            WHERE athlete_id = ${athlete_id}
                        );`)
                    //console.log(fan_rankings_raw[0])
                    const insta_fan_rankings: {
                        username: string
                        is_follower: boolean
                        average_sentiment: number
                        interaction_score: number
                    }[] = insta_fan_rankings_raw[0].length
                        ? JSON.parse(insta_fan_rankings_raw[0][0]?.fan_rankings)
                        : []
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            instagram: insta_fan_rankings,
                            kizuna: await rank_kizuna_followers(
                                athlete_id!,
                                knex_client
                            ),
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
