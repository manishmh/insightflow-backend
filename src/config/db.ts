import { MongoClient } from 'mongodb'

export const ConnectMongodb = async (url: string) => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        console.log("Mongodb connnected successfully to the server");
    } catch (error) {
        console.log("Mongodb connection failed!")
    }
}