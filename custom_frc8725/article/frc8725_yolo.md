<!-- title: FRC8725 Yolo模型訓練與物件辨識 -->
<!-- description: 使用Yolov5、v8訓練模型以及應用 -->
<!-- category: AI -->
<!-- tags: FRC8725 -->
<!-- published time: 2024/09/28 -->

# YOLO模型是什麼?
YOLO（You Only Look Once）是一種流行的物體檢測（Object Detection）深度學習模型，它可以在圖像中識別和定位多個物體，並為每個物體提供邊界框（Bounding Box）和類別標籤。雖然YOLO最初用於電腦視覺應用，但也可以應用於醫學影像辨識，例如醫學影像中的病灶檢測

# Object Detection
物件辨識（Object Detection）指的是讓計算機去分析一張圖片或者一段視頻中的物體，並標記出來，通過給與類神經網絡ANN(Artificial neural networks)大量的物體數據去訓練它，提高識別準確度

# CUDA是什麼?
CUDA（Compute Unified Devices Architectured，統一計算架構）是由輝達NVIDIA所推出的一種軟硬體整合技術，是該公司對於GPGPU的正式名稱。透過這個技術，使用者可利用NVIDIA的GPU進行圖像處理之外的運算，亦是首次可以利用GPU作為C-編譯器的開發環境

