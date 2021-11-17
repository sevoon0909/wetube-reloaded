import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const port = 4000;

const app = express();
const logger = morgan("dev")
app.use("/",logger);

app.use("/",()=>console.log("@"));
app.use("/users",userRouter);
app.use("/videos",videoRouter);


app.listen(port,() => console.log("Server listenning on port 4000"))