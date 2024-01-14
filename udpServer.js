const { Shared } = require("./shared/shared.js");
const { Reactivate } = require("@seyacat/reactive");

var argv = require("minimist")(process.argv.slice(2));
console.log({ argv });

const dgram = require("node:dgram");
const udpserver = dgram.createSocket("udp4");
const udpclient = dgram.createSocket("udp4");

clients = argv.port == 12345 ? ["127.0.0.1:12346"] : ["127.0.0.1:12345"];

const shared = new Shared({
  server: udpserver,
  address: "127.0.0.1",
  port: argv.port,
});

setInterval(() => {
  const msg = Math.floor(Math.random() * 10);
  //if (argv.port == 12345) {
  console.log("MSG", msg);
  shared.server.test = msg;
  //}
}, 3000);

setInterval(() => {
  for ([uuid, client] of shared.clients) {
    if (argv.port == 12345) {
      client.test = Math.floor(Math.random() * 100);
    }
  }
}, 12000);

for (client of clients) {
  shared.clients[client] = Reactivate(udpclient);
}

shared.subscribe(null, (data) => {
  console.log({ str: data.pathString, val: data.value });
});

udpserver.bind(argv.port);
