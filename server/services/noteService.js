const axios = require('axios')

class NoteService {
  constructor() {
    this.apiKey = process.env.CHATGLM_API_KEY
    this.apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    this.model = 'glm-5.1'
    this.useMock = true // 直接使用 mock 数据，不调用 AI
  }

  async generateNote(voiceText, imageCount = 1) {
    console.log('🚀 开始生成笔记')
    
    // 直接使用 mock 数据（AI API 暂时不可用）
    if (this.useMock) {
      console.log('📦 使用 Mock 数据')
      return this.getMockData(voiceText)
    }

    // 如果配置了 API key，尝试调用 AI
    if (!this.apiKey || this.apiKey === 'your_api_key_here') {
      console.log('⚠️ 未配置 API Key，使用 Mock 数据')
      return this.getMockData(voiceText)
    }

    try {
      const prompt = this.buildPrompt(voiceText, imageCount)
      const aiResponse = await this.callAI(prompt)
      return this.parseAIResponse(aiResponse)
    } catch (error) {
      console.log('⚠️ AI 生成失败，使用 Mock 数据:', error.message)
      return this.getMockData(voiceText)
    }
  }

  buildPrompt(voiceText, imageCount) {
    return `你是一个小红书美食博主，擅长写出吸引人的美食笔记。

用户提供了以下信息：
- 做菜步骤和心得：${voiceText}
- 配图数量：${imageCount} 张

请生成小红书风格笔记，严格按 JSON 格式返回：
{
  "title": "带emoji的标题(10-20字)",
  "content": "正文(200-400字，用\\n换行)",
  "tags": "#标签1 #标签2 #标签3"
}`
  }

  async callAI(prompt) {
    const response = await axios.post(
      this.apiUrl,
      {
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    )

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content
    }
    
    throw new Error('AI 响应格式错误')
  }

  parseAIResponse(aiResponse) {
    try {
      const result = JSON.parse(aiResponse)
      return {
        title: result.title || '美食分享✨',
        content: result.content || aiResponse,
        tags: result.tags || '#美食 #分享'
      }
    } catch (error) {
      return {
        title: '美食分享✨',
        content: aiResponse,
        tags: '#美食 #分享 #日常'
      }
    }
  }

  getMockData(voiceText) {
    return {
      title: '🔥 传统美食制作秘方！做法简单又好吃',
      content: `今天分享一道传统美食的制作方法！超级简单零失败~

📝 制作步骤:
${voiceText}

💡 小贴士:
用心制作，每一步都是关键！

喜欢的话记得点赞收藏哦～`,
      tags: '#传统美食 #美食教程 #家常菜 #零失败 #快手菜 #美食分享'
    }
  }
}

module.exports = new NoteService()
