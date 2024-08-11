<!-- title: FRC8725 軟體培訓教學 - Swerve底盤 -->
<!-- description: 控制 Swerve 底盤 -->
<!-- category: Programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/03/23 -->

# Swerve 底盤撰寫
使用 Neo 馬達撰寫Swerve

![樹狀圖(有使用IDashboard和比較簡化的Spark)](image/articleImage/swerve_edu/image1.wm.png)

![角塊](image/articleImage/swerve_edu/image2.wm.png)

## 相關函式說明
### Translation2d
這個類別有一個 x 和 y 分量，代表點
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mo stretchy="false">(</mo>
  <mi>x</mi>
  <mo>,</mo>
  <mi>y</mi>
  <mo stretchy="false">)</mo>
</math>
或向量
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mrow data-mjx-texclass="INNER">
    <mo data-mjx-texclass="OPEN">[</mo>
    <mtable columnspacing="1em" rowspacing="4pt">
      <mtr>
        <mtd>
          <mi>x</mi>
        </mtd>
      </mtr>
      <mtr>
        <mtd>
          <mi>y</mi>
        </mtd>
      </mtr>
    </mtable>
    <mo data-mjx-texclass="CLOSE">]</mo>
  </mrow>
</math>
在二維座標系上

### Rotation2d
這類有一個角度分量，表示機器人相對於二維座標系上的軸的旋轉，正旋轉(>0)為逆時針旋轉

### PIDController
![PID](image/articleImage/swerve_edu/image3.wm.png)
* `enableContinuousInput(minimumInput, maximumInput)` 輸入最小的值(minimumInput)，輸入最大的值(maximumInput)<br>
    使用角度做運算為-180, 180<br>
    使用弧度做運算為-Math.PI, Math.PI
* `calculate(a, b)` a為當前的值(measurement)，b為目標值(setPoint)

### 轉換係數公式
* 速度係數轉換：
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>c</mi>
  <mi>o</mi>
  <mi>n</mi>
  <mi>v</mi>
  <mi>e</mi>
  <mi>r</mi>
  <mi>s</mi>
  <mi>i</mi>
  <mi>o</mi>
  <mi>n</mi>
  <mo>=</mo>
  <mi>w</mi>
  <mi>h</mi>
  <mi>e</mi>
  <mi>e</mi>
  <mi>l</mi>
  <mi>D</mi>
  <mi>i</mi>
  <mi>a</mi>
  <mi>m</mi>
  <mi>e</mi>
  <mi>t</mi>
  <mi>e</mi>
  <mi>r</mi>
  <mo>&#xD7;</mo>
  <mn>2</mn>
  <mo>&#xD7;</mo>
  <mfrac>
    <mn>1</mn>
    <mrow>
      <mi>g</mi>
      <mi>e</mi>
      <mi>a</mi>
      <mi>r</mi>
      <mi>R</mi>
      <mi>a</mi>
      <mi>t</mi>
      <mi>i</mi>
      <mi>o</mi>
    </mrow>
  </mfrac>
  <mo>&#xD7;</mo>
  <mi>&#x3C0;</mi>
  <mo>&#xF7;</mo>
  <mn>60</mn>
</math><br>
* 角度係數轉換：
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>c</mi>
  <mi>o</mi>
  <mi>n</mi>
  <mi>v</mi>
  <mi>e</mi>
  <mi>r</mi>
  <mi>s</mi>
  <mi>i</mi>
  <mi>o</mi>
  <mi>n</mi>
  <mo>=</mo>
  <mi>w</mi>
  <mi>h</mi>
  <mi>e</mi>
  <mi>e</mi>
  <mi>l</mi>
  <mi>D</mi>
  <mi>i</mi>
  <mi>a</mi>
  <mi>m</mi>
  <mi>e</mi>
  <mi>t</mi>
  <mi>e</mi>
  <mi>r</mi>
  <mo>&#xD7;</mo>
  <mn>2</mn>
  <mo>&#xD7;</mo>
  <mfrac>
    <mn>1</mn>
    <mrow>
      <mi>g</mi>
      <mi>e</mi>
      <mi>a</mi>
      <mi>r</mi>
      <mi>R</mi>
      <mi>a</mi>
      <mi>t</mi>
      <mi>i</mi>
      <mi>o</mi>
    </mrow>
  </mfrac>
  <mo>&#xD7;</mo>
  <mi>&#x3C0;</mi>
