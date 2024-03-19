<!-- title: FRC8725 軟體培訓教學 - KOP底盤(2023) -->
<!-- description: 控制 KOP 底盤 -->
<!-- category: programming -->
<!-- tags: FRC8725 -->
<!-- published time: 2023/10/2 -->

# KOP底盤撰寫
使用 CIM 馬達為範例

## 常數設置
1. 於 `src\main\java\frc\robot\robotMap.java` 寫入馬達ID（編號）
```java
package frc.robot;

public class robotMap {
    public static final class DriveMotor {
        public static final int LEFT_FRONT = 1;
        public static final int LEFT_BACK = 2;
        public static final int RIGHT_FRONT = 3;
        public static final int RIGHT_BACK = 4;
    }
}

```

2. 於 `src\main\java\frc\robot\Constants.java` 寫入馬達前進和旋轉最大速度與 Deadband


> Deadband 用於防止搖桿無法完全歸零, 搖桿輸入需大於 Deadband 否則視為 0

```java
package frc.robot;

public final class Constants {
    public static final class Drive {
        public static final double MAX_SPEED = 0.5;
        public static final double MAX_TURN_SPEED = 0.7;
        public static final double DEAD_BAND = 0.05;
    }
}

```

3. 一樣於 `Constants` 中寫入馬達的正反轉 (同一邊的馬達轉向相同)
```java
package frc.robot;

public final class Constants {
    public static final class MotorReverse {
        public static final boolean LEFT_FRONT = false;
        public static final boolean LEFT_BACK = false;
        public static final boolean RIGHT_FRONT = true;
        public static final boolean RIGHT_BACK = true;
    }
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
public class DriveMotorModule {
    private final VictorSPX motor;
    private double speedOutput;

    public DriveMotorModule(int motorPort, boolean reverse) {
        this.motor = new VictorSPX(motorPort);
        this.motor.enableVoltageCompensation(true);
        this.motor.configVoltageCompSaturation(12.0);
        this.motor.setNeutralMode(NeutralMode.Brake);
        this.motor.setInverted(reverse);
    }
}
```

4. 寫入轉動與停止方法
```java
public void setDesiredState(double speed) {
    this.speedOutput = speed * Drive.MAX_SPEED; // 乘 Max Speed（<1）可限制馬達最大速度
    this.motor.set(VictorSPXControlMode.PercentOutput, this.speedOutput);
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
import frc.robot.robotMap.DriveMotor;
```

3. 於 `DriveMotorSubsystem` 宣告四顆馬達
```java
public class DriveMotorSubsystem extends SubsystemBase {
    private final DriveMotorModule leftfront;
    private final DriveMotorModule leftback;
    private final DriveMotorModule rightfront;
    private final DriveMotorModule rightback;

    public DriveMotorSubsystem() {
        this.leftfront = new DriveMotorModule(DriveMotor.LEFT_FRONT, MotorReverse.LEFT_FRONT);
        this.leftback = new DriveMotorModule(DriveMotor.LEFT_BACK, MotorReverse.LEFT_BACK);
        this.rightfront = new DriveMotorModule(DriveMotor.RIGHT_FRONT, MotorReverse.RIGHT_FRONT);
        this.rightback = new DriveMotorModule(DriveMotor.RIGHT_BACK, MotorReverse.RIGHT_BACK);
    }
}
```

4. 創建讓 KOP 移動的方法, 左右兩邊各需要一個速度讓底盤旋轉，故有 left 和 right Speed
```java
public void move(double leftSpeed, double rightSpeed) {
    this.leftfront.setDesiredState(leftSpeed);
    this.rightfront.setDesiredState(leftSpeed);
    this.rightback.setDesiredState(rightSpeed);
    this.rightback.setDesiredState(rightSpeed);
}
```

5. 創建讓底盤停止的方法
```java
public void stopModules() {
    this.leftfront.stop();
    this.rightfront.stop();
    this.rightback.stop();
    this.rightback.stop();
}
```

## 控制底盤
1. 於 `src\man\java\frc\robot\commands` 創建 `DriveJoystickCmd.java`
2. 引入函式庫
```java
package frc.robot.commands;

import edu.wpi.first.math.MathUtil;
import edu.wpi.first.wpilibj.XboxController;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.CommandBase;
import frc.robot.Constants.Drive;
import frc.robot.subsystems.DriveMotorSubsystem;
```

3. 於 `DriveJoystickCmd` 導入 `DriveMotorSubsystem` 與搖桿
```java
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

4. 輸出左右馬達的速度
### Tank Drive
左右搖桿的數值直接控制單邊的馬達

```java
@Override
public void execute() {
    double leftSpeed = MathUtil.applyDeadband(this.controller.getLeftY(), Drive.DEAD_BAND);
    double rightSpeed = MathUtil.applyDeadband(this.controller.getRightY(), Drive.DEAD_BAND);
		
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
    double driveSpeed = MathUtil.applyDeadband(this.controller.getLeftY(), Drive.DEAD_BAND);
    double turnSpeed = MathUtil.applyDeadband(this.controller.getRightX(), Drive.DEAD_BAND) * Drive.MAX_TURN_SPEED;
    // 讓轉向速度稍微慢一點, 比較好操控

    double leftSpeed = driveSpeed + turnSpeed;
    double rightSpeed = driveSpeed - turnSpeed;
		
    this.driveMotorSubsystem.move(leftSpeed, rightSpeed);
    SmartDashboard.putNumber("leftSpeed", leftSpeed); // 於 Dashboard 顯示左速度值
    SmartDashboard.putNumber("rightSpeed", rightSpeed); // 於 Dashboard 顯示右速度值
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

7. 把 `DriveJoystickCmd` 寫入 `RobotContainer.java`