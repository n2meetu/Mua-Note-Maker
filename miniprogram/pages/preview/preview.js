const app = getApp()
const config = require('../../utils/config')

Page({
  data: {
    title: '',
    content: '',
    tags: '',
    isLoading: true,
    isEditingTitle: false,
    isEditingContent: false,
    isEditingTags: false
  },

  onLoad() {
    this.generateNote()
  },

  // 生成笔记
  generateNote() {
    wx.showLoading({ title: '生成中...' })

    wx.request({
      url: config.API.GENERATE_NOTE,
      method: 'POST',
      data: {
        voiceText: app.globalData.voiceText,
        imageCount: app.globalData.images.length
      },
      timeout: 30000,
      success: (res) => {
        wx.hideLoading()
        console.log('✅ API 响应成功:', res)

        if (res.statusCode === 200 && res.data) {
          const result = res.data
          
          if (result.success) {
            const { title, content, tags } = result.data
            this.setData({
              title,
              content,
              tags,
              isLoading: false
            })
            app.globalData.generatedNote = result.data
            
            wx.showToast({
              title: '✅ 生成成功',
              icon: 'success'
            })
          } else {
            // 使用返回的数据（即使是错误情况）
            const { title, content, tags } = result.data || {}
            if (title && content) {
              this.setData({
                title,
                content,
                tags: tags || '#美食 #分享',
                isLoading: false
              })
              app.globalData.generatedNote = result.data
              
              wx.showToast({
                title: '⚠️ 使用测试数据',
                icon: 'none',
                duration: 2000
              })
            } else {
              this.useMockData()
            }
          }
        } else {
          this.useMockData()
        }
      },
      fail: (err) => {
        wx.hideLoading()
        console.error('❌ API 请求失败:', err)
        
        wx.showModal({
          title: '提示',
          content: '后端服务未启动，是否使用测试数据预览？',
          success: (res) => {
            if (res.confirm) {
              this.useMockData()
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },

  // 使用 Mock 数据（测试用）
  useMockData() {
    const mockData = {
      title: '🔥 零失败！这道红烧排骨香到邻居来敲门',
      content: `今天做了超级好吃的红烧排骨！分享给大家我的独门秘方～

📝 制作步骤：
Step1️⃣ 排骨冷水下锅，焯水去腥
Step2️⃣ 锅里放油，加冰糖炒糖色
Step3️⃣ 下排骨翻炒上色
Step4️⃣ 加生抽、老抽、料酒
Step5️⃣ 倒入开水，小火炖40分钟
Step6️⃣ 大火收汁，撒上葱花

💡 小贴士：
炒糖色是关键！要用小火慢慢炒，颜色才会漂亮`,
      tags: '#美食 #家常菜 #红烧排骨 #美食教程 #下饭菜 #懒人菜谱'
    }

    this.setData({
      ...mockData,
      isLoading: false
    })
    
    app.globalData.generatedNote = mockData
    
    wx.showToast({
      title: '使用测试数据',
      icon: 'none'
    })
  },

  // 编辑标题
  startEditTitle() {
    this.setData({ isEditingTitle: true })
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  finishEditTitle() {
    this.setData({ isEditingTitle: false })
    app.globalData.generatedNote.title = this.data.title
  },

  // 编辑内容
  startEditContent() {
    this.setData({ isEditingContent: true })
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  finishEditContent() {
    this.setData({ isEditingContent: false })
    app.globalData.generatedNote.content = this.data.content
  },

  // 编辑标签
  startEditTags() {
    this.setData({ isEditingTags: true })
  },

  onTagsInput(e) {
    this.setData({ tags: e.detail.value })
  },

  finishEditTags() {
    this.setData({ isEditingTags: false })
    app.globalData.generatedNote.tags = this.data.tags
  },

  // 复制文案
  copyNote() {
    const fullText = `${this.data.title}\n\n${this.data.content}\n\n${this.data.tags}`
    
    wx.setClipboardData({
      data: fullText,
      success: () => {
        // 震动反馈
        wx.vibrateShort({
          type: 'success'
        })
        
        // 显示成功提示
        wx.showToast({
          title: '✅ 已复制到剪贴板',
          icon: 'success',
          duration: 2500
        })
        
        // 延迟显示额外提示
        setTimeout(() => {
          wx.showModal({
            title: '复制成功！',
            content: '文案已复制到剪贴板，现在可以打开小红书粘贴发布了～',
            showCancel: false,
            confirmText: '知道了'
          })
        }, 500)
      },
      fail: () => {
        wx.showToast({
          title: '复制失败，请重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 返回编辑页
  goBackToEdit() {
    wx.navigateBack()
  },

  // 返回首页
  goHome() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  }
})
