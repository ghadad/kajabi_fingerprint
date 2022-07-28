class Result {
    name = "result"
    executer = true
    constructor(fastify){
        this.fastify = fastify
    }
    
    async execute(config) {
        return await this.convert(config.result,config);

    }

    convert(data,config) { 
        
        if(typeof data == "string" && config.convert){
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

        let result  =data
            .reduce((prev,curr,index) => ({...prev,[config.picks[index]]:curr},{}))
  
        return result;
    }
    static  validate(config) {
        return Array.isArray(config) ;
    }
}

module.exports = Result ;