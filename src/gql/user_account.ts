import {
    enumType,
    extendType,
    nonNull,
    stringArg,
    list,
    intArg,
    queryType,
    inputObjectType,
    floatArg,
    booleanArg,
} from 'nexus'
import { Knex } from 'knex'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { formatDistance } from 'date-fns'
import {
    create_jwt_token,
    AthleteDataType,
    err_return,
    ServerReturnType,
    login_auth,
    SuggestionsDataType,
    UserActivityType,
    UserAthleteStoreType,
    send_email_notifications,
    create_sale_notification,
    ProductsRespType,
    prep_sql_array,
} from './utils'
import {
    TokenResponse,
    UserSigninResponse,
    BaseResponse,
    UserFetchSportsResponse,
    UserFetchAthletesResponse,
    UserFetchSuggestionsResponse,
    UserFetchIncentivesResponse,
    UserFetchActivityResponse,
    UserFetchNotificationsResponse,
    UserFetchNotifSettingsResponse,
    UserUnreadNotificationsResponse,
    UsersFetchAthleteStore,
    UsersFetchProduct,
    DeliveryDetailsResponse,
    UserCreateSaleResponse,
} from './response_types'

dotenv.config()

const GenderEnum = enumType({
    name: 'GenderEnum',
    members: ['male', 'female', 'nonbinary', 'other'],
})

const AgeRangeEnum = enumType({
    name: 'AgeRangeEnum',
    members: [
        'under_18',
        'eighteen_to_twentyfour',
        'twentyfive_to_thirtyfour',
        'thirtyfive_to_fortyfour',
        'above_fortyfive',
    ],
})

