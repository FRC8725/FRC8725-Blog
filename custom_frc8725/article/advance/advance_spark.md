<!-- title: 進階內容 SparkMax -->
<!-- description: SparkMax -->
<!-- category: Advance -->
<!-- tags: Programming -->
<!-- published time: 2024/03/23 -->

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
