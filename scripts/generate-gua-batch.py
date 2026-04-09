import json
import os

def generate_gua_data():
    """
    核心逻辑：生成六十四卦象数据
    包括每一卦的卦名、数字、符号、爻变等信息
    """
    gua_data = []
    
    # 这里根据易经六十四卦规律填充
    # 示例结构：
    for i in range(1, 65):
        gua = {
            "number": i,
            "nameZh": f"卦象_{i}",
            "nameEn": f"Hexagram_{i}",
            "symbol": "---" # 简化的示例，实际需填充完整六爻符号
        }
        gua_data.append(gua)
        
    return gua_data

def save_to_file(data, filename="hexagrams.json"):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"卦象数据已生成: {filename}")

if __name__ == "__main__":
    data = generate_gua_data()
    save_to_file(data)
