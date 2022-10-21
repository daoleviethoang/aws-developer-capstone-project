import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateDiaryRequest } from '../../requests/CreateDiaryRequest'
import { getUserId } from '../utils';
import { createDiary } from '../../helpers/diaries'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newDiary: CreateDiaryRequest = JSON.parse(event.body)
    const diaryItem = await createDiary(newDiary, getUserId(event));

    return {
      statusCode: 201,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
          "item": diaryItem
      }),
  }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
