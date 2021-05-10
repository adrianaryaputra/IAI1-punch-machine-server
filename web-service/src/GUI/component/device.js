import BasicComponent from './basic-component.js';
import LabelText from './label-text.js';
import TitleText from './title-text.js';
import Indicator from './indicator.js';
import ChartComponent from './chart.js';
export default class Device extends BasicComponent{

    constructor({
        name,
        state = {},
        listener = {},
    }, options) {
        super(options);
        this.name = name;
        this.listener = listener;
        this.draw();
        this.execListener();
        this.update(state);
        this.stylize(this.element(), {
            backgroundColor: "rgba(0,255,0,0.2)",
            fontSize: "1.2rem",
            cursor: "pointer",
        });
        this.noInput = this.onNoInputTimeout(5000);
    }

    onNoInputTimeout(t) {
        return setTimeout(() => this.stylize(this.element(), {backgroundColor: "rgba(255,0,0,0.2)"}), t);
    }

    update(state) {
        this.stylize(this.element(), {backgroundColor: "rgba(0,255,0,0.2)"})
        this.state = state;
        clearTimeout(this.noInput);
        this.noInput = this.onNoInputTimeout(5000);
        for (const key in state) {
            switch(key) {
                // case "DRIVE_SPEED":
                //     this.speed.setValue(state[key]);
                //     break;
                case "STATS_PUNCH_PER_MINUTE":
                    this.ponpmin.setValue(state[key]);
                    break;
                case "DEVICE_STATUS":
                    this.deviceStatus.toggle(state[key]);
                    break;
                case "STATS_NAMA_PELANGGAN":
                    this.client.setValue(state[key]);
                    break;
                case "STATS_TEBAL_BAHAN":
                    this.tebal.setValue(state[key]);
                    break;
                case "STATS_UKURAN_BAHAN":
                    this.diameter.setValue(state[key]);
                    break;
                case "STATS_TOTAL_COUNT":
                    this.countersum.setValue(state[key]);
                    break;
                case "PONPMIN_CHART":
                    setChart(this.ponpminChart, Object.keys(state[key]).map(v => new Date(v)), [
                        Object.values(state[key]).map(v => v.ponpmin)
                    ]);
                    break;
            }
        }
        return this;
    }

    draw() {

        this.deviceSplitter = new BasicComponent({
            parent: this.element(),
            style: {
                display: "grid",
                gap: "1em",
                gridTemplateColumns: "500px auto",
            }
        });

        this.viewHolder = new BasicComponent({
            parent: this.deviceSplitter.element(),
            style: {
                display: "grid",
                gap: ".3em",
            }
        })

        this.headerHolder = new BasicComponent({
            parent: this.viewHolder.element(),
            style: {
                fontSize: "1.5rem",
                margin: "0 0 var(--normal) .3em",
                display: "grid",
                gridTemplateColumns: "minmax(max-content, 1fr) 100px",
            }
        });

        this.deviceName     = new TitleText(this.name, { parent: this.headerHolder.element() });
        this.deviceStatus   = new Indicator({ valueON: "ON", valueOFF: "OFF" }, { parent: this.headerHolder.element() });
        this.client         = new LabelText("Customer", "###", { parent:this.viewHolder.element() });
        this.tebal          = new LabelText("Thickness", "###", { parent:this.viewHolder.element() });
        this.diameter       = new LabelText("Dimension", "###", { parent:this.viewHolder.element() });
        // this.speed          = new LabelText("Speed", "###", { parent:this.viewHolder.element() });
        this.countersum     = new LabelText("Counts", "###", { parent:this.viewHolder.element() });
        this.ponpmin        = new LabelText("Pon/min", "###", { parent:this.viewHolder.element() });

        this.ponpminChartHolder = new BasicComponent({
            parent: this.deviceSplitter.element(),
            style: { position: "relative" }
        })

        this.ponpminChart   = createPonpminChart({ parent:this.ponpminChartHolder.element() });
    }

    execListener() {
        for (const key in this.listener) {
            this.element().addEventListener(key, this.listener[key]);
        }
    }

}


function createPonpminChart({
    parent, 
    style = {
        margin: "2em 1em 1em 1em",
    }
}) {

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
        height: "auto",
        width: "auto",
    }, {
        parent: parent,
        style: {
            position: "absolute",
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
        }
    });
}


function setChart(chart, labels, datapoints) {
    console.log("updating chart...");
    chart.chart.data.labels = labels;
    datapoints.forEach((data, dataidx) => {
        chart.chart.data.datasets[dataidx].data = data;
    });
    chart.chart.update();
}