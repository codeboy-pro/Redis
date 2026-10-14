const express=require('express');
const axios=require('axios').default;
const app=express();
const client=require('./client')
app.get('/',async(req,res)=>{
    const cachedValue=await client.get('todos');
    if(cachedValue){
        return res.json(JSON.parse(cachedValue));
    }
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    await client.set('todos', JSON.stringify(data));
    await  client.expire('todos', 30);
    return res.json(data);
})
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

