import app from './app.js'
import DBConnect from './db/index.js'
import dotenv from 'dotenv'

dotenv.config()
DBConnect().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is Running at PORT : ${process.env.PORT}`);
    })

})


