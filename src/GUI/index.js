import Device from './component/device.js';

var wsUri = `ws://${location.hostname}:${+location.port+1}`;
var websocket = new WebSocket(wsUri);

function ws_load() {
    websocket.onopen    = ws_onOpen;
    websocket.onclose   = ws_onClose;
    websocket.onmessage = ws_onMessage;
    websocket.onerror   = ws_onError;
}

function ws_send(command, value) {
    websocket.send(JSON.stringify({
        command,
        value
    }))
}
      
function ws_onOpen(evt) {
    ws_send("GET_STATE", true);
}
      
function ws_onClose(evt) {
    location.reload();
}
      
function ws_onMessage(evt) {
    let parsedEvt = JSON.parse(evt.data);
    console.log(parsedEvt);
    switch(parsedEvt.command){
        case "SERVER_STATE":
            for (const deviceName in parsedEvt.payload) {
                devices[deviceName] = new Device(deviceName, parsedEvt.payload[deviceName], {parent: document.body});
            }
        case "STATE":
            if(devices[parsedEvt.device] === "undefined") {
                devices[parsedEvt.device] = new Device(parsedEvt.device, parsedEvt.payload, {parent: document.body})
            }
            else devices[parsedEvt.device].update(parsedEvt.payload);
    }
}
      
function ws_onError(evt) {
    console.log(`WS: ${evt.type}`);
    console.log(evt.data);
}

const devices = {};

const run = () => {
    ws_load();
}

document.addEventListener("DOMContentLoaded", run)
