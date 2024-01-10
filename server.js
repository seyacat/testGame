const express = require("express");
const bodyparser = require("body-parser");
const http = require("http");
const { Shared } = require("./shared/shared.js");
const { Reactive } = require("@seyacat/reactive");

const app = express();
const server = http.createServer(app);

const shared = new Shared({
  server,
  clientPaths: { message: { validate: (val) => typeof val === "string" } },
});

setInterval(() => {
  //shared.server.date = new Date();
  for (const [uuid, client] of shared.clients) {
    client.rand4 = uuid + " " + Math.random();
  }
}, 10000);

shared.clients.subscribe(null, (data) => {
  const { pathString, value } = data;
  console.log({ pathString, value });
  const client = data.base[data.path[0]];
  if (data.path.length === 1) {
    if (!client.game) {
      //TODO TEST GAME

      client.game = games.test;
    }
    client.rand = Math.random();
    client.rand2 = Math.random();
  }
});

app.use(bodyparser.json());

app.use("/shared", express.static("shared"));
app.use("/", express.static("public"));

const cards = {};
for (let i = 0; i < 5; i++) {
  cards[`g-card-${i}`] = {
    id: `g-card-${i}`,
    title: `card ${i}`,
  };
}

const games = Reactive({
  test: Reactive({ turn: 0, mainDeck: Reactive([]), players: Reactive({}) }),
});

games.subscribe(null, (data) => {
  const { path, pathValues } = data;
  const [game, item] = path;
  if (item === "players") {
    const [uuid, prop] = path.slice(2);
    const [player] = pathValues.slice(2);
    //player.ws.send(JSON.stringify({ hand: player.hand._ }));
  }
});

shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

games.test.mainDeck = Reactive(
  Object.fromEntries(
    Object.entries(cards).map(([key, c]) => [
      key,
      Reactive(c, { prefix: "card" }),
    ])
  )
);

//express static route

/*
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
    } else if (ws.id != msg.uuid) {
      ws.id = msg.uuid;
    }
    const game = "test";
    if (!games[game].players[ws.id]) {
      games[game].players[ws.id] = Reactive(
        { hand: Reactive([], { prefix: "hand" }), ws },
        { subscriptionDelay: 10, prefix: ws.id }
      );
      drawCards("test", ws.id, 5);
    } else {
      games[game].players[ws.id].ws = ws;
    }
    if (msg.cmd === "move") {
      const card = games[game].cards[msg.card];
      const target = games[game]["play-area"];
      moveCardTo(card, target);
    }
    ("");
  });
});

const drawCards = (game, uuid, qty) => {
  console.time("drawCards");
  for (let i = 0; i < qty; i++) {
    if (games[game].mainDeck.length) {
      const card = games[game].mainDeck.pop();
      games[game].players[uuid].hand.push(card);
    }
  }
  console.timeEnd("drawCards");
};

const moveCardTo = (card, target) => {
  //const parent
  //card._parent.
};

function broadcastAll(clients, msg) {
  for (const client of clients) {
    client.send(msg);
  }
}

function sendHand(client) {
  client.ws.send(JSON.stringify({ hand: client.hand }));
}




*/

server.listen(5500, () => {
  console.log("server running on port 5500");
});
