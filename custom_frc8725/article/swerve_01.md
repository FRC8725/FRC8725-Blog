<!-- title: Swerve 總覽 -->
<!-- description: 控制 Swerve 底盤 -->
<!-- category: Swerve -->
<!-- tags: Programming -->
<!-- published time: 2024/11/21 -->

# Swerve總覽
## 什麼是Swerve
是一種底盤，如果是四輪傳動的swerve，組成為四個獨立的腳，每腳皆有 Drive Motor & Turning Motor & Encoder

* Driving Motor 負責控制Module輪子的轉速
* Turning Motor 負責控制Module輪子的旋轉角度
* Encoder (紀錄轉速、角度的設備)
    * Drive Encoder (馬達內建) 讀取輪子轉速
    * Turning Encoder (CANCoder) 讀取輪子角度

因此 Swerve 可以向四面八方移動，同時也可以轉動其底盤的面對角度

## 控制Swerve模式
### Absolute Feild (絕對場地運動)
以場地前方當作正向，可邊走邊旋轉，大多數swerve用此模式，需要使用Gyro控制
### Relatively Felid (相對場地運動)
以機器人前方當作正向，類似KOP控制

<br><a class="articleSwitcher" next_article="swerve_02">>> 下一章 <<</a>