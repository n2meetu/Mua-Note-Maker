// 配置文件
// 请安装 ngrok:
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
