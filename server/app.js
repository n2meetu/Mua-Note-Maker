require('dotenv').config()
const express = require('express')
const cors = require('cors')
const noteRoutes = require('./routes/note')

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(cors())
app.use(express.json())

// 路由
app.use('/api/note', noteRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    message: err.message || '服务器错误'
  })
})

// 启动服务
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
  console.log(`📝 Note Maker API is ready`)
})
