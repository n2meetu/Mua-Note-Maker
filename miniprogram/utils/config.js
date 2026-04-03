// 配置文件
const API_BASE_URL = 'http://localhost:3000' // 修改为你的服务器地址

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
