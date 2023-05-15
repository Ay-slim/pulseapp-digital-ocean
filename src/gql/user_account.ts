import { enumType, extendType, nonNull, stringArg, list, intArg } from 'nexus'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { formatDistance, subDays } from 'date-fns'
import {
    create_jwt_token,
    AthleteDataType,
    err_return,
    GQLResponse,
    ServerReturnType,
    login_auth,
    UserContentType,
    SuggestionsDataType,
} from './utils'

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
            type: GQLResponse,
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { email, password } = args
                try {
                    const db_resp = await context.knex_client
                        .select('password', 'id', 'info_completion')
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
                    } = db_resp?.[0]
                    const pw_match = hashed_password
                        ? await bcrypt.compare(password, hashed_password)
                        : false
                    if (!pw_match)
                        throw {
                            status: 401,
                            message: 'Invalid password!',
                        }
                    const token = create_jwt_token(id, 'user_id')
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
                    return err_return(Error?.status, Error?.message)
                }
            },
        })
    },
})

export const UserSignupMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('signup', {
            type: GQLResponse,
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
                    const existing_email_check = await context.knex_client
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
                    const insert_ret = await context
                        .knex_client('users')
                        .insert(
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
                    const token = create_jwt_token(insert_ret?.[0], 'user_id')
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
                    return err_return(Error?.status, Error?.message)
                }
            },
        })
    },
})

export const UserJoinWaitlist = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('waitlist', {
            type: GQLResponse,
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
                        data: {
                            email,
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

export const UserAddInterests = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('interests', {
            type: GQLResponse,
            args: {
                athletes: nonNull(list(intArg())),
                sports: nonNull(list(stringArg())),
                incentives: nonNull(list(stringArg())),
            },
            async resolve(_, args, context) {
                try {
                    const { athletes, sports, incentives } = args
                    const user_id = login_auth(
                        context?.auth_token,
                        'user_id'
                    )?.user_id

                    await Promise.all([
                        context.knex_client('interests').insert({
                            user_id,
                            athletes: JSON.stringify(athletes),
                            sports: JSON.stringify(sports),
                            incentives: JSON.stringify(incentives),
                        }),
                        context
                            .knex_client('users')
                            .where('id', user_id)
                            .update({
                                info_completion: 'complete',
                            }),
                    ])

                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            completion_status: 'complete',
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

export const UserFetchSports = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_sports', {
            type: GQLResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    login_auth(context?.auth_token, 'user_id')?.user_id
                    const available_sports = await context
                        .knex_client('constants')
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
                    return err_return(Error?.status, Error?.message)
                }
            },
        })
    },
})

export const UserFetchIncentives = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('user_fetch_incentives', {
            type: GQLResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    login_auth(context?.auth_token, 'user_id')?.user_id
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
                    return err_return(Error?.status, Error?.message)
                }
            },
        })
    },
})

export const UserDisplayAthletes = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('athletes', {
            type: GQLResponse,
            args: {
                next_min_id: intArg(),
                limit: nonNull(intArg()),
                sports: nonNull(list(stringArg())),
            },
            async resolve(_, args, context) {
                login_auth(context?.auth_token, 'user_id')
                try {
                    const { next_min_id, limit, sports } = args
                    const athlete_query = context.knex_client
                        .select(
                            'id',
                            'display_name',
                            'image_url',
                            'sport',
                            'metadata'
                        )
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
                                display_name: resp?.display_name,
                                image_url: resp?.image_url,
                                sport: resp?.sport,
                                incentives: parsed_mdata?.incentives,
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
                    return err_return(Error?.status, Error?.message)
                }
            },
        })
    },
})

export const UserDisplayContent = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_user_content', {
            type: GQLResponse,
            args: {
                next_min_id: intArg(),
                limit: nonNull(intArg()),
                athlete_select_id: intArg(),
            },
            async resolve(_, args, context) {
                try {
                    const { next_min_id, limit, athlete_select_id } = args
                    const { user_id } = login_auth(
                        context?.auth_token,
                        'user_id'
                    )
                    const interests_data = await context
                        .knex_client('interests')
                        .select('athletes')
                        .where('user_id', user_id)
                        .first()
                    const athletes_list = JSON.parse(interests_data?.athletes)
                    const content_query = context.knex_client
                        .select(
                            'athletes.display_name',
                            'athletes.image_url',
                            'content.media_url',
                            'content.caption',
                            'content.id',
                            'content.created_at'
                        )
                        .from('athletes')
                        .join(
                            'content',
                            'athletes.id',
                            '=',
                            'content.athlete_id'
                        )
                        .orderBy('content.id', 'asc')
                        .limit(limit)
                    if (athlete_select_id) {
                        content_query.where(
                            'athletes.id',
                            '=',
                            athlete_select_id
                        )
                    } else {
                        content_query.whereIn('athletes.id', athletes_list)
                    }
                    if (next_min_id) {
                        content_query.where('content.id', '>', next_min_id)
                    }
                    const db_resp: UserContentType[] = await content_query
                    const batch_len = db_resp.length
                    const max_id = batch_len ? db_resp[batch_len - 1]?.id : 0
                    const normalized_db_resp = db_resp?.map((content) => {
                        return {
                            athlete_display_name: content?.display_name,
                            athlete_image_url: content?.image_url,
                            content_media_url: content?.media_url,
                            content_caption: content?.caption,
                            distance: formatDistance(
                                new Date(content?.created_at),
                                new Date(),
                                { addSuffix: true }
                            ),
                        }
                    })
                    const all_followed_athletes: SuggestionsDataType[] =
                        next_min_id
                            ? []
                            : await context.knex_client
                                  .select('id', 'display_name', 'image_url')
                                  .from('athletes')
                                  .whereIn('id', athletes_list)
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            content_data: normalized_db_resp,
                            athletes: all_followed_athletes,
                            max_id,
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

export const UserInterestsSuggestions = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.field('fetch_user_suggestions', {
            type: GQLResponse,
            args: {},
            async resolve(_, __, context) {
                try {
                    const user_id = login_auth(
                        context?.auth_token,
                        'user_id'
                    )?.user_id
                    const interests_data = await context
                        .knex_client('interests')
                        .select('athletes', 'incentives')
                        .where('user_id', user_id)
                        .first()
                    const athletes_list = JSON.parse(interests_data?.athletes)
                    // const incentives_list = JSON.parse(interests_data?.incentives)
                    const suggestions: SuggestionsDataType[] = await context
                        .knex_client('athletes')
                        .select('id', 'display_name', 'image_url', 'metadata')
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
                    return err_return(Error?.status, Error?.message)
                }
            },
        })
    },
})
