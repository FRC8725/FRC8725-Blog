<!-- title: Swerve 角塊撰寫 -->
<!-- description: 控制 Swerve 底盤 -->
<!-- category: Swerve -->
<!-- tags: Programming -->
<!-- published time: 2024/11/21 -->

# 撰寫單個Module
## 宣告Module馬達
* 在建構式（Constructor）引入Module的:
    
    <span>1. Driving motor ID</span>
    
    <span>2. Turning motor ID</span>
    
    <span>3. CANCoder ID</span>
    
    <span>4. Driving motor reverse</span>

    <span>5. Turning motor reverse</span>
    
    <span>6. Drive Encoder reverse</span>

    <span>7. Module name（putDashboard方便查看各Module數值）</span>

* 使用 `PIDController` 控制Turn馬達旋轉角度

```java
public class SwerveModule implements IDashboardProvider {
    private final SwerveSpark driveMotor;
    private final SwerveSpark turnMotor;

    private final RelativeEncoder driveEncoder;
    private final CANCoder turnEncoder;

    private final PIDController turnPid;

    private final String motorName;
    private double driveOutput;
    private double turnOutput;

    public SwerveModule(
        int driveMotorPort, int turnMotorPort, int turnEncoderPort,
        boolean driveMotorReverse, boolean turnMotorReverse, boolean driveEncoderReverse,
        String motorName
    ){
        this.registerDashboard();

        this.driveMotor = new SwerveSpark(driveMotorPort, driveMotorReverse);
        this.turnMotor = new SwerveSpark(turnMotorPort, turnMotorReverse);

        this.driveEncoder = this.driveMotor.getEncoder();
        this.turnEncoder = new CANCoder(turnEncoderPort);

        this.driveEncoder.setPositionConversionFactor(SwerveConstants.DRIVE_POSITION_CONVERSION_FACTOR);
        this.driveEncoder.setVelocityConversionFactor(SwerveConstants.DRIVE_VELOCITY_CONVERSION_FACTOR);

        this.turnPid = new PIDController(0.0, 0.0, 0.0);
        this.turnPid.enableContinuousInput(-180, 180);

        this.motorName = motorName;
    }
}
```

## 正反轉設定
讓Driving motor在swerve向前時 `getVelocity` 輸出為正值，若設定錯誤在使用 PathPlanner 等自動控制軟體的時候會出錯

```java
public double getDriveEncoderPosition() {
    return this.driveEncoder.getPosition() * (this.driveEncoderReversed ? 1 : -1);
}

public double getDriveEncoderVelocity() {
    return this.driveEncoder.getVelocity() * (this.driveEncoderReversed ? 1 : -1);
}
```

## CANCoder角度輸出設定
將Encoder讀出來的值先轉為Degrees，因之前不知道為什麼輸出有超過360，在後面加了一串判斷式保證輸出為360度以內

```java
public double getTurningEncoderPosition() {
    double value = Units.rotationsToDegrees(this.turnEncoder.getAbsolutePosition().getValue());
    value %= 360.0;
    return value > 180 ? value - 360 : value;
}
```

## 輸出角塊狀態
```java
public SwerveModulePosition getPosition() {
    return new SwerveModulePosition(
        this.driveEncoder.getPosition(),
        Rotation2d.fromDegrees(this.turnEncoder.getAbsolutePositionDegrees())
    );
}
```

## 輸出角塊轉向狀態
```java
public SwerveModulePosition getPosition() {
    return new SwerveModulePosition(
        this.driveEncoder.getPosition(),
        Rotation2d.fromDegrees(this.turnEncoder.getAbsolutePositionDegrees())
    );
}
```

<br><a class="articleSwitcher" next_article="swerve\swerve_07">>> 下一章 <<</a>