//

const directives = require("./directives");
const _ = require('lodash');
const  Executers = ["shell","api","result","cmd","sql","plsql","command","text"];
const Base = require("./base");

class Executer extends Base { 
    getExecuter(config) {
        let executer =  _.pick(config,Executers);
        let  executersNumber =  Object.keys(executer).length ;
        if(executersNumber>1) { 
            throw new Error("only one executer is allow in q config");
        }
        else if(executersNumber ==0 ) { 
            throw new Error("no executer found in q config");
        }

        const Executer = directives[Object.keys(executer)[0]];
        return  new Executer(this.fastify);

    }

    async execute(qKey,qObject,params,session) {
        let  Executer ; 
        let  executer ;
        let  result = [];
        let error ;
        try { 
            Executer= directives[qObject.executer];
            executer = new Executer(this.fastify);
            result = await executer.execute(qObject,params,session); 
        } catch(e) { 
            error = e.message + ":"+e.stack;
            
        }
         return {
                tableData: result.map((e ,index) => Object.assign(e,{$rowId:index,$active:false})),
                columns:qObject.columns,
                config:qObject ,
                qKey:qKey ,
                error:error || qObject.error
            };
    }
}

module.exports = new Executer();