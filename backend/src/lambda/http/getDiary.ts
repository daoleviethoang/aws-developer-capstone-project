import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getDiariesForUserAndId as getDiariesForUserAndId } from '../../helpers/diaries'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const diaryId = event.pathParameters.diaryId
    const diary = await getDiariesForUserAndId(getUserId(event), diaryId);
    diary.password = null;
    if(diary.lock) {
      diary.title = "****"
      diary.date = "****"
      diary.description = "****"
      diary.attachmentUrl = ""
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
            "item": diary,
        }),
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
