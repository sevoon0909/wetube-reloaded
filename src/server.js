import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const port = 4000;

const app = express();
const logger = morgan("dev")
app.use(logger);

app.use("/",globalRouter);
app.use("/users",userRouter);
app.use("/videos",videoRouter);

const handleLogin = (req,res) => {
    return res.send({message:"Login Here"});
}

app.get("/login", handleLogin);

app.listen(port,() => console.log("Server listenning on port 4000"))