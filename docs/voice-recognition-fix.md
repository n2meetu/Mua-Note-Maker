# 语音识别修复说明

## 问题

原代码使用了不存在的微信 API `wx.createRecognizerContext()`，导致语音识别功能无法使用。

## 修复方案

### 1. 后端修改（server/）

#### 新增文件
- **`server/services/voiceService.js`** - 语音识别服务
  - 支持 Mock 模式（开发测试用）
  - 预留腾讯云/百度云语音识别接口
  
- **`server/routes/voice.js`** - 语音识别路由
  - 接收音频文件上传
  - 调用语音识别服务
  - 返回识别结果

#### 修改文件
- **`server/app.js`** - 注册语音识别路由
- **`server/package.json`** - 添加 multer 依赖（用于文件上传）

### 2. 前端修改（miniprogram/）

#### 修改文件
- **`miniprogram/pages/record/record.js`** - 使用正确的录音 API
  - `wx.getRecorderManager()` - 录音管理器
  - 录音结束后上传音频文件
  - 接收识别结果并显示
  
- **`miniprogram/app.json`** - 添加录音权限配置

## 技术栈

### 前端（微信小程序）
- **wx.getRecorderManager()** - 官方录音 API
- **wx.uploadFile()** - 上传音频文件

### 后端（Node.js）
- **Express** - Web 框架
- **Multer** - 文件上传中间件
- **语音识别服务** - Mock/腾讯云/百度云

## 使用方式

### 开发测试（Mock 模式）

当前默认使用 Mock 模式，无需配置第三方服务：

```javascript
// server/services/voiceService.js
this.useMock = true
```

Mock 模式会返回固定的示例文本，适合前端开发调试。

### 生产环境（真实识别）

#### 方案一：腾讯云语音识别（推荐）

1. 注册腾讯云账号
2. 开通语音识别服务
3. 获取 SecretId 和 SecretKey
4. 安装 SDK：
   ```bash
   npm install tencentcloud-sdk-nodejs
   ```
5. 在 `server/services/voiceService.js` 中实现 `tencentRecognize()` 方法

#### 方案二：百度语音识别

1. 注册百度 AI 账号
2. 开通语音识别服务
3. 获取 API Key 和 Secret Key
4. 安装 SDK：
   ```bash
   npm install baidu-aip-sdk
   ```
5. 在 `server/services/voiceService.js` 中实现 `baiduRecognize()` 方法

## 启动项目

### 后端
```bash
cd server
npm install
npm start
```

### 前端
1. 用微信开发者工具打开 `miniprogram` 目录
2. 修改 `miniprogram/utils/config.js` 中的 `API_BASE_URL` 为后端地址
3. 点击"编译"预览

## API 接口

### POST /api/voice/recognize

上传音频文件进行识别

**请求**
- Content-Type: `multipart/form-data`
- Body:
  - `audio`: 音频文件（支持 mp3/wav/aac/m4a/pcm）
  - `platform`: 识别平台（可选，默认 mock）

**响应**
```json
{
  "success": true,
  "data": {
    "text": "识别出的文本",
    "duration": 3.5
  }
}
```

## 后续优化

- [ ] 实现腾讯云语音识别
- [ ] 实现百度语音识别
- [ ] 添加音频格式转换（如果需要）
- [ ] 添加音频压缩（减少上传时间）
- [ ] 支持长语音分段识别
- [ ] 添加离线语音识别支持（可选）