/* ALL CONTRACTS RELATED TO USER ACCOUNT MANAGEMENT*/
export const UserSigninMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('signin', {
            type: UserSigninResponse,
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { email, password } = args
                try {
                    const db_resp = await context.knex_client
                        .select('password', 'id', 'info_completion', 'name')
                        .from('users')
                        .where({
                            email: email,
                        })

                    if (db_resp?.length != 1)
                        throw {
                            status: 400,
                            messsage: 'User does not exist!',
                        }
                    const {
                        password: hashed_password,
                        id,
                        info_completion,
                        name,
                    } = db_resp?.[0]
                    const pw_match = hashed_password
                        ? await bcrypt.compare(password, hashed_password)
                        : false
                    if (!pw_match)
                        throw {
                            status: 401,
                            message: 'Invalid password!',
                        }
                    const token = create_jwt_token(id, 'user_id', name, email)
                    return {
                        status: 200,
                        error: false,
                        message: 'Success',
                        data: {
                            token,
                            completion_status: info_completion,
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

export const UserSignupMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('signup', {
            type: TokenResponse,
            args: {
                password: nonNull(stringArg()),
                phone: nonNull(stringArg()),
                email: nonNull(stringArg()),
                name: nonNull(stringArg()),
                gender: GenderEnum,
                age_range: AgeRangeEnum,
            },
            async resolve(_, args, context) {
                const { password, phone, email, name } = args
                const gender = args?.gender
                const age_range = args?.age_range
                try {
                    const { knex_client } = context
                    const existing_email_check = await knex_client
                        .select('email')
                        .from('users')
                        .where({
                            email: email,
                        })
                    if (existing_email_check?.length > 0)
                        throw new Error(
                            'A user already signed up with this email!'
                        )
                    const salt = bcrypt.genSaltSync(10)
                    const hashed_password = bcrypt.hashSync(password, salt)
                    const insert_ret: number[] = await knex_client(
                        'users'
                    ).insert(
                        {
                            password: hashed_password,
                            phone,
                            email,
                            name,
                            gender,
                            age_range,
                        },
                        ['id']
                    )
                    const token = create_jwt_token(
                        insert_ret[0],
                        'user_id',
                        name,
                        email
                    )
                    const welcome_notif_packet = {
                        user_id: insert_ret[0],
                        headline: 'Welcome bonus!',
                        message:
                            'Welcome to Scientia, you have received 3 points for signing up!',
                        event: 'point',
                    }
                    const welcome_points = {
                        user_id: insert_ret[0],
                        units: 3,
                        total: 3,
                        event: 'signup',
                    }
                    await Promise.all([
                        knex_client('notifications').insert(
                            welcome_notif_packet
                        ),
                        knex_client('points').insert(welcome_points),
                    ])
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

export const UserJoinWaitlist = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('waitlist', {
            type: BaseResponse,
            args: {
                email: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { email } = args
                try {
                    const success = await context
                        .knex_client('waitlist')
                        .insert({
                            email,
                        })

                    if (!success) {
                        throw new Error()
                    }

                    return {
                        status: 200,
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

export const UserAddInterests = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('interests', {
            type: BaseResponse,
            args: {
                athletes: nonNull(list(intArg())),
                sports: nonNull(list(stringArg())),
                incentives: nonNull(list(stringArg())),
                notifications_preference: nonNull(list(stringArg())),
            },
            async resolve(_, args, context) {
                try {
                    const {
                        athletes,
                        sports,
                        incentives,
                        notifications_preference,
                    } = args
                    const { knex_client } = context
                    const { user_id, email } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const db_updates_array = [
                        knex_client('interests').insert({
                            user_id,
                            sports: JSON.stringify(sports),
                            incentives: JSON.stringify(incentives),
                            notifications_preference: JSON.stringify(
                                notifications_preference
                            ),
                        }),
                        knex_client('users').where('id', user_id).update({
                            info_completion: 'complete',
                        }),
                        ...athletes.map((athlete_id: number | null) => {
                            return knex_client('users_athletes').insert({
                                athlete_id,
                                user_id,
                            })
                        }),
                    ]
                    await Promise.all(db_updates_array)
                    if (
                        notifications_preference.includes('email') &&
                        !process.env.NO_EMAILS
                    ) {
                        const body =
                            "We're glad you completed your signup! Login to your profile to get the latest exclusive stuff from your favorite athletes! We can't wait to show you around."
                        send_email_notifications([
                            {
                                email: email!,
                                body,
                                subject: 'Welcome to Scientia',
                            },
                        ])
                    }

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

export const UserFetchSports = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_sports', {
            type: UserFetchSportsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    await login_auth(context?.auth_token, 'user_id')
                    const { knex_client } = context
                    const available_sports = await knex_client('constants')
                        .select('sports')
                        .where('id', 1)
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            sports: JSON.parse(available_sports?.[0]?.sports),
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

export const UserFetchIncentives = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_incentives', {
            type: UserFetchIncentivesResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    await login_auth(context?.auth_token, 'user_id')
                    const available_incentives = await context
                        .knex_client('constants')
                        .select('incentives')
                        .where('id', 1)
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            incentives: JSON.parse(
                                available_incentives?.[0]?.incentives
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

export const UserDisplayAthletes = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('athletes', {
            type: UserFetchAthletesResponse,
            args: {
                next_min_id: intArg(),
                limit: nonNull(intArg()),
                sports: nonNull(list(stringArg())),
            },
            async resolve(_, args, context) {
                login_auth(context?.auth_token, 'user_id')
                const { knex_client } = context
                try {
                    const { next_min_id, limit, sports } = args
                    const athlete_query = knex_client
                        .select('id', 'name', 'image_url', 'sport', 'metadata')
                        .from('athletes')
                        .whereIn('sport', sports)
                        .orderBy('id', 'asc')
                        .limit(limit)
                    if (next_min_id) {
                        athlete_query.where('id', '>', next_min_id)
                    }
                    const db_resp: AthleteDataType[] = await athlete_query
                    const ret_value = db_resp.map((resp) => {
                        try {
                            const parsed_mdata = JSON.parse(resp?.metadata)
                            return {
                                id: resp?.id,
                                name: resp?.name,
                                image_url: resp?.image_url,
                                sport: resp?.sport,
                                description: parsed_mdata?.description,
                            }
                        } catch (err) {
                            throw {
                                status: 400,
                                message: 'Could not parse athlete metadata',
                            }
                        }
                    })
                    const batch_len = db_resp.length
                    const max_id = batch_len ? db_resp[batch_len - 1]?.id : 0
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            athlete_data: ret_value,
                            max_id,
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

export const UserInterestsSuggestions = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_user_suggestions', {
            type: UserFetchSuggestionsResponse,
            args: {
                next_max_id_ath: intArg(),
                next_max_visits_count: intArg(),
                next_max_id_curr_products: intArg(),
                next_max_view_count_curr_products: intArg(),
                next_max_id_upc_products: intArg(),
                next_max_view_count_upc_products: intArg(),
                limit: intArg(),
                user_id: intArg(),
            },
            async resolve(_, args, context) {
                try {
                    const {
                        limit,
                        next_max_id_ath,
                        next_max_visits_count,
                        next_max_id_curr_products,
                        next_max_view_count_curr_products,
                        next_max_id_upc_products,
                        next_max_view_count_upc_products,
                    } = args
                    const DEFAULT_PAGINATION_UPPER_BOUND = 1000000000
                    const nxt_max_id_ath =
                        next_max_id_ath ?? DEFAULT_PAGINATION_UPPER_BOUND
                    const nxt_max_visits_count =
                        next_max_visits_count ?? DEFAULT_PAGINATION_UPPER_BOUND
                    const nxt_max_id_curr_products =
                        next_max_id_curr_products ??
                        DEFAULT_PAGINATION_UPPER_BOUND
                    const nxt_max_view_count_curr_products =
                        next_max_view_count_curr_products ??
                        DEFAULT_PAGINATION_UPPER_BOUND
                    const nxt_max_id_upc_products =
                        next_max_id_upc_products ??
                        DEFAULT_PAGINATION_UPPER_BOUND
                    const nxt_max_view_count_upc_products =
                        next_max_view_count_upc_products ??
                        DEFAULT_PAGINATION_UPPER_BOUND
                    let { user_id } = args
                    let no_of_athlete_pages = 0,
                        no_of_curr_product_pages = 0,
                        no_of_upcoming_product_pages = 0
                    /**
                     * We use this endpoint both to show suggestions for logged in fans
                     * and to display an overview of the product to visiting users who aren't signed up/logged in yet
                     */
                    const is_not_logged_in = user_id === -1
                    const MAX_SUGGESTIONS = 15
                    const suggestions_limit = limit ?? MAX_SUGGESTIONS
                    const { knex_client } = context
                    type SuggestedProducts = {
                        id: number
                        name: string
                        price: number
                        end_time: string | null
                        start_time?: string | null | undefined
                        exclusive: boolean
                        media_urls: string
                        description: string
                        view_count: number
                    }
                    type NormalizedProducts = {
                        id: number
                        name: string
                        price: number
                        end_time: string | null
                        start_time?: string | null | undefined
                        media_urls: string[]
                        description: string
                    }
                    const normalize_products = (
                        prod: SuggestedProducts
                    ): NormalizedProducts => {
                        return {
                            id: prod.id,
                            name: prod.name,
                            media_urls: JSON.parse(prod.media_urls),
                            price: prod.price,
                            description: prod.description,
                            start_time: prod.start_time,
                            end_time: prod.end_time,
                        }
                    }
                    let athlete_suggestions: SuggestionsDataType[] = []
                    let curr_products_list: SuggestedProducts[] = []
                    let upcoming_products_list: SuggestedProducts[] = []
                    let min_ath_id = 0
                    let min_curr_products_id = 0
                    let min_upc_products_id = 0
                    let min_ath_visits_count = 0
                    let min_curr_view_count = 0
                    let min_upc_view_count = 0
                    if (!is_not_logged_in) {
                        //This is a scenario where we're pulling suggestions for a logged in user
                        const decoded_token = await login_auth(
                            context?.auth_token,
                            'user_id'
                        )
                        user_id = decoded_token?.user_id
                        const raw_athletes_list: { athlete_id: number }[] =
                            await knex_client('users_athletes')
                                .select('athlete_id')
                                .where({ user_id })
                        const athletes_list = raw_athletes_list.map(
                            (ath_packet) => ath_packet.athlete_id
                        )
                        //console.log(athletes_list, 'lists')
                        athlete_suggestions = await knex_client('athletes')
                            .select(
                                'id',
                                'name',
                                'image_url',
                                'metadata',
                                'sport'
                            )
                            .whereNotIn('id', athletes_list)
                            .where('id', '<', nxt_max_id_ath)
                            .orderBy('id', 'desc')
                            .limit(suggestions_limit)
                        //console.log(athlete_suggestions)
                        min_ath_id =
                            athlete_suggestions[athlete_suggestions.length - 1]
                                ?.id
                        const raw_viewed_products: { product_id: number }[] =
                            await knex_client('product_views')
                                .distinct('product_id')
                                .where({ user_id })
                        let raw_curr_products_list: SuggestedProducts[][] = []
                        let raw_upcoming_products_list: SuggestedProducts[][] =
                            []
                        //console.log(raw_upcoming_products_list)
                        const athletes_list_str = prep_sql_array(athletes_list)
                        raw_upcoming_products_list = await knex_client.raw(
                            `SELECT p.id, p.athlete_id, p.name, p.media_urls, p.price, p.description, p.start_time, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE p.athlete_id IN ${athletes_list_str} AND p.start_time > CURRENT_TIMESTAMP() AND p.deleted_at IS NULL GROUP BY p.id HAVING (view_count, p.id) < (${nxt_max_view_count_upc_products}, ${nxt_max_id_upc_products}) ORDER BY view_count DESC, p.id DESC LIMIT ${suggestions_limit};`
                        )
                        upcoming_products_list = raw_upcoming_products_list[0]
                        min_upc_products_id =
                            upcoming_products_list[
                                upcoming_products_list.length - 1
                            ]?.id
                        min_upc_view_count =
                            upcoming_products_list[
                                upcoming_products_list.length - 1
                            ]?.view_count
                        const viewed_products_str = prep_sql_array(
                            raw_viewed_products.map((prod) => prod.product_id)
                        )

                        raw_curr_products_list = await knex_client.raw(
                            `SELECT p.id, p.name, p.media_urls, p.price, p.description, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE p.id NOT IN ${viewed_products_str} AND (p.start_time IS NULL OR p.start_time <= CURRENT_TIMESTAMP()) AND p.deleted_at IS NULL AND (p.end_time IS NULL OR p.end_time > CURRENT_TIMESTAMP()) GROUP BY p.id HAVING (view_count, id) < (${nxt_max_view_count_curr_products}, ${nxt_max_id_curr_products}) ORDER BY view_count DESC, p.id DESC LIMIT ${suggestions_limit};`
                        )
                        curr_products_list = raw_curr_products_list[0]
                        min_curr_products_id =
                            curr_products_list[curr_products_list.length - 1]
                                ?.id
                        min_curr_view_count =
                            curr_products_list[curr_products_list.length - 1]
                                ?.view_count
                        if (nxt_max_id_ath === DEFAULT_PAGINATION_UPPER_BOUND) {
                            const no_of_ath_rows: { total_athletes: number } =
                                await knex_client('athletes')
                                    .count('* as total_athletes')
                                    .whereNotIn('id', athletes_list)
                                    .first()
                            const { total_athletes } = no_of_ath_rows
                            no_of_athlete_pages = Math.ceil(
                                total_athletes / suggestions_limit
                            )
                            //console.log(no_of_athlete_pages, 'page  nummmmm')

                            const total_upcoming_products: {
                                total_uc: number
                            }[][] = await knex_client.raw(
                                `SELECT COUNT(*) AS total_uc FROM (SELECT p.id, p.athlete_id, p.name, p.media_urls, p.price, p.description, p.start_time, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE p.athlete_id IN ${athletes_list_str} AND p.start_time > CURRENT_TIMESTAMP() AND p.deleted_at IS NULL GROUP BY p.id) AS subquery_alias;`
                            )
                            //console.log(total_upcoming_products[0][0]?.total_uc, 'total upcoming products')
                            no_of_upcoming_product_pages = Math.ceil(
                                total_upcoming_products[0][0]?.total_uc /
                                    suggestions_limit
                            )

                            //console.log(viewed_products_str, 'viewed str')
                            const total_current_products: {
                                total_cp: number
                            }[][] = await knex_client.raw(
                                `SELECT COUNT(*) AS total_cp FROM (SELECT p.id, p.name, p.media_urls, p.price, p.description, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE p.id NOT IN ${viewed_products_str} AND (p.start_time IS NULL OR p.start_time <= CURRENT_TIMESTAMP()) AND p.deleted_at IS NULL AND (p.end_time IS NULL OR p.end_time > CURRENT_TIMESTAMP()) GROUP BY p.id) AS subquery_alias;`
                            )
                            //console.log(total_current_products[0][0]?.total_cp, 'total current products')
                            no_of_curr_product_pages = Math.ceil(
                                total_current_products[0][0]?.total_cp /
                                    suggestions_limit
                            )
                        }
                        //console.log(viewed_products_str)
                    } else {
                        if (nxt_max_id_ath === DEFAULT_PAGINATION_UPPER_BOUND) {
                            const no_of_ath_rows: {
                                total_athletes: number
                            }[][] = await knex_client.raw(
                                `SELECT COUNT(*) AS total_athletes FROM (SELECT ath.id, ath.name, ath.image_url, ath.metadata, ath.sport, COUNT(*) AS visits FROM athletes ath LEFT JOIN store_visits sv ON ath.id=sv.athlete_id GROUP BY ath.id) AS subquery_alias;`
                            )
                            const { total_athletes } = no_of_ath_rows[0][0]
                            //console.log(no_of_ath_rows, 'total athhs')
                            no_of_athlete_pages = Math.ceil(
                                total_athletes / suggestions_limit
                            )
                            const total_upcoming_products: {
                                total_uc: number
                            }[][] = await knex_client.raw(
                                `SELECT COUNT(*) AS total_uc FROM (SELECT p.id, p.athlete_id, p.name, p.media_urls, p.price, p.description, p.start_time, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE p.start_time > CURRENT_TIMESTAMP() AND p.deleted_at IS NULL GROUP BY p.id) AS subquery_alias;`
                            )
                            //console.log(total_upcoming_products[0][0]?.total_uc, 'total upcoming products')
                            no_of_upcoming_product_pages = Math.ceil(
                                total_upcoming_products[0][0]?.total_uc /
                                    suggestions_limit
                            )
                            const total_current_products: {
                                total_cp: number
                            }[][] = await knex_client.raw(
                                `SELECT COUNT(*) AS total_cp FROM (SELECT p.id, p.name, p.media_urls, p.price, p.description, p.start_time, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE (p.start_time IS NULL OR p.start_time <= CURRENT_TIMESTAMP()) AND p.deleted_at IS NULL AND (p.end_time IS NULL OR p.end_time > CURRENT_TIMESTAMP()) GROUP BY p.id) AS subquery_alias;`
                            )
                            //console.log(total_current_products[0][0]?.total_cp, 'total current products')
                            no_of_curr_product_pages = Math.ceil(
                                total_current_products[0][0]?.total_cp /
                                    suggestions_limit
                            )
                        }
                        const raw_athlete_suggestions: SuggestionsDataType[][] =
                            await knex_client.raw(`
                            SELECT ath.id, ath.name, ath.image_url, ath.metadata, ath.sport, COUNT(*) AS visits FROM athletes ath LEFT JOIN store_visits sv ON ath.id=sv.athlete_id GROUP BY ath.id HAVING (visits, ath.id) < (${nxt_max_visits_count}, ${nxt_max_id_ath}) ORDER BY visits DESC, ath.id DESC LIMIT ${suggestions_limit};
                        `)
                        //console.log(raw_athlete_suggestions)
                        athlete_suggestions = raw_athlete_suggestions[0]
                        min_ath_id =
                            athlete_suggestions[athlete_suggestions.length - 1]
                                ?.id
                        min_ath_visits_count =
                            athlete_suggestions[athlete_suggestions.length - 1]
                                ?.visits
                        const raw_curr_products_list = await knex_client.raw(
                            `SELECT p.id, p.name, p.media_urls, p.price, p.description, p.start_time, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE (p.start_time IS NULL OR p.start_time <= CURRENT_TIMESTAMP()) AND p.deleted_at IS NULL AND (p.end_time IS NULL OR p.end_time > CURRENT_TIMESTAMP()) GROUP BY p.id HAVING (view_count, p.id) < (${nxt_max_view_count_curr_products}, ${nxt_max_id_curr_products}) ORDER BY view_count DESC, p.id DESC LIMIT ${suggestions_limit};`
                        )
                        curr_products_list = raw_curr_products_list[0]
                        min_curr_products_id =
                            curr_products_list[curr_products_list.length - 1]
                                ?.id
                        min_curr_view_count =
                            curr_products_list[curr_products_list.length - 1]
                                ?.view_count
                        const raw_upcoming_products_list =
                            await knex_client.raw(
                                `SELECT p.id, p.athlete_id, p.name, p.media_urls, p.price, p.description, p.start_time, p.end_time, count(*) AS view_count FROM products p LEFT JOIN product_views pv ON p.id = pv.product_id WHERE p.start_time > CURRENT_TIMESTAMP() AND p.deleted_at IS NULL GROUP BY p.id HAVING (view_count, p.id) < (${nxt_max_view_count_upc_products}, ${nxt_max_id_upc_products}) ORDER BY view_count DESC, p.id DESC LIMIT ${suggestions_limit};`
                            )
                        upcoming_products_list = raw_upcoming_products_list[0]
                        min_upc_products_id =
                            upcoming_products_list[
                                upcoming_products_list.length - 1
                            ]?.id
                        min_upc_view_count =
                            upcoming_products_list[
                                upcoming_products_list.length - 1
                            ]?.view_count
                    }
                    //console.log(upcoming_products_list)

                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            athlete_suggestions,
                            products:
                                curr_products_list.map(normalize_products),
                            upcoming_products:
                                upcoming_products_list.map(normalize_products),
                            no_of_athlete_pages,
                            no_of_curr_product_pages,
                            no_of_upcoming_product_pages,
                            min_ath_id,
                            min_ath_visits_count,
                            min_curr_products_id,
                            min_curr_view_count,
                            min_upc_products_id,
                            min_upc_view_count,
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

export const UserFollowAthlete = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('user_follow_athlete', {
            type: BaseResponse,
            args: { athlete_id: nonNull(intArg()) },
            async resolve(_, args, context) {
                try {
                    const { user_id } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const { athlete_id } = args
                    const { knex_client } = context
                    // await knex_client('interests')
                    //     .update({
                    //         athletes: knex_client.raw(
                    //             'JSON_ARRAY_APPEND(athletes, "$", ?)',
                    //             [athlete_id]
                    //         ),
                    //     })
                    //     .where({ user_id })
                    //     .whereRaw(
                    //         'NOT JSON_CONTAINS(athletes, CAST(? AS JSON), "$")',
                    //         [athlete_id]
                    //     )
                    await knex_client('users_athletes').insert({
                        user_id,
                        athlete_id,
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

export const UserFetchFollowing = queryType({
    definition(t) {
        t.nonNull.field('user_following', {
            type: UserFetchAthletesResponse,
            args: {
                next_min_id: intArg(),
                limit: intArg(),
                order_by_store_visits: booleanArg(),
            },
            async resolve(_, args, context) {
                const { user_id } = await login_auth(
                    context?.auth_token,
                    'user_id'
                )
                const { knex_client } = context
                try {
                    const { next_min_id, limit, order_by_store_visits } = args
                    // Subquery to count all the products that have not been viewed by this user
                    const products_subquery = knex_client('products as p')
                        .select(
                            knex_client.raw(
                                'COUNT(DISTINCT p.id) AS new_product_count'
                            )
                        )
                        .where(
                            'p.athlete_id',
                            '=',
                            knex_client.raw('athletes.id')
                        )
                        .whereNotIn(
                            'p.id',
                            (query_builder: Knex.QueryBuilder) => {
                                query_builder
                                    .select('pv.product_id')
                                    .from('product_views as pv')
                                    .whereRaw(`pv.user_id = ${user_id}`)
                            }
                        )

                    const athlete_query = knex_client('athletes')
                        .join(
                            'users_athletes',
                            'athletes.id',
                            '=',
                            'users_athletes.athlete_id'
                        )
                        .select([
                            'athletes.id',
                            'athletes.name',
                            'athletes.image_url',
                            'athletes.sport',
                            'athletes.metadata',
                            knex_client.raw(
                                `(${products_subquery}) as new_product_count`
                            ),
                        ])
                        .where('users_athletes.user_id', user_id)

                    if (next_min_id) {
                        athlete_query.where('athletes.id', '>', next_min_id)
                    }
                    if (limit) {
                        athlete_query.limit(limit)
                    }
                    if (order_by_store_visits) {
                        const latest_unique_visits_subquery = knex_client(
                            'store_visits'
                        )
                            .select('user_id', 'athlete_id')
                            .max('created_at as latest_created_at')
                            .groupBy('athlete_id', 'user_id')

                        const subquery_alias = knex_client.raw('(?) as ??', [
                            latest_unique_visits_subquery,
                            'latest_store_visits',
                        ])

                        athlete_query
                            .leftJoin(
                                subquery_alias,
                                (join_arg: Knex.JoinClause) => {
                                    join_arg
                                        .on(
                                            'athletes.id',
                                            '=',
                                            'latest_store_visits.athlete_id'
                                        )
                                        .andOn(
                                            'users_athletes.user_id',
                                            '=',
                                            'latest_store_visits.user_id'
                                        )
                                }
                            )
                            .orderBy(
                                'latest_store_visits.latest_created_at',
                                'desc'
                            )
                    }
                    const db_resp: AthleteDataType[] = await athlete_query
                    const ret_value = db_resp.map((resp) => {
                        try {
                            const parsed_mdata = JSON.parse(resp?.metadata)
                            return {
                                id: resp?.id,
                                name: resp?.name,
                                image_url: resp?.image_url,
                                sport: resp?.sport,
                                description: parsed_mdata?.description,
                                new_product_count: resp?.new_product_count,
                            }
                        } catch (err) {
                            throw {
                                status: 400,
                                message: 'Could not parse athlete metadata',
                            }
                        }
                    })
                    const batch_len = db_resp.length
                    const max_id = batch_len ? db_resp[batch_len - 1]?.id : 0
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            athlete_data: ret_value,
                            max_id,
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

export const UserFetchActivity = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_activity', {
            type: UserFetchActivityResponse,
            args: {
                next_min_id: intArg(),
                limit: nonNull(intArg()),
            },
            async resolve(_, args, context) {
                const { user_id } = await login_auth(
                    context?.auth_token,
                    'user_id'
                )
                const { knex_client } = context
                try {
                    const { next_min_id, limit } = args
                    const activity_query = knex_client('sales_products')
                        .leftJoin(
                            'sales',
                            'sales.id',
                            '=',
                            'sales_products.sale_id'
                        )
                        .leftJoin(
                            'products',
                            'sales_products.product_id',
                            '=',
                            'products.id'
                        )
                        .leftJoin(
                            'athletes',
                            'products.athlete_id',
                            '=',
                            'athletes.id'
                        )
                        .select(
                            'sales_products.id',
                            'products.name',
                            'athletes.name as athlete',
                            'sales_products.created_at',
                            'sales.status',
                            'products.media_urls'
                        )
                        .whereRaw(`sales_products.user_id = ${user_id}`)
                        .orderBy('sales_products.id', 'desc')
                        .limit(limit)
                    if (next_min_id) {
                        activity_query.where(
                            'sales_products.id',
                            '>',
                            next_min_id
                        )
                    }
                    const points_query = knex_client('points')
                        .select('total')
                        .where({ user_id })
                        .orderBy('id', 'desc')
                        .limit(1)
                        .first()
                    const [db_sales_resp, db_points_resp]: [
                        UserActivityType[],
                        { total: number }
                    ] = await Promise.all([activity_query, points_query])
                    const normalized_db_resp = db_sales_resp?.map(
                        (activity) => {
                            const media_url_list =
                                JSON.parse(activity.media_urls ?? null) ?? []
                            return {
                                name: activity.name,
                                status: activity.status,
                                image_url: media_url_list[0],
                                athlete: activity.athlete,
                                id: activity.id,
                                distance: formatDistance(
                                    new Date(activity.created_at),
                                    new Date(),
                                    { addSuffix: true }
                                ),
                            }
                        }
                    )
                    const batch_len = db_sales_resp.length
                    const max_id = batch_len
                        ? db_sales_resp[batch_len - 1]?.id
                        : 0
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            activity: normalized_db_resp,
                            max_id,
                            points: db_points_resp?.total ?? 0,
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

const SaleProductTmpl = inputObjectType({
    name: 'SaleProductTmpl',
    definition(t) {
        t.nonNull.int('quantity')
        t.nonNull.int('product_id')
        t.nonNull.int('price')
    },
})

const DeliveryDetailsTmpl = inputObjectType({
    name: 'DeliveryDetailsTmpl',
    definition(t) {
        t.string('address')
        t.string('city')
        t.string('zipcode')
        t.string('card_email')
        t.string('card_name')
        t.string('card_number')
        t.string('card_expiry')
    },
})

export const UserCreateSale = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('user_create_sale', {
            type: UserCreateSaleResponse,
            args: {
                items: nonNull(list(SaleProductTmpl.asArg())),
                total_value: nonNull(floatArg()),
                delivery_details: nonNull(DeliveryDetailsTmpl.asArg()),
            },
            async resolve(_, args, context) {
                try {
                    const { user_id, email, name } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const { items, delivery_details, total_value } = args
                    const { knex_client } = context
                    const remaining_qtys: { quantity: number; name: string }[] =
                        await Promise.all(
                            items.map(
                                (
                                    item: {
                                        price: number
                                        product_id: number
                                        quantity: number
                                    } | null
                                ) => {
                                    return knex_client('products')
                                        .select('quantity', 'name')
                                        .where('id', item?.product_id)
                                        .first()
                                }
                            )
                        )
                    const item_len = remaining_qtys.length
                    type ItemsCloneType = {
                        price: number
                        product_id: number
                        quantity: number
                        new_qty?: number
                        name?: string
                    }
                    const items_clone: ItemsCloneType[] = items.map(
                        (item: ItemsCloneType | null) => ({
                            price: item!.price,
                            product_id: item!.product_id,
                            quantity: item!.quantity,
                        })
                    )
                    for (let i = 0; i < item_len; i++) {
                        //Calculate the new quantity for each product after current sale
                        items_clone[i]!.new_qty =
                            remaining_qtys[i].quantity - items[i]!.quantity
                        items_clone[i]!.name = remaining_qtys[i].name
                        //Check that all items are still in stock
                        if (items[i]!.quantity > remaining_qtys[i].quantity) {
                            throw {
                                status: 400,
                                error: true,
                                message:
                                    remaining_qtys[i].quantity > 0
                                        ? `Only ${remaining_qtys[i].quantity} units of product '${remaining_qtys[i].name}' remaining in stock.`
                                        : `We're sorry, product '${remaining_qtys[i].name}' is out of stock.`,
                            }
                        }
                    }
                    const sale_ref = email![1] + String(Date.now()) + email![0]
                    const [sale_id]: [number] = await knex_client(
                        'sales'
                    ).insert({ user_id, total_value, sale_ref }, ['id'])
                    await Promise.all([
                        ...items.map(
                            (
                                item: {
                                    price: number
                                    product_id: number
                                    quantity: number
                                } | null
                            ) => {
                                return knex_client('sales_products').insert({
                                    user_id,
                                    sale_id,
                                    product_id: item!.product_id,
                                    quantity: item!.quantity,
                                })
                            }
                        ),
                        ...items_clone.map((item) => {
                            return knex_client('products')
                                .update({
                                    quantity: item.new_qty,
                                })
                                .where('id', item.product_id)
                        }),
                        knex_client('delivery_info')
                            .insert({
                                ...delivery_details,
                                user_id,
                            })
                            .onConflict('user_id')
                            .merge(),
                    ])
                    const email_notif_message = (
                        items: ItemsCloneType[]
                    ): string => {
                        let order_list = ''
                        items.forEach((item) => {
                            order_list += `<li>Name: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}</li>`
                        })
                        return order_list
                    }
                    const html_message = `<html><body><p>Dear ${name}, your order has been confirmed and is being processed. Here are the details: \n<ul>${email_notif_message(
                        items_clone
                    )}</ul><br/>Total purchase value: <strong>$${total_value}</strong><br/>Your purchase ID is: <strong>${sale_ref}</strong></p></body></html>`
                    const plain_text_message = `Dear ${name}, your order with purchase id: ${sale_ref} has been confirmed and is being processed`
                    const headline = 'Successful Purchase'
                    create_sale_notification({
                        knex_client,
                        sale_id,
                        user_id: user_id!,
                        headline,
                        html_message,
                        plain_text_message,
                        email: email!,
                        sale_ref,
                        total_value,
                    })
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            sale_ref,
                        },
                    }
                } catch (err) {
                    const Error = err as ServerReturnType
                    console.error(err)
                    return err_return(Error?.status, Error?.message)
                }
            },
        })
    },
})

export const UserFetchNotifications = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_notifications', {
            type: UserFetchNotificationsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { knex_client } = context
                    const { user_id } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const notifications: {
                        id: number
                        message: string
                        status: string
                        event: string
                        headline: string
                        created_at: string
                    }[] = await knex_client('notifications')
                        .select(
                            'id',
                            'message',
                            'status',
                            'event',
                            'headline',
                            'created_at'
                        )
                        .where({ user_id })
                        .orderBy('created_at', 'desc')
                    const normalized_notifications = notifications?.map(
                        (notification) => {
                            return {
                                id: notification.id,
                                status: notification.status,
                                message: notification.message,
                                event: notification.event,
                                headline: notification.headline,
                                distance: formatDistance(
                                    new Date(notification.created_at),
                                    new Date(),
                                    { addSuffix: true }
                                ),
                            }
                        }
                    )
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            notifications: normalized_notifications,
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

export const UserUpdateSettingsMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('user_update_notif_settings', {
            type: BaseResponse,
            args: {
                notifications_preference: nonNull(list(stringArg())),
            },
            async resolve(_, args, context) {
                const { notifications_preference } = args
                try {
                    const { user_id } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const { knex_client } = context
                    await knex_client('interests')
                        .update({
                            notifications_preference: JSON.stringify(
                                notifications_preference
                            ),
                        })
                        .where('user_id', '=', user_id)
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

export const UserFetchNotifSettingsQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_notif_settings', {
            type: UserFetchNotifSettingsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { user_id } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const { knex_client } = context
                    const notif_settings_resp: {
                        notifications_preference: string
                    } = await knex_client('interests')
                        .select('notifications_preference')
                        .where('user_id', '=', user_id)
                        .first()
                    if (!notif_settings_resp) {
                        throw new Error(
                            'Registration incomplete. No default notification preferences set'
                        )
                    }
                    const { notifications_preference } = notif_settings_resp
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            notifications_preference: JSON.parse(
                                notifications_preference
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

export const userFetchUnreadNotifications = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_unread_notifications', {
            type: UserUnreadNotificationsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { knex_client } = context
                    const { user_id } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const [count] = await knex_client.raw(
                        `SELECT COUNT(*) AS count FROM notifications WHERE user_id = ${user_id} AND status = 'unread'`
                    )
                    const unread_count = count[0]?.count
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            unread_count,
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

export const UserUpdateReadNotifications = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('user_mark_read_notifications', {
            type: BaseResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { knex_client, auth_token } = context
                    const { user_id } = await login_auth(auth_token, 'user_id')
                    await knex_client('notifications')
                        .update({
                            status: 'read',
                        })
                        .where({ user_id })
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

export const UserFetchAthleteStore = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_athlete_store', {
            type: UsersFetchAthleteStore,
            args: {
                athlete_id: nonNull(intArg()),
            },
            async resolve(_, args, context) {
                try {
                    let { athlete_id } = args
                    let user_id = 0
                    /**
                     * May be bad practice, but we're reusing this user endpoint for athletes as well when we
                     * need to display a store view of their store to them, it returns the same data so we didn't
                     * see the need to reinvent the wheel.
                     * How do we differentiate? When the user visits, we expect to have a valid athlete id in the args
                     * but when it's being used by an athlete, we set the athlete_id arg to -1 and pick the correct athlete_id from
                     * the athlete's login token
                     */
                    const is_athlete_visit: boolean = athlete_id === -1
                    const { knex_client, auth_token } = context
                    if (is_athlete_visit) {
                        const decoded_token = await login_auth(
                            auth_token,
                            'athlete_id'
                        )
                        athlete_id = decoded_token.athlete_id!
                    } else {
                        const decoded_token = await login_auth(
                            auth_token,
                            'user_id'
                        )
                        user_id = decoded_token.user_id!
                    }
                    const products_resp: UserAthleteStoreType =
                        await knex_client
                            .select(
                                'athletes.name as athlete_name',
                                'athletes.image_url',
                                knex_client.raw(
                                    `(SELECT JSON_OBJECT('id', id, 'name', name, 'media_urls', media_urls, 'price', price, 'description', description, 'exclusive', exclusive, 'end_time', end_time, 'quantity', quantity, 'start_time', start_time, 'metadata', metadata, 'discount', discount,
                                    'number_of_views', (SELECT COUNT(*) FROM product_views WHERE product_id = products.id)) FROM products WHERE products.athlete_id = ${athlete_id} AND products.deleted_at IS NULL AND end_time IS NOT NULL AND end_time > CURRENT_TIMESTAMP() ORDER BY created_at DESC LIMIT 1) AS featured`
                                ),
                                knex_client.raw(
                                    `(
                                    SELECT JSON_ARRAYAGG(
                                      JSON_OBJECT(
                                        'id', products.id,
                                        'name', products.name,
                                        'media_urls', products.media_urls,
                                        'price', products.price,
                                        'description', products.description,
                                        'exclusive', products.exclusive,
                                        'end_time', products.end_time,
                                        'quantity', products.quantity,
                                        'start_time', products.start_time,
                                        'discount', products.discount,
                                        'number_of_views', (SELECT COUNT(*) FROM product_views WHERE product_id = products.id)
                                      )
                                    )
                                    FROM products
                                    WHERE products.athlete_id = athletes.id AND products.deleted_at IS NULL AND products.end_time IS NOT NULL AND products.end_time < CURRENT_TIMESTAMP()
                                  ) AS expired_drops`
                                ),
                                knex_client.raw(`
                        (
                          SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                              'id', products.id,
                              'name', products.name,
                              'media_urls', products.media_urls,
                              'price', products.price,
                              'description', products.description,
                              'exclusive', products.exclusive,
                              'end_time', products.end_time,
                              'metadata', products.metadata,
                              'quantity', products.quantity,
                              'start_time', products.start_time,
                              'discount', products.discount,
                              'number_of_views', (SELECT COUNT(*) FROM product_views WHERE product_id = products.id)
                            )
                          )
                          FROM products
                          WHERE products.athlete_id = athletes.id AND products.deleted_at IS NULL AND (products.end_time IS NULL OR products.end_time > CURRENT_TIMESTAMP()) AND (products.start_time IS NULL OR products.start_time < CURRENT_TIMESTAMP())
                        ) AS products
                      `),
                                knex_client.raw(`
                      (
                        SELECT JSON_ARRAYAGG(
                          JSON_OBJECT(
                            'id', products.id,
                            'name', products.name,
                            'media_urls', products.media_urls,
                            'price', products.price,
                            'description', products.description,
                            'exclusive', products.exclusive,
                            'end_time', products.end_time,
                            'metadata', products.metadata,
                            'quantity', products.quantity,
                            'start_time', products.start_time,
                            'discount', products.discount,
                            'number_of_views', (SELECT COUNT(*) FROM product_views WHERE product_id = products.id)
                          )
                        )
                        FROM products
                        WHERE products.athlete_id = athletes.id AND products.deleted_at IS NULL AND (products.end_time IS NULL OR products.end_time > CURRENT_TIMESTAMP()) AND products.start_time > CURRENT_TIMESTAMP()
                      ) AS future_products
                    `)
                            )
                            .from('athletes')
                            .where('athletes.id', athlete_id)
                            .first()

                    const products_list: ProductsRespType[] =
                        JSON.parse(products_resp.products ?? null) ?? []
                    const expired_drops: ProductsRespType[] =
                        JSON.parse(products_resp.expired_drops ?? null) ?? []
                    const future_products: ProductsRespType[] =
                        JSON.parse(products_resp.future_products ?? null) ?? []
                    const featured_product: ProductsRespType =
                        JSON.parse(products_resp.featured ?? null) ?? null

                    // if (
                    //     featured_product &&
                    //     Object.keys(featured_product).length > 0
                    // ) {
                    //     featured_product['start_time'] = null
                    // }
                    //console.log(products_list, expired_drops, future_products, featured_product)
                    /**
                     * As a specific frontend request, we're merging the featured products and future products arrays
                     * with the featured product being the final element
                     */
                    const featured = future_products.concat([featured_product])
                    const media_url_extractor_and_exclusive_bool_converter = (
                        product: ProductsRespType
                    ) => {
                        if (product) {
                            const norm_product: {
                                id: number
                                name: string
                                price: number
                                discounted_price: number
                                discount: number
                                end_time: string | null
                                start_time?: string | null
                                exclusive: boolean
                                media_url: string
                                description: string
                                number_of_views: number
                                quantity: number
                                category?: string
                                notified_followers: boolean
                            } = {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                discount: product.discount,
                                discounted_price:
                                    product.discount > 0
                                        ? Math.round(
                                              (product.discount / 100) *
                                                  product.price
                                          )
                                        : product.price,
                                end_time: product.end_time,
                                start_time: product?.start_time,
                                exclusive: product.exclusive === 'true',
                                media_url: (product.media_urls ?? [])[0],
                                description: product.description,
                                number_of_views: product.number_of_views,
                                quantity: product.quantity,
                                notified_followers: false,
                            }
                            if (product?.metadata) {
                                norm_product.category =
                                    product.metadata.category
                                norm_product.notified_followers = product
                                    .metadata?.notified_followers
                                    ? product.metadata?.notified_followers
                                    : false
                            }
                            return norm_product
                        }
                        return null
                    }
                    if (!is_athlete_visit) {
                        await knex_client('store_visits').insert({
                            user_id,
                            athlete_id,
                        })
                    }
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            athlete_name: products_resp.athlete_name,
                            image_url: products_resp.image_url,
                            products: products_list.map(
                                media_url_extractor_and_exclusive_bool_converter
                            ),
                            expired_drops: expired_drops.map(
                                media_url_extractor_and_exclusive_bool_converter
                            ),
                            featured: featured.map(
                                media_url_extractor_and_exclusive_bool_converter
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

export const UserFetchProduct = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_product', {
            type: UsersFetchProduct,
            args: {
                product_id: nonNull(intArg()),
            },
            async resolve(_, args, context) {
                try {
                    const { auth_token, knex_client } = context
                    const { product_id } = args
                    const { user_id } = await login_auth(auth_token, 'user_id')

                    const extract_distance = (time_val: string | null) => {
                        if (!time_val) {
                            return null
                        }
                        return formatDistance(new Date(time_val), new Date(), {
                            addSuffix: true,
                        })
                    }

                    const product: {
                        name: string
                        price: number
                        currency: string
                        end_time: string | null
                        start_time: string | null
                        exclusive: string
                        quantity: number
                        media_urls: string
                        description: string
                        total_views: number
                    } = await knex_client('products')
                        .select(
                            'name',
                            'media_urls',
                            'price',
                            'currency',
                            'quantity',
                            'exclusive',
                            'end_time',
                            'start_time',
                            'description',
                            knex_client.raw(
                                `(SELECT COUNT(*) FROM product_views WHERE product_id = ${product_id}) AS total_views`
                            )
                        )
                        .where('id', product_id)
                        .whereRaw('deleted_at IS NULL')
                        .first()

                    await knex_client('product_views').insert({
                        user_id,
                        product_id,
                    })
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            product: {
                                name: product.name,
                                price: product.price,
                                currency: product.currency,
                                end_time: product.end_time,
                                start_time: product.start_time,
                                end_distance: extract_distance(
                                    product.end_time
                                ),
                                start_distance: extract_distance(
                                    product.start_time
                                ),
                                exclusive: product.exclusive === 'true',
                                quantity: product.quantity,
                                media_urls: JSON.parse(product.media_urls),
                                description: product.description,
                                total_views: product.total_views,
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

export const UserFetchDeliveryDetails = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_delivery_details', {
            type: DeliveryDetailsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { auth_token, knex_client } = context
                    const { user_id } = await login_auth(auth_token, 'user_id')
                    type DeliveryType = {
                        address: string
                        city: string
                        zipcode: string
                        card_email: string
                        card_name: string
                        card_number: string
                        card_expiry: string
                        name: string
                        email: string
                        phone: string
                    }
                    const delivery_details: DeliveryType = await knex_client(
                        'users as u'
                    )
                        .select(
                            'd.address',
                            'd.city',
                            'd.zipcode',
                            'd.card_email',
                            'd.card_name',
                            'd.card_number',
                            'd.card_expiry',
                            'u.name',
                            'u.email',
                            'u.phone'
                        )
                        .leftJoin(
                            'delivery_info as d',
                            'u.id',
                            '=',
                            'd.user_id'
                        )
                        .whereRaw(`u.id = ${user_id}`)
                        .first()
                    const delivery_normalizer = (del_details: DeliveryType) => {
                        return {
                            name: del_details.name,
                            email: del_details.email,
                            phone: del_details.phone,
                            card_expiry: del_details.card_expiry ?? '',
                            card_number: del_details.card_number ?? '',
                            card_name: del_details.card_name ?? '',
                            card_email: del_details.card_email ?? '',
                            zipcode: del_details.zipcode ?? '',
                            city: del_details.city ?? '',
                            address: del_details.address ?? '',
                        }
                    }
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: delivery_normalizer(delivery_details),
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
