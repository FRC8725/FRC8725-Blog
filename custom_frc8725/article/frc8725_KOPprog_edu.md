<!-- title: FRC8725 軟體培訓教學 - KOP底盤 -->
<!-- description: 控制 KOP 底盤 -->
<!-- category: Programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/08/12 -->

# KOP底盤撰寫
使用 CIM（VictorSPX） 馬達為範例

## 常數設置
1. 於 `src\main\java\frc\robot\DeviceId.java` 寫入馬達ID（編號）
```java
package frc.robot;

public class DeviceId {
    public static final class DriveMotor {
        public static final int FRONT_LEFT = 1;
        public static final int FRONT_RIGHT = 3;
        public static final int BACK_LEFT = 2;
        public static final int BACK_RIGHT = 4;
    }
}

```

2. 於 `src\main\java\frc\robot\Constants.java` 寫入馬達前進和旋轉最大速度與 Deadband


> Deadband 用於防止搖桿無法完全歸零, 搖桿輸入需大於 Deadband 否則視為 0

```java
public static final class Drive {
    public static final double MAX_SPEED = 0.5;
    public static final double MAX_TURN_SPEED = 0.7;
    public static final double DEAD_BAND = 0.05; // 當前面的值小於0.05則視為0
}

```

3. 一樣於 `Constants` 中寫入馬達的正反轉 (同一邊的馬達轉向相同)
```java

public static final class MotorReverse {
    public static final boolean FRONT_LEFT = false;
    public static final boolean FRONT_RIGHT = true;
    public static final boolean BACK_LEFT = false;
    public static final boolean BACK_RIGHT = true;
}
```

## 模組化
如果一組機構中使用多個相同作用的馬達, 模組可以使程式更加簡潔

1. 於 `src\man\java\frc\robot\subsystems` 創建 `DriveMotorModule.java`
2. 引入函示庫
```java
package frc.robot.subsystems;

import com.ctre.phoenix.motorcontrol.NeutralMode;
import com.ctre.phoenix.motorcontrol.VictorSPXControlMode;
import com.ctre.phoenix.motorcontrol.can.VictorSPX;

import frc.robot.Constants.Drive;
```

3. 於 `DriveMotorModule` 宣告單顆馬達
```java
public class DriveModule {
    private final VictorSPX motor;

    public DriveModule(int port, boolean reverse) {
        this.motor = new VictorSPX(port);
        this.motor.enableVoltageCompensation(true);
        this.motor.configVoltageCompSaturation(15.0);
        this.motor.setInverted(reverse);
        this.motor.setNeutralMode(NeutralMode.Brake);
    }
}
```

4. 寫入轉動與停止方法
```java
public void setDesiredState(double speed) {
    this.motor.set(VictorSPXControlMode.PercentOutput, speed);
}

public void stop() {
    this.motor.set(VictorSPXControlMode.PercentOutput, 0.0);
}
```

## 四顆馬達
完成 DriveMotorModule 後可於 Sudsystem 中使用

1. 於 `src\man\java\frc\robot\subsystems` 創建 `DriveMotorSubsystem.java`
2. 引入函式庫
```java
package frc.robot.subsystems;

import edu.wpi.first.wpilibj2.command.SubsystemBase;
import frc.robot.Constants.MotorReverse;
import frc.robot.DeviceId.DriveMotor;
```

3. 於 `DriveMotorSubsystem` 宣告四顆馬達
```java
public class DriveMotorSubsystem extends SubsystemBase {
    private final DriveMotorModule frontLeft;
    private final DriveMotorModule frontRight;
    private final DriveMotorModule backLeft;
    private final DriveMotorModule backRight;

    public DriveMotorSubsystem() {
        this.frontLeft = new DriveMotorModule(DriveMotor.FRONT_LEFT, MotorReverse.FRONT_LEFT);
        this.frontRight = new DriveMotorModule(DriveMotor.FRONT_RIGHT, MotorReverse.FRONT_RIGHT);
        this.backLeft = new DriveMotorModule(DriveMotor.BACK_LEFT, MotorReverse.BACK_LEFT);
        this.backRight = new DriveMotorModule(DriveMotor.BACK_RIGHT, MotorReverse.BACK_RIGHT);
    }
}
```

