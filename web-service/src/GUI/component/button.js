import BasicComponent from './basic-component.js';
export default class Button extends BasicComponent{

    constructor({
        text = "UNK_BUTTON",
        listener = {},
    }, options
    ) {
        super(options);
        this.text = text;
        this.listener = listener;
        this.draw();
        this.execListener();
    }

    draw() {

        // set holder style
        this.stylize(this.element(), {});

        this.elem.value = document.createElement("h3");
        this.element().appendChild(this.elem.value);
        this.elem.value.innerText = this.text;
        this.stylize(this.elem.value, {});
    }

    execListener() {
        for (const key in this.listener) {
            this.element().addEventListener(key, this.listener[key]);
        }
    }

}