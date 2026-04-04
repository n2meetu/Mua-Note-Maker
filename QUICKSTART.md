# 快速启动指南

## 1. 安装依赖

### 后端
```bash
cd server
npm install
```

### 前端
使用微信开发者工具直接导入 `miniprogram` 目录

## 2. 配置

### 后端配置（server/.env）
```env
PORT=3000
CHATGLM_API_KEY=your_api_key_here  # 可选，暂时使用 Mock 数据
```

### 前端配置（miniprogram/utils/config.js）
```javascript
const API_BASE_URL = 'http://localhost:3000'  // 改为你的服务器地址
```

## 3. 启动

### 启动后端
```bash
cd server
npm start
```

### 启动前端
1. 打开微信开发者工具
2. 导入 `miniprogram` 目录
3. 点击"编译"预览

## 4. 测试语音识别

### Mock 模式（默认）
- 录音后会返回固定的示例文本
- 无需配置第三方服务
- 适合前端开发调试

### 真实识别（可选）
1. 注册腾讯云/百度云语音识别服务
2. 在 `server/services/voiceService.js` 中配置
3. 修改 `this.useMock = false`

## 5. 遇到问题？

### 录音失败
- 确认微信开发者工具版本 >= 1.02
- 真机测试（模拟器可能不支持录音）
- 检查小程序配置中的录音权限

### 识别失败
- 检查后端服务是否启动
- 查看后端控制台日志
- 尝试切换到手动输入模式

## 6. 开发调试

### 查看后端日志
```bash
cd server
npm run dev  # 使用 nodemon 自动重启
```

### 查看小程序日志
- 微信开发者工具 → 调试器 → Console

## 7. API 测试

### 测试语音识别接口
```bash
# 上传音频文件
curl -X POST http://localhost:3000/api/voice/recognize \
  -F "audio=@test.mp3" \
  -F "platform=mock"
```

### 测试笔记生成接口
```bash
curl -X POST http://localhost:3000/api/note/generate \
  -H "Content-Type: application/json" \
  -d '{
    "voiceText": "测试文本",
    "imageCount": 1
  }'
```
