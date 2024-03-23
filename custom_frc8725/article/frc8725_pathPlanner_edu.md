<!-- title: FRC8725 軟體培訓教學 - PathPlanner -->
<!-- description: PathPlanner教學(NeoSwerve) -->
<!-- category: Programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/03/23 -->

# PathPlanner教學
## 軟件下載
在Microsoft Store搜尋PathPlanner安裝 `FRC PathPlanner`
## 軟件設定
1. 先開一個Project，他會在deploy新增一個PathPlanner資料夾
2. 設定機器長寬、速度限制等

![](image/articleImage/pathplanner_edu/image1.wm.png)

## Path
1. 在Paths按+後可新增路徑
2. 功能說明

> `Waypoints` 所有點的設定(x, y, handing)

> `Global Constraints` 最大速度、加速度、角速度、角加速度設定

> `Goal End State` 設定結束時速度和角度

> `Rotation Targets` 在路徑上的特定定點要旋轉的角度

## Auto
在畫完幾張Path後可將這些Path串接起來並且在中間穿插特定Command
1. 先新增一個Auto
2. `Start Point` 可設定開始位置
3. `Sequential Group` 可串接Path和Command

> `Follow Path` Path畫的圖

> `Named Command` 自訂Command

## Code
1. 安裝Lib
```java
https://3015rangerrobotics.github.io/pathplannerlib/PathplannerLib.json
```

2. 創建兩個**陣列**

> `SwerveModuleState` 取得四個角塊狀態

> `SwerveModulePosition` 取得四個角塊角度

3. 創建 `SwerveDriveOdometry` 物件
4. 創建一個Function和一個方法分別為取得Pose和resetPose

> `getPoseMeters` 回傳機器人在場上的位置

> `resetPosition` 重製機器人的Pose

5. 在 `perodic` 裡 update `odometry` (可用Override)
6. 創建一個 `ChassisSpeeds` 的Function (取得底盤速度)

> `Kinematics.toChassisSpeeds` 獲得底盤x, y, rotation速度

7. 使用 `AutoBuilder.configureHolonomic` 設定所需資料

> `poseSupplier` 要取得機器人當前位置

> `resetPose` 重製機器人當前位置

> `robotRelativeSpeedsSupplier` 取得當前速度

> `robotRelativeOutput` 輸出給底盤(輸出ChassisSpeed)

> `config` 創建 `HolonomicPathFollowerConfig` 裡面設定最大速度、機器人中心至角快距離、是否重新規畫路徑設定

> `shouldFlipPath` 紅藍方翻轉路徑
```java
() -> {
    var alliance = DriverStation.getAlliance();
    if (alliance.isPresent()) {
        return alliance.get() == DriverStation.Alliance.Red;
    }
    return false;
}
```
> `driveSubsystem` subsystem

## Run
在 `RobotContainer` 的 `getAutonomousCommand`<br>
```java
return new PathPlannerAuto("路徑名稱")
```