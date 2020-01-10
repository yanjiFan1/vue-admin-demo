/**
 * Created by yanji on 2018/8/16.
 */
import { get, post } from './tools'
import * as config from './config'

/* 用户信息 */
export const getUserMenu = () => post({ url: config.GETUSERINFO }) // 获取用户信息
export const logout = () => get({ url: config.LOGOUT }) // 登出
export const login = () => get({ url: config.LOGINBYUSERNAME }) // 用户名登录