4. 創建讓 KOP 移動的方法, 左右兩邊各需要一個速度讓底盤旋轉，故有 left 和 right Speed
```java
public void move(double leftSpeed, double rightSpeed) {
    this.frontLeft.setDesiredState(leftSpeed);
    this.backLeft.setDesiredState(leftSpeed);
    this.frontRight.setDesiredState(rightSpeed);
    this.backRight.setDesiredState(rightSpeed);
}
```

5. 創建讓底盤停止的方法
```java
public void stopModules() {
    this.frontLeft.stop();
    this.frontRight.stop();
    this.backLeft.stop();
    this.backRight.stop();
}
```

## 控制底盤
1. 於 `src\main\java\frc\robot` 創建 `GamepadJoystick.java` , 用於搖桿操作
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
2. 於 `src\main\java\frc\robot\commands` 創建 `DriveCmd.java`
3. 引入函式庫
```java
package frc.robot.commands;

import edu.wpi.first.math.MathUtil;
import edu.wpi.first.wpilibj.XboxController;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.Command;
import frc.robot.Constants.Drive;
import frc.robot.subsystems.DriveSubsystem;
```

3. 於 `DriveCmd` 導入 `DriveMotorSubsystem` 與搖桿
```java
public class DriveCmd extends Command {
	private final DriveSubsystem driveSubsystem;
	private final XboxController controller;

	public DriveCmd(DriveSubsystem driveSubsystem, XboxController controller) {
		this.driveSubsystem = driveSubsystem;
		this.controller = controller;
		this.addRequirements(this.driveSubsystem);
	}
}
```
### Tank Drive
左右搖桿的數值直接控制單邊的馬達

```java
@Override
public void execute() {
    double leftSpeed = -MathUtil.applyDeadband(this.controller.getLeftY(), Drive.DEAD_BAND) * Drive.MAX_SPEED;
    double rightSpeed = MathUtil.applyDeadband(this.controller.getRightY(), Drive.DEAD_BAND) * Drive.MAX_TURN_SPEED;
		
    this.driveMotorSubsystem.move(leftSpeed, rightSpeed);
    SmartDashboard.putNumber("leftSpeed", leftSpeed); // 於 Dashboard 顯示左速度值
    SmartDashboard.putNumber("rightSpeed", rightSpeed); // 於 Dashboard 顯示右速度值
}
```

### Arcade Drive
透過運算將移動與轉向的控制分開

```java
@Override
public void execute() {
	double driveSpeed = -MathUtil.applyDeadband(this.controller.getLeftY(), Drive.DEAD_BAND) * Drive.MAX_SPEED;
	double turnSpeed = MathUtil.applyDeadband(this.controller.getRightX(), Drive.DEAD_BAND) * Drive.MAX_TURN_SPEED;

	double leftSpeed = driveSpeed + turnSpeed;
	double rightSpeed = driveSpeed - turnSpeed;

	this.driveSubsystem.move(leftSpeed, rightSpeed);
	SmartDashboard.putNumber("LeftSpeed", leftSpeed);
	SmartDashboard.putNumber("RightSpeed", rightSpeed);
}
```

5. 於 `end()` 寫入指令執行完成後動作
```java
@Override
public void end(boolean interrupted) {
    this.driveMotorSubsystem.stopModules();
}
```

6. 於 `isFinished()` 回傳 `false` 表示程式 Command 不停止
```java
@Override
public boolean isFinished() {
    return false;
}
```

7. 把 `DriveCmd.java` 寫入 `RobotContainer.java`
```java
package frc.robot;

import edu.wpi.first.wpilibj.XboxController;
import edu.wpi.first.wpilibj2.command.Command;
import frc.robot.commands.DriveCmd;
import frc.robot.subsystems.DriveSubsystem;

public class RobotContainer {
    private final GamepadJoystick joystick  = new GamepadJoystick(GamepadJoystick.CONTROLLER_PORT);
    private final DriveMotorSubsystem driveMotorSubsystem = new DriveMotorSubsystem();
    private final DriveJoystickCmd driveJoystickCmd = new DriveJoystickCmd(driveMotorSubsystem, joystick);

    public RobotContainer() {
	    this.driveMotorSubsystem.setDefaultCommand(this.driveJoystickCmd);
    }

    public Command getAutonomousCommand() {
	    return null;
    }
}
```