const app = getApp()
const config = require('../../utils/config')

Page({
  data: {
    recordText: '步骤如下:\\n1️⃣艾理干净 清洗3遍,焯水\n2️⃣切好食材 备用\n3️⃣下锅炒制 加调料',
    isRecording: false,
    voiceButtonText: '按住说话',
    voiceSupported: false,
    voiceStatusText: '正在检查语音支持...',
    showManualInput: false,
    recognizedText: ''
  },

  onLoad() {
    this.checkVoiceSupport()
  },

  // 检查语音识别是否支持
  checkVoiceSupport() {
    const systemInfo = wx.getSystemInfoSync()
    
    console.log('系统信息:', systemInfo)
    
    // 使用微信官方的录音管理器
    if (typeof wx.getRecorderManager === 'function') {
      console.log('✅ 录音API可用')
      this.initRecorder()
    } else {
      console.error('❌ 录音API不可用')
      this.setData({
        voiceSupported: false,
        voiceStatusText: '当前环境不支持录音，请使用手动输入',
        showManualInput: true
      })
    }
  },

  initRecorder() {
    try {
      // 创建录音管理器
      this.recorderManager = wx.getRecorderManager()
      
      if (!this.recorderManager) {
        throw new Error('创建录音管理器失败')
      }
      
      console.log('✅ 录音管理器创建成功')
      
      // 录音开始回调
      this.recorderManager.onStart(() => {
        console.log('🎤 录音开始')
        this.setData({
          isRecording: true,
          voiceButtonText: '松开结束',
          recognizedText: ''
        })
        wx.hideLoading()
      })

      // 录音暂停回调
      this.recorderManager.onPause(() => {
        console.log('⏸️ 录音暂停')
      })

      // 录音结束回调
      this.recorderManager.onStop((res) => {
        console.log('⏹️ 录音结束:', res)
        this.setData({
          isRecording: false,
          voiceButtonText: '按住说话'
        })
        
        // 上传音频文件进行识别
        if (res.tempFilePath) {
          this.uploadAndRecognize(res.tempFilePath)
        }
      })

      // 录音错误回调
      this.recorderManager.onError((err) => {
        console.error('❌ 录音错误:', err)
        wx.hideLoading()
        wx.showToast({
          title: '录音失败: ' + (err.errMsg || '请重试'),
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isRecording: false,
          voiceButtonText: '按住说话'
        })
      })

      this.setData({
        voiceSupported: true,
        voiceStatusText: '语音识别已就绪',
        showManualInput: false
      })
      
    } catch (err) {
      console.error('❌ 初始化失败:', err)
      this.setData({
        voiceSupported: false,
        voiceStatusText: '初始化失败,请手动输入',
        showManualInput: true
      })
      
      wx.showToast({
        title: '语音识别不可用',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 开始录音
  startRecording() {
    if (this.data.isRecording) {
      console.log('⚠️ 已在录音中')
      return
    }

    if (!this.data.voiceSupported || !this.recorderManager) {
      console.error('❌ 录音功能不可用')
      wx.showToast({
        title: '当前设备不支持录音',
        icon: 'none',
        duration: 2000
      })
      return
    }

    console.log('🎤 开始录音...')
    
    wx.showLoading({
      title: '正在初始化...',
      mask: true
    })

    try {
      const options = {
        duration: 60000,        // 最长录音时间 60s
        sampleRate: 16000,      // 采样率（百度要求）
        numberOfChannels: 1,    // 单声道（百度要求）
        encodeBitRate: 64000,   // 编码码率
        format: 'wav'           // 音频格式（百度支持）
      }

      this.recorderManager.start(options)
      
    } catch (err) {
      console.error('❌ 启动录音失败:', err)
      wx.hideLoading()
      wx.showToast({
        title: '启动录音失败',
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 停止录音
  stopRecording() {
    if (!this.data.isRecording) {
      console.log('⚠️ 未在录音中')
      return
    }

    console.log('⏹️ 停止录音...')
    
    if (this.recorderManager) {
      try {
        this.recorderManager.stop()
        console.log('✅ 已停止录音')
      } catch (err) {
        console.error('❌ 停止录音失败:', err)
      }
    }
  },

  // 上传音频并识别
  async uploadAndRecognize(tempFilePath) {
    wx.showLoading({
      title: '识别中...',
      mask: true
    })

    try {
      // 上传到服务器
      const uploadRes = await new Promise((resolve, reject) => {
        wx.uploadFile({
          url: `${config.API_BASE_URL}/api/voice/recognize`,
          filePath: tempFilePath,
          name: 'audio',
          formData: {
            'platform': 'baidu' 
          },
          success: (res) => {
            if (res.statusCode === 200) {
               console.log('百度，识别结果:', res.data)
              resolve(JSON.parse(res.data))
            } else {
              reject(new Error(`上传失败: ${res.statusCode}`))
            }
          },
          fail: reject
        })
      })

      wx.hideLoading()

      if (uploadRes.success && uploadRes.data.text) {
        const newText = this.data.recordText + '\n' + uploadRes.data.text
        
        this.setData({
          recordText: newText,
          recognizedText: uploadRes.data.text
        })
        
        wx.showToast({
          title: '✅ 已添加到文本',
          icon: 'success',
          duration: 1500
        })
      } else {
        throw new Error(uploadRes.message || '识别失败')
      }
      
    } catch (err) {
      console.error('❌ 语音识别失败:', err)
      wx.hideLoading()
      
      // 网络错误时的友好提示
      let errorMsg = '识别失败，请手动输入'
      if (err.errMsg && err.errMsg.includes('ERR_ADDRESS_UNREACHABLE')) {
        errorMsg = '网络不通，请手动输入或检查配置'
      }
      
      wx.showModal({
        title: '语音识别失败',
        content: `${errorMsg}\n\n可能原因：\n1. 手机和电脑不在同一 Wi-Fi\n2. 路由器 AP 隔离\n\n请先使用手动输入，或配置 ngrok 内网穿透`,
        showCancel: false,
        confirmText: '知道了'
      })
      
      // 降级到手动输入
      this.setData({
        showManualInput: true,
        voiceStatusText: '语音识别失败，已切换到手动输入'
      })
    }
  },

  // 手指长按事件
  handleVoicePress() {
    console.log('👆 按钮事件触发, isRecording:', this.data.isRecording)
    
    if (this.data.isRecording) {
      this.stopRecording()
    } else {
      this.startRecording()
    }
  },

  // 输入文字
  onTextInput(e) {
    this.setData({
      recordText: e.detail.value
    })
  },

  // 生成笔记
  generateNote() {
    if (!this.data.recordText.trim()) {
      wx.showToast({
        title: '请先输入做菜步骤',
        icon: 'none',
        duration: 2000
      })
      return
    }

    // 使用本地存储持久化数据
    try {
      wx.setStorageSync('voiceText', this.data.recordText)
      console.log('✅ 语音文字已保存到本地存储')
    } catch (err) {
      console.error('❌ 保存失败:', err)
    }

    wx.navigateTo({
      url: '/pages/preview/preview'
    })
  },

  // 返回上一步
  goBack() {
    wx.navigateBack()
  }
})
