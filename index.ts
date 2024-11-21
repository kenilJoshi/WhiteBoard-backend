import dotenv from 'dotenv';
dotenv.config()
import { port } from "./config";
import app from "./app"




app.listen(port, () => {
    console.log("The Port is listneng at Port Kenil1", port);  
})