# ROC-RK3588S-PC部署AI模型

## 硬件基础

- **CPU**：4×A76@2.4GHz + 4×A55@1.8GHz
- **NPU**：6TOPS INT8，支持**w8a8/w4a16**量化
- **内存**：32GB LPDDR5（足够跑 7B 量化模型）
- **GPU**：Mali-G610 MP4，支持 Vulkan/OpenCL 加速

## 可跑模型清单（按大小 / 场景）

### 1. 流畅优先（1.5B–3B，NPU 全跑）

- Qwen/Qwen2 1.5B/3B（Instruct/Chat）
- DeepSeek-R1-Distill-Qwen 1.5B
- Phi-2/Phi-3-mini 3.8B
- MiniCPM 2B/2.4B
- ChatGLM3-6B（w8a8 量化）
- Gemma 2B/7B（w8a8）
- Llama 2 7B（w4a16/w8a8）
- InternLM2 7B

### 2. 极限尝试（7B–10B，需优化）

- Qwen 7B、Llama 2 7B、ChatGLM3-6B（w4a16 + KV 缓存优化 + 短上下文）
- Qwen3.5-7B、Llama 3 8B（w4 量化 + llama.cpp + GPU offload）

### 3. 多模态 / 视觉（NPU 友好）

- Whisper（small/medium） 语音识别
- YOLOv8/v10、PPOCR 检测 / OCR
- MiniCPM-V 2B 多模态对话

## RKNN vs RKLLM

### RKNN（RKNN-Toolkit2）

- 定位：瑞芯微**通用 AI 模型**部署框架（CV 为主：图像分类、检测、OCR、YOLO、人脸等）
- 格式：`.rknn`
- 输入：ONNX、Caffe、TensorFlow、PyTorch（非原生 LLM）
- 不擅长：大语言模型的**自回归生成、KV 缓存、长上下文、动态解码**

### RKLLM（RKNN-LLM）

- 定位：瑞芯微LLM 专用推理框架（专为大语言模型优化）
- 格式：`.rkllm`
- 输入：Hugging Face、GGUF 格式大模型（Llama、Qwen、ChatGLM、Phi 等）
- 核心能力：**w8a8/w4a16 量化、KV 缓存管理、多轮对话、长上下文、NPU 硬件调度**
- 底层：**依赖 RKNPU 驱动**，和 RKNN 共用 NPU 硬件，但上层逻辑完全为 LLM 定制

## 为什么部署大模型必须用 RKLLM

### RKNN 不支持 LLM 原生架构

- RKNN 没有针对 Transformer、自回归生成、动态长度、KV 缓存做优化，直接转 LLM 到 RKNN 会**跑不起来、速度极慢、内存爆炸**
- RKLLM 是瑞芯微官方为 LLM 做的**专用适配层**，把大模型的计算图、算子、内存调度全部优化到 NPU

### 量化与内存管理

- RKLLM 支持**w8a8/w4a16**（RK3588 最优），直接适配 NPU 硬件指令集
- 内置**KV 缓存优化、上下文管理、分层卸载**，32GB 内存跑 7B 模型不 OOM

### 推理 API 与体验

- RKLLM 提供`chat()`、`generate()`等**对话专用 API**，开箱即用
- RKNN 只有通用`inference()`，无法直接做文本生成与多轮对话

## 环境准备

```bash
# 更新依赖
sudo apt update
sudo apt install virtualenv python3 python3-dev python3-pip -y
sudo apt install libxslt1-dev zlib1g zlib1g-dev libglib2.0-0 libsm6 libgl1-mesa-glx libprotobuf-dev gcc git -y

# 安装Python基础库
pip3 install torch transformers huggingface_hub
```

## 安装 RKLLM（NPU 核心框架）

```bash
# 克隆官方仓库
git clone https://github.com/airockchip/rknn-llm.git

cd rknn-llm/rkllm-runtime/Linux/librkllm_api/aarch64
sudo cp librkllmrt.so /usr/lib/
sudo ldconfig
```

## 下载模型

### Qwen2-1.5B

```bash
# 下载轻量聊天模型（国内高速）
huggingface-cli download --local-dir-use-symlinks False Qwen/Qwen2-1.5B-Instruct
```

## 转换模型

在x86的Ubuntu上：

```bash
# 1. 安装依赖
sudo apt update && sudo apt install -y git python3-pip python3-venv

# 2. 克隆 rknn-llm（含 toolkit）
git clone https://github.com/airockchip/rknn-llm.git
cd rknn-llm/rkllm-toolkit/packages

# 3. 安装对应 Python 版本的 whl（以 cp311 为例，按你实际版本）
pip install ./rkllm_toolkit-1.2.3-cp311-cp311-linux_x86_64.whl --user

# 安装 RKLLM 工具包
pip3 install rkllm-toolkit-*.whl
```
