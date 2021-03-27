const cfg = require('../config.json');


// mq import
const aedes = require('aedes')();
const mqserver = require('net').createServer(aedes.handle);
mqserver.listen(cfg.MQTT.PORT, () => console.log("MQTT listening on", cfg.MQTT.PORT))


// web import
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: cfg.WS.PORT });
const express = require('express');
const app = express();
app.use(express.static(`${__dirname}/GUI`))
app.listen(cfg.WEB.PORT, () => {
    console.log(`listening on port ${cfg.WEB.PORT}`);
});


// mq sub -> ws pub
aedes.on("client", c => console.log(c.id, "Connected"));
aedes.on("clientDisconnect", c => console.log(c.id, "Disconnected"));
aedes.subscribe("MP/#", (a,b) => {
    console.log(a.topic);
    console.log(JSON.parse(a.payload.toString(),null,2));
    wss.clients.forEach(client => {
        if(client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify({
                topic: a.topic,
                payload: JSON.parse(a.payload.toString())
            }))
        }
    })
    b();
});


// ws sub
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        parsedMsg = JSON.parse(message);
        console.log(parsedMsg);
        // ws_handleIncoming(ws, parsedMsg.command, parsedMsg.value);
    });
});