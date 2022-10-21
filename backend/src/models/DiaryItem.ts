export interface DiaryItem {
  userId: string
  diaryId: string
  createdAt: string
  title: string
  date: string
  lock: boolean
  description: string
  password: string
  attachmentUrl?: string
}
