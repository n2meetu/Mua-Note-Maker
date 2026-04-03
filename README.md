# Mua Note Maker

小红书美食笔记生成器 - 拍照 + 语音，自动生成小红书风格笔记

## 功能特点

- 📸 **拍照上传**：支持单张或多张图片（最多9张）
- 🎙️ **语音识别**：按住说话，自动转文字（基于微信原生API）
- ✍️ **混合输入**：语音+手动双模式，灵活记录
- 🤖 **AI生成文案**：自动生成小红书风格笔记
- ✏️ **预览编辑**：可微调标题和内容
- 📋 **一键复制**：复制到剪贴板，直接粘贴到小红书

## 技术栈

### 前端（微信小程序）
- 原生小程序框架
- 微信语音识别 API
- Canvas 图片处理

### 后端（Node.js）
- Express 框架
- ChatGLM-4 AI 接口
- 微信小程序云开发（可选）

## 项目结构

```
Mua-Note-Maker/
├── miniprogram/          # 小程序前端
│   ├── pages/
│   │   ├── index/        # 首页
│   │   ├── record/       # 录音生成页
│   │   └── preview/      # 预览编辑页
│   ├── utils/
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── server/               # 后端服务
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── package.json
└── README.md
```

## 快速开始

### 1. 配置小程序

1. 注册微信小程序账号（个人版即可）
2. 获取 AppID
3. 修改 `miniprogram/app.json` 中的 AppID

### 2. 配置后端服务

```bash
cd server
npm install
```

创建 `.env` 文件：
```
PORT=3000
CHATGLM_API_KEY=your_api_key_here
```

启动服务：
```bash
npm start
```

### 3. 配置小程序请求地址

修改 `miniprogram/utils/config.js`：
```javascript
const API_BASE_URL = 'http://your-server-ip:3000'
```

### 4. 导入小程序

1. 下载微信开发者工具
2. 导入 `miniprogram` 目录
3. 点击"编译"预览
4. 点击"上传"发布体验版

## 使用流程

1. 打开小程序
2. 点击"拍照"或"从相册选择"
3. 按住"录音"按钮，描述做菜步骤
4. 点击"生成笔记"
5. 预览并微调文案
6. 点击"复制文案"
7. 打开小红书，粘贴发布

## 开发计划

- [x] 项目初始化
- [ ] 前端页面开发
- [ ] 语音录制功能
- [ ] AI 文案生成
- [ ] 文案预览编辑
- [ ] 一键复制功能
- [ ] 体验版发布

## 后续优化

- [ ] 图片智能识别（自动识别菜品）
- [ ] 文案风格模板（简约/详细/种草）
- [ ] 草稿箱功能
- [ ] 历史记录
- [ ] 封面图生成

## License

MIT
