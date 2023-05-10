import { enumType, extendType, nonNull, stringArg, list } from 'nexus'
import { MutationAuthResponse, ServerReturnType, login_auth } from './utils'
import { err_return } from './utils'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { create_jwt_token } from './utils'

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
            type: MutationAuthResponse,
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
                    const token = create_jwt_token(id)
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
            type: MutationAuthResponse,
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
                    const token = create_jwt_token(insert_ret?.[0])
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
            type: MutationAuthResponse,
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
            type: MutationAuthResponse,
            args: {
                athletes: nonNull(list(stringArg())),
                sports: nonNull(list(stringArg())),
                incentives: nonNull(list(stringArg())),
            },
            async resolve(_, args, context) {
                try {
                    const { athletes, sports, incentives } = args
                    const user_id = login_auth(context?.auth_token)

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
