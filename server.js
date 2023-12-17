const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");
const WS = require("ws");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WS.Server({ server });
const clients = {};

const turn = 0;
const cards = [];
for (let i = 0; i < 64; i++) {
  cards.push({
    id: i,
    title: `card ${i}`,
  });
}

shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const mainDeck = [...cards];
shuffle(mainDeck);

//express static route
app.use(bodyparser.json());

app.use("/reactive", express.static("reactive"));
app.use("/", express.static("public"));

// main user dashboard GET
wss.on("connection", function connection(ws) {
  console.log(`Connected ${ws.id}`);

  ws.on("message", async function incoming(message) {
    let msg;
    try {
      msg = JSON.parse(message);
    } catch (e) {
      return;
    }
    console.log("received:", { msg });
    if (!msg.uuid) {
      ws.id = uuidv4();
      ws.send(JSON.stringify({ uuid: ws.id }));

      return;
    } else {
      ws.id = msg.uuid;
    }
    if (!clients[ws.id]) {
      clients[ws.id] = { hand: [], ws };
      drawCards(clients[ws.id], 5);
    } else {
      clients[ws.id].ws = ws;
    }
    //if (clients[ws.id]) {
    sendHand(clients[ws.id]);
    //}
  });
});

const drawCards = (client, qty) => {
  for (let i = 0; i < qty; i++) {
    if (mainDeck.length) {
      client.hand.push(mainDeck.pop());
    }
  }
};

function broadcastAll(clients, msg) {
  for (const client of clients) {
    client.send(msg);
  }
}

function sendHand(client) {
  client.ws.send(JSON.stringify({ hand: client.hand }));
}

server.listen(5500, () => {
  console.log("server running on port 5500");
});
