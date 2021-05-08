// import '../dep/chart.js';
// import '../dep/moment.js';
// import '../dep/chartjs-adapter-moment.js';
import BasicComponent from './basic-component.js';
export default class ChartComponent extends BasicComponent{

    constructor(chartOptions, canvasOptions, options) {
        super(options);
        this.canvasOptions = canvasOptions;
        this.chartOptions = chartOptions;
        this.draw();
    }

    draw() {

        // set holder style
        this.stylize(this.element(), {});

        this.elem.canvas = document.createElement("canvas");
        this.element().appendChild(this.elem.canvas);
        this.stylize(this.elem.canvas, this.canvasOptions);

        this.chart = new window.Chart(this.elem.canvas, this.chartOptions);
    }

}