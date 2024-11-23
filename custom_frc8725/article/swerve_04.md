<!-- title: Swerve 相關函式說明 -->
<!-- description: 控制 Swerve 底盤 -->
<!-- category: Swerve -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/11/21 -->

## 相關函式說明
### Translation2d
這個類別有一個 x 和 y 分量，代表點（x, y）或向量［x, y］在二維座標系上

### Rotation2d
這類有一個角度分量，表示機器人相對於二維座標系上的軸的旋轉，正旋轉(>0)為逆時針旋轉

### PIDController
![](image/articleImage/swerve_edu/image3.wm.png)
* `enableContinuousInput(minimumInput, maximumInput)` 輸入最小的值(minimumInput)，輸入最大的值(maximumInput)<br>
    使用角度做運算為-180, 180<br>
    使用弧度做運算為-Math.PI, Math.PI

* `calculate(a, b)` a為當前的值(measurement)，b為目標值(setPoint)

### 轉換係數公式
* 速度係數轉換：
$$conversion = \frac{1}{gearRatio} * 2 * wheelRadius * \frac{\pi}{60}$$

* 角度係數轉換：
$$conversion = \frac{1}{gearRatio} * wheelRadius * \pi$$

### 單位轉換公式
* Rotation to Degrees
  * Units.rotationsToDegrees(double rotation)<br><br>
$$Degrees = Rotation * 360$$
* Degrees to Radian
  * Units.degreesToRadians(double degrees)<br><br>
$$Radians = Degrees * \frac{\pi}{180}$$
* RPM(每分鐘轉速) to m/s(公尺每秒)<br><br>
$$Velocity = 2 * wheelRadius * \pi * \frac{RPM}{60}$$

<br>[>> 下一章 <<](?page=article&article=swerve_05)