const app = getApp()
const config = require('../../utils/config')

Page({
  data: {
    recordText: '步骤如下：\n1️⃣艾理干净 清洗3遍，焯水\n2️⃣切好食材 备用\n3️⃣下锅炒制 加调料',
    isRecording: false,
    recognizedText: '',
    voiceButtonText: '按住说话'
  },

  onLoad() {
    this.initRecognizer()
  },

  initRecognizer() {
    // 创建语音识别器
    this.recognizerManager = wx.createRecognizerContext()
    
    // 实时识别回调
    this.recognizerManager.onRecognize((res) => {
      console.log('实时识别结果:', res.result)
      this.setData({
        recognizedText: res.result
      })
    })

    // 识别错误回调
    this.recognizerManager.onError((err) => {
      console.error('识别错误:', err)
      wx.showToast({
        title: '识别失败，请重试',
        icon: 'none'
      })
      this.setData({
        isRecording: false,
        voiceButtonText: '按住说话'
      })
    })

    // 识别结束回调
    this.recognizerManager.onStop((res) => {
      console.log('识别结束:', res.result)
      if (res.result) {
        this.setData({
          recordText: this.data.recordText + '\n' + res.result,
          recognizedText: res.result
        })
      }
    })
  },

  // 开始语音识别
  startVoiceRecognition() {
    if (this.data.isRecording) return

    wx.showLoading({
      title: '正在初始化...',
      mask: true
    })

    const options = {
      lang: 'zh_CN',
      continuous: true,  // 持续识别
      punct: true  // 自动添加标点
    }

    this.recognizerManager.start(options)
    
    this.setData({
      isRecording: true,
      voiceButtonText: '松开结束',
      recognizedText: ''
    })

    wx.hideLoading()
  },

  // 停止语音识别
  stopVoiceRecognition() {
    if (!this.data.isRecording) return

    this.recognizerManager.stop()
    
    this.setData({
      isRecording: false,
      voiceButtonText: '按住说话'
    })
  },

  // 手指长按事件
  handleVoicePress() {
    if (this.data.isRecording) {
      this.stopVoiceRecognition()
    } else {
      this.startVoiceRecognition()
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
        icon: 'none'
      })
      return
    }

    app.globalData.voiceText = this.data.recordText

    wx.navigateTo({
      url: '/pages/preview/preview'
    })
  },

  // 返回上一步
  goBack() {
    wx.navigateBack()
  }
})
