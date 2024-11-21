import express, { Express } from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import { corsUrl } from "./config";
// import { WebsocketData } from "./type/Type";
import cookieParser from "cookie-parser";
import baseRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import DrawWhiteBoard from "./websocket/websocket";

const app: Express = express();

app.use(express.json({ limit: "10mb" }));

app.use(cookieParser());

app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);

app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

const wss = new WebSocketServer({ port: 8000 });

// let rooms = new Map();

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

    ws.on('message', function message(data: any) {
      console.log(data);
      const message = JSON.parse(data); // Converts Buffer to string
      console.log(message);
      console.log(message);

      DrawWhiteBoard(message, ws)

    });

  //   ws.send('something Kenil');
});

app.use("/", baseRouter);

app.use(errorHandler);

export default app;
