from flask import Flask, request, jsonify
from openai import OpenAI
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 初始化 OpenAI 客户端
client = OpenAI(
    base_url='https://api.openai-proxy.org/v1',
    api_key='sk-pVzBiHlJhKgg4iM2fhes7RweNsM8tY7oYR5uXH7x9a33JKmp',
)

@app.route('/api/color-analysis', methods=['POST'])
def color_analysis():
    """调用AI进行配色分析"""
    try:
        data = request.json
        colors_text = data.get('colors_text', '')
        
        if not colors_text:
            return jsonify({'error': '没有颜色数据'}), 400
        
        # 构建提示词
        prompt = f"""
        请分析以下图片的主要配色方案，并给出专业的配色诊断意见：
        
        颜色信息：
        {colors_text}
        
        请提供：
        1. 配色方案分析（色彩搭配是否和谐）
        2. 色彩属性分析（冷色/暖色比例）
        3. 应用建议（这个配色方案适合什么场景）
        4. 改进建议（如何优化这个配色）
        
        回复要简洁专业，不超过200字。
        """
        
        # 调用 AI
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-4.1-mini",
        )
        
        ai_response = response.choices[0].message.content
        
        return jsonify({
            'success': True,
            'analysis': ai_response,
            'tokens_used': response.usage.total_tokens
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    try:
        print("=" * 60)
        print("Starting AI Color Analysis API Server...")
        print("=" * 60)
        port = int(os.environ.get('PORT', 5000))
        print(f"Server running at: http://localhost:{port}")
        print(f"API Endpoint: POST /api/color-analysis")
        print("=" * 60)
        app.run(host='0.0.0.0', port=port, debug=False)
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