</math>

### 單位轉換公式
* Rotation to Degrees(程式上可用Units轉換)<br><br>
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>D</mi>
  <mi>e</mi>
  <mi>g</mi>
  <mi>r</mi>
  <mi>e</mi>
  <mi>e</mi>
  <mi>s</mi>
  <mo>=</mo>
  <mi>R</mi>
  <mi>o</mi>
  <mi>t</mi>
  <mi>a</mi>
  <mi>t</mi>
  <mi>i</mi>
  <mi>o</mi>
  <mi>n</mi>
  <mo>&#xD7;</mo>
  <mn>360.0</mn>
</math><br>
* Degrees to Radian(程式上可用Units轉換)<br><br>
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>R</mi>
  <mi>a</mi>
  <mi>d</mi>
  <mi>i</mi>
  <mi>a</mi>
  <mi>n</mi>
  <mo>=</mo>
  <mi>D</mi>
  <mi>e</mi>
  <mi>g</mi>
  <mi>r</mi>
  <mi>e</mi>
  <mi>e</mi>
  <mi>s</mi>
  <mo>&#xD7;</mo>
  <mi>&#x3C0;</mi>
  <mo>&#xF7;</mo>
  <mn>180.0</mn>
</math><br>
* RPM(每分鐘轉速) to m/s(公尺每秒)<br><br>
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>V</mi>
  <mi>e</mi>
  <mi>l</mi>
  <mi>o</mi>
  <mi>c</mi>
  <mi>i</mi>
  <mi>t</mi>
  <mi>y</mi>
  <mo>=</mo>
  <mi>W</mi>
  <mi>h</mi>
  <mi>e</mi>
  <mi>e</mi>
  <mi>l</mi>
  <mi>R</mi>
  <mi>a</mi>
  <mi>d</mi>
  <mi>i</mi>
  <mi>u</mi>
  <mi>s</mi>
  <mo>&#xD7;</mo>
  <mn>2</mn>
  <mo>&#xD7;</mo>
  <mi>&#x3C0;</mi>
  <mo>&#xD7;</mo>
  <mi>R</mi>
  <mi>P</mi>
  <mi>M</mi>
  <mo>&#xF7;</mo>
  <mn>60</mn>
</math>


## Constants參數設定
### Swerve Constants
```java
TRACK_WIDTH = 0.62                                  // Swerve寬度(公尺)
TRACK_LENGTH = 0.62                                 // Swerve長度(公尺)
WHEEL_RADIUS = 0.0508                               // 輪子半徑(公尺)
PHYSICAL_MAX_SPEED_METERS_PER_SECOND = 3.0          // 最大速度m/s
PHYSICAL_MAX_ACCELERATION_METERS_PER_SECONE = 1.0   // 最大加速度m/s^2
DRIVE_GEAR_RATIO = 57.0 / 7.0                       // 齒輪比
MAX_VOLTAGE = 20                                    // 限制最大電壓
DRIVE_VELOCITY_CONVERSION_FACTOR = WHEEL_RADIUS * 2 / DRIVE_GEAR_RATIO * Math.PI / 60  // Drive速度換算係數
DRIVE_POSITION_CONVERSION_FACTOR = WHEEL_RADIUS * 2 / DRIVE_GEAR_RATIO * Math.PI       // Drive角度換算係數
```
### Motor Reverse Constants
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
```java
FRONT_LEFT = true;          // 左前
FRONT_RIGHT = true;         // 右前
BACK_LEFT = true;           // 左後
BACK_RIGHT = true;          // 右後
```

### Swerve Drive Kinematics
```java
SwerveDriveKinematics swerveDriveKinematics = new SwerveDriveKinematics(
    new Translation2d(Constants.SwerveConstants.TRACK_LENGTH / 2, Constants.SwerveConstants.TRACK_WIDTH / 2),
    new Translation2d(Constants.SwerveConstants.TRACK_LENGTH / 2, -Constants.SwerveConstants.TRACK_WIDTH / 2),
    new Translation2d(-Constants.SwerveConstants.TRACK_LENGTH / 2, Constants.SwerveConstants.TRACK_WIDTH / 2),
    new Translation2d(-Constants.SwerveConstants.TRACK_LENGTH / 2, -Constants.SwerveConstants.TRACK_WIDTH / 2)
)
```

