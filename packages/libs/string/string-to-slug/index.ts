export const stringToSlug = (str: string) => {
  let formattedString = str

  formattedString = str.replace(/^\s+|\s+$/g, '') // trim
  formattedString = str.toLowerCase()

  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaeeeeiiiioooouuuunc------'
  for (let i = 0, l = from.length; i < l; i++) {
    formattedString = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  formattedString = str
    .replace(/[^A-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return formattedString
}
