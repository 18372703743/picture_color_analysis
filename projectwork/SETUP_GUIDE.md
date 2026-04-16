# 🤖 AI 配色分析系统 - 完整设置指南

## 📋 系统架构

```
前端 (HTML+JS) 
    ↓ (HTTP POST)
Flask 后端 API (Python)
    ↓ 
Close-AI OpenAI API
    ↓
GPT-4.1-mini 模型
```

---

## 🚀 快速启动步骤

### 第1步：启动 AI API 服务器

```powershell
# 方式A：使用 PowerShell
cd d:\data_vis\projectwork
D:/ananconda/Scripts/conda.exe run -n closeai_env python ai_server.py

# 方式B：创建批处理文件（双击即可运行）
# 文件名：start-ai-server.bat
```

**确认服务器已启动：**
```
✅ 应该看到：
Server running at: http://localhost:5000
API Endpoint: POST /api/color-analysis
```

---

### 第2步：启动前端网页

在浏览器中打开：
```
file:///d:/data_vis/projectwork/index.html
```

或者用 Python 启动一个简单的 HTTP 服务器：
```powershell
cd d:\data_vis\projectwork
D:/ananconda/Scripts/conda.exe run -n closeai_env python -m http.server 8000
```

然后访问：`http://localhost:8000`

---

### 第3步：使用流程

1. **上传图片** - 点击文件输入框选择图片
2. **调整参数** - 修改 K 值和色彩空间（可选）
3. **点击分析** - "开始分析" 按钮
4. **查看结果** - 等待 AI 配色诊断

---

## 📂 文件结构

```
d:\data_vis\projectwork\
├── index.html              ← 网页界面
├── script.js              ← 前端 JavaScript（已更新）
├── style.css              ← 样式文件
├── ai_server.py           ← 后端 API 服务器（新增）
└── README.md              ← 本文件
```

---

## 🔧 关键文件说明

### ai_server.py（后端 API 服务器）

作用：
- ✅ 接收前端的颜色数据
- ✅ 调用 Close-AI 的 OpenAI API
- ✅ 返回 AI 的配色分析结果

端点：`POST /api/color-analysis`

请求体：
```json
{
    "colors_text": "颜色1: RGB(255, 0, 0)\n颜色2: RGB(0, 255, 0)"
}
```

响应：
```json
{
    "success": true,
    "analysis": "这是 AI 的配色分析结果...",
    "tokens_used": 231
}
```

### script.js（前端脚本）

新增函数 `askAI(colorCentroids)` 用于：
- 格式化颜色数据
- 发送 FETCH 请求到后端
- 显示 AI 的分析结果

---

## ⚙️ 配置修改

### 修改 AI 模型

在 `ai_server.py` 中修改：
```python
model="gpt-4.1-mini"  # ← 改为其他模型名称
```

### 修改 API Key

在 `ai_server.py` 中修改：
```python
api_key='sk-xxx'  # ← 替换为您的实际 API Key
```

### 修改 API 地址

在 `script.js` 中修改：
```javascript
fetch('http://localhost:5000/api/color-analysis', { ... })
                      ↑
                   可改为其他地址
```

---

## 🛠️ 故障排查

### ❌ 连接失败：无法连接到 localhost:5000

**原因**：后端服务器未启动

**解决**：
```powershell
# 启动服务器
cd d:\data_vis\projectwork
D:/ananconda/Scripts/conda.exe run -n closeai_env python ai_server.py
```

### ❌ AI 返回错误：401 - Invalid API Key

**原因**：API Key 无效或已过期

**解决**：
1. 从超星泛雅重新下载 API Key
2. 更新 `ai_server.py` 中的 API Key

### ❌ 浏览器跨域错误 (CORS)

**原因**：浏览器安全限制

**解决**：已在 `ai_server.py` 中配置 CORS，应该不会出现此错误

---

## 📝 示例工作流程

1. **用户上传**：选择一张图片（如日落照片）
2. **前端处理**：K-means 聚类提取主要颜色
3. **后端分析**：将颜色数据发送到 AI
4. **AI 回复**：
   ```
   配色方案分析：暖色系为主，橙红色与金黄色搭配和谐...
   色彩属性：冷色0%，暖色100%...
   应用建议：适合用于秋季或温暖主题的设计...
   改进方案：可以加入冷色元素以增加对比度...
   ```

---

## 💡 常见问题

**Q: 为什么使用后端 API 而不是直接调用？**
A: 安全性。直接在前端暴露 API Key 很危险。

**Q: 可以用其他 AI 服务吗？**
A: 可以。只需修改 `ai_server.py` 中的 API 端点和 Key。

**Q: 服务器要一直运行吗？**
A: 是的。当用户点击"分析"时，前端会调用后端，所以后端必须始终在线。

---

## 📞 技术支持

如遇到问题，请检查：
1. ✅ API Key 是否正确
2. ✅ 后端服务器是否运行
3. ✅ 前端是否正确加载 script.js
4. ✅ 浏览器控制台是否有错误（F12）

---

## 版本信息

- Python: 3.9
- Flask: 最新
- OpenAI: 最新
- Close-AI 平台: https://doc.closeai-asia.com/