## Device設備ID
### 馬達
```java
frontLeftDrive = 2;
frontRightDrive = 6;
backLeftDrive = 4;
backRightDrive = 7;

frontLeftTurn = 1;
frontRightTurn = 5;
backLeftTurn = 3;
backRightTurn = 8;
```
### Encoder
```java
frontLeft = 9;
frontRight = 10;
backLeft = 11;
backRight = 12;
```

## Spark Lib
於 `robot` 資料夾創建 `lib` 資料夾並新增 `SwerveSpark.java`
```java
package frc.robot.lib;

import com.revrobotics.CANSparkMax;

import frc.robot.Constants.SwerveConstants;

public class SwerveSpark extends CANSparkMax {
    public SwerveSpark(int motorPort, boolean reverse) {
        super(motorPort, MotorType.kBrushless);
        this.restoreFactoryDefaults();
        this.setInverted(reverse);
        this.setIdleMode(IdleMode.kBrake);
        this.setSmartCurrentLimit(SwerveConstants.MAX_VOLTAGE);
    }
}

```

## Module 撰寫
1. 以一個角塊為單位撰寫Module，先創建 **Drive** 和 **Turn** 馬達
2. 創建Module所需物件

> `Drive Encoder`使用 `RelativeEncoder` 創建

> `Turn Encoder`使用 `CANCoder` 創建

> `PIDController` 用於控制Turn轉向

* * *

3. `Drive Encoder` 因齒輪比轉換關係需要使用函式設定(馬達轉一圈不等於輪子轉一圈)

> `setPositionConversionFactor` 角度係數轉換

> `setVelocityConversionFactor` 速度係數轉換

* * *

4. 創建3個Function，<span style="color: #ff0000">**馬達正反轉會影響數值**

> 1. 獲取 `Drive Velocity`

> 2. 獲取 `Drive Position`

> 3. 獲取 `CANCoder` 的角度

* * *

5. 創建二個可以取得角塊狀態的Method (都是運算Drive的)

> `SwerveModuleState` 運算速度

> `SwerveModulePosition` 運算角度

* * *

6. 將 Subsystem 運算完的值對馬達進行輸入

> 1. 將匯入的State使用 `SwerveModuleState.optimize` 優化轉向 (讓輪子旋轉的最遠距離為 90 度)

> 2. `Drive` 輸出：State裡面的speedMetersPerSecond(可除最大速度做速度限制)

> 3. `Turn` 輸出：使用PID將**當前角度**與**理想角度**做運算

* * *

7. 停止角塊

> `Drive` 和 `Turn` 都 `set(0)`

* * *

## Subsystem 撰寫
1. 創建四個角塊的物件
2. 使用 `AHRS` 創建Gyro(陀螺儀)並使用 `SerialPort` 進行物件創建
3. 寫一個Method寫入四個角塊的狀態

> 1. 引入一個 `SwerveModuleState` **陣列**

> 2. 使用 `SwerveDriveKinematics.desaturateWheelSpeeds` 設定上限速度(m/s)避免出現寫入馬達的值>1.0

> 3. 將 `states` **陣列** 分別的速度寫至各個角塊

4. 寫一個Method將搖桿的值寫入，並轉換為 `SwerveModuleState`

> 1. 先引入 `xSpeed`(左右), `ySpeed`(前後), `rotationSpeed`(旋轉), `field`(相對or絕對場地運動)

> 2. 創建 `SwerveModuleState` **陣列** ，並使用 `Kinematics.toSwerveModuleStates` 將搖桿值轉換為**理想**馬達狀態

> 3. **相對場地運動**使用 `ChassisSpeeds.fromFieldRelativeSpeeds` 進行轉換<br>**絕對場地運動**創建 `ChassisSpeeds` 就好了

> 4. 將轉換好的 `state` **陣列** 輸入至步驟3的Method

5. 創建一個Method停止四個角塊

## Command 撰寫
1. 在建構式裡引入 `Subsystem` 和 `Controller`(搖桿)
2. 記得 `addRequirements` Subsystem 不然會報錯
3. 將搖桿值轉換為Swerve方向 (可使用applyDeadband優化)

> 左右方向 `LeftY` <br>前後方向 `LeftX` <br>旋轉 `RightX`

4. 將搖桿值寫至 Subsystem
5. 在 `end` 中停止整台Swerve

## RobotContainer
1. 創建 `GameJoystck` `SwerveSubsystem` `SwerveDriveCmd` 物件
2. subsystem記得 `setDefaultCommand`