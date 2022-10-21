import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export async function generateUploadUrlUtils(diaryId: string): Promise<string> {
    const url = new XAWS.S3({ signatureVersion: 'v4' }).getSignedUrl('putObject', {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: diaryId,
        Expires: 1000,
    });
    return url as string;
}