## 安裝CUDA(僅限NVIDIA顯卡)
要安裝[PyTorch](https://pytorch.org/get-started/locally/)可支援的版本(11.8、12.1、12.4) </br>
[11.8](https://developer.nvidia.com/cuda-11-8-0-download-archive)

[12.1](https://developer.nvidia.com/cuda-12-1-0-download-archive)(建議)

[12.4](https://developer.nvidia.com/cuda-12-4-0-download-archive)

# 如何使用?
yolo模型分為v1~10，主要使用v5、v8模型

## YOLOv5
### 環境
[Python >= 3.8.0](https://www.python.org/) </br>
[PyTorch >= 1.8](https://pytorch.org/get-started/locally/)

### 安裝
`git clone https://github.com/ultralytics/yolov5` (要先安裝git) </br>

`cd yolov5` </br>

`pip install -r requirements.txt`

### 訓練
首先到 [RoboFlow](https://roboflow.com/) 尋找要訓練的Dataset (通常是Game Piece) </br>
越多張訓練效果越好，但時間越久

dataset資料結構

`train` 模型訓練用資料

`valid` 訓練過程測試用資料，可在訓練時看到訓練結果，及時判斷學習狀態

`test` 訓練結束後，用於測試模型結果資料

```shell
| data.yaml
|
|--test
|  |--images
|  |--labels
|
|--train
|  |--images
|  |--labels
|
|--valid
|  |--images
|  |--labels
```

```shell
python train.py --data data.yaml --epochs 100 --weights '' --batch-size 16 --imgsz 640 --device 0
```
`data`(設定資料集) 在下載Roboflow的dataset時的yaml名稱(通常是data.yaml)

`epochs`(訓練次數) 越多次模型越準但時間越久(通常100次)

`weights`(指定訓練權重文件) 使用官方預訓練的模型權重來進行微調訓練(通常為無)

`batch-size`(模型一次性處理的樣本數量) 模型訓練時每一個批次的數據樣本數量(vRam4G建議16，vRam8~12G建議32)

`imgsz`(圖片大小) 每張圖片欲切成大小

`device`(訓練計算設備) 單個GPU(device=0)，多個GPU(device=0,1)，CPU(device=CPU)

### 導出&轉換模型
當訓練完後會在 `runs/train/exp...` 產生訓練檔案，裡面會有weights(訓練好的模型)，以及訓練數據和圖片</br>
在weights中會有 `best.pt` `last.pt` 這兩個模型，要將 `best.pt` 轉換成其他(limelight、photonvision)可以用的模型檔案(tflite、onnx)

```shell
python export.py --weights best.pt --include tflite
```
`weights`(選擇訓練模型) **路徑要對**

`include`(要轉換的類型) limelight的Object Detection用tflite，photonvision用onnx

### 測試模型
通常使用path測試，在路徑下放置拍攝好的測試照片(640x640)，輸出後會產生在`runs/detect/exp...`
```shell
python detect.py --weights best.pt --source 0                               # 鏡頭
                                            img.jpg                         # 圖片
                                            vid.mp4                         # 影片
                                            screen                          # 電腦畫面
                                            path/                           # 路徑
                                            'https://youtu.be/dQw4w9WgXcQ'  # YouTube影片
```

### 上機測試(limelight)
先給limelight插上[Coral TPU](https://coral.ai/products/accelerator)，在`Pipeline Type`中選擇**Object Detection**</br>
上傳模型(tflite)以及labels(data.yaml會有寫)後就可以進行物件辨識了

## YOLOv8
### 環境
[Python >= 3.8.0](https://www.python.org/) </br>
[PyTorch >= 1.8](https://pytorch.org/get-started/locally/)

### 安裝
`pip install ultralytics`

### 訓練
跟YOLOv5一樣，首先到 [RoboFlow](https://roboflow.com/) 尋找要訓練的Dataset (通常是Game Piece) </br>
越多張訓練效果越好，但時間越久

dataset資料結構

`train` 模型訓練用資料

`valid` 訓練過程測試用資料，可在訓練時看到訓練結果，及時判斷學習狀態

`test` 訓練結束後，用於測試模型結果資料

```shell
| data.yaml
|
|--test
|  |--images
|  |--labels
|
|--train
|  |--images
|  |--labels
|
|--valid
|  |--images
|  |--labels
```

cd到下載的dataset路徑
```shell
yolo detect train data=data.yaml epochs=100 imgsz=640 batch=16 device=0 
```
參數和YOLOv5差不多

`data`(設定資料集) 在下載Roboflow的dataset時的yaml名稱(通常是data.yaml)

`epochs`(訓練次數) 越多次模型越準但時間越久(通常100次)

`batch`(模型一次性處理的樣本數量) 模型訓練時每一個批次的數據樣本數量(vRam4G建議16，vRam8~12G建議32)

`imgsz`(圖片大小) 每張圖片欲切成大小

`device`(訓練計算設備) 單個GPU(device=0)，多個GPU(device=0,1)，CPU(device=CPU)

### 導出&轉換模型
與YOLOv5差不多，當訓練完後會在 `runs/train/exp...` 產生訓練檔案，裡面會有weights(訓練好的模型)，以及訓練數據和圖片</br>
在weights中會有 `best.pt` `last.pt` 這兩個模型，要將 `best.pt` 轉換成其他(limelight、photonvision)可以用的模型檔案(tflite、onnx)

```shell
yolo export model=best.pt format=tflite
```
`model`(選擇訓練模型) **路徑要對**

`format`(要轉換的類型) limelight的Object Detection用tflite，photonvision用onnx

### 測試模型
與YOLOv5差不多，通常使用path測試，在路徑下放置拍攝好的測試照片(640x640)，輸出後會產生在`runs/detect/exp...`
```shell
yolo predict model=best.pt imgsz=640 source=0                               # 鏡頭
                                            img.jpg                         # 圖片
                                            vid.mp4                         # 影片
                                            screen                          # 電腦畫面
                                            path/                           # 路徑
                                            'https://youtu.be/dQw4w9WgXcQ'  # YouTube影片
```
* val與predict差異: val用於訓練模型時預測圖片，predict用於模型沒有看過的圖片
  
# YOLOv5與YOLOv8差別
## YOLOv5
* Backbone: New CSP-Darknet53
* Neck: PAN結構
* Head: Coupled-Head
* Loss:
  * 分類損失: BCE loss，只計算正樣本loss
  * 目標損失: BCE loss，目標指的是network預測的BBOX與Ground truth 的 BBOX的CIOU，為所有樣本的目標損失
  * 定位損失: CIOU loss，只計算正樣本的定位損失

![](image/articleImage/yolo/yolov5.jpeg)

## YOLOv8
* Backbone: C3結構換成C2f，多了更多跳層連接和額外split操作
* Neck: 去掉兩個捲積連接層
* Head: Anchor-Based變成Anchor-Free
* Loss: 沒有objectness分支

![](image/articleImage/yolo/yolov8.jpeg)

## 訓練數據
![](image/articleImage/yolo/v5VSv8.png)