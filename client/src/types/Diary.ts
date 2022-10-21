export interface Diary {
  diaryId: string
  createdAt: string
  title: string
  date: string
  lock: boolean
  password: string
  description: string
  attachmentUrl?: string
}
