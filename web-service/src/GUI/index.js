import Device from './component/device.js';
import BasicComponent from './component/basic-component.js';

var wsUri = `ws://${location.hostname}:${+location.port+1}`;
var websocket = new WebSocket(wsUri);

function ws_load() {
    console.log("opening websocket ...");
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
}
      
function ws_onClose(evt) {
    setTimeout(ws_load, 1000);
}

let deviceStyle = {
    margin: "1em",
    padding: "1em",
    borderRadius: "1em"
}
      
function ws_onMessage(evt) {
    let parsedEvt = JSON.parse(evt.data);
    console.log(parsedEvt);
    switch(parsedEvt.command){
        case "SERVER_STATE":
            for (const deviceName in parsedEvt.payload) {
                console.log("creating", deviceName);
                devices[deviceName] = new Device(deviceName, parsedEvt.payload[deviceName], {
                    parent: deviceHolder.element(),
                    style: deviceStyle,
                });
            }
            break;
        case "STATE":
            if(devices[parsedEvt.device]) {
                devices[parsedEvt.device].update(parsedEvt.payload);
            } else {
                devices[parsedEvt.device] = new Device(parsedEvt.device, parsedEvt.payload, {
                    parent: deviceHolder.element(),
                    style: deviceStyle,
                });
                console.log("creating", deviceName);
            }
            break;
    }
}
      
function ws_onError(evt) {
    console.log(`WS: ${evt.type}`);
    console.log(evt.data);
}

const devices = {};

const deviceHolder = new BasicComponent({
    parent: document.body,
    style: {
        display: "grid",
        gridTemplateColumn: "repeat(4, auto)",
        gridTemplateRow: "repeat(3, auto)",
        gridAutoFlow: "row"
    }
});


const run = () => {
    ws_load();
}

document.addEventListener("DOMContentLoaded", run)
