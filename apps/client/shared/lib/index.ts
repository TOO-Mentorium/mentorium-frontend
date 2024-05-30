export const bffUrl = (endpoint: string) => {
  return `${process.env.bffUrl}${endpoint}`
}

export const apiUrl = (endpoint: string) => {
  return `${process.env.apiUrl}${endpoint}`
}
