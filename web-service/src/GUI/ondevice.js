import LabelText from './component/label-text.js';
import TitleText from './component/title-text.js';
import Indicator from './component/indicator.js';
import Button from './component/button.js';
import BasicComponent from './component/basic-component.js';
import ChartComponent from './component/chart.js';
import InputDateTime from './component/input-datetime.js';

var wsUri = `ws://${location.hostname}:${+location.port+1}`;
var websocket = new WebSocket(wsUri);

function ws_load() {
    console.log("opening websocket ...");
    websocket.onopen = ws_onOpen;
    websocket.onclose = ws_onClose;
    websocket.onmessage = ws_onMessage;
    websocket.onerror = ws_onError;
}

function ws_send(command, value) {
    let data = JSON.stringify({
        command,
        value
    });
    console.log(`WS SENDING ${data}`);
    websocket.send(data)
}

function requestPonpminHist(date) {
    clearInterval(chartUpdateInterval);
    ws_send("GET_PONPMIN_HIST", {
        device: par.get("name"),
        date: date.toISOString()
    });
}

let chartUpdateInterval;
function ws_onOpen(evt) {
    console.log("websocket opened...");
    ws_send("GET_PONPMIN_24H", par.get("name"));
    chartUpdateInterval = setInterval(() => ws_send("GET_PONPMIN_24H", par.get("name")), 60000);
}

function ws_onClose(evt) {
    console.log("websocket closed...");
    setTimeout(() => location.reload(), 1000);
}

function ws_onMessage(evt) {
    let parsedEvt = JSON.parse(evt.data);
    console.log(parsedEvt);
    switch (parsedEvt.command) {
        case "SERVER_STATE":
            incomingMsg(parsedEvt.payload[par.get("name")]);
            break;
        case "STATE":
            if (parsedEvt.device == par.get("name")) incomingMsg(parsedEvt.payload);
            break;
        case "GET_PONPMIN_HIST":
        case "GET_PONPMIN_24H":
            if (parsedEvt.device == par.get("name")) {
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
                    setChart(ponpminChart, Object.keys(datapoints).map(v => new Date(v)), [
                        Object.values(datapoints).map(v => v.ponpmin)
                    ]);
                    dateSelector.setValue(new Date((new Date()).setSeconds(0,0)));
                }
            }
            break;
    }
}

function incomingMsg(msg) {
    for (const key in msg) {
        switch (key) {
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

function setChart(chart, labels, datapoints) {
    console.log("updating chart...");
    chart.chart.data.labels = labels;
    datapoints.forEach((data, dataidx) => {
        chart.chart.data.datasets[dataidx].data = data;
    });
    chart.chart.update();
}

function createPonpminChart() {

    let dp = {};
    let yesterday = (new Date(Date.now() - (864e5/2))).setSeconds(0,0);
    let current = new Date().setSeconds(0,0);
    for (
        let index = yesterday; 
        index <= current; 
        index+=6e4
    ) { dp[new Date(index).toISOString()] = 0 }

    const labels = Object.keys(dp).map(v => new Date(v));
    const datapoints = Object.values(dp);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Kecepatan Pon (pon/min)',
            data: datapoints,
            borderColor: "rgba(100,255,100,.5)",
            backgroundColor: "rgba(100,255,100,.5)",
            pointRadius: 1,
            fill: true,
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
                axis: 'x',
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "hour",
                        tooltipFormat: 'DD/MM/YYYY HH:mm'
                    },
                    title: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: ''
                    },
                    suggestedMin: 0,
                    suggestedMax: 20
                }
            }
        },
    };
    
    return new ChartComponent(chartConfig, {
        height: "400px"
    }, {
        parent: deviceHolder.element(),
        style: {
            margin: "2em 1em 1em 1em",
        }
    });
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
        padding: "1em 0 0 1em",
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

const deviceTitle = new TitleText(par.get("name"), {
    parent: deviceHeaderHolder.element()
});
const deviceStatus = new Indicator({
    valueON: "Online",
    valueOFF: "Offline"
}, {
    parent: deviceHeaderHolder.element()
});

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

const dateSelectorHolder = new BasicComponent({
    parent: deviceHolder.element(),
    style: {
        fontSize: "1.5em",
        margin: "1em 0",
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(600px, 1fr))",
        gap: "1em 2em",
    }
});

const dateSelector = new InputDateTime({
    label: "Tanggal",
    value: new Date(),
},{
    parent: dateSelectorHolder.element(),
    style: {}
});

const findAndUpdateButtonHolder = new BasicComponent({
    parent: dateSelectorHolder.element(),
    style: {
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gap: "1em",
    }
});

const findButton = new Button({
    text: "Go to date",
    buttonStyle: {
        display: 'block',
        width: '100%',
        padding: '.2em',
        borderRadius: '.2em',
        backgroundColor: 'rgba(0,150,0,1)',
    },
    listener: {
        click: () => {
            console.log("get date", dateSelector.getValue());
            requestPonpminHist(dateSelector.getValue());
        },
    }
}, {
    parent: findAndUpdateButtonHolder.element(),
    style: {
        textAlign: 'center',
        cursor: 'pointer',
    }
});

const updateButton = new Button({
    text: "Latest",
    buttonStyle: {
        display: 'block',
        width: '100%',
        padding: '.2em',
        borderRadius: '.2em',
        backgroundColor: 'rgba(150,150,0,1)',
    },
    listener: {
        click: () => location.reload(),
    }
}, {
    parent: findAndUpdateButtonHolder.element(),
    style: {
        textAlign: 'center',
        cursor: 'pointer',
    }
});

const ponpminChart = createPonpminChart([],[]);

const deviceClient = new LabelText("Customer", "###", {
    parent: deviceLabelHolder.element()
});
const deviceTebal = new LabelText("Thickness", "###", {
    parent: deviceLabelHolder.element()
});
const deviceDiameter = new LabelText("Dimension", "###", {
    parent: deviceLabelHolder.element()
});
const deviceSpeed = new LabelText("Speed", "###", {
    parent: deviceLabelHolder.element()
});
const deviceCountersum = new LabelText("Counts", "###", {
    parent: deviceLabelHolder.element()
});
const devicePonpmin = new LabelText("Pon/min", "###", {
    parent: deviceLabelHolder.element()
});


// JS EXEC
const run = () => {
    ws_load();
}

document.addEventListener("DOMContentLoaded", run)