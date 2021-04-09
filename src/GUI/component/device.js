import BasicComponent from './basic-component.js';
import LabelText from './label-text.js';
export default class Device extends BasicComponent{

    constructor(name, state = {}, options) {
        super(options);
        this.name = name;
        this.draw();
        this.update(state);
    }

    update(state) {
        this.state = state;
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
            }
        }
        return this;
    }

    draw() {
        this.deviceName     = new LabelText("", this.name, { parent:this.element() });
        this.onlineStatus   = new LabelText("status : ", "", { parent:this.element() });
        this.client         = new LabelText("client : ", "", { parent:this.element() });
        this.tebal          = new LabelText("tebal : ", "", { parent:this.element() });
        this.diameter       = new LabelText("diameter : ", "", { parent:this.element() });
        this.speed          = new LabelText("speed : ", "", { parent:this.element() });
        this.counter        = new LabelText("counter : ", "", { parent:this.element() });
    }

}