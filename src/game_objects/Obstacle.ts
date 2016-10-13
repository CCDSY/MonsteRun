/**
 * Obstacle
 */
class Obstacle extends egret.Bitmap {

    private activationDuration: number;
    private activationPosition: number;
    private activationDistance: number;
    private activationMovement: Movement;

    private movementSpeed: number;

    private collisionTestOffsetThreshold: number = 250;

    private player: Player = Player.getInstance();

    constructor(activationDuration: number,
        activationPosition: number,
        activationDistance: number,
        activationMovement: Movement,
        movementSpeed: number) {
        super();

        this.activationDuration = activationDuration;
        this.activationPosition = activationPosition;
        this.activationDistance = activationDistance;
        this.activationMovement = activationMovement;

        this.movementSpeed = movementSpeed;

        this.game = GameScene.getInstance();

        var sprite = RES.getRes("monster_01_png");
        this.texture = sprite;

        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        GameScene.getInstance().once(GameLifeCycleEvent.GAME_ENDED, this.destroy, this);
    }

    private scored: boolean = false;
    private game: GameScene;

    private onEnterFrame(event: egret.Event): void {
        if (this.scored) {
            return;
        }

        if (this.x <= this.activationPosition && !this.activated) {
            this.activate();
        }

        if (this.x <= this.player.x + this.collisionTestOffsetThreshold) {
            if (Utility.testCollision(this, this.player)) {
                this.player.die();
            }
        }

        if (this.x + (this.width >> 1) <= this.player.x - (this.player.width >> 1)) {
            this.game.incrementScores();
            this.scored = true;
        }
    }

    private activated: boolean = false;

    private activate(): void {
        this.activated = true;
        if (this.activationMovement == Movement.Still) {
            return;
        }

        var target: any;
        let deltaX = this.movementSpeed * this.activationDuration / 1000;

        if (this.activationMovement == Movement.Up) {
            target = {
                y: this.y - this.activationDistance,
                x: this.x - deltaX
            };
        } else if (this.activationMovement == Movement.Left) {
            target = {
                x: this.x - this.activationDistance - deltaX
            };
        } else if (this.activationMovement == Movement.Right) {
            target = {
                x: this.x + this.activationDistance - deltaX
            };
        }

        egret.Tween.removeTweens(this);
        egret.Tween.get(this).to(target, this.activationDuration).call(this.startMoving);
    }

    public startMoving(): void {
        let finalTarget = { x: -this.width }

        let duration = (this.x - finalTarget.x) / this.movementSpeed * 1000;

        egret.Tween.get(this).to(finalTarget, duration).call(this.destroy);
    }

    public destroy(): void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);

        this.dispatchEvent(new GameObjectEvent(GameObjectEvent.OBJECT_DESTROYED));
    }

}
