export function validateUsername(str) {
  const username = new RegExp('[A-Za-z0-9_\-\u4e00-\u9fa5]+')
  return str !== undefined && str.length >= 3 && username.test(str)
}

export function validatePassword(password) {
  const passwordRegExp = /^.*(?=.{6,12})(?=.*\d)(?=.*[a-zA-Z]{1,})(?=.*[-!\.@#$%^&*?\(\)]).*$/
  return passwordRegExp.test(password)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}
