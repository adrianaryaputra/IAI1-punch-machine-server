export default class BasicComponent {

    constructor({style, parent}) {
        this.style = style || {};
        this.parent = parent;
        this.elem = {
            holder: document.createElement("div")
        };
        if(this.parent) this.parent.appendChild(this.element());
    }

    element() {
        return this.elem.holder;
    }

    stylize(node, styling){
        for (const styleKey in styling) {
            node.style[styleKey] = styling[styleKey]
        }
    }

}