# 常见问题排查

## 语音识别相关错误

### 1. `wx.createRecognizerContext is not a function`

**原因**：微信基础库版本过低

**解决方案**：
- ✅ 已在代码中添加 API 可用性检查
- ✅ 不支持时会自动显示提示并隐藏语音按钮
- ✅ 降级到手动输入模式

**检查方法**：
```javascript
// 在控制台查看基础库版本
console.log('基础库版本:', wx.getSystemInfoSync().SDKVersion)
```

### 2. `Cannot read property 'start' of undefined`

**原因**：`wx.createRecognizerContext()` 返回 undefined

**解决方案**：
- ✅ 已添加 try-catch 异常处理
- ✅ 添加 recognizerManager 初始化检查
- ✅ 调用前检查 voiceSupported 状态

### 3. 兼容性要求

**最低要求**：
- 微信基础库版本 >= 2.20.0
- 小程序已设置 libVersion: 3.15.0

**如何更新基础库**：
1. 打开微信开发者工具
2. 右上角「详情」→「本地设置」
3. 调试基础库版本选择 3.15.0 或更高

### 4. 在真机上测试

**开发者工具限制**：
- 语音识别API 在模拟器中可能不可用
- 建议在真机上测试

**真机测试方法**：
1. 点击「预览」生成二维码
2. 手机扫码打开体验版
3. 测试语音识别功能

## 降级方案

当语音识别不可用时：
- ✅ 自动隐藏语音按钮
- ✅ 显示友好提示信息
- ✅ 保留手动输入功能
- ✅ 正常使用其他所有功能

## 调试技巧

### 查看语音识别状态
在 `pages/record/record.js` 的 `onLoad` 中查看：
```javascript
console.log('语音支持:', this.data.voiceSupported)
console.log('状态:', this.data.voiceStatusText)
```

### 测试降级逻辑
在开发者工具中：
1. 详情 → 本地设置 → 调试基础库选择 2.19.0（低版本）
2. 重新编译
3. 查看是否显示不支持提示
