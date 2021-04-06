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
const deviceState = {};
aedes.on("clientReady", c => {
    if(deviceState[c.id] === "undefined") deviceState[c.id] = {};
    deviceState[c.id]["DEVICE_STATUS"] = true;
    ws_broadcast(c.id, "STATE", deviceState[c.id]);
    mq_publish(`MP/${c.id}/SERVER_STATE`, deviceState[c.id]);
});
aedes.on("clientDisconnect", c => {
    if(deviceState[c.id] === "undefined") deviceState[c.id] = {};
    deviceState[c.id]["DEVICE_STATUS"] = false;
    ws_broadcast(c.id, "STATE", deviceState[c.id]);
});
aedes.subscribe("MP/#", (a,cb) => {
    const topic = a.topic.split('/');
    const name = topic[1];
    const command = topic[2];
    const msg = JSON.parse(a.payload.toString());
    deviceState[name] = deviceState[name] ?? {};

    switch(command) {
        case "SERVER_STATE":
        case "DRIVE_THREAD_FORWARD":
        case "DRIVE_THREAD_REVERSE":
        // case "DRIVE_COUNTER_CV":
            break;
        default:
            if(msg.success) {
                deviceState[name][command] = msg.payload;
                ws_broadcast(name, "STATE", deviceState[name]);
            }
    }
    cb();
});


// ws sub
wss.on('connection', (ws) => {
    ws.send(JSON.stringify({
        command: "SERVER_STATE",
        payload: deviceState
    }));
    ws.on('message', (message) => {
        parsedMsg = JSON.parse(message);
        console.log(parsedMsg);
        ws_handleIncoming(ws, parsedMsg.command, parsedMsg.value);
    });
});



function ws_broadcast(device, command, payload) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                device,
                command, 
                payload,
            }));
        }
    });
}



function mq_publish(topic, payload) {
    aedes.publish({
        topic,
        payload: JSON.stringify({
            success: true,
            payload
        })
    });
}



function ws_handleIncoming(client, command, value) {
    switch(command) {
        case "GET_STATE":
            client.send(JSON.stringify({
                command,
                payload: deviceState
            }));
            break;
    }
}