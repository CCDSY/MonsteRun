/**
 * ScoresScene
 */
class ScoresScene extends egret.DisplayObjectContainer {

    private scores: number;

    constructor(scores: number) {
        super();

        this.scores = scores;

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createScene, this);
    }

    private createScene(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createScene, this);

        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        var scoreLabel = new egret.TextField();
        this.addChild(scoreLabel);
        Utility.configureCenteredTextField(scoreLabel, 108, String(this.scores), -100);

        let remarkConfigs: RemarkConfig[] = RES.getRes("remark_config_json");
        let remark: string;
        for (var i = 0; i < remarkConfigs.length; i++) {
            if (this.scores < remarkConfigs[i].threshold) {
                remark = remarkConfigs[i].remark;
                break;
            }
        }
        if (!remark) {
            remark = "Not bad…";
        }

        var remarksLabel = new egret.TextField();
        this.addChild(remarksLabel);
        Utility.configureCenteredTextField(remarksLabel, 32, remark, 0);

        var retryButton = new egret.TextField();
        this.addChild(retryButton);
        Utility.configureCenteredTextField(retryButton, 64, "Try Again", 100);

        retryButton.once(egret.TouchEvent.TOUCH_TAP, this.retry, this);
        retryButton.touchEnabled = true;
    }

    private retry(): void {
        var container = this.parent;
        container.removeChildren();

        let newGame = new GameScene();
        container.addChild(newGame);
        newGame.startGame();
    }

}