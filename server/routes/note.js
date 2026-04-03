const express = require('express')
const router = express.Router()
const noteService = require('../services/noteService')

// 生成笔记
router.post('/generate', async (req, res) => {
  try {
    const { voiceText, imageCount } = req.body
    
    if (!voiceText) {
      return res.status(400).json({
        success: false,
        message: '缺少语音内容'
      })
    }

    console.log('📝 生成笔记请求:', { voiceText, imageCount })

    const result = await noteService.generateNote(voiceText, imageCount)
    
    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('生成笔记失败:', error)
    res.status(500).json({
      success: false,
      message: error.message || '生成失败'
    })
  }
})

module.exports = router
