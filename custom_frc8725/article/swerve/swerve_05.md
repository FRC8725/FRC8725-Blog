<!-- title: Swerve 常數設定 -->
<!-- description: 控制 Swerve 底盤 -->
<!-- category: Swerve -->
<!-- tags: Programming -->
<!-- published time: 2024/11/21 -->

# Constants參數設定
## SwerveConstants.java
註: 單位為公尺

角塊最大速度、齒輪比在[這裡](https://www.swervedrivespecialties.com/products/mk4i-swerve-module)查詢

* `TRACK_WIDTH` `TRACK_LENGTH` 為角塊中心到另一角塊中心距離

* `WHEEL_RADIUS` Swerve輪子半徑

* `MAX_SPEED` 最大速度

* `MAX_ACCELERATION` 最大加速度

* `MAX_ANGULAR_ACCELERATION` 最大角加速度

* `DRIVE_GEAR_RATIO` Driving Motor齒輪比

* `MAX_VOLTAGE` 限制馬達最大電壓

* `DRIVE_VELOCITY_CONVERSION_FACTOR` 算出從 drive encoder 速度轉換成線性速度（m/s）所需要的轉換的常數

* `DRIVE_POSITION_CONVERSION_FACTOR` 算出從 drive encoder 速度轉換成角度

* `SwerveDriveKinematics` 將整體的速度算成各腳角度及速度，輸入值為圓心為機器人中心到各角塊座標
    * 順序為：左前、右前、左後、右後
    * Kinematics順序要注意，跟之後寫的順序要相同

* `DEAD_BAND` 避免搖桿值誤差導致車往前開，輸入值若小於Dead_Band則視為0

* `GYRO_FIELD` 決定絕對場地(true)或相對場地(false)運動

```java
package frc.robot;

import edu.wpi.first.math.geometry.Translation2d;
import edu.wpi.first.math.kinematics.SwerveDriveKinematics;
import edu.wpi.first.math.util.Units;

public final class SwerveConstants {
    public static final double TRACK_WIDTH = Units.inchesToMeters(19.25);
    public static final double TRACK_LENGTH = Units.inchesToMeters(19.25);
    public static final double WHEEL_RADIUS = 0.0508;

    public static final double MAX_SPEED = 3.0;
    public static final double MAX_ACCELERATION = 9.0;
    public static final double MAX_ANGULAR_ACCELERATION = 9.0;
    public static final double DRIVE_GEAR_RATIO = 57.0 / 7.0;
    public static final int MAX_VOLTAGE = 20;

    public static final double DRIVE_VELOCITY_CONVERSION_FACTOR = WHEEL_RADIUS * 2 / DRIVE_GEAR_RATIO * Math.PI / 60;
    public static final double DRIVE_POSITION_CONVERSION_FACTOR = WHEEL_RADIUS * 2 / DRIVE_GEAR_RATIO * Math.PI;

    public static final SwerveDriveKinematics swerveDriveKinematics = new SwerveDriveKinematics(
    	new Translation2d(TRACK_LENGTH / 2, TRACK_WIDTH / 2),
    	new Translation2d(TRACK_LENGTH / 2, -TRACK_WIDTH / 2),
    	new Translation2d(-TRACK_LENGTH / 2,TRACK_WIDTH / 2),
    	new Translation2d(-TRACK_LENGTH / 2, -TRACK_WIDTH / 2)
    );

    public static final double DEAD_BAND = 0.05;
    public static final boolean GYRO_FIELD = true;
}
```
### Motor Reverse Constants
* 確保swerve向前時，4個Module輪子向前

```java
FRONT_LEFT_DRIVE = true;    // 左前Drive
FRONT_RIGHT_DRIVE = false;  // 右前Drive
BACK_LEFT_DRIVE = true;     // 左後Drive
BACK_RIGHT_DRIVE = false;   // 右後Drive

FRONT_LEFT_TURN = true;     // 左前Turn
FRONT_RIGHT_TURN = true;    // 右前Turn
BACK_LEFT_TURN = true;      // 左後Turn
BACK_RIGHT_TURN = true;     // 右後Turn
```
### Encoder Reverse Constants
* 確保swerve向前時，4個Module的Velocity為正值

```java
FRONT_LEFT = true;          // 左前
FRONT_RIGHT = true;         // 右前
BACK_LEFT = true;           // 左後
BACK_RIGHT = true;          // 右後
```
## DeviceId.java
紀錄馬達和Encoder ID

* 要跟**SwerveKinematics**順序相同

	* Turning motor通常為單數

	* Driving motor通常為雙數

```java
package frc.robot;

public final class DeviceId {
    public final class Swerve {
        public static final int frontLeftDrive = 2;
        public static final int frontRightDrive = 4;
        public static final int backwardLeftDrive = 5;
        public static final int backwardRightDrive = 7;
        public static final int frontLeftTurn = 1;
        public static final int frontRightTurn = 3;
        public static final int backwardLeftTurn = 6;
        public static final int backwardRightTurn = 8;
    }
    public final class Encoder {
        public static final int frontLeft = 9;
        public static final int frontRight = 10;
        public static final int backwardLeft = 11;
        public static final int backwardRight = 12;
    }
}
```

<br><a class="articleSwitcher" next_article="swerve\swerve_06">>> 下一章 <<</a>