import { extendType, nonNull, stringArg } from 'nexus'
import { GQLResponse, ServerReturnType, login_auth } from './utils'
import { err_return } from './utils'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import dotenv from 'dotenv'

dotenv.config()
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET } = process.env
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error('No AWS config found')
}
const client = new S3Client({
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
    region: 'us-east-1',
})

export const s3_upload = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('s3_upload', {
            type: GQLResponse,
            args: {
                file_name: nonNull(stringArg()),
            },
            async resolve(_, args, context) {
                const { file_name } = args
                try {
                    login_auth(context?.auth_token, 'athlete_id')
                    const img_key = `${Date.now()}_${file_name}`
                    const command = new PutObjectCommand({
                        Bucket: AWS_S3_BUCKET,
                        Key: img_key,
                    })
                    const signed_url = await getSignedUrl(client, command, {
                        expiresIn: 3600,
                    })
                    //const image_url = `https://s3.amazonaws.com/${bucket_name}/${img_key}`
                    return {
                        status: 201,
                        error: false,
                        message: 'Success',
                        data: {
                            signed_url,
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
