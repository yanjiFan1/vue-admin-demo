/**
 * Created by yanji on 2018/8/16.
 */
import { get, post } from './tools'
import * as config from './config'

/* 用户信息 */
export const getUserMenu = (params) => get({ url: config.GETUSERINFO, data: params }) // 获取用户信息
export const logout = (params) => get({ url: config.LOGOUT, data: params }) // 登出
export const login = (params) => post({ url: config.LOGINBYUSERNAME, data: params }) // params
export const testList = (params) => get({ url: config.TESTLIST, data: params }) // 测试table

