// import { WebsocketData } from "../type/Type"

// import { WebsocketData } from "../type/Type"

let rooms = new Map()

const DrawWhiteBoard = (data: any, ws: any) => {
    const {type, room, linewidth, x, y, color, clear, isPainting} = data

    try {  
        if (type === "join") {
          console.log("hee");
          
          if (!rooms.has(room)) {
            rooms.set(room, new Set());
          }
          
          rooms.get(room).add(ws);
        } else if (type === "leave") {
          if (rooms.has(room)) {
            rooms.get(room).delete(ws);
            ws.send(`Left room: ${room}`);
          }
        } else if (type === "message") {
            
          rooms.get(room.room)?.forEach((client: WebSocket) => {
            if (client !== ws) {
                console.log();
                
                client.send(JSON.stringify({ room, linewidth, x, y, color, clear, isPainting }));
              }
          });
        }else if(type == "NOT_PAINTING"){
          
          rooms.get(room.room)?.forEach((client: WebSocket) => {
            if (client !== ws) {
                // console.log();
                
                client.send(JSON.stringify({ room, isPainting: false }));
              }
          });
        }
      } catch (err) {
        console.error("Error processing message:", err);
      }
}

export default DrawWhiteBoard