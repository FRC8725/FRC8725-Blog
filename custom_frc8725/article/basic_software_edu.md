<!-- title: FRC8725 軟體培訓教學 - 程式撰寫 -->
<!-- description: 類比搖桿控制單一馬達 -->
<!-- category: Basic -->
<!-- tags: Programming -->
<!-- published time: 2024/03/18 -->
<!-- cover: <?=customDirPath?>/image/articleCover/frc8725_software_edu_cover.jpg -->

# 程式撰寫
## 建立新專案
1. 在安裝 WPILIB 的 Vscode 中, 按下 F1 鍵, 使指令區出現於上方
2. 在指令區中輸入 `` > WPILib: Create a new project ``
3. 填寫以下資訊
    1. 輸入 Example (範例程式) 或 Template (只提供模板) `Template`
    2. 選擇程式語言 (java或cpp) `Java`
    3. 選擇專案控制方式 (Time Robot、 Command Robot等) `Command Robot`
    4. 選擇存檔位置
    5. 專案名稱
    6. 是否以資料夾方式儲存? `勾選`
    7. 輸入隊號 `8725`
    8. 確認第三方軟件是否全部支援 WPILib 的相關物件(由於可能有部分軟件無法支援, 會造成崩潰, 因此此區<span style="color: #e06c53">請勿勾選</span>)

4. 確認資訊無誤後, 點選 `Generate Project` 選擇 `Yes（New Window）`

![](image/articleImage/software_edu/image3.wm.png)

