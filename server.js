const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");
const WS = require("ws");
const { v4: uuidv4 } = require("uuid");
const { Reactive } = require("./reactive/reactive.js");

const app = express();
const server = http.createServer(app);
const wss = new WS.Server({ server });

const cards = [];
for (let i = 0; i < 5; i++) {
  cards.push({
    id: i,
    title: `card ${i}`,
  });
}

const games = Reactive({
  test: Reactive({ turn: 0, mainDeck: Reactive([]), players: Reactive({}) }),
});

games.subscribe(null, (data) => {
  const { path, pathValues } = data;
  console.log(path);
  const [game, item] = path;
  if (item === "players") {
    const [uuid, prop] = path.slice(2);
    const [player] = pathValues.slice(2);
    player.ws.send(JSON.stringify({ hand: player.hand._ }));
  }
});

shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

const mainDeck = [...cards];
shuffle(mainDeck);

games.test.mainDeck = Reactive(mainDeck);

games.test.mainDeck.push({ id: "testcard" });

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
    const game = "test";
    if (!games[game].players[ws.id]) {
      games[game].players[ws.id] = Reactive(
        { hand: Reactive([]), ws },
        { subscriptionDelay: 10 }
      );
      drawCards("test", ws.id, 5);
    } else {
      games[game].players[ws.id].ws = ws;
    }
  });
});

const drawCards = (game, uuid, qty) => {
  console.time("drawCards");
  for (let i = 0; i < qty; i++) {
    if (mainDeck.length) {
      const card = games[game].mainDeck.pop();
      games[game].players[uuid].hand.push(card);
    }
  }
  console.timeEnd("drawCards");
};

const moveCardTo = (client, card) => {};

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
