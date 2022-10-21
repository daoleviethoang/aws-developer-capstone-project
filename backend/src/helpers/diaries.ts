import {DiaryItem} from "../models/DiaryItem";
import {CreateDiaryRequest} from "../requests/CreateDiaryRequest";
import {UpdateDiaryRequest} from "../requests/UpdateDiaryRequest";
import {DiaryUpdate} from "../models/DiaryUpdate";
import { DiariesAccess } from "./diariesAcess";
import { generateUploadUrlUtils } from "./attachmentUtils";
import { LockDiaryRequest } from "../requests/LockDiaryRequest";

const uuidv4 = require('uuid/v4');
const diariesAccess = new DiariesAccess();

export function createDiary(createDiaryRequest: CreateDiaryRequest, userId: string): Promise<DiaryItem> {
    const diaryId =  uuidv4();
    const s3BucketName = process.env.S3_BUCKET_NAME;
    
    return diariesAccess.createDiary({
        userId: userId,
        diaryId: diaryId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${diaryId}`, 
        createdAt: new Date().getTime().toString(),
        lock: false,
        password: null,
        ...createDiaryRequest,
    });
}

export function deleteDiary(diaryId: string, userId: string): Promise<string> {
    return diariesAccess.deleteDiary(diaryId, userId);
}

export function updateDiary(updateDiaryRequest: UpdateDiaryRequest, diaryId: string, userId: string): Promise<DiaryUpdate> {
    return diariesAccess.updateDiary(updateDiaryRequest, diaryId, userId);
}

export function generateUploadUrl(diaryId: string): Promise<string> {
    return generateUploadUrlUtils(diaryId);
}

export function getDiariesForUser(userId: string): Promise<DiaryItem[]> {
    return diariesAccess.getDiariesForUser(userId);
}

export function getDiariesForUserAndId(userId: string, diaryId: string): Promise<DiaryItem> {
    return diariesAccess.getDiariesForUserAndId(userId, diaryId);
}

export function lockDiary(lockDiaryRequest: LockDiaryRequest, diaryId: string, userId: string): Promise<void> {
    return diariesAccess.lockDiary(lockDiaryRequest, diaryId, userId);
}

export function unlockDiary(lockDiaryRequest: LockDiaryRequest, diaryId: string, userId: string): Promise<void> {
    return diariesAccess.unlockDiary(lockDiaryRequest, diaryId, userId);
}

export function searchDiariesForUser(userId: string, searchValue: string): Promise<DiaryItem[]> {
    return diariesAccess.searchDiariesForUser(userId, searchValue);
}
