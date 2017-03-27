export const smallText = {
    attach() {
        this.text = new PIXI.extras.BitmapText("", {font: "8px Minimal3x5"});
        this.addChild(this.text);

        this.text.tint = 0xccd5ff;
    },

    detach() {
        this.text.destroy();
        delete this.text;
    },

    properties: {
        setText(text) {
            this.text.text = text;
        }
    }
};

export const mediumText = {
    attach() {
        this.stroke = this.addChild(new PIXI.Graphics());
        this.text = new PIXI.extras.BitmapText("", {font: "16px Sharp-Retro"});
        this.addChild(this.text);

        this.text.tint = 0xccd5ff;
        this.stroke.color = 0x505ea1;
    },

    detach() {
        this.stroke.destroy();
        this.text.destroy();
        delete this.stroke;
        delete this.text;
    },

    properties: {
        setText(text) {
            this.text.text = text;
            this.drawStroke();
        },

        drawStroke() {
            this.stroke
            .clear()
            .beginFill(this.stroke.color)
            .drawRect(-1, 6, this.text.textWidth + 2, this.text.textHeight - 14)
            .endFill();
        }
    }
};
