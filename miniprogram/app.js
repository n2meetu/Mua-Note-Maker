App({
  onLaunch() {
    // 初始化云开发（可选）
    // wx.cloud.init({
    //   env: 'your-env-id',
    //   traceUser: true,
    // })
  },

  globalData: {
    userInfo: null,
    images: [],      // 选择的图片列表
    voiceText: '',   // 语音转文字内容
    generatedNote: null  // 生成的笔记内容
  }
})
