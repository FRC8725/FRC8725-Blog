<!-- title: Swerve IDashboard設定 -->
<!-- description: 控制 Swerve 底盤 -->
<!-- category: Swerve -->
<!-- tags: Programming -->
<!-- published time: 2024/11/21 -->

# IDashboardProvider
這是一個由我們學長開發的Lib，原本每次要執行到`SmartDashboard.putXXX`的時候才會更新數值</br>
使用這個後只要程式刷進去他就會一直put，非常方便

## 安裝
</span>1. 在 `java/frc/robot/lib`（沒有的話創一個資料夾）新增一個檔案 `DashboardHelper.java`</span>

```java
package frc.robot.lib.helpers;

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

<span>2. 一樣在lib中創建檔案 `IDashboardProvider.java`</span>

```java
package frc.robot.lib.helpers;

public interface IDashboardProvider {
    void putDashboard();

    default void registerDashboard() {
        DashboardHelper.register(this);
    }
}
```


<span>3. 在 `java/frc/robot/Robot.java` 中的 `robotInit` 改為</span>

```java
@Override
public void robotInit() {
    DashboardHelper.enableRegistration();
    this.robotContainer = new RobotContainer();
    DashboardHelper.disableRegistration();
}
```

`robotPeriodic` 改為

```java
@Override
public void robotPeriodic() {
    CommandScheduler.getInstance().run();
    DashboardHelper.putAllRegistries();
}
```

## 使用
<span>1. 在想要使用的檔案中 `implements IDashboardProvider`</span>

<span>2. 在建構式（Constructor）中寫入 `this.registerDashboard()`</span>

<span>3. 在 class 裡面會有一個 `putDashboard` 的方法，將要put的 `SmartDashboard` 寫到裡面就好了</span>

例：
```java
public class SwerveModule implements IDashboardProvider {
    public SwerveModule() {
        this.registerDashboard();
    }

    @Override
    public void putDashboard() {
        SmartDashboard.putNumber("SwerveState/" + this.motorName + " DriveVel", this.driveEncoder.getVelocity());
        SmartDashboard.putNumber("SwerveState/" + this.motorName + " TurnPos", this.turnEncoder.getAbsolutePositionDegrees());
    }
}
```

<br>[>> 下一章 <<](?page=article&article=swerve_04)