# Vercel 部署问题排查

## 问题现象
Vercel 部署失败,返回 404 错误.

## 声音识别问题

**问题**: 百度语音识别 API 返回 404 错误,但 Vercel 的日志显示 `Mock mode - 未配置语音识别平台`。但实际上 Mock 模式已启用,但无法验证 API Key 是否真实.

 还需要提供正确的百度 API Key.**V

## 解决方案

### 选项 1: 快速验证(推荐)
1. 在 Vercel 项目设置中添加环境变量
2. 在 Vercel 网站上测试 API
3. 在本地开发环境使用 mock 模式

4. 通知羌芜重新上传体验版小程序码
5. 后续可以配置真实的百度语音识别

6. 皂时先部署 Mock 版本,后续再升级到 real服务

### 选项 2: 修复当前问题(添加真实的语音识别)
1. 在微信小程序端添加环境变量选择区域,让用户可以选择使用 mock 还是真实语音识别
2. 嚂时重新编译上传体验版小程序码
3. 添加一个提示:"在体验版中,语音识别将使用 mock 模式"并引导用户点击"使用 Mock" 或"切换到"真实语音识别".

4. 修改小程序代码提示:"语音识别功能已启用"
5. 添加一个文本框显示"开发环境"
6. 在引导页添加占位符说明
7. 在代码中添加 `console.log('开发环境:', platform)` 判断是否 mock 模式
7. 在语音识别成功后显示 toast 揢 `"语音识别成功"(`platform: ${platform})`)
```

让用户知道当前环境。

**配置项说明**:
`.env` 文件中有 `BAIDU_API_KEY`, `BAIDU_SECRET_KEY`, 这些值在 Vercel 部署时需要配置为环境变量.
**重要**: 环境变量名称必须与代码中的保持一致!**
`BAIDU_API_KEY` 和 `BAIDU_SECRET_KEY` 变量名必须一致.
- 代码中使用 `process.env.BAIDU_API_KEY`,`process.env.BAIDU_SECRET_KEY`
- Vercel 项目设置中环境变量名称必须与代码一致
- 添加 `BAIDU_API_KEY` 和 `BAIDU_SECRET_KEY` 瘟。
