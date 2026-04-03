# Mua Note Maker - 开发指南

## 快速开始

### 1. 准备工作

#### 注册微信小程序
1. 访问 https://mp.weixin.qq.com/
2. 注册小程序账号（个人版即可）
3. 获取 AppID

#### 获取 ChatGLM API Key
1. 访问 https://open.bigmodel.cn/
2. 注册账号
3. 获取 API Key

### 2. 后端服务部署

#### 本地开发
```bash
cd server
npm install
cp .env.example .env
# 编辑 .env 填入 CHATGLM_API_KEY
npm run dev
```

#### 服务器部署
```bash
# 使用 PM2 部署
npm install -g pm2
cd server
npm install --production
pm2 start app.js --name mua-note-server
```

### 3. 小程序配置

#### 修改 AppID
编辑 `miniprogram/app.json`：
```json
{
  "appid": "your-appid-here"
}
```

#### 修改服务器地址
编辑 `miniprogram/utils/config.js`：
```javascript
const API_BASE_URL = 'https://your-server.com'
```

### 4. 导入小程序

1. 下载微信开发者工具
2. 导入 `miniprogram` 目录
3. 点击"详情" → "本地设置" → 勾选"不校验合法域名"（开发阶段）
4. 点击"编译"预览

### 5. 发布体验版

1. 点击"上传"按钮
2. 填写版本号和备注
3. 登录小程序后台
4. "管理" → "版本管理" → 设为体验版
5. 添加体验成员（扫码即可使用）

## 常见问题

### Q: 语音识别不准确？
A: 
- 确保在安静环境录音
- 说话清晰，语速适中
- 微信小程序自带语音识别，准确率较高

### Q: AI 生成的文案不满意？
A:
- 可以在预览页点击标题/内容进行编辑
- 点击"重新生成"再次生成
- 优化 `noteService.js` 中的 prompt

### Q: 后端服务无法访问？
A:
- 检查服务器防火墙是否开放端口
- 确认域名已备案（正式版需要）
- 开发阶段可以在开发者工具中勾选"不校验合法域名"

## 后续优化

### 功能优化
- [ ] 图片智能识别（自动识别菜品）
- [ ] 文案风格模板（简约/详细/种草）
- [ ] 草稿箱功能
- [ ] 历史记录
- [ ] 封面图生成（照片上叠加标题）

### 性能优化
- [ ] 响应缓存
- [ ] 请求压缩
- [ ] CDN 加速

### 体验优化
- [ ] 加载动画
- [ ] 错误提示优化
- [ ] 引导教程

## 技术支持

如有问题，可以：
1. 查看微信小程序文档：https://developers.weixin.qq.com/miniprogram/dev/framework/
2. 查看 ChatGLM 文档：https://open.bigmodel.cn/dev/api
3. 提交 Issue（如果项目开源）
