<!-- title: FRC8725 軟體培訓教學 - 進階內容 -->
<!-- description: 函式說明與其他零件使用 -->
<!-- category: programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2023/11/06 -->

# 進階內容
## 馬達配置
### CTRE
#### CIM & TalonFX 皆可使用
* `enableVoltageCompensation(boolean)`: 電壓補償
* `configVoltageCompSaturation(double)`: 電壓輸出百分比, 例：設定為12V時, 若馬達輸出50%動力, 將嘗試產生6V
* `setInverted(boolean)`: 設定正反轉
* `setNeutralMode(NeutralMode)`: 設定馬達停止後狀態,  `kBrake` 停止後鎖住馬達, `kCoast` 停止後保持慣性
* `configFactoryDefault()`: 將所有配置恢復為預設值
* `set(TalonFXControlMode, double)`: 馬達運轉百分比 -1 ~ 1

若為 CIM 馬達需在數值前面標註 `VictorSPXControlMode.PercentOutput`

若為 TalonFX 需標註 `TalonFXControlMode.PercentOutput`

例：`set(TalonFXControlMode.PercentOutput, 1)`

#### 僅TalonFX 可使用

* `getSelectedSensorPosition()`: 取得馬達旋轉角度
* `getSelectedSensorVelocity()`: 取得馬達速度

### REV

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
### RelativeEncoder
#### NEO
在宣告馬達時同時宣告一個 `RelativeEncoder` 並把此 Encoder 定義為 NEO 馬達內建的 Encoder
```java
public class DriveMotorModule {
    private final CANSparkMax motor;

    private final RelativeEncoder mEncoder;

    public DriveMotorModule(int motorPort, boolean reverse) {
        this.motor = new CANSparkMax(motorPort, MotorType.kBrushless);
        this.motor.setIdleMode(IdleMode.kBrake);
        this.motor.setSmartCurrentLimit(30);
        this.motor.setInverted(reverse);

        this.mEncoder = this.motor.getEncoder();

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