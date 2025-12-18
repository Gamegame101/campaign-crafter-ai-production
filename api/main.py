from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from openai import OpenAI
import json
import os
import httpx
from datetime import datetime

app = FastAPI(
    title="Campaign Generator API",
    description="AI-powered marketing campaign generation using advanced prompt engineering",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class CampaignRequest(BaseModel):
    name: str
    objective: str
    target_audience: str
    platforms: List[str]
    budget: float
    start_date: str
    end_date: str
    content_strategy: str
    posting_frequency: str
    mode: str = "preview"  # preview or full
    focus_type: Optional[str] = None
    focus_data: Optional[Dict[str, Any]] = None

class CampaignResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

THAI_MARKETING_EXPERT_PROMPT = """คุณเป็นผู้เชี่ยวชาญด้านการตลาดดิจิทัลในประเทศไทย มีประสบการณ์ 10+ ปี ในการสร้างแคมเปญการตลาดที่ประสบความสำเร็จ

หลักการสำคัญ:
- เข้าใจวัฒนธรรมไทยและพฤติกรรมผู้บริโภค
- สร้างเนื้อหาที่เหมาะสมกับแต่ละแพลตฟอร์ม
- ใช้ภาษาไทยที่เป็นธรรมชาติและน่าสนใจ
- คำนึงถึงงบประมาณและ ROI
- สร้างกลยุทธ์ที่วัดผลได้

ตอบเป็นภาษาไทยเสมอ และให้ข้อมูลที่ครบถ้วน เป็นประโยชน์"""

def build_campaign_prompt(request: CampaignRequest) -> str:
    focus_context = ""
    if request.focus_type and request.focus_data:
        focus_context = f"\n\nข้อมูลเฉพาะ {request.focus_type}:\n{json.dumps(request.focus_data, ensure_ascii=False, indent=2)}"
    
    if request.mode == "preview":
        return f"""สร้างแคมเปญการตลาดแบบย่อสำหรับ:

ชื่อแคมเปญ: {request.name}
วัตถุประสงค์: {request.objective}
กลุ่มเป้าหมาย: {request.target_audience}
แพลตฟอร์ม: {', '.join(request.platforms)}
งบประมาณ: {request.budget:,.0f} บาท
ระยะเวลา: {request.start_date} ถึง {request.end_date}
กลยุทธ์เนื้อหา: {request.content_strategy}
ความถี่โพสต์: {request.posting_frequency}{focus_context}

ให้ผลลัพธ์เป็น JSON ตามรูปแบบนี้:
{{
  "campaign_summary": "สรุปแคมเปญ 2-3 ประโยค",
  "big_idea": "แนวคิดหลักของแคมเปญ",
  "key_messages": ["ข้อความหลัก 1", "ข้อความหลัก 2", "ข้อความหลัก 3"],
  "visual_direction": "แนวทางการออกแบบและภาพลักษณ์"
}}"""
    
    else:  # full mode
        # Calculate posts needed based on frequency
        posts_needed = 7 if request.posting_frequency == "daily" else 3
        
        platform_examples = {}
        for platform in request.platforms:
            platform_key = platform.lower().replace(" ", "_")
            posts_list = []
            for i in range(posts_needed):
                posts_list.append(f'{{"day": {i+1}, "content": "เนื้อหา{platform}วันที่{i+1}", "hashtags": ["#tag{i+1}"], "image_description": "ภาพ{platform}วันที่{i+1}"}}')
            platform_examples[platform_key] = '[' + ', '.join(posts_list) + ']'
        
        platform_json = ',\n    '.join([f'"{k}": {v}' for k, v in platform_examples.items()])
        
        return f"""สร้างแคมเปญการตลาดแบบสมบูรณ์สำหรับ:

ชื่อแคมเปญ: {request.name}
วัตถุประสงค์: {request.objective}
กลุ่มเป้าหมาย: {request.target_audience}
แพลตฟอร์ม: {', '.join(request.platforms)}
งบประมาณ: {request.budget:,.0f} บาท
ระยะเวลา: {request.start_date} ถึง {request.end_date}
กลยุทธ์เนื้อหา: {request.content_strategy}
ความถี่โพสต์: {request.posting_frequency} (ต้องสร้าง {posts_needed} โพสต์ต่อแพลตฟอร์ม){focus_context}

**สำคัญ: ต้องสร้าง {posts_needed} โพสต์สำหรับแต่ละแพลตฟอร์มที่เลือก**

ให้ผลลัพธ์เป็น JSON ตามรูปแบบนี้:
{{
  "campaign_summary": "สรุปแคมเปญ",
  "big_idea": "แนวคิดหลัก",
  "key_messages": ["ข้อความหลัก"],
  "visual_direction": "แนวทางการออกแบบ",
  "platform_content": {{
    {platform_json}
  }},
  "estimated_reach": 50000,
  "estimated_engagement": 2.5,
  "estimated_conversions": 500
}}"""

@app.post("/api/v1/generate-campaign")
async def generate_campaign(request: CampaignRequest):
    try:
        prompt = build_campaign_prompt(request)
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": THAI_MARKETING_EXPERT_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        content = response.choices[0].message.content
        
        # Parse JSON response
        try:
            campaign_data = json.loads(content)
        except json.JSONDecodeError:
            # Fallback: extract JSON from response
            start = content.find('{')
            end = content.rfind('}') + 1
            if start != -1 and end != 0:
                try:
                    campaign_data = json.loads(content[start:end])
                except json.JSONDecodeError:
                    # Create fallback response
                    campaign_data = {
                        "campaign_summary": f"แคมเปญ {request.name} สำหรับ {request.target_audience}",
                        "big_idea": "สร้างการรับรู้แบรนด์และเพิ่มการมีส่วนร่วม",
                        "key_messages": ["ข้อความหลัก 1", "ข้อความหลัก 2", "ข้อความหลัก 3"],
                        "visual_direction": "ใช้สีสันสดใสและภาพที่น่าสนใจ"
                    }
            else:
                # Create fallback response
                campaign_data = {
                    "campaign_summary": f"แคมเปญ {request.name} สำหรับ {request.target_audience}",
                    "big_idea": "สร้างการรับรู้แบรนด์และเพิ่มการมีส่วนร่วม",
                    "key_messages": ["ข้อความหลัก 1", "ข้อความหลัก 2", "ข้อความหลัก 3"],
                    "visual_direction": "ใช้สีสันสดใสและภาพที่น่าสนใจ"
                }
        
        # Generate posts for full mode
        if request.mode == "full":
            posts = {}
            posts_count = 7 if request.posting_frequency == "daily" else 3
            
            # Always generate posts for all requested platforms
            for platform in request.platforms:
                platform_posts = []
                
                # Try to get AI-generated content first
                ai_content = None
                if "platform_content" in campaign_data:
                    platform_key = platform.lower().replace(" ", "_")
                    ai_content = campaign_data.get("platform_content", {}).get(platform_key, [])
                
                # Generate posts (use AI content if available, otherwise fallback)
                for i in range(posts_count):
                    if ai_content and isinstance(ai_content, list) and i < len(ai_content):
                        # Use AI-generated content
                        post = ai_content[i]
                        if isinstance(post, dict):
                            platform_posts.append(post)
                        else:
                            # Fallback if AI content is malformed
                            platform_posts.append({
                                "day": i + 1,
                                "content": f"โพสต์ {platform} วันที่ {i + 1} สำหรับ {request.name}",
                                "hashtags": [f"#{request.name.replace(' ', '')}", "#campaign"],
                                "image_description": f"ภาพสำหรับ {platform} วันที่ {i + 1}"
                            })
                    else:
                        # Generate fallback content
                        platform_posts.append({
                            "day": i + 1,
                            "content": f"โพสต์ {platform} วันที่ {i + 1} สำหรับ {request.name} - เนื้อหาที่แตกต่างกันในแต่ละวัน",
                            "hashtags": [f"#{request.name.replace(' ', '')}", "#campaign", f"#day{i + 1}"],
                            "image_description": f"ภาพสำหรับ {platform} วันที่ {i + 1}"
                        })
                
                posts[platform] = platform_posts
            
            campaign_data["posts"] = posts
            # Remove platform_content if it exists
            if "platform_content" in campaign_data:
                del campaign_data["platform_content"]
        
        return {"success": True, "data": campaign_data}
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Proxy endpoints to Functions Server
FUNCTIONS_BASE_URL = "http://functions:3001"

@app.get("/api/organizations")
async def get_organizations():
    """Get all organizations from Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{FUNCTIONS_BASE_URL}/api/organizations")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/products")
async def get_products():
    """Get all products from Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{FUNCTIONS_BASE_URL}/api/products")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/services")
