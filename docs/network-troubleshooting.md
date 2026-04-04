# 网络问题排查

## 🔧 临时解决方案（推荐）：使用 ngrok 内网穿透

```bash
# 安装 ngrok（如果未安装）
brew install ngrok

# 启动内网穿透
ngrok http 3000
```

会显示类似：
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

修改小程序配置：
```javascript
// miniprogram/utils/config.js
const API_BASE_URL = 'https://abc123.ngrok.io'
```

**优点：**
- 不受防火墙限制
- 手机可以用 4G/5G 访问
- 支持 HTTPS（小程序正式版需要）
