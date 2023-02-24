import express from 'express'
import mongoose from 'mongoose'
// import lifecycle from './middleware/lifecycle.js'
import router from '../routes.js'

const app = express();
app.use(express.json());
// app.use("/public", express.static("public"));

// app.use(lifecycle({
//   async setup() {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.DATABASE_URL)
//   },
//   async cleanup() {
//     await mongoose.disconnect()
//   }
// }))

app.use('/api/', router);

export default app;