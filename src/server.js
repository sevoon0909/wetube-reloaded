import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const port = 4000;

const app = express();
const logger = morgan("dev");

app.set("view engine","pug");
app.set("views", process.cwd() + '/src/views');
app.use(logger);

console.log(app);


app.use("/",globalRouter);
app.use("/users",userRouter);
app.use("/videos",videoRouter);



app.listen(port,() => console.log("Server listenning on port 4000"))