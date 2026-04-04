// 配置文件
// 生产环境：Vercel 部署
const API_BASE_URL = 'https://mua-note-maker.vercel.app'

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
