/**
 * WelcomeScene
 */
class WelcomeScene extends egret.DisplayObjectContainer {

    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createScene, this);
    }

    private createScene(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createScene, this);

        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        var titleLabel = new egret.TextField();
        this.addChild(titleLabel);
        Utility.configureCenteredTextField(titleLabel, 92, "MonsteRun", -100);
        titleLabel.textColor = 0x0D649B;

        var startButton = new egret.TextField();
        this.addChild(startButton);
        Utility.configureCenteredTextField(startButton, 48, "GO!", 100);
        startButton.textColor = 0x23bb23;

        startButton.once(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        startButton.touchEnabled = true;
    }

    private startGame(): void {
        var container = this.parent;
        container.removeChild(this);
        GameScene.getInstance().startGame();
    }

}