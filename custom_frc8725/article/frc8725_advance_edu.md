<!-- title: FRC8725 軟體培訓教學 - 進階內容 -->
<!-- description: 函式說明與其他零件使用 -->
<!-- category: Programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/08/12 -->

# 進階內容
## 馬達配置
### Phoneix5
#### CIM（VictorSPX）
* `enableVoltageCompensation(boolean)`: 電壓補償
* `configVoltageCompSaturation(double)`: 電壓輸出百分比, 例：設定為12V時, 若馬達輸出50%動力, 將嘗試產生6V
* `setInverted(boolean)`: 設定正反轉
* `setNeutralMode(NeutralMode)`: 設定馬達停止後狀態,  `kBrake` 停止後鎖住馬達, `kCoast` 停止後保持慣性
* `configFactoryDefault()`: 將所有配置恢復為預設值
* `set(VictorSPXControlMode.PercentOutput, speed)`: 馬達運轉百分比 -1 ~ 1

### Phoneix6
#### TalonFX（Falcon）
* 大部分同上
* `getPosition().getValue()`: 取得馬達旋轉角度
* `getVelocity().getValue()`: 取得馬達速度
* `set(speed)`: 馬達運轉百分比 -1 ~ 1

### SparkMax（Neo）
* `setSmartCurrentLimit(double)`:  限制馬達輸入最大電流
* `setInverted(boolean)`: 設定正反轉
* `setIdleMode(IdleMode)`: 設定馬達停止後狀態,  `kBrake` 停止後鎖住馬達, `kCoast` 停止後保持慣性
* `restoreFactoryDefaults()`: 將所有配置恢復為預設值
* `setVoltage(double)`: 設定輸入馬達電壓
* `set(double)`: 馬達運轉百分比 -1 ~ 1, 前方不須標註
* `getEncoder()` 取得 Encoder, 下方會補充說明

創建 Neo 馬達的物件時ID後方必須填馬達類型, 我們使用的是 `MotorType.kBrushless` 無刷馬達

例: `CANSparkMax(ID, MotorType.kBrushless)` 

## Encoder
### RelativeEncoder（Neo內建）
#### NEO
在宣告馬達時同時宣告一個 `RelativeEncoder` 並把此 Encoder 定義為 NEO 馬達內建的 Encoder
```java
public class DriveMotorModule {
    private final CANSparkMax motor;

    private final RelativeEncoder encoder;

    public DriveMotorModule(int motorPort, boolean reverse) {
        this.motor = new CANSparkMax(motorPort, MotorType.kBrushless);
        this.motor.setIdleMode(IdleMode.kBrake);
        this.motor.setSmartCurrentLimit(30);
        this.motor.setInverted(reverse);

        this.encoder = this.motor.getEncoder();
    }
}
```
#### Methods
* `getPosition()`: 取得角度
* `getVelocity()`: 取得速度
* `setPosition(double)`: 設定角度
* `setInverted(boolean)`: 設定正反向
* `setVelocityConversionFactor(double)` 設定速度轉換係數
    * 預設 1.0, 如果設置 2.0 則 `getVelocity()` 回傳 -2 ~ 2

* `setPositionConversionFactor(double)` 設定角度轉換係數
    * 預設 1.0, 如果設置 180 則 `getPosition()` 回傳 -180 ~ 180
* 內建Encoder較不準

### AbsoluteEncoder
#### 宣告方法
在宣告馬達時同時宣告一個 `AbsoluteEncoder` 並把Encoder定義為Neo馬達外接的Encoder
（模式為SparkAbsoluteEncoder.Type.kDutyCycle）
```java
public class DriveMotorModule {
    private final CANSparkMax motor;
    private final AbsoluteEncoder absoluteEncoder;

    public DriveMotorModule(int motorPort, boolean reverse) {
        this.motor = new CANSparkMax(motorPort, MotorType.kBrushless);
        this.motor.setIdleMode(IdleMode.kBrake);
        this.motor.setSmartCurrentLimit(30);
        this.motor.setInverted(reverse);
        this.absoluteEncoder = this.motor.getAbsoluteEncoder(SparkAbsoluteEncoder.Type.kDutyCycle);
    }
}
```
#### 函式
* `getPosition` 讀取相對角度
* `getVelocity` 讀取速度
* `setZeroOffset` 設定角度
* `setInverted` 設定正反轉
* `setPositionConversionFactor` 設定角度轉換係數
* `setVelocityConversionFactor` 設定速度轉換係數

