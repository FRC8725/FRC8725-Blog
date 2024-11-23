<!-- title: 進階內容 Encoder -->
<!-- description: Encoder -->
<!-- category: Advance -->
<!-- tags: Programming -->
<!-- published time: 2024/03/23 -->

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