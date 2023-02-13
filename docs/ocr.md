# OCR

1. Tesseract <https://github.com/tesseract-ocr/tesseract>
2. PaddleOCR <https://github.com/PaddlePaddle/PaddleOCR>
3. EasyOCR <https://github.com/JaidedAI/EasyOCR>
4. chineseocr <https://github.com/chineseocr/chineseocr>
5. chineseocr_lite <https://github.com/DayBreak-u/chineseocr_lite>
6. CnOCR <https://github.com/breezedeus/cnocr>
7. TrWebOCR <https://github.com/alisen39/TrWebOCR>

## Tesseract

```bash
# 安裝 Tesseract
sudo apt install tesseract-ocr

# 安裝 Developer Tools
sudo apt install libtesseract-dev

# 安裝Leptonica
sudo apt install libleptonica-dev
```

安装语言包

```bash
# 英文
sudo apt install tesseract-ocr-eng

# 简体中文（vert为竖排）
sudo apt install tesseract-ocr-chi-sim tesseract-ocr-chi-sim-vert

# 繁体中文
sudo apt install tesseract-ocr-chi-tra tesseract-ocr-chi-tra-vert
```

查看包含的语言包

```bash
tesseract --list-langs
```

Golang 安装启动 OCR 服务

```bash
go install github.com/otiai10/ocrserver@latest

PORT=8080 ocrserver
```

Docker 安装启动 OCR 服务

```bash
docker pull otiai10/ocrserver:latest

docker run -p 8080:8080 otiai10/ocrserver
```

访问页面：

<http://localhost:8080>

## PaddleOCR

```bash
docker pull registry.baidubce.com/paddlepaddle/paddle:latest

docker run --name ppocr \
  -v $PWD:/paddle \
  --network=host \
  -it registry.baidubce.com/paddlepaddle/paddle:latest /bin/bash
```

## chineseocr_lite

```bash
git clone https://github.com/DayBreak-u/chineseocr_lite

pip3 install -r requirements.txt

cd chineseocr_lite
python backend/main.py
```

## ONNX Runtime

下载 二进制：<https://github.com/microsoft/onnxruntime/releases>

以1.14.0版本为例子：

```bash
wget https://github.com/microsoft/onnxruntime/releases/download/v1.14.0/onnxruntime-linux-x64-1.14.0.tgz

tar -zxvf onnxruntime-linux-x64-1.14.0.tgz

sudo mv onnxruntime-linux-x64-1.14.0 /opt/onnxruntime
```

## 参考资料

- [6款支持中文开源OCR软件的简单使用](https://blog.csdn.net/qq_23091073/article/details/126495395)
- [对比了最常见的几家开源OCR框架，我发现了最好的开源模型](https://zhuanlan.zhihu.com/p/265359676)
- [它会不会成为 OCR 领域霸主？](https://juejin.cn/post/6909366513124245511)
- [Golang 和 Python 的 OCR 服务安装及使用](https://cloud.tencent.com/developer/article/2111779)
- [使用ONNX进行部署并推理](https://datawhalechina.github.io/thorough-pytorch/%E7%AC%AC%E4%B9%9D%E7%AB%A0/9.1%20%E4%BD%BF%E7%94%A8ONNX%E8%BF%9B%E8%A1%8C%E9%83%A8%E7%BD%B2%E5%B9%B6%E6%8E%A8%E7%90%86.html)
