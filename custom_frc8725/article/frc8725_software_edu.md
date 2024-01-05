<!-- title: FRC8725 軟體培訓教學 -->
<!-- description: 如何讓機器人動起來 -->
<!-- category: programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2023/09/08 -->
<!-- cover: <?=customDirPath?>/image/articleCover/frc8725_software_edu_cover.jpg -->

# 安裝環境
## WPILib 安裝
會附上 Vscode

搜尋 wpilib+年分 或是前往 [WPILib Installation Guide](https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-2/wpilib-setup.html) 下載符合自己作業系統的檔案

完成下載後 
1. 開啟 iso 檔
2. 執行 `WPIlibInstaller.exe` -> `其他資訊` -> `仍要執行`
3. 跟著 Inastaller 的指示做

安裝類型選擇 `Download for this computer only(fastest)`

API Docs 
[Java](https://github.wpilib.org/allwpilib/docs/release/java/index.html) 
[C++](https://github.wpilib.org/allwpilib/docs/release/cpp/index.html)

## Frc game tools(NI) 安裝
包含 Roborio Imaging 以及 Driver Station

搜尋 FRC game tools 加年分或是前往 [FRC Game Tools Download](https://www.ni.com/zh-tw/support/downloads/drivers/download.frc-game-tools.html#479842) 選擇當年度的工具
(若原本已經有 FRC game tools 的只需要安裝新檔即可，更新時會自動覆蓋)

## 刷機用程式安裝
[CTRE phoenix](https://store.ctr-electronics.com/software/)

[REV Hardware Client](https://docs.revrobotics.com/rev-hardware-client/)

# 程式撰寫
## 建立新專案
1. 在安裝 WPILIB 的 Vscode 中，按下 F1 鍵，使指令區出現於上方
2. 在指令區中輸入 `` > WPILib: Create a new project ``
3. 填寫以下資訊
    1. 輸入 Example (範例程式) 或 Template (只提供模板) `[Template]`
    2. 選擇程式語言 (java或cpp) `[Java]`
    3. 選擇專案控制方式 (Time Robot、 Command Robot等) `[Command Robot]`
    4. 選擇存檔位置
    5. 專案名稱
    6. 是否以資料夾方式儲存? `[勾選]`
    7. 輸入隊號 `[8725]`
    8. 確認第三方軟件是否全部支援 WPILib 的相關物件(由於可能有部分軟件無法支援，會造成崩潰，因此此區<span style="color: #e06c53">請勿勾選</span>)

4. 確認資訊無誤後，點選 `Generate Project` 選擇 `Yes（New Window）`

![](image/articleImage/frc8725_software_edu_image3.wm.png)

## 函式庫安裝
由於要撰寫來自不同經銷商(Vendor)控制器，因此需要下載其函示庫
1. 搜尋 WPILib vendor libraries 或是前往 [3rd Party Libraries](https://docs.wpilib.org/en/stable/docs/software/vscode-overview/3rd-party-libraries.html#libraries)
2. 複製該函式庫的網址
3. 至 Vscode 按下 `ctrl+shift+p` 進行指令搜尋 `Manage Vendor Libraries`
4. 選擇 `install new libraries(online)` 並貼上剛剛複製的網址，跳出 build 時請按確定
5. 函式庫安裝完成

函式庫網址

* NavX2（陀螺儀）<br>
https://dev.studica.com/releases/2023/NavX.json

* REVLib（Neo）<br>
https://software-metadata.revrobotics.com/REVLib-2023.json

* Phoenix（CIM & TalonFX）<br>
https://maven.ctr-electronics.com/release/com/ctre/phoenix/Phoenix5-frc2023-latest.json

## Command robot
### 檔案之間關係
![](image/articleImage/frc8725_software_edu_image4.wm.png)

### 資料夾結構
![](image/articleImage/frc8725_software_edu_image5.wm.png)

## 常數設置

1. 於 `src\main\java\frc\robot\` 創建 `robotMap.java`，用於紀錄馬達ID（編號）
```java
package frc.robot;

public class robotMap {
    public static final class CIM {
        public static final int motor = 1;
    }
    public static final class Neo {
        public static final int motor = 2;
    }
    public static final class Talon {
        public static final int motor = 3;
    }
}

```
2. 於 `src\main\java\frc\robot\` 創建 `GamepadJoystick.java`，用於搖桿操作

```java
package frc.robot;

import edu.wpi.first.wpilibj.XboxController;

public class GamepadJoystick extends XboxController{
    public GamepadJoystick(int port) {
        super(port);
    }
    public static final int CONTROLLER_PORT = 0;
}

```

3. 於 `src\main\java\frc\robot\Constants.java` 中寫入馬達輸出最大值
```java
package frc.robot;

public final class Constants {
    public static final double MAX_DRIVE_SPEED = 0.7;
}
```

## 馬達控制 （僅一顆）
### CIM 馬達
1. 於 `src\main\java\frc\robot\subsystems` 創建 DriveMotorSubsystem.java 用於控制馬達
2. 引入函式庫

```java
package frc.robot.subsystems;

import com.ctre.phoenix.motorcontrol.NeutralMode;
import com.ctre.phoenix.motorcontrol.VictorSPXControlMode;
import com.ctre.phoenix.motorcontrol.can.VictorSPX;

import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import frc.robot.Constants;
import frc.robot.robotMap;
```

3. 創建 `DriveMotorSubsystem` 類別，以 PWMVictorSPX 宣告一顆 CIM 馬達
4. 寫入 移動 `move` 與停止 `stop` 方法

```java
public class DriveMotorSubsystem extends SubsystemBase {

    private PWMVictorSPX Motor;
    private double speed_input;

    public DriveMotorSubsystem() {

        this.Motor = new PWMVictorSPX(robotMap.CIM.motor);
        this.Motor.setInverted(false); // 是否反轉
        
    }

    public move(double speed) {
        this.motor.set(VictorSPXControlMode.PercentOutput, speed * Constants.MAX_DRIVE_SPEED);
        SmartDashboard.putNumber("CIM Speed", speed * Constants.MAX_DRIVE_SPEED); // 輸出速度到 SmartDashboard 
    }

    public stop() {
        this.motor.set(VictorSPXControlMode.PercentOutput, 0.0);
    }
}
```

### NEO 馬達
1. 於 `src\main\java\frc\robot\subsystems` 創建 DriveMotorSubsystem.java 用於控制馬達
2. 引入函式庫

```java
package frc.robot.subsystems;

import com.revrobotics.CANSparkMax;
import com.revrobotics.CANSparkMax.IdleMode;
import com.revrobotics.CANSparkMaxLowLevel.MotorType;

import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import frc.robot.Constants;
import frc.robot.robotMap;
```
3. 創建 `DriveMotorSubsystem` 類別，以 CANSparkMax 宣告一顆 NEO 馬達
4. 寫入 移動 `move` 與停止 `stop` 方法

```java
public class DriveMotorSubsystem extends SubsystemBase {
    private final CANSparkMax motor;

    public DriveMotorSubsystem() {
        this.motor = new CANSparkMax(robotMap.NEO.motor, MotorType.kBrushless);
        this.motor.setSmartCurrentLimit(30); // 電流限制
        this.motor.setInverted(false);  // 是否反轉
        this.motor.setIdleMode(IdleMode.kBrake); // kBrake 停止後鎖住馬達, kCoast 停止後保持慣性
    }

    public move(double speed) {
        this.motor.set(speed * Constants.MAX_DRIVE_SPEED);
        SmartDashboard.putNumber("CIM Speed", speed * Constants.MAX_DRIVE_SPEED); // 輸出速度到 SmartDashboard 
    }

    public stop() {
        this.motor.set(0.0);
    }
}
```

### Talon 馬達 (Falcon)
1. 於 `src\main\java\frc\robot\subsystems` 創建 DriveMotorSubsystem.java 用於控制馬達
2. 引入函式庫

```java
package frc.robot.subsystems;

import com.ctre.phoenix.motorcontrol.NeutralMode;
import com.ctre.phoenix.motorcontrol.TalonFXControlMode;
import com.ctre.phoenix.motorcontrol.can.TalonFX;

import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import frc.robot.Constants;
import frc.robot.robotMap;
```
3. 創建 DriveMotorSubsystem 類別，以TalonFX宣告一顆Talon馬達
4. 寫入 移動 `move` 與停止 `stop` 方法

```java
public class DriveMotorSubsystem extends SubsystemBase {
    private final TalonFX motor;

    public DriveMotorSubsystem() {
        this.motor = new TalonFX(robotMap.Talon.motor);
        this.motor.enableVoltageCompensation(true);
        this.motor.configVoltageCompSaturation(30);
        this.motor.setInverted(false); // 是否反轉
        this.motor.setNeutralMode(NeutralMode.Brake); // kBrake 停止後鎖住馬達, kCoast 停止後保持慣性
    }

    public void move(double speed) {
        SmartDashboard.putNumber("Speed", speed * Constants.MAX_DRIVE_SPEED);
        this.motor.set(TalonFXControlMode.PercentOutput, speed * Constants.MAX_DRIVE_SPEED);
    }

    public void stop() {
        this.motor.set(TalonFXControlMode.PercentOutput, 0.0);
    }
}
```

## 搖桿控制
1. 於 src\main\java\frc\robot\commands 創建 DriveJoystickCmd.java
2. 引入函式庫

```java
package frc.robot.commands;

import edu.wpi.first.wpilibj.XboxController;
import edu.wpi.first.wpilibj2.command.CommandBase;
import frc.robot.subsystems.DriveMotorSubsystem;
```

2. 宣告 subsystem 和搖桿函式庫

```java
// 讓 class 以官方的 CommandBase 函式庫擴充
public class DriveJoystickCmd extends CommandBase {
    private final DriveMotorSubsystem driveMotorSubsystem;
    private final XboxController controller;

    public DriveJoystickCmd(DriveMotorSubsystem driveMotorSubsystem, XboxController controller) {
        this.driveMotorSubsystem = driveMotorSubsystem;
        this.controller = controller;
	
	    addRequirements(this.driveMotorSubsystem);
    }
}
```

3. 透過覆寫取搖桿值與呼叫 Command 的前進函式 
    1. `initialize()`, 開始時執行一次；
    2. `execute()` , 重複直到停止；
    3. `end()`, 停止時執行一次；
    4. `isFinished()`, 寫入要停止的條件然後回傳 `true`, 如果不停止則直接回傳 `false`

```java
    @Override
    public void initialize() {}

    @Override
    public void execute() {
        double speed = this.controller.getLeftY();
        this.driveMotorSubsystem.move(speed);
    }

    @Override
    public void end(boolean interrupted) {
        this.driveMotorSubsystem.stopModules();
    }

    @Override
    public boolean isFinished() {
        return false;
    }
```

4. 找到 `RobotContainer.java` ，並且引入剛剛寫好的 `CommandSubsystem` 檔案，以及 `GamepadJoystick()`

```java
package frc.robot;

import edu.wpi.first.wpilibj2.command.Command;
import frc.robot.commands.DriveJoystickCmd;
import frc.robot.subsystems.DriveMotorSubsystem;
```

5. 宣告一個機構模組(Subsystem)與搖桿，並在 Container 中進行搖　桿值的讀取傳入機構模組的函式中執行
```java
public class RobotContainer {

    private final GamepadJoystick controller  = new GamepadJoystick(GamepadJoystick.CONTROLLER_PORT);
    private final DriveMotorSubsystem driveMotorSubsystem = new DriveMotorSubsystem();
    private final DriveJoystickCmd driveJoystickCmd = new DriveJoystickCmd(driveMotorSubsystem, joystick);

    public RobotContainer() {
	    this.driveMotorSubsystem.setDefaultCommand(this.driveJoystickCmd);
        configureBindings();
    }

    private void configureBindings() {
        // 按鈕綁定指令
    }

    public Command getAutonomousCommand() {
        // 自動階段
	    return null;
    }
}
```

## 上傳程式
1. 確定無報錯
2. <span style="color: #ff5555">CAN 接線無誤 </span>， Roborio 連接正常
3. 關閉防火牆
4. Shift + F5 上傳程式，出現 <span style="color: #6ce26c">BUILD SUCCESSFUL </span> 代表上傳完成
5. 連接搖桿進行測試


### 關閉防火牆
在上傳程式碼或操控 Roborio 時才需要

1. 按下 windows建，尋找「具有進階安全性的 Windows 防火牆」
2. 點擊最下方的「Windows Defender 防火牆內容」
3. 接著會進入下圖介面，上方有三個設定檔
「網域設定檔、私人設定檔、公用設定檔」 將三個設定檔的「防火牆狀態」調整為關閉，三區皆調整完後按下「確定」

![](image/articleImage/frc8725_software_edu_image1.wm.png)

4. 當畫面顯示改變如下即設定成功

![](image/articleImage/frc8725_software_edu_image2.wm.png)

⚠️<span style="color: #e06c53">請注意!! 為了保護電腦的安全，務必在結束活動、使用完畢後，將防火牆設定用上述設定方式再度開啟。</span>