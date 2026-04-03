const app = getApp()
const config = require('../../utils/config')
const recorderManager = wx.getRecorderManager()
const recognizerManager = wx.createRecognizerTask()

Page({
  data: {
    isRecording: false,
    recordText: '',
    duration: 0,
    formattedDuration: '00:00'
  },

  onLoad() {
    // 初始化录音管理器
    recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.processVoice(res.tempFilePath)
    })

    recorderManager.onError((err) => {
      console.error('录音错误', err)
      wx.showToast({
        title: '录音失败',
        icon: 'none'
      })
      this.setData({ isRecording: false })
    })

    // 初始化语音识别
    recognizerManager.onRecognize((res) => {
      console.log('识别中', res)
      if (res.result) {
        this.setData({
          recordText: res.result
        })
      }
    })

    recognizerManager.onComplete((res) => {
      console.log('识别完成', res)
      if (res.result) {
        this.setData({
          recordText: res.result
        })
        app.globalData.voiceText = res.result
      }
    })
  },

  // 开始/停止录音
  toggleRecord() {
    if (this.data.isRecording) {
      this.stopRecord()
    } else {
      this.startRecord()
    }
  },

  startRecord() {
    // 请求录音权限
    wx.authorize({
      scope: 'scope.record',
      success: () => {
        // 开始录音
        recorderManager.start({
          duration: config.MAX_RECORD_DURATION * 1000,
          format: 'mp3'
        })

        // 开始语音识别
        recognizerManager.start({
          lang: 'zh_CN',
          continuous: true
        })

        this.setData({
          isRecording: true,
          duration: 0,
          recordText: ''
        })

        // 开始计时
        this.timer = setInterval(() => {
          const duration = this.data.duration + 1
          const minutes = Math.floor(duration / 60)
          const seconds = duration % 60
          
          this.setData({
            duration,
            formattedDuration: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
          })
        }, 1000)
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '需要录音权限才能使用语音功能',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      }
    })
  },

  stopRecord() {
    recorderManager.stop()
    recognizerManager.stop()
    
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    this.setData({
      isRecording: false
    })
  },

  // 处理语音文件
  processVoice(tempFilePath) {
    wx.showLoading({ title: '识别中...' })
    
    // 微信小程序自带的语音识别已经处理了，这里可以做一些额外的处理
    wx.hideLoading()
    
    if (!this.data.recordText) {
      wx.showToast({
        title: '未识别到语音内容',
        icon: 'none'
      })
    }
  },

  // 生成笔记
  generateNote() {
    if (!this.data.recordText) {
      wx.showToast({
        title: '请先录制语音',
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
