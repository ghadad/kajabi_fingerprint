'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
require('dotenv').config()
const Config = require('config');

 
module.exports = async function (fastify, opts) {

  fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/', // optional: default '/'
  })
  
 
  fastify.register(require('@fastify/cors'), { 
    // put your options here
  })

  fastify.decorate('db', {})
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts,Config)
  })
  
}

