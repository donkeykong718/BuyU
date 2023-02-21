import mongoose from "mongoose"

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/buyU')

export default mongoose;