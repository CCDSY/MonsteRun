/**
 * ObstacleFactory
 */
class ObstacleFactory {

    private baseSpawnDelay: number;
    private spawnDelayRandomizationRange: number;

    private obstacleConfig: ObstacleConfig;

    private container: GameScene;

    private playerInitialPosition: [number, number];

    private obstacles: Obstacle[] = [];

    constructor(baseSpawnDelay: number, spawnDelayRandomizationRange: number, obstacleConfig: ObstacleConfig, playerInitialPosition: [number, number]) {
        this.baseSpawnDelay = baseSpawnDelay;
        this.spawnDelayRandomizationRange = spawnDelayRandomizationRange;
        this.obstacleConfig = obstacleConfig;
        this.playerInitialPosition = playerInitialPosition;
        this.container = GameScene.getInstance();
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

        var self = this;
        let callback = function (gameEnded: boolean): void {
            if (!gameEnded) {
                self.obstacles.shift();
                obstacle.parent.removeChild(obstacle);
            }
        }
        obstacle.addDestructionCallback(callback);

        obstacle.startMoving();
    }

    private chooseMovement(): Movement {
        return Math.floor(Math.random() * 4);
    }

}