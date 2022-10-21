import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { DiaryItem } from '../models/DiaryItem'
import { DiaryUpdate } from '../models/DiaryUpdate';
import { LockDiaryRequest } from "../requests/LockDiaryRequest";

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('DiariesAccess')

export class DiariesAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly diaryTable = process.env.DIARIES_TABLE) {
    }

    async getDiariesForUser(userId: string): Promise<DiaryItem[]> {
        logger.info("Getting all diary")
        const params = {
            TableName: this.diaryTable,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId"
            },
            ExpressionAttributeValues: {
                ":userId": userId
            }
        };

        const result = await this.docClient.query(params).promise();
        logger.info(result);
        const items = result.Items;

        return items as DiaryItem[];
    }

    async createDiary(diaryItem: DiaryItem): Promise<DiaryItem> {
        logger.info("Creating new diary");

        const params = {
            TableName: this.diaryTable,
            Item: diaryItem,
        };

        const result = await this.docClient.put(params).promise();
        logger.info(result);
        const attributes = result.Attributes;

        return attributes as DiaryItem;
    }

    async updateDiary(diaryUpdate: DiaryUpdate, diaryId: string, userId: string): Promise<DiaryUpdate> {

        const params = {
            TableName: this.diaryTable,
            Key: {
                "userId": userId,
                "diaryId": diaryId
            },
            UpdateExpression: "set #a = :a, #b = :b, #c = :c",
            ExpressionAttributeNames: {
                "#a": "title",
                "#b": "description",
                "#c": "date"
            },
            ExpressionAttributeValues: {
                ":a": diaryUpdate['title'],
                ":b": diaryUpdate['description'],
                ":c": diaryUpdate['date']
            },
            ReturnValues: "ALL_NEW"
        };

        const result = await this.docClient.update(params).promise();
        logger.info(result);
        const attributes = result.Attributes;

        return attributes as DiaryUpdate;
    }

    async deleteDiary(diaryId: string, userId: string): Promise<string> {
        logger.info("Deleting diary");

        const params = {
            TableName: this.diaryTable,
            Key: {
                "userId": userId,
                "diaryId": diaryId
            },
        };

        const result = await this.docClient.delete(params).promise();
        logger.info(result);

        return diaryId as string;
    }

    async getDiariesForUserAndId(userId: string, diaryId: string): Promise<DiaryItem> {
        logger.info("Getting all diary")
        const params = {
            TableName: this.diaryTable,
            KeyConditionExpression: "#userId = :userId and #diaryId = :diaryId",
            ExpressionAttributeNames: {
                "#userId": "userId",
                "#diaryId": "diaryId"
            },
            ExpressionAttributeValues: {
                ":userId": userId,
                ":diaryId": diaryId
            }
        };

        const result = await this.docClient.query(params).promise();
        logger.info(result);
        const item = result.Items[0];

        return item as DiaryItem;
    }

    async lockDiary(lockDiaryRequest: LockDiaryRequest, diaryId: string, userId: string): Promise<void> {

        const params = {
            TableName: this.diaryTable,
            Key: {
                "userId": userId,
                "diaryId": diaryId
            },
            UpdateExpression: "set #a = :a, #b = :b",
            ExpressionAttributeNames: {
                "#a": "password",
                "#b": "lock"
            },
            ExpressionAttributeValues: {
                ":a": lockDiaryRequest['password'],
                ":b": true
            },
            ReturnValues: "ALL_NEW"
        };

        await this.docClient.update(params).promise();
    }

    async unlockDiary(lockDiaryRequest: LockDiaryRequest, diaryId: string, userId: string): Promise<void> {
        const item = await this.getDiariesForUserAndId(userId, diaryId);
        if(item.password != lockDiaryRequest.password) {
            throw("Password not matching");
        }

        const params = {
            TableName: this.diaryTable,
            Key: {
                "userId": userId,
                "diaryId": diaryId
            },
            UpdateExpression: "set #a = :a, #b = :b",
            ExpressionAttributeNames: {
                "#a": "password",
                "#b": "lock"
            },
            ExpressionAttributeValues: {
                ":a": null,
                ":b": false
            },
            ReturnValues: "ALL_NEW"
        };

        await this.docClient.update(params).promise();
    }

    async searchDiariesForUser(userId: string, searchValue: string): Promise<DiaryItem[]> {
        const items = await this.getDiariesForUser(userId);
        logger.info(items);
        const searchItems = this.find(items, searchValue);
        
        return searchItems as DiaryItem[];
    }

    find(items, text) {
        text = text.split(' ');
        return items.filter(item => {
          return text.every(el => {
            return item.title.includes(el);
          });
        });
      }
}
