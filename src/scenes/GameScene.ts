/**
 * GameScene
 */
class GameScene extends egret.DisplayObjectContainer {

    private static instance: GameScene;
    public static getInstance(): GameScene {
        return GameScene.instance;
    }

    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createGameScene, this);

        GameScene.instance = this;
    }

    private player: Player;
    private factory: ObstacleFactory;

    private scoreLabel: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.createGameScene, this);

        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        var bg = new egret.Shape();
        bg.width = stageW;
        bg.height = stageH;
        bg.graphics.beginFill(0xaaaaaa);
        bg.graphics.drawRect(0, 0, stageW, stageH);
        bg.graphics.endFill();
        this.addChild(bg);

        let playerConfig: PlayerConfig = RES.getRes("player_config_json");

        var ground = new egret.Shape();
        ground.width = stageW;
        ground.height = playerConfig.initialPosition.offsetY - (playerConfig.size.height >> 1);
        ground.y = stageH - ground.height;
        ground.graphics.beginFill(0x888888);
        ground.graphics.drawRect(0, 0, ground.width, ground.height);
        ground.graphics.endFill();
        this.addChild(ground);

        this.player = new Player(playerConfig.jumpHeight, playerConfig.jumpTime, playerConfig.playerColor);
        this.player.width = playerConfig.size.width;
        this.player.height = playerConfig.size.height;
        this.player.x = playerConfig.initialPosition.x;
        this.player.y = stageH - playerConfig.initialPosition.offsetY;
        this.player.anchorOffsetX = this.player.width >> 1;
        this.player.anchorOffsetY = this.player.height >> 1;
        this.addChild(this.player);

        let factoryConfig: ObstacleFactoryConfig = RES.getRes("obstacle_factory_config_json");
        this.factory = new ObstacleFactory(factoryConfig.baseSpawnDelay, factoryConfig.spawnDelayRandomizationRange, factoryConfig.obstacleConfig, [this.player.x, this.player.y]);

        let scoreLabelConfig: ScoreLabelConfig = RES.getRes("score_label_config_json");
        this.scoreTextPrefix = scoreLabelConfig.prefix;
        this.scoreLabel = new egret.TextField();
        this.scoreLabel.x = scoreLabelConfig.leftMargin;
        this.scoreLabel.y = scoreLabelConfig.topMargin;
        this.scoreLabel.size = scoreLabelConfig.fontSize;
        this.addChild(this.scoreLabel);

        this.startGame();
    }

    public startGame(): void {
        this.updateScoreText();

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.player.jump, this.player);
        this.touchEnabled = true;

        this.factory.startSpawning();
    }

    public endGame(): void {
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.player.jump, this.player);

        this.factory.stopSpawning();

        egret.Tween.removeAllTweens();
        var obstacles = this.factory.getObstacles()
        for (var i = 0; i < obstacles.length; i++) {
            obstacles[i].destroy(true);
        }

        this.showScores();
    }

    private scores: number = 0;

    public incrementScores(): void {
        this.scores++;
        this.updateScoreText();
    }

    private scoreTextPrefix: string;
    private updateScoreText(): void {
        this.scoreLabel.text = this.scoreTextPrefix + this.scores;
    }

    private showScores(): void {
        this.removeChild(this.scoreLabel);
        this.parent.addChild(new ScoresScene(this.scores));
    }

}