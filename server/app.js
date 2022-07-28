'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
require('dotenv').config()
const Config = require('config');

console.log(Config);
 
module.exports = async function (fastify, opts) {

 
  fastify.register(require('@fastify/cors'), { 
    // put your options here
  })

  fastify.decorate('db', {})
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts,Config)
  })
  
}

