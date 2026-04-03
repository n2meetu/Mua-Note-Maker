const app = getApp()
const config = require('../../utils/config')

const COMPATIBILITY_TIP = '💡 揯示：当前微信开发者工具模拟器可能不支持语音识别API，请在真机上测试语音功能。如仍无法使用,请手动输入内容。如果语音识别失败会会自动降级到手动输入。。

Page({
  data: {
    recordText: '步骤如下:\\n1️⃣艾理干净 清洗3遍,焯水\n2️⃣切好食材 备用\n3️⃣下锅炒制 加调料',
    isRecording: false,
    recognizedText: '',
    voiceButtonText: '按住说话',
    voiceSupported: false,
    voiceStatusText: '正在检查语音支持...',
    showManualInput: false
  },

  onLoad() {
    this.checkVoiceSupport()
  },

  // 检查语音识别是否支持
  checkVoiceSupport() {
    const systemInfo = wx.getSystemInfoSync()
    
    console.log('系统信息:', systemInfo)
    
    // 检查API是否存在
    if (typeof wx.createRecognizerContext === 'function') {
      console.log('✅ 语音识别API可用')
      this.initRecognizer()
    } else {
      console.error('❌ 语音识别API不可用')
      this.setData({
        voiceSupported: false,
        voiceStatusText: '当前环境不支持语音识别，请使用手动输入',
        showManualInput: true
      })
    }
  },

  initRecognizer() {
    try {
      // 创建语音识别器
      this.recognizerManager = wx.createRecognizerContext()
      
      if (!this.recognizerManager) {
        throw new Error('创建识别器失败')
      }
      
      console.log('✅ 语音识别器创建成功')
      
      // 实时识别回调
      this.recognizerManager.onRecognize((res) => {
        console.log('🎤 实时识别:', res.result)
        this.setData({
          recognizedText: res.result
        })
      })

      // 识别错误回调
      this.recognizerManager.onError((err) => {
        console.error('❌ 识别错误:', err)
        wx.showToast({
          title: '识别失败: ' + (err.errMsg || '请重试'),
          icon: 'none',
          duration: 2000
        })
        this.setData({
          isRecording: false,
          voiceButtonText: '按住说话'
        })
      })

      // 识别结束回调
      this.recognizerManager.onStop((res) => {
        console.log('✅ 识别结束:', res.result)
        if (res.result) {
          const newText = this.data.recordText + '\n' + res.result
          this.setData({
            recordText: newText,
            recognizedText: res.result
          })
          
          // 鷻加成功提示
          wx.showToast({
            title: '✅ 已添加到文本',
            icon: 'success',
            duration: 1500
          })
        }
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

  // 开始语音识别
  startVoiceRecognition() {
    if (this.data.isRecording) {
      console.log('⚠️ 已在录音中')
      return
    }

    if (!this.data.voiceSupported || !this.recognizerManager) {
      console.error('❌ 语音识别不可用')
      wx.showToast({
        title: '当前设备不支持语音识别',
        icon: 'none',
        duration: 2000
      })
      return
    }

    console.log('🎤 开始语音识别...')
    
    wx.showLoading({
      title: '正在初始化...',
      mask: true
    })

    try {
      const options = {
        lang: 'zh_CN',
        continuous: true,
        punct: true
      }

      this.recognizerManager.start(options)
      
      this.setData({
        isRecording: true,
        voiceButtonText: '松开结束',
        recognizedText: ''
      })

      console.log('✅ 语音识别已启动')
      wx.hideLoading()
      
    } catch (err) {
      console.error('❌ 启动失败:', err)
      wx.hideLoading()
      wx.showToast({
        title: '启动失败: ' + err.errMsg,
        icon: 'none',
        duration: 2000
      })
    }
  },

  // 停止语音识别
  stopVoiceRecognition() {
    if (!this.data.isRecording) {
      console.log('⚠️ 未在录音中')
      return
    }

    console.log('⏹️ 停止语音识别...')
    
    if (this.recognizerManager) {
      try {
        this.recognizerManager.stop()
        console.log('✅ 已停止语音识别')
      } catch (err) {
        console.error('❌ 停止失败:', err)
      }
    }
    
    this.setData({
      isRecording: false,
      voiceButtonText: '按住说话'
    })
  },

  // 手指长按事件
  handleVoicePress() {
    console.log('👆 按钮事件触发, isRecording:', this.data.isRecording)
    
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
        icon: 'none',
        duration: 2000
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
