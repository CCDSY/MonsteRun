/**
 * Stack
 */
class Stack<T extends egret.DisplayObject> extends egret.DisplayObjectContainer {

    private contents: T[];
    private offset: number = 0;

    constructor(contents: T[], offset: number) {
        super();

        this.contents = contents;
        this.offset = offset;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        let contentWidth = this.width / this.contents.length;
        for (var i = 0; i < this.contents.length; i++) {
            this.contents[i].width = contentWidth;
            this.contents[i].height = this.height;
            this.contents[i].x = i * contentWidth + this.offset;
            this.addChild(this.contents[i]);
        }
    }

}
