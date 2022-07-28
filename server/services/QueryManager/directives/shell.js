var shell = require('shelljs');
const _ = require('lodash');
class Shell {
    name="shell";
    executer = true
    constructor(fastify){
        this.fastify = fastify
    }
    
    async execute(config) { 
        let result =  await this.invokdeShell(config);
       

        if(config.convert) { 
                 return this.convert(result,config)   
          }
         
        // we have only one result block   
        const newReuslt = [{}]  ;

        newReuslt[0][config.columns[0].field] = result ;

        return newReuslt;
    }

    async invokdeShell(config) {
        let self = this;
        return new Promise(function(resolve,reject)  { 
                let shellCommand =  self.normalize(config.shell);
                shell.exec(shellCommand, function(code, stdout, stderr) {
                    if(code !=0) { 
                        return reject("shell exit with status :" + code) ;
                    }
                   if(stderr) { 
                    return reject("shell has failed : "+stderr);
                   }
                   if(stdout) { 
                    return resolve(stdout)
                   } else { 
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
        return (config.shell.match(/:\w+/g)||[]).map(e=>e.substr(1))
    }

    convert(data,config) { 
        let convertConfig = config.convert
        let result ;
        if(convertConfig.type == "table") {
            result =data.split(new RegExp(convertConfig.newline)).map(e=>e.split(new RegExp(convertConfig.delim)))
        }
        
        if(convertConfig.type == "json" || !convertConfig.type) {
            result =data
            .split(new RegExp(convertConfig.newline))
            .map(e=>e.split(new RegExp(convertConfig.delim))
            .reduce((prev,curr,index) => ({...prev,[config.picks[index]]:curr},{})))
            .map(e=>Object.assign({},e,{"$empty":null}));
  
        }
        return result;
    }
}

module.exports = Shell;