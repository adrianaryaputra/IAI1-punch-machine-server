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
    // check if device exist; if not create a new one
    // if(device[topic[1]] === "undefined") device[topic[1]] = {}
    // check if 
    // let a = document.createElement("p").textContent(parsedEvt)
    // document.body.appendChild();
}
      
function ws_onError(evt) {
    console.log(`WS: ${evt.type}`);
    console.log(evt.data);
}

const device = {};

const run = () => {
    ws_load();
}

document.addEventListener("DOMContentLoaded", run)
