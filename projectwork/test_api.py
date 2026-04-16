import requests
import json
import time

# 测试 API 服务器是否正常工作

def test_api():
    print("=" * 70)
    print("🧪 测试 AI Color Analysis API")
    print("=" * 70)
    
    # API 地址
    api_url = "http://localhost:5000/api/color-analysis"
    
    # 测试数据：模拟从图片中提取的颜色
    test_payload = {
        "colors_text": """颜色1: RGB(255, 100, 50)
颜色2: RGB(100, 150, 200)
颜色3: RGB(200, 200, 100)
颜色4: RGB(50, 100, 150)
颜色5: RGB(200, 50, 50)"""
    }
    
    try:
        print("\n📤 正在发送请求到:", api_url)
        print(f"📊 颜色数据:\n{test_payload['colors_text']}\n")
        
        # 发送请求
        response = requests.post(
            api_url,
            json=test_payload,
            timeout=30
        )
        
        print(f"📡 HTTP 状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            if result.get('success'):
                print("\n✅ API 调用成功！")
                print("-" * 70)
                print("🤖 AI 的配色分析结果：")
                print("-" * 70)
                print(result['analysis'])
                print("-" * 70)
                print(f"\n📊 Token 使用: {result.get('tokens_used', 'N/A')}")
                print("\n" + "=" * 70)
                print("✨ 测试通过！前端现在可以正常调用 AI 了。")
                print("=" * 70)
            else:
                print(f"\n❌ API 返回错误: {result.get('error')}")
        else:
            print(f"\n❌ API 返回非 200 状态码")
            print(f"   应答内容: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ 连接失败！")
        print("   请检查：")
        print("   1. API 服务器是否正在运行 (localhost:5000)")
        print("   2. 命令: D:/ananconda/Scripts/conda.exe run -n closeai_env python ai_server.py")
        
    except Exception as e:
        print(f"\n❌ 发生错误: {type(e).__name__}")
        print(f"   信息: {str(e)}")

if __name__ == '__main__':
    test_api()
