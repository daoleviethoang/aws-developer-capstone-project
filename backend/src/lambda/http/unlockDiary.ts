import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { unlockDiary } from '../../helpers/diaries'
import { LockDiaryRequest } from '../../requests/LockDiaryRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const diaryId = event.pathParameters.diaryId
      const lockDiaryRequest: LockDiaryRequest = JSON.parse(event.body);

      await unlockDiary(lockDiaryRequest, diaryId, getUserId(event));

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          "item": {}
        }),
      }
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          "message": "Password incorrect"
        }),
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
