import BasicComponent from './basic-component.js';
import LabelText from './label-text.js';
export default class Device extends BasicComponent{

    constructor(name, state = {}, options) {
        super(options);
        this.name = name;
        this.state = state;
        this.draw();
    }

    update(state) {
        this.state = state;
        console.log(this);
        return this;
    }

    draw() {
        this.deviceName = new LabelText("", this.name, { parent:this.element() });
        this.onlineStatus = new LabelText("status : ", "", { parent:this.element() });
        this.counter = new LabelText("counter : ", "", { parent:this.element() });
        this.speed = new LabelText("speed : ", "", { parent:this.element() });
        this.length = new LabelText("length : ", "", { parent:this.element() });
    }

}