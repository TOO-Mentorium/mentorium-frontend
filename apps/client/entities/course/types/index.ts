import type { LessonSimplified } from '../../lesson/types'

export interface Course {
  uid: string
  name: string
  slug: string
  imageUrl: string
  description: string
  prerequisites: string
  whatWillLearn: string
  author: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    createDate: string
    updatedDate: string
    lastLogin: string
    hashRefreshToken: string
  }
  isPublished: boolean
  createdDate: string
  updatedDate: string
  lessons: LessonSimplified[]
}

export interface CourseSimplified {
  uid: string
  name: string
  imageUrl: string
  slug: string
  author: {
    username: string
    firstName: string
    lastName: string
  }
  description: string
}

export interface CourseSimplifiedWithPublished extends CourseSimplified {
  isPublished: boolean
}
