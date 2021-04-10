import BasicComponent from './basic-component.js';
import LabelText from './label-text.js';
export default class Device extends BasicComponent{

    constructor(name, state = {}, options) {
        super(options);
        this.name = name;
        this.draw();
        this.update(state);
        this.stylize(this.element(), {backgroundColor: "rgba(0,255,0,0.3)"});
        this.noInput = this.onNoInputTimeout(5000);
    }

    onNoInputTimeout(t) {
        return setTimeout(() => this.stylize(this.element(), {backgroundColor: "rgba(255,0,0,0.3)"}), t);
    }

    update(state) {
        this.stylize(this.element(), {backgroundColor: "rgba(0,255,0,0.3)"})
        this.state = state;
        clearTimeout(this.noInput);
        this.noInput = this.onNoInputTimeout(5000);
        for (const key in state) {
            switch(key) {
                case "DRIVE_COUNTER_CV":
                    this.counter.setValue(state[key]);
                    break;
                case "DRIVE_SPEED":
                    this.speed.setValue(state[key]);
                    break;
                case "DEVICE_STATUS":
                    this.onlineStatus.setValue(state[key] ? "ONLINE" : "OFFLINE");
                    break;
                case "STATS_NAMA_PELANGGAN":
                    this.client.setValue(state[key]);
                    break;
                case "STATS_TEBAL_BAHAN":
                    this.tebal.setValue(state[key]);
                    break;
                case "STATS_DIAMETER_PON":
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
        this.deviceName     = new LabelText(this.name, "", { parent:this.element() });
        this.onlineStatus   = new LabelText("Status :", "", { parent:this.element() });
        this.client         = new LabelText("Pelanggan :", "", { parent:this.element() });
        this.tebal          = new LabelText("Tebal :", "", { parent:this.element() });
        this.diameter       = new LabelText("Diameter :", "", { parent:this.element() });
        this.speed          = new LabelText("Speed :", "", { parent:this.element() });
        this.counter        = new LabelText("Counter :", "", { parent:this.element() });
        this.countersum     = new LabelText("Total Count :", "", { parent:this.element() });
    }

}