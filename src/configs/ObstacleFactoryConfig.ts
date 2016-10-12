interface ObstacleFactoryConfig {

    baseSpawnDelay: number;
    spawnDelayRandomizationRange: number;

    startingMovePossibility: number;
    maxMovePossibility: number;
    stepMovePossibility: number;
    movePossibilityIncrementStartDelay: number;

    obstacleConfig: ObstacleConfig;

}