import express from 'express'
import  dotenv   from 'dotenv';

const app = express();
dotenv.config();


const PORT = process.env.PORT || 8000;

app.get('/',(req,res)=>{
    res.send('this is get request');
})


app.listen(PORT,()=>{
  console.log(`server started to listern on port ${PORT}`);
})


