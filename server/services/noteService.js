const axios = require('axios')

class NoteService {
  constructor() {
    // ChatGLM API 配置
    this.apiKey = process.env.CHATGLM_API_KEY
    this.apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
    this.model = 'glm-4' // 或 'glm-4-flash' 性价比更高
  }

  /**
   * 生成小红书风格笔记
   * @param {string} voiceText - 语音转文字内容
   * @param {number} imageCount - 图片数量
   */
  async generateNote(voiceText, imageCount = 1) {
    // 构建 Prompt
    const prompt = this.buildPrompt(voiceText, imageCount)
    
    // 调用 AI API
    const aiResponse = await this.callAI(prompt)
    
    // 解析 AI 响应
    return this.parseAIResponse(aiResponse)
  }

  /**
   * 构建 AI Prompt
   */
  buildPrompt(voiceText, imageCount) {
    return `你是一个小红书美食博主，擅长写出吸引人的美食笔记。

用户提供了以下信息：
- 做菜步骤和心得（语音描述）：${voiceText}
- 配图数量：${imageCount} 张

请生成一个适合发布在小红书的美食笔记，包含：

1. **爆款标题**（10-20字，带emoji，吸引眼球）
   - 使用：✨🔥💯👉😍‼️ 等emoji
   - 风格参考：
     - "深夜放毒！这道菜香到邻居来敲门✨"
     - "零失败！厨房小白也能做出米其林级美味🔥"
     - "绝了！这个配方让我连续吃了一周💯"

2. **正文内容**（200-400字，分段清晰，带emoji）
   - 开头：用1-2句话引出这道菜的亮点
   - 步骤：清晰列出制作步骤（Step1️⃣ Step2️⃣...）
   - 小贴士：分享1-2个实用技巧
   - 使用emoji：👩‍🍳👨‍🍳🍳🥘🥗🍽️ 等

3. **热门标签**（5-8个）
   - 格式：#美食 #家常菜 #美食教程 等
   - 包含：美食大类 + 菜系 + 做法特点

请严格按照以下 JSON 格式返回（不要有任何其他内容）：
{
  "title": "标题内容",
  "content": "正文内容（使用\\n换行）",
  "tags": "#标签1 #标签2 #标签3"
}`
  }

  /**
   * 调用 AI API
   */
  async callAI(prompt) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          top_p: 0.9
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data.choices[0].message.content
    } catch (error) {
      console.error('AI API 调用失败:', error.response?.data || error.message)
      throw new Error('AI 生成失败，请稍后重试')
    }
  }

  /**
   * 解析 AI 响应
   */
  parseAIResponse(aiResponse) {
    try {
      // 尝试解析 JSON
      const result = JSON.parse(aiResponse)
      
      return {
        title: result.title || '',
        content: result.content || '',
        tags: result.tags || ''
      }
    } catch (error) {
      console.error('解析 AI 响应失败:', error)
      
      // 如果解析失败，返回原始内容
      return {
        title: '美食分享✨',
        content: aiResponse,
        tags: '#美食 #分享 #日常'
      }
    }
  }
}

module.exports = new NoteService()
