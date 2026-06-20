import Websocket, { WebSocketServer } from "ws";
import { eventBus } from '../events/eventBus.js'

const sendJSON = (socket, payload) => {
  if (socket.readyState !== Websocket.OPEN) {
    return;
  }
  socket.send(JSON.stringify(payload));
};

const broadcast = (wss, payload) => {
  wss.clients.forEach((client) => {
    if (client.readyState !== Websocket.OPEN) {
      return;
    }
    client.send(JSON.stringify(payload));
  });
};

export const attachWebsocketServer = (server) => {
  const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 1024 * 1024 });
  
  wss.on("connection", (socket, request) => {
    socket.isAlive = true;
    
    socket.on('pong', () => { socket.isAlive = true });

    sendJSON(socket, { type: "welcome" });

    socket.on("error", (error) => {
      console.log(`Error message: ${error.message} Stack: ${error.stack} IP: ${ip}`,);
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.isAlive === false) {
        console.log("Terminating unresponsive zombie client...");
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => { clearInterval(interval) });

  const broadcastMatchCreated = (match) => {
    broadcast(wss, { type: 'match_created', data: match })
  }

  eventBus.on('match:created', (matchData) => {
    broadcastMatchCreated(matchData)
  })

};