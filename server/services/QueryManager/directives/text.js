var shell = require('shelljs');
const _ = require('lodash');
class Command {
    executer = true
    name = "text"
    constructor(fastify){
        this.fastify = fastify
    }
    
    async execute(config) { 
        if(config.convert) { 
                 return this.convert(config)   
           }
    }

    
   static validate(val) {
        return (typeof val === 'string' || Array.isArray(val)) ;
    }

    
    normalize(val) {
        if (typeof val === 'string') 
            return val ;
        // is Array 
        return val.join(" ");
    }

            
    static getParams(config){
        return (config.text.match(/:\w+/g)||[]).map(e=>e.substr(1))
    }


   

    convert(config) { 
     
        let convertConfig = config.convert
        let  rows =config.text
            .split(new RegExp(convertConfig.newline))
        
        const returnRows = [] ;    
        for(let row of rows)     {
           if(row.trim().length==0)
               continue;
            let lineArr = row.split(new RegExp(convertConfig.delim));
            

            let jsonLine = { };
            let index=0;
            for(let v of lineArr) {
                jsonLine[config.picks[index++]] = v ;
            }
            returnRows.push(jsonLine)
        }
        return returnRows;
    }
}

module.exports = Command;