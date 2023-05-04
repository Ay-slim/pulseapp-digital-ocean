import { enumType, extendType, nonNull, stringArg } from 'nexus'
import { MutationAuthResponse, ServerReturnType } from './utils'
import { err_return } from './utils'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { create_jwt_token } from './utils'

dotenv.config()

const GenderEnum = enumType({
    name: 'GenderEnum',
    members: ['male', 'female', 'nonbinary', 'other'],
})

/* ALL CONTRACTS RELATED TO USER ACCOUNT MANAGEMENT*/
export const UserSigninMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('signin', {
            type: MutationAuthResponse,
            args: {
                username: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { username, password } = args
                try {
                    const db_resp =
                        await context.prisma.users.findUniqueOrThrow({
                            where: {
                                username,
                            },
                            select: {
                                password: true,
                            },
                        })
                    const { password: hashed_password } = db_resp
                    //Needed the check below because Typescript is too dumb to realize that findUniqueorThrow would throw if hashed_password is null
                    const pw_match = hashed_password
                        ? await bcrypt.compare(password, hashed_password)
                        : false
                    if (!pw_match)
                        throw {
                            status: 401,
                            message: 'Invalid password!',
                        }
                    const token = create_jwt_token(username)
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
                username: nonNull(stringArg()),
                password: nonNull(stringArg()),
                phone: nonNull(stringArg()),
                email: nonNull(stringArg()),
                full_name: nonNull(stringArg()),
                gender: GenderEnum,
                age_range: stringArg(),
            },
            async resolve(_, args, context) {
                const { username, password, phone, email, full_name } = args
                const gender = args?.gender
                const age_range = args?.age_range
                try {
                    const existing_uname_check =
                        await context.prisma.users.findUnique({
                            where: {
                                username,
                            },
                            select: {
                                username: true,
                            },
                        })
                    if (existing_uname_check)
                        throw new Error('Username already exists!')
                    const salt = bcrypt.genSaltSync(10)
                    const hashed_password = bcrypt.hashSync(password, salt)
                    await context.prisma.users.create({
                        data: {
                            username,
                            password: hashed_password,
                            phone,
                            email,
                            full_name,
                            gender,
                            age_range,
                        },
                    })
                    const token = create_jwt_token(username)
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
                    return {
                        status: 400,
                        error: true,
                        message: Error?.message,
                    }
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
                    const success = await context.prisma.waitlist.create({
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
                    return {
                        status: 500,
                        error: true,
                        message: 'Could not add to waitlist',
                    }
                }
            },
        })
    },
})
