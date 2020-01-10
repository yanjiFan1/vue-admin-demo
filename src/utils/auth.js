import Cookies from 'js-cookie'

const TokenKey = 'Token'
const NameKey = 'Name'
const AvatarKey = 'Avatar'
const tokenKey = 'token' // 注意这个用户token
const userNameKey = 'userName'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getUserName() {
  return Cookies.get(userNameKey)
}

export function setUserNameKey(name) {
  return Cookies.set(userNameKey, name)
}

export function removeNameKey() {
  return Cookies.remove(userNameKey)
}

export function getUserToken() {
  return Cookies.get(tokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getName() {
  return Cookies.get(NameKey)
}

export function setName(name) {
  return Cookies.set(NameKey, name)
}

export function removeName() {
  return Cookies.remove(NameKey)
}

export function getAvatar() {
  return Cookies.get(AvatarKey)
}

export function setAvatar(avatar) {
  return Cookies.set(AvatarKey, avatar)
}

export function removeAvatar() {
  return Cookies.remove(AvatarKey)
}
