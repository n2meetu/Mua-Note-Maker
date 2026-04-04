// 配置文件
// ⚠️ 真机测试方式：
// 方式1（同一Wi-Fi）：使用局域网 IP
//   const API_BASE_URL = 'http://192.168.3.239:3000'
// 方式2（推荐）：使用 ngrok 内网穿透
//   1. 安装: brew install ngrok
//   2. 启动: ngrok http 3000
//   3. 复制 ngrok 给的 https 地址到下面
// 配置文件
// ⚠️ 真机测试时必须使用电脑的局域网 IP（不能用 localhost/127.0.0.1）
// 获取本机 IP: 终端运行 ifconfig | grep "inet " | grep -v 127.0.0.1
// 
// 🔥 手机热点方案（推荐）
// 1. 手机开启热点（设置 → 个人热点）
// 2. 电脑连接手机热点
// 3. 修改下面的 IP 为新 IP（例如 172.20.10.2）
// const API_BASE_URL = 'http://172.20.10.2:3000' // 改成你的新 IP

// 等待 ngrok 完成后改回来
// 如果不想用手机热点，请安装 ngrok:
//   brew install ngrok
//   ngrok http 3000
//   复制 ngrok 给的 https 地址
// 例如: https://abc123.ngrok.io
//   修改下面的配置为 ngrok 地址
const API_BASE_URL = 'https://cliffless-anastacia-overbookishly.ngrok-free.dev'
// ⚠️ 手机浏览器测试: http://192.168.3.239:3000/health

module.exports = {
  API_BASE_URL,
  
  // API 接口
  API: {
    GENERATE_NOTE: `${API_BASE_URL}/api/note/generate`,
    UPLOAD_IMAGE: `${API_BASE_URL}/api/image/upload`
  },
  
  // 最大图片数量
  MAX_IMAGE_COUNT: 9,
  
  // 录音最大时长（秒）
  MAX_RECORD_DURATION: 60
}
