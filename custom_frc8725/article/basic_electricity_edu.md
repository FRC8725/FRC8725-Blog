<!-- title: 軟體培訓教學 - 機電整合 -->
<!-- description: 配電與整線 -->
<!-- category: Basic -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/03/16 -->

# 機電整合
## 基本認識
### 電源分配板
#### PDH
REV Power Distribution Hub（PDH）- 是 FRC 中較新型的電源分配板。具有 20 條高電流通道（最大 40A）、3 條低電流通道（最大 15A）和 1 條可切換的低電流通道。

#### PDP
CTRE Power Distribution Panel（PDP）- 電源分配板，具有 8 條高電流通道（最大 40A）、8 條較低電流通道（20A / 30A）、1 條 20A 受保護通道（用於 PCM 和 VRM）、以及 1 條 10A 受保護通道（用於 roboRIO）。

左邊的是 PDH

![](image/articleImage/electricity_edu/image1.wm.png)

### VRM
Voltage Regulator Module（VRM）- 提供不同恆定電壓，用於自定義感應器、鏡頭或其他特殊設備(raspberry pi, orange pi...)。12V直流輸入直接由[電源分配板](###電源分配板)供電。

![](image/articleImage/electricity_edu/image6.wm.png)

### Breaker
保險絲，按下紅色按鈕後斷開連接
![](image/articleImage/electricity_edu/image2.wm.png)

### CAN
Controller Area Network（CAN）- 一種基於消息的協議，允許微控制器和設備彼此通信。

一定要用WAGO弄好確定不會掉
RoboRIO跟配電盤連接的CAN線建議用熱溶膠塗起來

### RPM
REV Radio Power Module 用來幫 Radio 供電，帶有兩個插座式RJ45連接器的18V被動式POE

![](image/articleImage/electricity_edu/image3.wm.png)

## 線路連接
Radio跟交換機不要疊起來訊號會互相干擾導致斷線

<span style="color: #e06c53">**接線之前需要先想好走線**
這很重要，否則線會不夠長</span>
線路需緊貼平面使用束帶或是其他固定器固定
轉向時以 90度或 45度旋轉並且固定轉彎處
優先使用 Wago

![](image/articleImage/electricity_edu/image4.wm.jpg)

### 供電
#### 總電源
1. 將 6AWG 的火線與 [Braeker](###Breaker) 連接<span style="color: #e06c53">(螺絲部分鎖緊)</span>
2. 將電線連接至[電源分配板](###電源分配板)
3. [Braeker](###Breaker) 固定於明顯且容易觸碰到的位置

#### 馬達
1. 使用 12AWG 的電線連接
2. 用較硬的電線 (馬達本身的電線比較軟可以上一點焊錫)

#### Limelight

<span style="color: #e06c53">不要使用REV無線電供電模塊來為 Limelight 供電，其輸出電壓太高。</span>

![](image/articleImage/electricity_edu/image5.wm.png)

也可以從 Limelight 側邊直接供電

推薦的網路交換機 [Branboxes SW-005 5 port Switch](https://www.amazon.com/BRAINBOXES-SW-005-Brainboxes-Unmanaged-Ethernet/dp/B07PRZ2R1P/)
官方推薦的接線方式

1. 使用Cat線供電給 Limelight 方便減少裝置。
2. 使用熱熔膠將所有連接點固定。
3. 使用有絞線的Cat6網路線。
4. 不建議使用第二個無線電端口，將所有設備都通過網絡交換機連接。

### CAN線的連接
CAN 需要機器人上保持串連的結構，從 roboRIO 開始，然後連續進入和退出每個設備，最終到達 [PDP](####PDP) / [PDH](###PDH)。

![](image/articleImage/electricity_edu/image7.wm.png)