const fs = require('fs')
const path = require('path')
const axios = require('axios')

class VoiceService {
  // constructor() {
  //   this.useMock = false // 默认使用 mock，避免需要配置第三方服务
  // }

  /**
   * 语音识别（支持多个平台）
   * @param {string} audioFilePath - 音频文件路径
   * @param {string} platform - 平台选择：tencent/baidu/mock
   */
  async recognize(audioFilePath, platform = 'mock') {
    console.log('🎤 开始语音识别:', { audioFilePath, platform })

    // Mock 模式：直接返回固定文本（用于开发测试）
    if (platform === 'mock') {
      return this.mockRecognize(audioFilePath)
    }

    // 腾讯云语音识别（推荐，微信生态集成更好）
    if (platform === 'tencent') {
      return this.tencentRecognize(audioFilePath)
    }

    // 百度语音识别
    if (platform === 'baidu') {
      return this.baiduRecognize(audioFilePath)
    }

    throw new Error('不支持的语音识别平台')
  }

  /**
   * Mock 语音识别（开发测试用）
   */
  async mockRecognize(audioFilePath) {
    console.log('📦 使用 Mock 语音识别')

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // 返回一段示例文本
    return {
      success: true,
      text: '首先将食材清洗干净，然后切成小块备用。热锅倒油，放入蒜末爆香，加入主料翻炒。加入适量调料，翻炒均匀即可。',
      duration: 3.5
    }
  }

  /**
   * 腾讯云语音识别
   * 文档：https://cloud.tencent.com/document/product/1093
   */
  async tencentRecognize(audioFilePath) {
    // TODO: 实现腾讯云语音识别
    // 需要：SecretId, SecretKey
    // 使用腾讯云 SDK：tencentcloud-sdk-nodejs

    throw new Error('腾讯云语音识别尚未实现，请在 voiceService.js 中补充')
  }



  /**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
  async getAccessToken() {
    const AK = process.env.BAIDU_AK || "vqVTIoLFN98uayAh3oDVWkL0"
    const SK = process.env.BAIDU_SK || "jWsCjWBJPZfDCBWNk27FKCQCiFl38fRX"

    let options = {
      'method': 'POST',
      'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
      axios(options)
        .then(res => {
          resolve(res.data.access_token)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * 百度语音识别
   * 文档：https://ai.baidu.com/ai-doc/SPEECH/Nk38y8pbm
   */
  async baiduRecognize(audioFilePath) {
    console.log('📦 使用百度语音识别')

    try {
      // 读取音频文件
      const audioBuffer = fs.readFileSync(audioFilePath)
      const audioBase64 = audioBuffer.toString('base64')
      const accessToken = await this.getAccessToken()

      const response = await axios.post(
        'https://vop.baidu.com/pro_api',
        {
          format: 'wav',  // 百度支持: pcm/wav/amr/m4a
          rate: 16000,
          channel: 1,
          cuid: 'wCdw81klXGVQzI1W8OgV9PPkJ5emQWNC',
          dev_pid: 80001,
          speech: audioBase64,
          len: audioBuffer.length,
          token: accessToken
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )

      const result = response.data
      console.log('✅ 百度语音识别原始返回:', JSON.stringify(result, null, 2))

      if (result.err_no === 0 && result.result && result.result.length > 0) {
        const text = result.result.join('')
        console.log('✅ 识别内容成功:', text)
        return {
          success: true,
          text,
          duration: audioBuffer.length / 16000 / 2
        }
      } else if (result.err_no === 0 && (!result.result || result.result.length === 0)) {
        throw new Error('百度语音识别成功但未识别到内容，可能是音频太短或静音')
      } else {
        throw new Error(`百度语音识别失败: ${result.err_msg || result.err_no}`)
      }
    } catch (error) {
      throw new Error(`百度语音识别失败: ${error.message}`)
    }
  }
}

module.exports = new VoiceService()
