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
            display: "inline-block"
        });


        this.elem.label = document.createElement("h3");
        this.element().appendChild(this.elem.label);
        this.stylize(this.elem.label, {
            display: "block"
        });

        this.elem.value = document.createElement("h3");
        this.element().appendChild(this.elem.value);
        this.stylize(this.elem.value, {
            display: "block"
        });
    }

    setValue(val) {
        this.elem.value.innerText = val;
    }

    setLabel(lbl) {
        this.elem.label.innerText = lbl;
    }

}