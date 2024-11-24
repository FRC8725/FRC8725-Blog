<!-- title: Swerve 簡化馬達設定 -->
<!-- description: 控制 Swerve 底盤 -->
<!-- category: Swerve -->
<!-- tags: Programming -->
<!-- published time: 2024/11/21 -->

# 簡化馬達設定
因為Driving和Turning motor會有重複設定導致重複的程式碼變多的問題，會在`java/frc/robot`下創建一個lib資料夾

裡面就會放一些好用的lib，這裡以Neo&CANSparkMAX為例，先創建一個`SwerveSpark.java`

```java
package frc.robot.lib;

import com.revrobotics.CANSparkMax;

import frc.robot.SwerveConstants;

public class SwerveSpark extends CANSparkMax {
    public SwerveSpark(int motorPort, boolean reverse) {
        super(motorPort, MotorType.kBrushless);
        this.restoreFactoryDefaults();
        this.setInverted(reverse);
        this.setIdleMode(IdleMode.kBrake);
        this.setSmartCurrentLimit(SwerveConstants.MAX_VOLTAGE);
    }
}
```

這裡馬達全部設定為Brake以及限制最大電壓

* `MAX_VOLTAGE` 會在常數設置才設定

<br><a class="articleSwitcher" next_article="swerve\swerve_03">>> 下一章 <<</a>