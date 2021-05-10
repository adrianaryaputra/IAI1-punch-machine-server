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
    console.log(`WS SENDING ${command}: ${value}`);
    websocket.send(JSON.stringify({
        command,
        value
    }))
}
      
function ws_onOpen(evt) {
    console.log("websocket opened...");
}
      
function ws_onClose(evt) {
    console.log("websocket closed...");
    setTimeout(() => location.reload(), 1000);
}

let deviceStyle = {
    padding: "1em",
    borderRadius: "1em"
}
      
function ws_onMessage(evt) {
    let parsedEvt = JSON.parse(evt.data);
    console.log(parsedEvt);
    switch(parsedEvt.command){
        case "SERVER_STATE":
            for (const deviceName of Object.keys(parsedEvt.payload).sort()) {
                devices[deviceName] = new Device({
                    name: deviceName, 
                    state: parsedEvt.payload[deviceName],
                    listener: {
                        click: () => location.href = `/ondevice.html?name=${deviceName}`,
                    }
                }, {
                    parent: deviceHolder.element(),
                    style: deviceStyle,
                });
                console.log("creating", deviceName);
                ws_send("GET_PONPMIN_24H", deviceName)
                setInterval(() => ws_send("GET_PONPMIN_24H", deviceName), 60000);
            }
            break;
        case "STATE":
            if(devices[parsedEvt.device]) {
                devices[parsedEvt.device].update(parsedEvt.payload);
            } else {
                devices[parsedEvt.device] = new Device({
                    name: deviceName, 
                    state: parsedEvt.payload[deviceName],
                    listener: {
                        click: () => {
                            location.href = "/ondevice",
                            location.search = `?name=${deviceName}`
                        }
                    }
                }, {
                    parent: deviceHolder.element(),
                    style: deviceStyle,
                });
                console.log("creating", deviceName);
                ws_send("GET_PONPMIN_24H", deviceName)
                setInterval(() => ws_send("GET_PONPMIN_24H", deviceName), 60000);
            }
            break;
        case "GET_PONPMIN_24H":
            if(Array.isArray(parsedEvt.payload.bucket)){
                let ponpmin = parsedEvt.payload.bucket.map(v => {
                    return {
                        jam: v._id,
                        jumlah: v.count,
                        ponpmin: (v.count / 1).toFixed(2)
                    }
                });
                // console.log("ponpmin", ponpmin);
                let datapoints = {};
                for (
                    let index = parsedEvt.payload.startHour; 
                    index <= parsedEvt.payload.finishHour; 
                    index+=6e4
                ) { datapoints[new Date(index).toISOString()] = {ponpmin: 0, jumlah: 0} }
                ponpmin.forEach((data) => {
                    datapoints[data.jam] = {
                        ponpmin: data.ponpmin,
                        jumlah: data.jumlah
                    };
                });
                console.log("datapoints", datapoints);
                devices[parsedEvt.device].update({"PONPMIN_CHART": datapoints});
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
        margin: "1em",
        gridTemplateColumns: "repeat(auto-fit, 1fr)",
        gridAutoFlow: "row",
        gap: "1em"
    }
});


const run = () => {
    ws_load();
}

document.addEventListener("DOMContentLoaded", run)