### CANCoder
#### 宣告方法
宣告馬達時同時宣告一個 `CANCoder` 並在建構式裡面創建物件（需要ID）
```java
public class DriveMotorModule {
    private final CANSparkMax motor;
    private final CANCoder canCoder;
    private double speedOutput;

    public DriveMotorModule(int motorPort, int encoderPort, boolean reverse) {
        this.motor = new CANSparkMax(motorPort, MotorType.kBrushless);
        this.motor.setIdleMode(IdleMode.kBrake);
        this.motor.setSmartCurrentLimit(30);
        this.motor.setInverted(reverse);
        this.canCoder = new CANCoder(encoderPort);
    }
}
```
#### 函式
* `getPosition` 讀取絕對角度
* `getAbsolutePosition` 讀取相對角度
* `getVelocity` 讀取速度
* `setPosition` 設定角度
* 註：2024後在 `getPosition` 等會獲得數值的函式後需要增加 `.getValue`
    * 例 `this.canCoder.getAbsolutePosition().getValue()`

## Commands指令類別
### Command Group
#### SequentialCommandGroup
* (Command1, Command2) 1執行完執行2 指令依序執行

#### ParallelCommandGroup
* (Command1, Command2) 1&2同時執行

#### ParallelRaceGroup
* (Command1, Command2) 1&2同時執行 其中一個執行完終止全部指令

### Commands
* `Commands.run(action, requiredments)` 要執行的動作、對應的subsystem （執行到被中斷）
* `Commands.runEnd(run, runEnd, requirements) ` 要執行的動作、結束時執行的動作、對應的subsystem （運行命令直到中斷，接著運行第二個命令）
* `Commands.runOnce(action, requirements)` 要執行的動作、對應的subsystem （只執行一次操作）

### WaitCommand
* `new WaitCommand(seconds)` 不會執行任何操作，在指定持續時間後結束

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
![](image/articleImage/software_edu/image9.wm.png)

### 函式
* `getYaw` 、 `getAngle` 取得Yaw（偏擺）
* `getPitch` 取得Pitch（俯仰）
* `getRoll` 取得Roll（翻滾）
* `getRotation2d` 以Rotation2d形式傳回機器人航向
* `reset` 重置陀螺儀
* `getWorldLinearAccelX` 取得X軸線性加速度
* `getWorldLinearAccelY` 取得Y軸線性加速度
* `getWorldLinearAccelZ` 取得Z軸線性加速度

## IDashboard 安裝 & 使用方法
### 介紹
原本SmartDashboard函式需要執行到才會更新數值
可用裡面的 `putDashboard` 方法 刷進RoboRIO時也可刷新（不須enable）
### 安裝
1. 於 `src\main\java\frc\robot` 創建一個名為 `lib` 的資料夾
2. 於 `lib` 資料夾底下創建 `IDashboardProvider.java` 並寫入以下程式
```java
package frc.robot.lib;

public interface IDashboardProvider {
    void putDashboard();

    default void registerDashboard() {
        DashboardHelper.register(this);
    }
}
```
3. 於 `lib` 資料夾底下創建 `DashboardHelper.java` 並寫入以下程式
```java
package frc.robot.lib;

import java.util.ArrayList;

import edu.wpi.first.wpilibj.DriverStation;

public final class DashboardHelper {
    private static final ArrayList<IDashboardProvider> providers = new ArrayList<>();
    private static boolean isRegistrationValid = false;


    public static void register(IDashboardProvider provider) {
        if (isRegistrationValid) {
            providers.add(provider);
        } else {
            DriverStation.reportWarning("Found dashboard registries when DashboardHelper is invalid!", true);
        }
    }

    public static void putAllRegistries() {
        providers.forEach(IDashboardProvider::putDashboard);
    }

    public static void enableRegistration() {
        providers.clear();
        isRegistrationValid = true;
    }

    public static void disableRegistration() {
        isRegistrationValid = false;
    }
}
```
4. 找到 `src\main\java\frc\robot` 的 `Robot.java`
5. 將 `robotInit` 方法裡的程式改為
```java
DashboardHelper.enableRegistration();
m_robotContainer = new RobotContainer();
DashboardHelper.disableRegistration();
```
6. 將 `robotPeriodic` 方法裡的程式改為
```java
CommandScheduler.getInstance().run();
DashboardHelper.putAllRegistries();
```

### 使用方法
1. 在類別後面增加 `implements IDashboardProvider` 
例：`public class DriveMotorModule implements IDashboardProvider {...}`
2. 在建構式裡面寫上 `this.registerDashboard()` 註冊Dashboard
3. 並在類別裡面的任意地方寫上
```java
@Override
public void putDashboard() {
        
}
```
裡面可放需要的SmartDashboard函式