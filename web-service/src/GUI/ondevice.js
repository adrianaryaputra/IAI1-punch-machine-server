import LabelText from './component/label-text.js';
import TitleText from './component/title-text.js';
import Indicator from './component/indicator.js';
import Button from './component/button.js';
import BasicComponent from './component/basic-component.js';
import ChartComponent from './component/chart.js';

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
    console.log("websocket opened...");
}
      
function ws_onClose(evt) {
    console.log("websocket closed...");
    setTimeout(() => location.reload(), 1000);
}
      
function ws_onMessage(evt) {
    let parsedEvt = JSON.parse(evt.data);
    console.log(parsedEvt);
    switch(parsedEvt.command){
        case "SERVER_STATE":
            incomingMsg(parsedEvt.payload[par.get("name")]);
            break;
        case "STATE":
            if(parsedEvt.device == par.get("name")) incomingMsg(parsedEvt.payload);
            break;
    }
}

function incomingMsg(msg) {
    for (const key in msg) {
        switch(key) {
            case "DRIVE_SPEED":
                deviceSpeed.setValue(msg[key]);
                break;
            case "STATS_PUNCH_PER_MINUTE":
                devicePonpmin.setValue(msg[key]);
                break;
            case "DEVICE_STATUS":
                deviceStatus.toggle(msg[key]);
                break;
            case "STATS_NAMA_PELANGGAN":
                deviceClient.setValue(msg[key]);
                break;
            case "STATS_TEBAL_BAHAN":
                deviceTebal.setValue(msg[key]);
                break;
            case "STATS_UKURAN_BAHAN":
                deviceDiameter.setValue(msg[key]);
                break;
            case "STATS_TOTAL_COUNT":
                deviceCountersum.setValue(msg[key]);
                break;
        };
    };
}
      
function ws_onError(evt) {
    console.log(`WS: ${evt.type}`);
    console.log(evt.data);
}


// PARAM SEARCH
let par = new URLSearchParams(location.search);


// COMPONENT LOAD
const backBtn = new Button({
    text: "ᐊ Back to Dashboard",
    listener: {
        click: () => location.href = "/"
    }
}, {
    parent: document.body,
    style: {
        display: "block",
        textAlign: "left",
        margin: "1em",
        cursor: "pointer",
    }
})

const deviceHolder = new BasicComponent({
    parent: document.body,
    style: {
        margin: "1em",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: "1em",
        padding: "1em",
    }
});

const deviceHeaderHolder = new BasicComponent({
    parent: deviceHolder.element(),
    style: {
        fontSize: "2em",
        margin: " 0 0 1em 0",
        display: "grid",
        gridTemplateColumns: "minmax(max-content, 1fr) 250px",
    }
});

const deviceTitle = new TitleText(par.get("name"), { parent: deviceHeaderHolder.element() });
const deviceStatus = new Indicator({ valueON: "Online", valueOFF: "Offline" }, { parent: deviceHeaderHolder.element() });

const deviceLabelHolder = new BasicComponent({
    parent: deviceHolder.element(),
    style: {
        fontSize: "1.5em",
        margin: "1em 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(600px, 1fr))",
        gridAutoFlow: "row",
        gap: "1em 2em"
    }
});

const deviceClient         = new LabelText("Customer", "###", { parent:deviceLabelHolder.element() });
const deviceTebal          = new LabelText("Thickness", "###", { parent:deviceLabelHolder.element() });
const deviceDiameter       = new LabelText("Dimension", "###", { parent:deviceLabelHolder.element() });
const deviceSpeed          = new LabelText("Speed", "###", { parent:deviceLabelHolder.element() });
const deviceCountersum     = new LabelText("Counts", "###", { parent:deviceLabelHolder.element() });
const devicePonpmin        = new LabelText("Pon/min", "###", { parent:deviceLabelHolder.element() });

const datapoints = [0, 0, 0, 0, 0, 0, 0, 22.7, 22.7, 22.9, 22.7, 23, 22.7, 0, 22.4, 22.3, 22.7, 22.5, 22.5, 0, 0, 0, 0, 0];
const labels = [];
for (let i = 0; i < datapoints.length; ++i) {
  labels.push(i.toString().padStart(2,'0')+":00");
}
const chartData = {
    labels: labels,
    datasets: [{
        label: 'Kecepatan Pon (pon/min)',
        data: datapoints,
        borderColor: "cyan",
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4
    }]
};

const chartConfig = {
  type: 'line',
  data: chartData,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: 'Kecepatan Pon'
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: ''
        },
        suggestedMin: 0,
        suggestedMax: 40
      }
    }
  },
};

const testChart = new ChartComponent(chartConfig, {
    height: "400px"
},{
    parent: deviceHolder.element(),
    style: {
        margin: "2em 1em 1em 1em",
    }
})


// JS EXEC
const run = () => {
    ws_load();
}

document.addEventListener("DOMContentLoaded", run)