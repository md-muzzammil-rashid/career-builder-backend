import mongoose from "mongoose"

const DBConnect = async()=>{
    try {
         await mongoose.connect(`${process.env.CONNECTION_URL}/${process.env.DB_NAME}`).then(()=>{
            console.log("Database is Connected")
        })
    } catch (error) {
        console.log("Error in connecting DB\n", error);
    }
}
export default DBConnect