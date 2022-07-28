const fetch = require('node-fetch');
const _ = require('lodash');
class API {
    name = "api"
    executer = true
    constructor(fastify){
        this.fastify = fastify
    }
    
    async execute(config) {
        const response = await fetch(config.api.uri, {method: config.api.method || 'GET'});
        let result = await response.json();

        if(config.api.datapath) { 
            result = result[config.api.datapath];
        }
        if(!Array.isArray(result))
            result = [result];
            return result.map(e=>Object.assign({},_.pick(e,config.picks)));
    }

        
    static getParams(config){
        return (config.api.uri.match(/:\w+/g)||[]).map(e=>e.substr(1))
    }
    
    validate(config) {
        return Array.isArray(config) ;
    }
}

module.exports =  API;