async def get_services():
    """Get all services from Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{FUNCTIONS_BASE_URL}/api/services")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/campaigns")
async def get_campaigns():
    """Get all campaigns from Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{FUNCTIONS_BASE_URL}/api/campaigns")
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/campaigns/{campaign_id}")
async def get_campaign(campaign_id: str):
    """Get specific campaign from Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{FUNCTIONS_BASE_URL}/api/campaigns/{campaign_id}")
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Campaign not found")
            return response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Campaign not found")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class CampaignCreate(BaseModel):
    name: str
    objective: str
    target_audience: str
    platforms: List[str]
    budget: float
    start_date: str
    end_date: str
    content_strategy: str
    posting_frequency: str
    campaign_data: Dict[str, Any]
    status: Optional[str] = "draft"

@app.post("/api/campaigns")
async def create_campaign(campaign: CampaignCreate):
    """Create new campaign via Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{FUNCTIONS_BASE_URL}/api/campaigns",
                json=campaign.dict()
            )
            return response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/campaigns/{campaign_id}")
async def update_campaign(campaign_id: str, updates: Dict[str, Any]):
    """Update campaign via Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{FUNCTIONS_BASE_URL}/api/campaigns/{campaign_id}",
                json=updates
            )
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Campaign not found")
            return response.json()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Campaign not found")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/campaigns/{campaign_id}")
async def delete_campaign(campaign_id: str):
    """Delete campaign via Functions Server"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{FUNCTIONS_BASE_URL}/api/campaigns/{campaign_id}")
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="Campaign not found")
            return {"message": "Campaign deleted successfully"}
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Campaign not found")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "Campaign Crafter AI - FastAPI Server",
        "docs": "/docs",
        "endpoints": {
            "organizations": "/api/organizations",
            "products": "/api/products",
            "services": "/api/services",
            "campaigns": "/api/campaigns",
            "generate_campaign": "/api/v1/generate-campaign",
            "health": "/api/v1/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)