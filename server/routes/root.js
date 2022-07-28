'use strict'


module.exports = async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    let  seconds = Math.round(new Date().getTime() / 1000,0);

    if(request.ip && request.query.id) { 
      const userId =  "u_"+request.query.id ;

      //reset  
    


      if(fastify.db[userId] ) { 
        if(seconds - (10*60) > fastify.db[userId].timestamp)
          fastify.db[userId] =  {  clients: { [request.ip]: seconds }  ,timestamp:seconds }

        fastify.db[userId].clients[request.ip] = seconds
        
        if(Object.keys(  fastify.db[userId].clients).length>1) { 
          fastify.db[userId].duplicate = true
        }
      }
      else  { 
        fastify.db[userId] =  {  clients: { [request.ip]: seconds }  ,timestamp:seconds }
      }
      
    }
    
    return { root: true ,ip:request.ip , ... request.query ,...fastify.db}
  })

  fastify.get('/dup', async function (request, reply) {
    let  seconds = Math.round(new Date().getTime() / 1000,0);

    if(request.ip && request.query.id) { 
      const userId =  "u_"+request.query.id ;
      if(fastify.db[userId] ) { 
        fastify.db[userId].clients[request.ip] = seconds
        fastify.db[userId].timestamp = seconds
        if(Object.keys(  fastify.db[userId].clients).length>1) { 
          fastify.db[userId].duplicate = true
        }
      }
      else  { 
        fastify.db[userId] =  {  clients: { [request.ip]: seconds }  ,timestamp:seconds }
      }
      
    }
    
    return { root: true ,ip:request.ip , ... request.query ,...fastify.db}
  })

}
