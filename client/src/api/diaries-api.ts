import { apiEndpoint } from '../config'
import { Diary } from '../types/Diary';
import Axios from 'axios'
import { UpdateDiaryRequest } from '../types/UpdateDiaryRequest';
import { CreateDiaryRequest } from '../types/CreateDiaryRequest';
import { SearchDiaryRequest } from '../types/SearchDiaryRequest';
import { PasswordDiaryRequest } from '../types/PasswordDiaryRequest';

export async function getDiaries(idToken: string): Promise<Diary[]> {
  console.log('Fetching diaries')

  const response = await Axios.get(`${apiEndpoint}/diaries`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Diaries:', response.data)
  return response.data.items
}

export async function createDiary(
  idToken: string,
  newDiary: CreateDiaryRequest
): Promise<Diary> {
  const response = await Axios.post(`${apiEndpoint}/diary`,  JSON.stringify(newDiary), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  //return response.data.item
  return response.data
}

export async function patchDiary(
  idToken: string,
  diaryId: string,
  updatedDiary: UpdateDiaryRequest
): Promise<Diary> {
  const response = await Axios.patch(`${apiEndpoint}/diary/${diaryId}`, JSON.stringify(updatedDiary), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item;
}

export async function deleteDiary(
  idToken: string,
  diaryId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/diary/${diaryId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  diaryId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/diary/${diaryId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function getDiary(idToken: string, diaryId: string): Promise<Diary> {
  console.log('Fetching diary')

  const response = await Axios.get(`${apiEndpoint}/diary/${diaryId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('diary:', response.data)
  return response.data.item
}

export async function searchDiary(
  idToken: string,
  searchDiaryRequest: SearchDiaryRequest
): Promise<Diary[]> {
  const response = await Axios.post(`${apiEndpoint}/diaries/search`,  JSON.stringify(searchDiaryRequest), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  //return response.data.item
  return response.data.items
}

export async function lockDiary(
  idToken: string,
  diaryId: string,
  passwordDiaryRequest: PasswordDiaryRequest
): Promise<Diary[]> {
  const response = await Axios.patch(`${apiEndpoint}/diary/${diaryId}/lock`,  JSON.stringify(passwordDiaryRequest), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data
}

export async function unlockDiary(
  idToken: string,
  diaryId: string,
  passwordDiaryRequest: PasswordDiaryRequest
): Promise<Diary[]> {
  const response = await Axios.patch(`${apiEndpoint}/diary/${diaryId}/unlock`,  JSON.stringify(passwordDiaryRequest), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  //return response.data.item
  return response.data
}