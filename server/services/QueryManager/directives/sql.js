var fastify = require('fastify');
const _ = require('lodash');
const util = require("util")
class Sql {
    name = "sql";
    executer = true
    picksToLower = true;
    
    constructor(fastify){
        this.fastify = fastify
    }
    
    async execute(config,params,session) { 
      
        let result ; 
        try { 
            const driver =  this.fastify.dbs[session.db];
             result =  await driver.raw(config.sql,params);
        } catch(err) {
            console.error(err) 
            throw err;
        }
        
        return result.map(r => { 
            return Object.keys(r).reduce((acc,e) => { 
                acc[e.toLowerCase()] = r[e];
                return acc ;
            },{});
        });
    }

 
    static validate(val) {
       return true;
    }
   
    normalize(val) {
        if (typeof val === 'string') 
            return val ;
        // is Array 
        return val.join(" ");
    }

    
    static getParams(config){
        return (config.sql.match(/:\w+/g)||[]).map(e=>e.substr(1))
    }

}

module.exports = Sql ;