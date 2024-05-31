export interface BaseResponse<T> {
  isArray: boolean
  path: string
  duration: string
  method: string
  data: T
}
