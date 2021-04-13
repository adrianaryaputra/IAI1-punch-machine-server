import BasicComponent from './basic-component.js';
import LabelText from './label-text.js';
import TitleText from './title-text.js';
import Indicator from './indicator.js';
export default class Device extends BasicComponent{

    constructor(name, state = {}, options) {
        super(options);
        this.name = name;
        this.draw();
        this.update(state);
        this.stylize(this.element(), {
            display: "grid",
            gap: ".3em",
            backgroundColor: "rgba(0,255,0,0.2)"
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
                // case "DRIVE_COUNTER_CV":
                //     this.counter.setValue(state[key]);
                //     break;
                case "DRIVE_SPEED":
                    this.speed.setValue(state[key]);
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
            }
        }
        return this;
    }

    draw() {
        this.headerHolder = new BasicComponent({
            parent: this.element(),
            style: {
                fontSize: "1.5rem",
                margin: "0 0 var(--normal) .3em",
                display: "grid",
                gridTemplateColumns: "minmax(max-content, 1fr) 100px"
            }
        });

        this.deviceName     = new TitleText(this.name, { parent: this.headerHolder.element() });
        this.deviceStatus   = new Indicator({ valueON: "ON", valueOFF: "OFF" }, { parent: this.headerHolder.element() });
        this.client         = new LabelText("Pelanggan", "###", { parent:this.element() });
        this.tebal          = new LabelText("Tebal", "###", { parent:this.element() });
        this.diameter       = new LabelText("Diameter", "###", { parent:this.element() });
        this.speed          = new LabelText("Speed", "###", { parent:this.element() });
        // this.counter        = new LabelText("Counter", "", { parent:this.element() });
        this.countersum     = new LabelText("Total Count", "###", { parent:this.element() });
    }

}