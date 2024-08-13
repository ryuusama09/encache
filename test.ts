// // const map = new Map()
// // const arr = [1 , 2 ,5 ,6 ,7 ]
// // const b64 = Buffer.from(arr).toString('base64')
// // map.set(1 , b64)
// // console.log()
// import Cache from './index'
// import express from 'express'
// import bodyParser from 'body-parser'
// const app = express()
// app.use(express.json())
// app.use(bodyParser.json({limit: "50mb"}));
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:5000000}))
// app.listen(3000 , ()=>{
//     console.log("server started")
// })
// const cacheInstance = new Cache(30)
// // console.log(cacheInstance.memory)
// cacheInstance.logger.configureFFL('warn')
// cacheInstance.setPolicy('LFU')


// // console.log(cacheInstance.policy)
// // cacheInstance.put(1,1000)


// app.post('/put' , async(req , res)=>{
//     const {key , data} = req.body
//    // console.log(key , data)
//     await cacheInstance.put(key , data)
//     console.log(await cacheInstance.get("key1"))
//     console.log( cacheInstance.keys() , cacheInstance.memoryConsumption())
//    // console.log(cacheInstance.keys())
//     // console.log("size" , cacheInstance.memoryConsumption())
//     // console.log("evict" , cacheInstance.evictionRate())
//     // console.log("fill" , cacheInstance.fillRate())
//     // console.timeEnd("put")
//     // await cacheInstance.get(1)
//     // await cacheInstance.get(1)
//     // await cacheInstance.get(1)
//     // await cacheInstance.get("key2")
//      cacheInstance.show()
//     res.send(`${key} set to iii`)
    
// })
// //cacheInstance.get(1)




// //Buffer.from(data, 'base64').toString('utf-8')

import Cache from './index';
import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 5000000 }));

app.listen(3000, () => {
    console.log("server started");
});

// Assuming the Cache class is defined with generic types
const cacheInstance = new Cache({size : 30});

//cacheInstance.logger.configureFFL('warn');
cacheInstance.setPolicy('LFU');

interface CachePutRequest {
    key: string;
    data: any;
}

app.post('/put', async (req: any, res: any) => {
    const { key, data } = req.body;
    await cacheInstance.put(key, data);
    console.log(await cacheInstance.get("key1"));
    console.log(cacheInstance.keys(), cacheInstance.memoryConsumption());
    cacheInstance.show();
    res.send(`${key} set to iii`);
});
