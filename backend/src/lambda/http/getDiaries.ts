import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getDiariesForUser as getDiariesForUser } from '../../helpers/diaries'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const diaries = await getDiariesForUser(getUserId(event));
    diaries.forEach(function (e) {
      e.password = null;
      if(e.lock) {
        e.title = "****"
        e.date = "****"
        e.description = "****"
        e.attachmentUrl = ""
      }
    });


    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "items": diaries,
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
