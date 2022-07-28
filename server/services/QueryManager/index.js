'use strict'
const find = require("find")
const fs = require("fs")
const JsYaml = require("js-yaml");
const path = require("path");
const { push } = require("shelljs/commands");
const Validator = new require("./Validator");
const Executer = new require("./Executer");


 class QueryManager { 
  name="QueryManager"
   files = []
   sections =  [];
   starters =  new Map();
   queries =  new Map();
   aliases  = new Map();
  constructor(fastify) {
   this.load();
   this.fastify = fastify ;
  }

  load() {
       this.files =[] ;
      this.sections = [];
       this.starters.clear() ;
       this.queries.clear();

       this.files = find.fileSync(/\.(yaml|yml)$/, process.env.CQP_REPOSITORY);
       for(let file of this.files ){
         
          let key = file.replace(process.env.CQP_REPOSITORY,'')
                     .replace(/(^[\\\/]|[\\\/]$)/g,"")
                     .replace(/[\/\\]/g,":")
                     .replace(/\.(yaml|yml)$/,'')
          let [section,dum] = key.split(":");

          if(!this.sections.includes(section))
          this.sections.push(section);

          const qConfig = Validator.validate(JsYaml.load(fs.readFileSync(file,'utf8')));

          if(!qConfig.valid) {
            console.error(qConfig)
            continue;
          }
            
          
          for(let column of qConfig.columns) {
            if(column.alias){
              this.aliases.set(column.field, column.alias);
            }
          }

          this.queries.set(key,{key:key,section,...qConfig}) ; 

          if(qConfig.starter) { 
            if(this.starters.has(section)) {
              this.starters.get(section).push({section,qKey:key,...qConfig});
             } else { 
              this.starters.set(section,[{section,qKey:key,...qConfig}]);
             }
          }
       };
     
       
   }

   getQueries() {
    return { 
      queries : Object.fromEntries(this.queries) ,
      sections:this.sections , 
      starters:Object.fromEntries(this.starters)  ,
      aliases:Object.fromEntries(this.aliases) ,
      databases:Object.keys(this.fastify.dbs)
    };
   }

   

   async execute(qKey,params={},sessionParams={}) {
     if(params.$db ) {
       sessionParams.db =  params.$db ;
     }

     let qConfig =   this.queries.get(qKey)
     if(!qConfig ) {
       throw new Error("sqky " + qKey + " doesn't found in qinvetory")
     }
     Executer.setFastify(this.fastify);
     return await Executer.execute(qKey,qConfig,params || {},sessionParams);
   }
}

module.exports = QueryManager ;