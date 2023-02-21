import express from 'express'
import router from './routes.js'

const app = express();
app.use(express.json());
app.use("/public", express.static("public"));
app.use(router);

app.listen(8080, () => console.log(`Listening on port 8080`))