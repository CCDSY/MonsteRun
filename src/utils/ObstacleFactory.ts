/**
 * ObstacleFactory
 */
class ObstacleFactory {

    private baseSpawnDelay: number;
    private spawnDelayRandomizationRange: number;

    private movePossibility: number;
    private movePossibilityIncrement: number;
    private maxMovePossibility: number;
    private safeCounter: number;

    private obstacleConfig: ObstacleConfig;

    private container: GameScene;

    private playerInitialPosition: [number, number];

    private obstacles: Obstacle[] = [];

    private gameEnded: boolean = false;

    constructor(config: ObstacleFactoryConfig, playerInitialPosition: [number, number]) {
        this.baseSpawnDelay = config.baseSpawnDelay;
        this.spawnDelayRandomizationRange = config.spawnDelayRandomizationRange;

        this.movePossibility = config.startingMovePossibility;
        this.movePossibilityIncrement = config.stepMovePossibility;
        this.maxMovePossibility = config.maxMovePossibility;
        this.safeCounter = config.movePossibilityIncrementStartDelay;

        this.obstacleConfig = config.obstacleConfig;
        this.playerInitialPosition = playerInitialPosition;
        this.container = GameScene.getInstance();

        var self = this;
        var game = GameScene.getInstance();
        game.once(GameLifeCycleEvent.GAME_STARTED, this.startSpawning, this);
        game.once(GameLifeCycleEvent.GAME_ENDED, function () { self.gameEnded = true; }, this);
    }

    public getObstacles(): Obstacle[] {
        return this.obstacles;
    }

    private timer: egret.Timer;

    public startSpawning(): void {
        if (!this.timer) {
            this.timer = new egret.Timer(this.createSpawnDelay(), 1);
            this.timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        }

        this.timer.start();
    }

    public stopSpawning(): void {
        this.timer.stop();
    }

    private createSpawnDelay(): number {
        let randomization = Math.round((Math.random() * this.spawnDelayRandomizationRange * 2) - this.spawnDelayRandomizationRange);
        return this.baseSpawnDelay + randomization;
    }

    private onTimerComplete(): void {
        this.spawn();

        this.timer.delay = this.createSpawnDelay();
        this.timer.start();
    }

    private spawn(): void {
        var obstacle = new Obstacle(this.obstacleConfig.activationDuration, this.playerInitialPosition[0] + this.obstacleConfig.activationOffset, this.obstacleConfig.activationDistance, this.chooseMovement(), this.obstacleConfig.movementSpeed);
        obstacle.width = this.obstacleConfig.size.width;
        obstacle.height = this.obstacleConfig.size.height;
        obstacle.x = this.container.stage.stageWidth + (obstacle.width >> 1);
        obstacle.y = this.playerInitialPosition[1];
        obstacle.anchorOffsetX = obstacle.width >> 1;
        obstacle.anchorOffsetY = obstacle.height >> 1;
        this.container.addChild(obstacle);

        this.obstacles.push(obstacle);

        if (this.safeCounter > 0) {
            this.safeCounter--;
        } else if (this.movePossibility < this.maxMovePossibility) {
            this.movePossibility += this.movePossibilityIncrement;
            if (this.movePossibility > this.maxMovePossibility) {
                this.movePossibility = this.maxMovePossibility;
            }
        }

        var self = this;
        let callback = function (): void {
            if (!self.gameEnded) {
                console.log("Destroying obstacle.");
                self.obstacles.shift();
                obstacle.parent.removeChild(obstacle);
            }
        }
        obstacle.addEventListener(GameObjectEvent.OBJECT_DESTROYED, callback, this);

        obstacle.startMoving();
    }

    private chooseMovement(): Movement {
        if (Math.random() < this.movePossibility) {
            return Math.floor(Math.random() * 3);
        }
        return Movement.Still;
    }

}