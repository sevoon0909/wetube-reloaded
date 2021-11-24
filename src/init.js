import "./db";
import app from "./server.js"

const port = 4000;

app.listen(port,() => console.log("Server listenning on port 4000"))