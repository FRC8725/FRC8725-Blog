<!-- title: FRC8725 軟體培訓教學 - Limelight撰寫 -->
<!-- description: 使用Limelight偵測與目標距離 -->
<!-- category: Advance -->
<!-- tags: Programming -->
<!-- published time: 2024/03/18 -->

# Limelight撰寫
## Limelight Constants
* Limelight 相關參數
```java
public static final class LimelightConstants {
	public static final double MOUNT_ANGLE_DEG = 0.0; // Limelight與地面傾斜角度
	public static final double LENS_HEIGHT_METERS = 0.42; // Limelight與地面高度
	public static final double GOAL_HEIGHT_METERS = 0.74; // Limelight偵測目標高度
	public static final double HORIZONTAL_OFFSET_METERS = 0; // 將水平距離歸0參數
	public static final double VERTICAL_MAX_SPEED = 1.3; // 水平運動最大速度
	public static final double HORIZONTAL_MAX_SPEED = 2.6; // 旋轉最大速度
	public static final boolean gyroField = false; // 相對機器方向
}
```

## Limelight Subsystem
1. 於 `src/main/java/frc/robot/subsystems` 創建 `Limelight.java` （有使用IDashboard）
* [Limelight各項數值](https://docs.limelightvision.io/docs/docs-limelight/apis/complete-networktables-api)
2. 引入函式庫
```java
package frc.robot.subsystems;

import edu.wpi.first.networktables.NetworkTable;
import edu.wpi.first.networktables.NetworkTableEntry;
import edu.wpi.first.networktables.NetworkTableInstance;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.SubsystemBase;
import frc.robot.Constants.LimelightCamera;
import frc.robot.Constants.LimelightConstants;
import frc.robot.lib.IDashboardProvider;
```
3. 創建Limelight相關數值以及載入IDashBoard
```java
public class Limelight extends SubsystemBase implements IDashboardProvider {
    private final NetworkTable table; // 讀取Limelight
    private final NetworkTableEntry tx; // 讀取目標x軸度數
    private final NetworkTableEntry ty; // 讀取目標y軸度數
    private final NetworkTableEntry tid; // 讀取目標AprilTag ID
    private double distanceToGoalVerticalMeters; // 目標至中心垂直距離
    private double distanceToGoalHorizontalMeters; // 目標至中心水平距離

    public Limelight() {
        this.registerDashboard();
        this.table = NetworkTableInstance.getDefault().getTable("limelight");
        this.tx = this.table.getEntry("tx");
        this.ty = this.table.getEntry("ty");
        this.tid = this.table.getEntry("tid");
    }
}
```

4. 垂直計算距離
* `a1` `VerticalOffset` 與AprilTag角度
* `a2` `MountAngleDeg` Limelight與地面傾斜角度
* `h1` `LensHeightMeters` Limelight與地板高度
* `h2` `GoalHeightMeters` AprilTag與地板高度

<br>
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>tan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo stretchy="false">(</mo>
  <mi>a</mi>
  <mn>1</mn>
  <mo>+</mo>
  <mi>a</mi>
  <mn>2</mn>
  <mo stretchy="false">)</mo>
  <mo>=</mo>
  <mfrac>
    <mrow>
      <mi>h</mi>
      <mn>2</mn>
      <mo>&#x2212;</mo>
      <mi>h</mi>
      <mn>1</mn>
    </mrow>
    <mi>d</mi>
  </mfrac>
</math><br>

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mo stretchy="false">&#x21D3;</mo>
</math><br>

<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>d</mi>
  <mo>=</mo>
  <mfrac>
    <mrow>
      <mi>h</mi>
      <mn>2</mn>
      <mo>&#x2212;</mo>
      <mi>h</mi>
      <mn>1</mn>
    </mrow>
    <mrow>
      <mi>tan</mi>
      <mo data-mjx-texclass="NONE">&#x2061;</mo>
      <mo stretchy="false">(</mo>
      <mi>a</mi>
      <mn>1</mn>
      <mo>+</mo>
      <mi>a</mi>
      <mn>2</mn>
      <mo stretchy="false">)</mo>
    </mrow>
  </mfrac>
</math><br><br>

![](image/articleImage/software_edu/image10.wm.png)

```java
public double getDistanceToGoalVerticalMeters() {
    // 取得目標與中心垂直距離
    double verticalOffset = this.ty.getDouble(0.0);

    double mountAngleDeg = LimelightConstants.MOUNT_ANGLE_DEG;
    double lensHeightMeters = LimelightConstants.LENS_HEIGHT_METERS;
    double goalHeightMeters = LimelightConstants.GOAL_HEIGHT_METERS;

    double angleToGoalDeg = mountAngleDeg + verticalOffset;
    double angleToGoalRad = angleToGoalDeg * (Math.PI / 180.0);
    this.distanceToGoalVerticalMeters = Math.abs((goalHeightMeters - lensHeightMeters) / Math.tan(angleToGoalRad));

    return this.distanceToGoalVerticalMeters;
}
```
5. 計算水平距離（俯視圖）
* `a1` `HorizontalOffset` 與AprilTag夾角
* `d` `distanceToGoalVerticalMeters` 與AprilTag距離
* `h` `distanceToGoalHorizontalMeters` 與Limelight水平距離

<br>
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
  <mi>h</mi>
  <mo>=</mo>
  <mi>tan</mi>
  <mo data-mjx-texclass="NONE">&#x2061;</mo>
  <mo stretchy="false">(</mo>
  <mi>a</mi>
  <mn>1</mn>
  <mo stretchy="false">)</mo>
  <mo>&#xD7;</mo>
  <mi>d</mi>
</math><br>

![](image/articleImage/software_edu/image11.wm.png)

```java
public double getDistanceToGoalHorizontalMeters(double distanceToGoalVerticalMeters) {
    // 取得與目標水平距離
    if (distanceToGoalVerticalMeters == -1) {
        distanceToGoalVerticalMeters = this.getDistanceToGoalVerticalMeters();
    }
    double horizontalOffset = this.tx.getDouble(0.0);

    double horizontalOffsetRad = horizontalOffset * (Math.PI / 180.0);

    this.distanceToGoalHorizontalMeters = (Math.tan(horizontalOffsetRad) * distanceToGoalVerticalMeters) - LimelightConstants.HORIZONTAL_OFFSET_METERS;
    return this.distanceToGoalHorizontalMeters;
}
```

6. 取得AprilTag ID
```java
public double getAprilTagId() {
    return this.tid.getDouble(0.0);
}
```

## Limelight TrackCommand
1. 於 `src/main/java/frc/robot/Auto` 創建 `AutoTrackCmd.java`
2. 引入函式庫
```java
package frc.robot.Auto;

import edu.wpi.first.math.MathUtil;
import edu.wpi.first.math.controller.PIDController;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;
import edu.wpi.first.wpilibj2.command.CommandBase;
import frc.robot.Constants.LimelightConstants;
import frc.robot.subsystems.Limelight;
import frc.robot.subsystems.SwerveSubsystem;
```
3. 寫入建構式
```java
public class AutoTrackCmd extends CommandBase {
	private final SwerveSubsystem swerveSubsystem;
	private final Limelight limelight;
	private final PIDController flotPid;
	private final PIDController rotationPid;

	public AutoTrackCmd(SwerveSubsystem swerveSubsystem, Limelight limelight) {
		this.swerveSubsystem = swerveSubsystem;
		this.limelight = limelight;
		this.flotPid = new PIDController(0.45, 0, 0); // 要測
		this.rotationPid = new PIDController(0.49, 0, 0); // 要測

		addRequirements(this.swerveSubsystem);
	}
}
```
4. 追蹤目標
```java
@Override
public void execute() {
	double apriltagId = this.limelight.getAprilTagId(); // 取得偵測到的AprilTagID 如果沒偵測到輸出0
	double distanceToGoalVerticalMeters = this.limelight.getDistanceToGoalVerticalMeters(); // 取得偵測到目標與中心垂直距離
	double distanceToGoalHorizontalMeters = MathUtil.applyDeadband(this.limelight.getDistanceToGoalHorizontalMeters(distanceToGoalVerticalMeters), -1); // 取得偵測到目標與中心水平距離

    // 因取得的值不一定會是實際值 使用PID來控制
	double limelightDistance = 1.45226679422054; // 距離目標170cm的垂直距離 要測
	double limelightHorizontal = -0.041075960895223; // 距離目標到中心的水平距離 要測
    // 計算平移速度
	double verticalSpeed = MathUtil.applyDeadband(
			this.flotPid.calculate(distanceToGoalVerticalMeters, limelightDistance), -0.05) * LimelightConstants.VERTICAL_MAX_SPEED;
    // 計算旋轉速度
	double rotationSpeed = MathUtil.applyDeadband(
			this.rotationPid.calculate(distanceToGoalHorizontalMeters, limelightHorizontal), 0.25) * LimelightConstants.HORIZONTAL_MAX_SPEED;
	SmartDashboard.putNumber("Calculate Vertical", verticalSpeed);
    SmartDashboard.putNumber("Calculate Rotation", rotationSpeed);

    // 條件式控制機器
	if (verticalSpeed < 0 && apriltagId != -1) {
		this.swerveSubsystem.driveSwerve(-verticalSpeed, 0.0, rotationSpeed, LimelightConstants.gyroField);
	} else {
		this.swerveSubsystem.driveSwerve(0.0, 0.0, rotationSpeed, LimelightConstants.gyroField);
	}
}

@Override
public void end(boolean interrupted) {
	this.swerveSubsystem.stopModules();
}

@Override
public boolean isFinished() {
	return false;
}
```