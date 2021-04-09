import BasicComponent from './basic-component.js';
export default class LabelText extends BasicComponent{

    constructor(label, value, options) {
        super(options);
        this.label = label;
        this.value = value;
        this.draw();
    }

    draw() {

        // set holder style
        this.stylize(this.element(), {
            display: "flex"
        });


        this.elem.label = document.createElement("h3");
        this.element().appendChild(this.elem.label);
        this.setLabel(this.label);
        this.stylize(this.elem.label, {
            margin: "0 5px 0 0"
        });

        this.elem.value = document.createElement("h3");
        this.element().appendChild(this.elem.value);
        this.setValue(this.value)
        this.stylize(this.elem.value, {
            margin: "0"
        });
    }

    setValue(val) {
        this.elem.value.innerText = val;
    }

    setLabel(lbl) {
        this.elem.label.innerText = lbl;
    }

}