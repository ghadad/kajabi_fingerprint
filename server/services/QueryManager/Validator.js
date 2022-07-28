const assert = require('assert');
const AssertionError = assert.AssertionError ;
const Executer = require("./Executer");
const directives = require("./directives");
const _ = require("lodash");

class  Validator { 
    validate (config) { 
        
        let result;
        try {
            config = this.normalize(config);
            result = {valid:true,...config}; 
            if(config.shell)  assert.ok(directives.shell.validate(config.shell),"shell directive is invalid");
            if(config.result)  assert.ok( directives.result.validate(config.result),"result directive is invalid");
            assert.ok(config.columns &&  Array.isArray(config.columns) == true,"columns directive missing or does not array");
            assert.ok(Object.keys(config).length>0,"No config found");
            assert.ok(config.description  ,"No description found");
            assert.ok(config.name ,"No name found");
        } catch(err) { 
            result =  {...config,valid:false,error:err.message,stack:err.stack}
        }
        return result;
    }

    normalize(config) {
        let executer = Executer.getExecuter(config);
        let columns = config.cols || config.columns ;
        let normalCols  =  [];
        let picks = [];

        config.description = config.desc || config.description ;
        config.title = config.title || config.name ;    
        config.name  = config.name  || config.title ;    
        config.name = config.name.replace(/:(\w+)/, (v,c,o)=>  '{{' + c.toLowerCase()  + '}}');
        config.title = config.title.replace(/:(\w+)/,(v,c,o)=>  '{{' + c.toLowerCase() +'}}');
        config.description = config.description.replace(/:(\w+)/,(v,c,o)=>  '{{' + c.toLowerCase() +'}}');


        columns.forEach(function(c) { 
          let cObject  = {} ;
          if(typeof c == "object") { 
            
            c.field = c.field || c.label ;
            c.label = c.label || c.field ;

            if("exec" in c) { 
                cObject.exec = c.exec;     
            }

            if("sortable" in c) {
                cObject.sortable = c.sortable
            }

            if("alias" in c) {
              cObject.alias = c.alias.toLowerCase();
            }


            cObject.field = c.field || "$empty";
            if(executer.picksToLower ) {
                cObject.field = cObject.field.toLowerCase();
            }
          
            cObject.label = c.label ;
          } else { 
            cObject.label = c ;
            cObject.field = c ;
            if(executer.picksToLower )
                cObject.field = cObject.field.toLowerCase()
          }
          normalCols.push(cObject);
          if(executer.picksToLower )
            picks.push(cObject.field.toLowerCase);
          else 
          picks.push(cObject.field);  
        })


        const getParamsList   =_.get(directives[executer.name],'getParams',()=>[]);
        config.paramsList  =  getParamsList(config);
        return Object.assign(config,{columns:normalCols,picks:picks,executer:executer.name})
      }

}

module.exports =  new Validator();