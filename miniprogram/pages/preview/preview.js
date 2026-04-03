const app = getApp()
const config = require('../../utils/config')

Page({
  data: {
    title: '',
    content: '',
    tags: '',
    isLoading: true,
    isEditing: false
  },

  onLoad() {
    this.generateNote()
  },

  // 生成笔记
  async generateNote() {
    wx.showLoading({ title: '生成中...' })

    try {
      const res = await wx.request({
        url: config.API.GENERATE_NOTE,
        method: 'POST',
        data: {
          voiceText: app.globalData.voiceText,
          imageCount: app.globalData.images.length
        }
      })

      wx.hideLoading()

      if (res.data.success) {
        const { title, content, tags } = res.data.data
        this.setData({
          title,
          content,
          tags,
          isLoading: false
        })
        app.globalData.generatedNote = res.data.data
      } else {
        throw new Error(res.data.message)
      }
    } catch (err) {
      wx.hideLoading()
      console.error('生成笔记失败', err)
      
      wx.showModal({
        title: '生成失败',
        content: err.errMsg || '网络错误，请重试',
        showCancel: false
      })

      this.setData({ isLoading: false })
    }
  },

  // 编辑标题
  editTitle() {
    this.setData({ isEditing: true })
    
    wx.showModal({
      title: '编辑标题',
      editable: true,
      placeholderText: this.data.title,
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({
            title: res.content,
            isEditing: false
          })
        }
      }
    })
  },

  // 编辑内容
  editContent() {
    this.setData({ isEditing: true })
    
    wx.showModal({
      title: '编辑内容',
      editable: true,
      placeholderText: this.data.content,
      success: (res) => {
        if (res.confirm && res.content) {
          this.setData({
            content: res.content,
            isEditing: false
          })
        }
      }
    })
  },

  // 复制文案
  copyNote() {
    const fullText = `${this.data.title}\n\n${this.data.content}\n\n${this.data.tags}`
    
    wx.setClipboardData({
      data: fullText,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      }
    })
  },

  // 重新生成
  regenerate() {
    this.setData({ isLoading: true })
    this.generateNote()
  },

  // 返回首页
  goHome() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  }
})
