import mongoose from "mongoose";

const connectDB = async (url) => {

    try {
        const options = { dbName: 'webUser' }
        const connection = await mongoose.connect(url, options)
        console.log('DataBase Connected....');
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;