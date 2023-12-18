const { Reactive } = require("./reactive/reactive.js");

const games = Reactive({ test: Reactive({ hand: Reactive([222]) }) });
games.subscribe(null, (data) => {
  const { path } = data;
  console.log("path>>>", data.prop, data.value, data.oldValue);
  /*const [game, item] = path;
  if (item === "players") {
    const [uuid, prop] = path.slice(2);
    console.log(uuid, prop);
  }*/
});

games.test.subscribe(null, (data) => {
  //console.log(data.prop);
});

//games.test.hand = Reactive([6, 7, 8]);

games.test.hand.push(0);
games.test.hand.push(1);
games.test.hand.push(2);
games.test.hand.shift();

games.test.test = 1;
games.test.test = 2;

setTimeout(() => {
  games.test.test = 3;
}, 2000);

setTimeout(() => {
  games.test.test = 4;
}, 4000);

console.log(games.test._);