## 函式庫安裝
由於要撰寫來自不同經銷商(Vendor)控制器, 因此需要下載其函示庫
1. 搜尋 WPILib vendor libraries 或是前往 [3rd Party Libraries](https://docs.wpilib.org/en/stable/docs/software/vscode-overview/3rd-party-libraries.html#libraries)
2. 複製該函式庫的網址
3. 至 Vscode 按下 `Ctrl+Shift+p` 進行指令搜尋 `Manage Vendor Libraries`
4. 選擇 `Install new libraries(online)` 並貼上剛剛複製的網址, 跳出 build 時請按確定
5. 函式庫安裝完成

函式庫網址

* NavX2（陀螺儀）<br>
https://dev.studica.com/releases/2024/NavX.json

* REVLib（Neo）<br>
https://software-metadata.revrobotics.com/REVLib-2024.json

* Phoenix 6（TalonFX）<br>
https://maven.ctr-electronics.com/release/com/ctre/phoenix6/latest/Phoenix6-frc2024-latest.json

* Phoenix 5 （VictorSPX） <br>
https://maven.ctr-electronics.com/release/com/ctre/phoenix/Phoenix5-frc2024-latest.json

## Command robot
### 檔案之間關係
![](image/articleImage/software_edu/image8.wm.png)

### 資料夾結構
![](image/articleImage/software_edu/image5.wm.png)

### 機器人坐標系
![](image/articleImage/software_edu/image12.wm.png)

## 常數設置

1. 於 `src\main\java\frc\robot\` 創建 `DeviceId.java`, 用於紀錄馬達ID（編號）
```java
package frc.robot;

public class DeviceId {
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
2. 於 `src\main\java\frc\robot\` 創建 `GamepadJoystick.java`, 用於搖桿操作

```java
package frc.robot;

import edu.wpi.first.wpilibj.XboxController;

public class GamepadJoystick extends XboxController {
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
1. 先安裝 [Phonix 6 Library](https://frc8725.github.io/FRC8725-Blog/?page=article&article=frc8725_software_edu&anchor=h-%E5%87%BD%E5%BC%8F%E5%BA%AB%E5%AE%89%E8%A3%9D) 再安裝 [Phonix 5 Library](https://frc8725.github.io/FRC8725-Blog/?page=article&article=frc8725_software_edu&anchor=h-%E5%87%BD%E5%BC%8F%E5%BA%AB%E5%AE%89%E8%A3%9D) (有安裝過就不用)
2. 於 `src\main\java\frc\robot\subsystems` 創建 `Cim.java` 用於控制馬達
3. 引入函式庫

```java
package frc.robot.subsystems;

import com.ctre.phoenix.motorcontrol.NeutralMode;
import com.ctre.phoenix.motorcontrol.VictorSPXControlMode;
import com.ctre.phoenix.motorcontrol.can.VictorSPX;

import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.SubsystemBase;
import frc.robot.Constants;
import frc.robot.DeviceId;
```

3. 創建 `DriveMotorSubsystem` 類別, 以 VictorSPX 宣告一顆 CIM 馬達
4. 寫入 移動 `move` 與停止 `stop` 方法

```java
public class Cim extends SubsystemBase {
    private final VictorSPX motor;

    public Cim() {
        this.motor = new VictorSPX(DeviceId.CIM.motor);
        this.motor.enableVoltageCompensation(true); // 是否啟用電壓補償
        this.motor.configVoltageCompSaturation(15.0); // 電壓輸出百分比
        this.motor.setNeutralMode(NeutralMode.Brake); // Brake 停止後鎖住馬達, Coast 停止後保持慣性
        this.motor.setInverted(false); // 是否反轉
    }

    public void move(double speed) {
        this.motor.set(VictorSPXControlMode.PercentOutput, speed * Constants.MAX_DRIVE_SPEED);
        SmartDashboard.putNumber("CIM Speed", speed * Constants.MAX_DRIVE_SPEED); // 輸出速度到 SmartDashboard 
    }

    public void stop() {
        this.motor.set(VictorSPXControlMode.PercentOutput, 0.0);
    }
}
```

### NEO 馬達
1. 先安裝 [REVLib](https://frc8725.github.io/FRC8725-Blog/?page=article&article=frc8725_software_edu&anchor=h-%E5%87%BD%E5%BC%8F%E5%BA%AB%E5%AE%89%E8%A3%9D) (有安裝過就不用)
2. 於 `src\main\java\frc\robot\subsystems` 創建 `Neo.java` 用於控制馬達
3. 引入函式庫

```java
package frc.robot.subsystems;

import com.revrobotics.CANSparkMax;
import com.revrobotics.CANSparkBase.IdleMode;
import com.revrobotics.CANSparkLowLevel.MotorType;

import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.SubsystemBase;
import frc.robot.Constants;
import frc.robot.DeviceId;
```
3. 創建 `Neo` 類別, 以 CANSparkMax 宣告一顆 NEO 馬達
4. 寫入 移動 `move` 與停止 `stop` 方法

```java
public class Neo extends SubsystemBase {
    private final CANSparkMax motor;

    public Neo() {
        this.motor = new CANSparkMax(DeviceId.Neo.motor, MotorType.kBrushless);
        this.motor.setSmartCurrentLimit(30); // 電流限制
        this.motor.setInverted(false);  // 是否反轉
        this.motor.setIdleMode(IdleMode.kBrake); // kBrake 停止後鎖住馬達, kCoast 停止後保持慣性
    }

    public void move(double speed) {
        this.motor.set(speed * Constants.MAX_DRIVE_SPEED);
        SmartDashboard.putNumber("Neo Speed", speed * Constants.MAX_DRIVE_SPEED); // 輸出速度到 SmartDashboard 
    }

    public void stop() {
        this.motor.stopMotor();
    }
}
```

### TalonFX 馬達
又或者是 Falcon 馬達

1. 先安裝 [Phonix 6 Library](https://frc8725.github.io/FRC8725-Blog/?page=article&article=frc8725_software_edu&anchor=h-%E5%87%BD%E5%BC%8F%E5%BA%AB%E5%AE%89%E8%A3%9D) (有安裝過就不用)
2. 於 `src\main\java\frc\robot\subsystems` 創建 `Talon.java` 用於控制馬達
3. 引入函式庫

```java
package frc.robot.subsystems;

import com.ctre.phoenix6.hardware.TalonFX;
import com.ctre.phoenix6.signals.NeutralModeValue;

import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.SubsystemBase;
import frc.robot.Constants;
import frc.robot.DeviceId;
```
3. 創建 DriveMotorSubsystem 類別, 以TalonFX宣告一顆Talon馬達
4. 寫入 移動 `move` 與停止 `stop` 方法

```java
public class Talon extends SubsystemBase {
    private final TalonFX motor;

    public Talon() {
        this.motor = new TalonFX(DeviceId.Talon.motor);
        this.motor.setInverted(false); // 是否反轉
        this.motor.setNeutralMode(NeutralModeValue.Brake); // Brake 停止後鎖住馬達, Coast 停止後保持慣性
    }

    public void move(double speed) {
        SmartDashboard.putNumber("Talon Speed", speed * Constants.MAX_DRIVE_SPEED);
        this.motor.set(speed * Constants.MAX_DRIVE_SPEED);
    }

    public void stop() {
        this.motor.stopMotor();
    }
}

```

## 搖桿控制
1. 右鍵 `commands` 資料夾點 `create new class/command` 選 `command` 輸入 `MotorCmd`
2. 引入函式庫

```java
package frc.robot.commands;

import edu.wpi.first.wpilibj.XboxController;
import edu.wpi.first.wpilibj2.command.Command;
import frc.robot.subsystems.Cim;
import frc.robot.subsystems.Neo;
import frc.robot.subsystems.Talon;
```

2. 宣告 subsystem 和搖桿函式庫

```java
// 讓 class 以官方的 Command 函式庫擴充
public class MotorCmd extends Command {
	private final Cim cimSubsystem;
	private final Neo neoSubsystem;
	private final Talon talonSubsystem;
	private final XboxController controller;

	public MotorCmd(Cim cimSubsystem, Neo neoSubsytem, Talon talonSubsystem, XboxController controller) {
		this.cimSubsystem = cimSubsystem;
		this.neoSubsystem = neoSubsytem;
		this.talonSubsystem = talonSubsystem;
		this.controller = controller;
		this.addRequirements(this.cimSubsystem, this.neoSubsystem, this.talonSubsystem);
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
        this.cimSubsystem.move(speed);
		this.neoSubsystem.move(speed);
		this.talonSubsystem.move(speed);
    }

    @Override
    public void end(boolean interrupted) {
        this.cimSubsystem.stop();
		this.neoSubsystem.stop();
		this.talonSubsystem.stop();
    }

    @Override
    public boolean isFinished() {
        return false;
    }
```

4. 找到 `RobotContainer.java` , 並且引入剛剛寫好的 `Subsystem` 檔案, 以及 `GamepadJoystick`

```java
package frc.robot;

import edu.wpi.first.wpilibj2.command.Command;
import frc.robot.commands.MotorCmd;
import frc.robot.subsystems.CimSubsystem;
import frc.robot.subsystems.NeoSubsystem;
import frc.robot.subsystems.TalonSubsystem;
```

5. 宣告一個機構模組(Subsystem)與搖桿, 並在 Container 中進行搖　桿值的讀取傳入機構模組的函式中執行
```java
public class RobotContainer {
	private final GamepadJoystick joystick = new GamepadJoystick(GamepadJoystick.CONTROLLER_PORT);

	private final CimSubsystem cimSubsystem = new CimSubsystem();
	private final NeoSubsystem neoSubsystem = new NeoSubsystem();
	private final TalonSubsystem talonSubsystem = new TalonSubsystem();

	private final MotorCmd motorCmd = new MotorCmd(cimSubsystem, neoSubsystem, talonSubsystem, joystick);

	public RobotContainer() {
		this.cimSubsystem.setDefaultCommand(this.motorCmd);
		this.neoSubsystem.setDefaultCommand(this.motorCmd);
		this.talonSubsystem.setDefaultCommand(this.motorCmd);
		this.configureBindings();
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
2. **<span style="color: #ff5555">CAN 接線無誤 </span>**,  RoboRIO 連接正常
3. 關閉防火牆(非必要)
4. **Shift + F5** 上傳程式, 出現 <span style="color: #6ce26c">BUILD SUCCESSFUL </span> 代表上傳完成
5. 連接搖桿進行測試


### 關閉防火牆
在上傳程式碼或操控 RoboRIO 時才需要(其實不需要)

#### 使用 Windows 批次檔
1. 在隨意路徑下創建一個資料夾
2. 創建並編輯一個bat檔, 負責切換防火牆開關
3. 輸入以下內容
```bat
@echo off
color 0B
cls
echo ==============================
echo      Toggle Firewall  
echo ==============================
echo Checking firewall status...
ping 127.0.0.1 -n 2 >nul
echo.
echo Please wait...
netsh advfirewall show allprofiles state | find "ON" >nul
if %errorlevel%==0 (
    echo.
    echo Firewall is currently ON.
    echo Turning it OFF...
    netsh advfirewall set allprofile state off
    echo.
    color 0C
    echo Firewall is now OFF.
) else (
    echo.
    echo Firewall is currently OFF.
    echo Turning it ON...
    netsh advfirewall set allprofile state on
    echo.
    color 0A
    echo Firewall is now ON.
)
ping 127.0.0.1 -n 2 >nul
echo.
echo ==============================
echo Current Firewall Status:
netsh advfirewall show allprofiles state
echo ==============================
echo.
echo Closing ...
timeout /t 2 /nobreak >nul
exit
```

![](image/articleImage/software_edu/image6.wm.png)

#### 使用 Windows Defender 防火牆內容

1. 按下 windows建, 尋找「具有進階安全性的 Windows 防火牆」

![](image/articleImage/software_edu/image7.wm.png)

2. 點擊 `Windows Defender 防火牆內容`
3. 將「網域設定檔、私人設定檔、公用設定檔」的「防火牆狀態」調整為關閉, 三區皆調整完後按下「確定」

![](image/articleImage/software_edu/image1.wm.png)

⚠️<span style="color: #e06c53">請注意!! 為了保護電腦的安全, 務必在結束活動、使用完畢後, 將防火牆設定用上述設定方式再度開啟。</span>