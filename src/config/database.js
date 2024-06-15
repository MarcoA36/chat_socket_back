import { createClient } from "@libsql/client";

import mongoose from 'mongoose';
const db = createClient({
  url: "libsql://chat-marcoa36.turso.io",
  authToken:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MTI5MzgyOTAsImlkIjoiOTc4NjY2YTgtNjVmOS00Yzc2LThkNjUtYzZlOWEyMDZmYTFhIn0.KRiYLRUwXDLfkuVuU1eHsv0gQoZzXjKoYZaDzNJwyduYb6AXvzzjBNbwnW6PrtsfkX94-aIzKWfBvDE_uJN7CQ",
});


export default db;




export const connectDB = async() => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/chat')//no funciona con localhost
        console.log(">>>DB conectada")
    } catch (error) {
        console.log(error)
    }
   
}
