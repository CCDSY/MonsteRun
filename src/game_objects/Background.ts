/**
 * Background
 */
class Background extends egret.DisplayObjectContainer {

    private skyMovementSpeed: number;
    private floorMovementSpeed: number;
    private floorHeight: number;

    private sky: Stack<egret.Bitmap>;
    private floor: egret.Bitmap;

    constructor(skyMovementSpeed: number, floorMovementSpeed: number, floorHeight: number) {
        super();

        this.skyMovementSpeed = skyMovementSpeed;
        this.floorMovementSpeed = floorMovementSpeed;
        this.floorHeight = floorHeight;

        this.once(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);

        GameScene.getInstance().once(GameLifeCycleEvent.GAME_STARTED, this.startMoving, this);
    }

    private onAddToStage(): void {
        let skyBitmap1 = Utility.createBitmapByName("background_png");
        let skyBitmap2 = Utility.createBitmapByName("background_png");
        this.sky = new Stack([skyBitmap1, skyBitmap2], -2);
        this.sky.width = this.width << 1;
        this.sky.height = this.height - this.floorHeight;
        this.addChild(this.sky);

        this.floor = Utility.createBitmapByName("block_png");
        this.floor.width = this.width << 1;
        this.floor.height = this.floorHeight;
        this.floor.fillMode = egret.BitmapFillMode.REPEAT;
        this.floor.y = this.height - this.floorHeight;
        this.addChild(this.floor);
    }

    public startMoving(): void {
        this.animateSky();
        this.animateFloor();
    }

    private animateFloor(): void {
        let floorAnimationDuration = this.width / this.floorMovementSpeed;
        egret.Tween.get(this.floor).to({ x: -this.width }, floorAnimationDuration).call(this.resetFloor, this);
    }

    private animateSky(): void {
        let skyAnimationDuration = this.width / this.skyMovementSpeed;
        egret.Tween.get(this.sky).to({ x: -this.width }, skyAnimationDuration).call(this.resetSky, this);
    }

    private resetSky(): void {
        this.sky.x = 0;
        this.animateSky();
    }

    private resetFloor(): void {
        this.floor.x = 0;
        this.animateFloor();
    }

}
