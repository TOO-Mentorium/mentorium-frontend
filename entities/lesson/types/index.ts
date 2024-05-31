export interface Lesson {
  uid: string
  title: string
  averageTimeToRead: number
  content: string
  interactiveComponents: string
  createdDate: string
  updatedDate: string
  progression: number
}

export interface LessonSimplified {
  uid: string
  title: string
}
