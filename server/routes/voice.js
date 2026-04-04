const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const voiceService = require('../services/voiceService')

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname) || '.mp3'
    cb(null, `voice-${uniqueSuffix}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 最大 10MB
  },
  fileFilter: (req, file, cb) => {
    // 允许的音频格式
    const allowedTypes = ['.mp3', '.wav', '.aac', '.m4a', '.pcm']
    const ext = path.extname(file.originalname).toLowerCase()
    
    if (allowedTypes.includes(ext)) {
      cb(null, true)
    } else {
      cb(new Error(`不支持的音频格式: ${ext}`))
    }
  }
})

/**
 * 语音识别接口
 * POST /api/voice/recognize
 * 
 * FormData:
 * - audio: 音频文件
 * - platform: 识别平台（可选，默认 mock）
 */
router.post('/recognize', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请上传音频文件'
      })
    }

    const audioFilePath = req.file.path
    const platform = req.body.platform || 'mock'

    console.log('🎤 收到语音识别请求:', {
      file: req.file.originalname,
      size: req.file.size,
      platform
    })

    // 调用语音识别服务
    const result = await voiceService.recognize(audioFilePath, platform)

    // 删除临时文件
    fs.unlinkSync(audioFilePath)

    res.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('语音识别失败:', error)
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({
      success: false,
      message: error.message || '语音识别失败'
    })
  }
})

module.exports = router
