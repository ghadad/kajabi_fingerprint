var shell = require('shelljs');
const _ = require('lodash');
class Command {
    executer = true
    name = "command"
    constructor(fastify){
        this.fastify = fastify
    }
    
    async execute(config) { 
        let result =  await this.invokdeShell(config);
       
        if(config.convert) { 
                 return this.convert(result,config)   
           }
    }

    async invokdeShell(config) {
        let self = this;
        return new Promise(function(resolve,reject)  { 
                let shellCommand =  self.normalize(config.command);
                shell.exec(shellCommand, function(code, stdout, stderr) {
                    if(code !=0) { 
                        console.error("shell exit with status :" + code) ;
                        return reject("shell exit with status :" + code) ;
                    }
                   if(stderr) { 
                    console.error("invokdeShell:",stderr)
                    return reject("shell has failed : "+stderr);
                   }
                   if(stdout) { 
                    return resolve(stdout)
                   } else { 
                    console.error("invokde shell directive must return output")
                    return reject("invokde shell directive must return output ! ");
                   }
               });
            })

            
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
        return (config.command.match(/:\w+/g)||[]).map(e=>e.substr(1))
    }


   

    convert(data,config) { 
     
        let convertConfig = config.convert
        let  rows =data
            .split(new RegExp(convertConfig.newline))
        
        const returnRows = [] ;    
        for(let row of rows)     {
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