import {
    enumType,
    extendType,
    nonNull,
    stringArg,
    list,
    intArg,
    queryType,
    floatArg,
} from 'nexus'
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
                        headline: 'Signing bonus!',
                        message:
                            'Welcome to Scientia! You have received 3 points as signing bonus',
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
                        ...athletes.map((athlete_id) => {
                            return knex_client('users_athletes').insert({
                                athlete_id,
                                user_id,
                            })
                        }),
                    ]
                    await Promise.all(db_updates_array)
                    if (notifications_preference.includes('email')) {
                        const body =
                            "We're glad you completed your signup! Login to your profile to get the latest exclusive stuff from your favorite athletes! We can't wait to show you around."
                        send_email_notifications(
                            [email!],
                            'Welcome to Scientia!',
                            body
                        )
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

// export const UserDisplayContent = extendType({
//     type: 'Query',
//     definition(t) {
//         t.nonNull.field('fetch_user_content', {
//             type: GQLResponse,
//             args: {
//                 next_min_id: intArg(),
//                 limit: nonNull(intArg()),
//                 athlete_select_id: intArg(),
//                 live_events: booleanArg(),
//             },
//             async resolve(_, args, context) {
//                 // else if (live_events) {
//                 //     // content_query.whereRaw('content.end_time IS NOT NULL')
//                 //     // content_query.where('content.end_time', '>', Date.now())
//                 // }
//                 try {
//                     const { next_min_id, limit, athlete_select_id } = args
//                     const { user_id } = login_auth(
//                         context?.auth_token,
//                         'user_id'
//                     )
//                     //console.log(user_id)
//                     const interests_data = await context
//                         .knex_client('interests')
//                         .select('athletes', 'sports')
//                         .where('user_id', user_id)
//                         .first()
//                     //console.log(interests_data, 'INTERESTSSSSSSS')
//                     const athletes_list = JSON.parse(interests_data?.athletes)
//                     const sports_list = JSON.parse(interests_data?.sports)
//                     const content_query = context.knex_client
//                         .select(
//                             'athletes.name',
//                             'athletes.image_url',
//                             'events.media_url',
//                             'events.caption',
//                             'events.id',
//                             'events.created_at'
//                         )
//                         .from('athletes')
//                         .join('events', 'athletes.id', '=', 'events.athlete_id')
//                         .orderBy('events.id', 'asc')
//                         .limit(limit)
//                     if (athlete_select_id) {
//                         content_query.where(
//                             'athletes.id',
//                             '=',
//                             athlete_select_id
//                         )
//                     } else {
//                         content_query.whereIn('athletes.id', athletes_list)
//                     }
//                     if (next_min_id) {
//                         content_query.where('events.id', '>', next_min_id)
//                     }
//                     const db_resp: UserContentType[] = await content_query
//                     const batch_len = db_resp.length
//                     const max_id = batch_len ? db_resp[batch_len - 1]?.id : 0
//                     const normalized_db_resp = db_resp?.map((content) => {
//                         return {
//                             athlete_name: content?.name,
//                             athlete_image_url: content?.image_url,
//                             content_media_url: content?.media_url,
//                             content_caption: content?.caption,
//                             distance: formatDistance(
//                                 new Date(content?.created_at),
//                                 new Date(),
//                                 { addSuffix: true }
//                             ),
//                         }
//                     })
//                     //Only returning suggestios on first call to this endpoint, hence the check for next_min_id existence
//                     const all_followed_athletes: SuggestionsDataType[] =
//                         next_min_id
//                             ? []
//                             : await context.knex_client
//                                   .select('id', 'name', 'image_url')
//                                   .from('athletes')
//                                   .whereIn('sport', sports_list)
//                                   .whereNotIn('id', athletes_list)
//                     //console.log(all_followed_athletes, 'ALL FOLLOWEEDDDDD')
//                     return {
//                         status: 201,
//                         error: false,
//                         message: 'Success',
//                         data: {
//                             content_data: normalized_db_resp,
//                             athletes: all_followed_athletes,
//                             max_id,
//                         },
//                     }
//                 } catch (err) {
//                     const Error = err as ServerReturnType
//                     console.error(err)
//                     return err_return(Error?.status)
//                 }
//             },
//         })
//     },
// })

export const UserInterestsSuggestions = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_user_suggestions', {
            type: UserFetchSuggestionsResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const { user_id } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const { knex_client } = context
                    // const interests_data = await context
                    //     .knex_client('interests')
                    //     .select('athletes', 'incentives')
                    //     .where('user_id', user_id)
                    //     .first()
                    //const athletes_list = JSON.parse(interests_data?.athletes)
                    // const incentives_list = JSON.parse(interests_data?.incentives)
                    const athletes_list = knex_client('users_athletes')
                        .select('athlete_id')
                        .where({ user_id })
                    const suggestions: SuggestionsDataType[] = await context
                        .knex_client('athletes')
                        .select('id', 'name', 'image_url', 'metadata', 'sport')
                        .whereNotIn('id', athletes_list)
                    // const filtered_suggestions = suggestions.map(suggestion => {
                    //     const ath_metadata = JSON.parse(suggestion?.metadata)

                    // })
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            suggestions,
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
                    const athlete_query = knex_client('athletes')
                        .join(
                            'users_athletes',
                            'athletes.id',
                            '=',
                            'users_athletes.athlete_id'
                        )
                        .select(
                            'athletes.id',
                            'athletes.name',
                            'athletes.image_url',
                            'athletes.sport',
                            'athletes.metadata'
                        )
                        .whereRaw(`users_athletes.user_id = ${user_id}`)
                        .orderBy('athletes.id', 'asc')
                        .limit(limit)
                    if (next_min_id) {
                        athlete_query.where('athletes.id', '>', next_min_id)
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
                    const activity_query = knex_client('sales')
                        .leftJoin(
                            'products',
                            'sales.product_id',
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
                            'sales.id',
                            'products.name',
                            'athletes.name as athlete',
                            'sales.created_at',
                            'sales.status',
                            'products.media_urls'
                        )
                        .whereRaw(`sales.user_id = ${user_id}`)
                        .orderBy('sales.id', 'asc')
                        .limit(limit)
                    if (next_min_id) {
                        activity_query.where('sales.id', '>', next_min_id)
                    }
                    const points_query = knex_client('points')
                        .select('total')
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

export const UserCreateSale = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('user_create_sale', {
            type: BaseResponse,
            args: {
                product_id: nonNull(intArg()),
                quantity: intArg(),
                total_value: nonNull(floatArg()),
            },
            async resolve(_, args, context) {
                try {
                    const { user_id } = await login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const { product_id, quantity, total_value } = args
                    const { knex_client } = context
                    const sales_packet: {
                        user_id: number
                        product_id: number
                        quantity?: number
                        total_value: number
                    } = {
                        user_id: user_id!,
                        product_id,
                        total_value,
                    }
                    if (quantity) {
                        sales_packet['quantity'] = quantity
                    }
                    await knex_client('sales').insert(sales_packet)
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
                    const { athlete_id } = args
                    const { knex_client, auth_token } = context
                    const { user_id } = await login_auth(auth_token, 'user_id')
                    const products_resp: UserAthleteStoreType =
                        await knex_client
                            .select(
                                'athletes.name as athlete_name',
                                'athletes.image_url',
                                knex_client.raw(
                                    `(SELECT JSON_OBJECT('id', id, 'name', name, 'media_urls', media_urls, 'price', price, 'description', description, 'exclusive', exclusive, 'end_time', end_time,
                                    'number_of_views', (SELECT COUNT(*) FROM product_views WHERE product_id = products.id)) FROM products WHERE products.athlete_id = ${athlete_id} AND end_time IS NOT NULL AND end_time > CURRENT_TIMESTAMP() ORDER BY created_at DESC LIMIT 1) AS featured`
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
                              'number_of_views', (SELECT COUNT(*) FROM product_views WHERE product_id = products.id)
                            )
                          )
                          FROM products
                          WHERE products.athlete_id = athletes.id AND products.deleted_at IS NULL AND (products.end_time IS NULL OR products.end_time > CURRENT_TIMESTAMP())
                        ) AS products
                      `)
                            )
                            .from('athletes')
                            .where('athletes.id', athlete_id)
                            .first()

                    type ProductsRespType = {
                        id: number
                        name: string
                        price: number
                        end_time: string | null
                        exclusive: string
                        media_urls: string[]
                        description: string
                        number_of_views: number
                    }
                    const products_list: ProductsRespType[] =
                        JSON.parse(products_resp.products ?? null) ?? []
                    const expired_drops: ProductsRespType[] =
                        JSON.parse(products_resp.expired_drops ?? null) ?? []
                    const featured: ProductsRespType =
                        JSON.parse(products_resp.featured ?? null) ?? null
                    const media_url_extractor_and_exclusive_bool_converter = (
                        product: ProductsRespType
                    ) => {
                        return product
                            ? {
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  end_time: product.end_time,
                                  exclusive: product.exclusive === 'true',
                                  media_url: (product.media_urls ?? [])[0],
                                  description: product.description,
                                  number_of_views: product.number_of_views,
                              }
                            : null
                    }
                    await knex_client('store_visits').insert({
                        user_id,
                        athlete_id,
                    })
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
                            featured:
                                media_url_extractor_and_exclusive_bool_converter(
                                    featured
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
                    const product: {
                        name: string
                        price: number
                        currency: string
                        end_time: string | null
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
