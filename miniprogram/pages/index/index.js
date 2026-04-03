const app = getApp()
const config = require('../../utils/config')

Page({
  data: {
    images: [],
    hasImages: false
  },

  onLoad() {
    // 清空全局数据
    app.globalData.images = []
    app.globalData.voiceText = ''
    app.globalData.generatedNote = null
  },

  // 选择图片
  chooseImage() {
    const maxCount = config.MAX_IMAGE_COUNT - this.data.images.length
    if (maxCount <= 0) {
      wx.showToast({
        title: '最多选择9张图片',
        icon: 'none'
      })
      return
    }

    wx.chooseMedia({
      count: maxCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath)
        const images = [...this.data.images, ...newImages]
        
        this.setData({
          images,
          hasImages: images.length > 0
        })
        
        app.globalData.images = images
      }
    })
  },

  // 预览图片
  previewImage(e) {
    const current = e.currentTarget.dataset.src
    wx.previewImage({
      current,
      urls: this.data.images
    })
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images.filter((_, i) => i !== index)
    
    this.setData({
      images,
      hasImages: images.length > 0
    })
    
    app.globalData.images = images
  },

  // 下一步
  nextStep() {
    if (this.data.images.length === 0) {
      wx.showToast({
        title: '请先选择图片',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/record/record'
    })
  }
})
