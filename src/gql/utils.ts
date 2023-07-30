import { objectType, list } from 'nexus'
import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Knex } from 'knex'
import nodemailer, { TransportOptions } from 'nodemailer'
//import knex_config from '../db/knexfile'

dotenv.config()
//const env = process.env.NODE_ENV
//const knex_client = knex(knex_config[env!])
type JwtPayloadWithId = JwtPayload & {
    user_id?: number
    athlete_id?: number
    name?: string
    email?: string
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
export type UserAthleteStoreType = {
    athlete_name: string
    image_url: string
    products: string
    expired_drops: string
    featured: string
    future_products: string
}
export type AthleteDataType = SuggestionsDataType & {
    metadata: string
    new_product_count: number
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
    media_urls: string
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

export const create_jwt_token = (
    id: number,
    sign_key: string,
    name: string,
    email: string
): string => {
    const jwt_secret = process.env.JWT_SECRET_KEY
    const token = jwt_secret
        ? jwt.sign({ [sign_key]: id, name, email }, jwt_secret)
        : ''
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

export const err_return = (
    status = 400,
    message = 'Something went wrong'
): ServerReturnType => {
    return {
        status,
        error: true,
        message,
    }
}
export type ProductNotifArgs = {
    knex_client: Knex
    athlete_id: number
    product_id: number
    headline: string
    message: string
}
type NotifComponentType = {
    user_id: number
    email: string
    notifications_preference: string | null
}
const join_string_list = (string_list: string[]) => {
    const string_len = string_list.length
    let joined_string = ''
    for (let i = 0; i < string_len; i++) {
        console.log(string_list[i], 'each rec')
        if (i === 0) {
            joined_string += string_list[i]
        } else {
            joined_string += `, ${string_list[i]}`
        }
    }
    return joined_string
}
export const send_email_notifications = async (
    emails: string[],
    subject: string,
    body: string
) => {
    try {
        const transporter = nodemailer.createTransport({
            port: process.env.SMTP_PORT,
            secure: false,
            host: process.env.SMTP_HOST,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        } as TransportOptions)
        await Promise.all(
            emails.map((email) => {
                transporter.sendMail({
                    from: '"Letty from Scientia" <no_reply@scientia.com>',
                    to: email,
                    subject: subject,
                    html: body,
                })
                console.log(`${subject} email notification sent to: ${email}`)
            })
        )
    } catch (err) {
        console.error(`Email error: ${err}`)
    }
}

export const create_product_notifications = async (args: ProductNotifArgs) => {
    try {
        const { knex_client, athlete_id, product_id, headline, message } = args
        const db_resp = await knex_client.raw(
            `SELECT users_athletes.user_id as user_id, users.email, interests.notifications_preference FROM users_athletes JOIN interests ON users_athletes.user_id = interests.user_id JOIN users ON users_athletes.user_id = users.id WHERE users_athletes.athlete_id = ${athlete_id}`
        )
        const db_resp_dest: NotifComponentType[] = db_resp[0]
        const user_ids = db_resp_dest.map((resp) => {
            return resp.user_id
        })

        await Promise.all(
            user_ids.map((user_id) => {
                return knex_client('notifications').insert({
                    user_id,
                    headline,
                    message,
                    product_id,
                })
            })
        )
        if (!process.env.NO_EMAILS) {
            const follower_emails = db_resp_dest
                .filter((resp_val) => {
                    const notif_prefs =
                        JSON.parse(
                            resp_val.notifications_preference! ?? null
                        ) ?? []
                    return notif_prefs.includes('email')
                })
                .map((resp_val) => {
                    return resp_val.email
                })
            await send_email_notifications(follower_emails, headline, message)
        }
    } catch (err) {
        console.error(err)
    }
}

export type SaleNotifArgs = {
    knex_client: Knex
    sale_id: number
    user_id: number
    headline: string
    html_message: string
    plain_text_message: string
    email: string
    sale_ref: string
    total_value: number
}

export const create_sale_notification = async (args: SaleNotifArgs) => {
    const {
        knex_client,
        sale_id,
        headline,
        html_message,
        plain_text_message,
        user_id,
        email,
        sale_ref,
        total_value,
    } = args
    const { notifications_preference }: { notifications_preference: string } =
        await knex_client('interests')
            .select('notifications_preference')
            .where({ user_id })
            .first()
    await knex_client('notifications').insert({
        user_id,
        sale_id,
        message: plain_text_message,
        headline,
    })
    const notif_prefs: string[] =
        JSON.parse(notifications_preference ?? null) ?? []
    if (notif_prefs.includes('email') && !process.env.NO_EMAILS) {
        await send_email_notifications([email], headline, html_message)
    }
    ///Remove this in production, it's only a temporary mock of a successful payment
    await setTimeout(async () => {
        const sale_html_message = `<html><body><p>Your payment of $${total_value} was successful for your purchase with ref: ${sale_ref}. You have now received 5 extra points!</p></body></html>`
        send_email_notifications(
            [email],
            'Payment Successful',
            sale_html_message
        )
        const { total: current_total_points } = await knex_client('points')
            .select('total')
            .where({ user_id })
            .orderBy('id', 'desc')
            .limit(1)
            .first()
        await Promise.all([
            knex_client('points').insert({
                user_id,
                units: 5,
                total: current_total_points + 5,
                event: 'sale',
            }),
            knex_client('notifications').insert({
                user_id,
                headline: '5 purchase points!',
                message: `You have just gained 5 extra points for your purchase with ref: ${sale_ref}`,
                event: 'point',
            }),
            knex_client('sales')
                .update({
                    status: 'processing',
                })
                .where({ id: sale_id }),
        ])
    }, 120000)
}

type KizunaMetrics = {
    user_id: number
    name: string
    email: string
    sales_count: number
    views_count: number
    visits_count: number
    interaction_score: number
}

export const rank_kizuna_followers = async (
    athlete_id: number,
    knex_client: Knex
) => {
    const sales_count: {
        user_id: number
        name: string
        email: string
        sales_count: number
    }[][] =
        (await knex_client.raw(
            `SELECT sp.user_id, u.name, u.email, COUNT(*) AS sales_count FROM sales_products sp LEFT JOIN products p ON sp.product_id=p.id LEFT JOIN users u ON sp.user_id=u.id WHERE p.athlete_id=${athlete_id} GROUP BY sp.user_id;`
        )) ?? []
    const product_views: {
        user_id: number
        name: string
        email: string
        views_count: number
    }[][] =
        (await knex_client.raw(
            `SELECT pv.user_id, u.name, u.email, COUNT(*) AS views_count FROM product_views pv LEFT JOIN products p ON pv.product_id=p.id LEFT JOIN users u ON pv.user_id=u.id WHERE p.athlete_id=${athlete_id} GROUP BY pv.user_id;`
        )) ?? []
    const store_visits: {
        user_id: number
        name: string
        email: string
        visits_count: number
    }[][] =
        (await knex_client.raw(
            `SELECT sv.user_id, u.name, u.email, COUNT(*) AS visits_count FROM store_visits sv LEFT JOIN users u ON sv.user_id=u.id WHERE sv.athlete_id=${athlete_id} GROUP BY sv.user_id;`
        )) ?? []
    //console.log(sales_count, 'Count', product_views, 'vies', store_visits, 'visits')
    /**
     * Merges all three metrics into an object with the user_id as key
     */
    if (!sales_count.length && !product_views.length && !store_visits.length) {
        return []
    }
    const aggregated_metrics: { [key: string]: KizunaMetrics } = {}
    for (const i of sales_count[0]) {
        aggregated_metrics[i.user_id] = {
            user_id: i.user_id,
            name: i.name,
            email: i.email,
            sales_count: i.sales_count,
            views_count: 0,
            visits_count: 0,
            interaction_score: 0,
        }
    }
    for (const j of product_views[0]) {
        if (!aggregated_metrics[j.user_id]) {
            aggregated_metrics[j.user_id] = {
                user_id: j.user_id,
                name: j.name,
                email: j.email,
                sales_count: 0,
                views_count: j.views_count,
                visits_count: 0,
                interaction_score: 0,
            }
        } else {
            aggregated_metrics[j.user_id].views_count += j.views_count
        }
    }
    for (const k of store_visits[0]) {
        if (!aggregated_metrics[k.user_id]) {
            aggregated_metrics[k.user_id] = {
                user_id: k.user_id,
                name: k.name,
                email: k.email,
                sales_count: 0,
                views_count: 0,
                visits_count: k.visits_count,
                interaction_score: 0,
            }
        } else {
            aggregated_metrics[k.user_id].visits_count += k.visits_count
        }
    }

    /**
     * Create an array of all metrics, calculate interaction score and sort
     */
    const metrics_list: KizunaMetrics[] = []
    for (const l in aggregated_metrics) {
        aggregated_metrics[l].interaction_score =
            2 * aggregated_metrics[l].sales_count +
            1.5 * aggregated_metrics[l].views_count +
            1.2 * aggregated_metrics[l].visits_count
        metrics_list.push(aggregated_metrics[l])
    }
    metrics_list.sort((a, b) => b.interaction_score - a.interaction_score)
    //console.log(metrics_list)
    return metrics_list
}

//rank_kizuna_followers(1, knex_client)
