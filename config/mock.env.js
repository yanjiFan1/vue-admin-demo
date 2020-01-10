/*
 * @Description:
 * @Author: yanji
 * @Date: 2020-1-9 19:26:37
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"mock"',
  BASE_API: '"http://localhost:8088/api"'
})
