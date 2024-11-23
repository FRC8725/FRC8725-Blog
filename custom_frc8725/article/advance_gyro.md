<!-- title: 進階內容 Gyro -->
<!-- description: Gyro -->
<!-- category: Advance -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/03/23 -->

## 陀螺儀（Gyro）
### 宣告方法
1. 創建物件
`NavX-micro` 在創建AHRS物件時Port為 `SerialPort.Port.kUSB`
<br><br/>
`NavX-MXP` Port為 `SPI.Port.kMXP` （一和二代都一樣）

```java
public class DriveMotorSubsystem extends SubsystemBase{
    private final DriveMotorModule leftOne;
    private final DriveMotorModule leftTwo;
    private final DriveMotorModule rightOne;
    private final DriveMotorModule rightTwo;
    private final AHRS gyro;

    public DriveMotorSubsystem() {
        this.leftOne = new DriveMotorModule(Drive.LEFT_ONE, MotorReverse.LEFT_ONE, "leftOne");
        this.leftTwo = new DriveMotorModule(Drive.LEFT_TWO, MotorReverse.LEFT_TWO, "leftTwo");
        this.rightOne = new DriveMotorModule(Drive.RIGHT_ONE, MotorReverse.RIGHT_ONE, "rightOne");
        this.rightTwo = new DriveMotorModule(Drive.RIGHT_TWO, MotorReverse.RIGHT_TWO, "rightTwo");
        this.gyro = new AHRS(SPI.Port.kMXP);
    }
}
```
### 小知識
物體自由度，Roll（翻滾）、Pitch（俯仰）、Yaw（偏擺）
![](../public/articleImage/software_edu/image9.wm.png)

### 函式
* `getYaw` 、 `getAngle` 取得Yaw（偏擺）
* `getPitch` 取得Pitch（俯仰）
* `getRoll` 取得Roll（翻滾）
* `getRotation2d` 以Rotation2d形式傳回機器人航向
* `reset` 重置陀螺儀
* `getWorldLinearAccelX` 取得X軸線性加速度
* `getWorldLinearAccelY` 取得Y軸線性加速度
* `getWorldLinearAccelZ` 取得Z軸線性加速度