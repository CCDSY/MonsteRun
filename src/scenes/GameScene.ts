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

    private background: Background;

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

        let bgConfig: BackgroundConfig = RES.getRes("background_config_json");
        this.background = new Background(bgConfig.skyMovementSpeed, bgConfig.floorMovementSpeed, bgConfig.floorHeight);
        this.background.width = stageW;
        this.background.height = stageH;
        this.addChild(this.background);

        let playerConfig: PlayerConfig = RES.getRes("player_config_json");

        this.player = new Player(playerConfig.jumpHeight, playerConfig.jumpTime);
        this.player.width = playerConfig.size.width;
        this.player.height = playerConfig.size.height;
        this.player.x = playerConfig.initialPosition.x;
        this.player.y = stageH - playerConfig.initialPosition.offsetY;
        this.player.anchorOffsetX = this.player.width >> 1;
        this.player.anchorOffsetY = this.player.height >> 1;
        this.addChild(this.player);

        let factoryConfig: ObstacleFactoryConfig = RES.getRes("obstacle_factory_config_json");
        this.factory = new ObstacleFactory(factoryConfig, [this.player.x, this.player.y]);

        let scoreLabelConfig: ScoreLabelConfig = RES.getRes("score_label_config_json");
        this.scoreTextPrefix = scoreLabelConfig.prefix;
        this.scoreLabel = new egret.TextField();
        this.scoreLabel.x = scoreLabelConfig.leftMargin;
        this.scoreLabel.y = scoreLabelConfig.topMargin;
        this.scoreLabel.size = scoreLabelConfig.fontSize;
        this.addChild(this.scoreLabel);
        this.scoreLabel.textColor = 0x000000;
    }

    public startGame(): void {
        this.updateScoreText();

        this.dispatchEvent(new GameLifeCycleEvent(GameLifeCycleEvent.GAME_STARTED));
    }

    public endGame(): void {
        this.dispatchEvent(new GameLifeCycleEvent(GameLifeCycleEvent.GAME_ENDED));

        egret.Tween.removeAllTweens();

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