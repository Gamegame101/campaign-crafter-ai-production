const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  host: 'db',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres',
});

// Initialize database tables
const initDatabase = async () => {
  try {
    // Create organizations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        industry VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        organization_id VARCHAR(50) REFERENCES organizations(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        category VARCHAR(100),
        target_audience VARCHAR(255),
        features TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(50) PRIMARY KEY,
        organization_id VARCHAR(50) REFERENCES organizations(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        duration VARCHAR(100),
        target_audience VARCHAR(255),
        features TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert sample data if tables are empty
    const orgCount = await pool.query('SELECT COUNT(*) FROM organizations');
    if (parseInt(orgCount.rows[0].count) === 0) {
      // Insert organizations
      await pool.query(`
        INSERT INTO organizations (id, name, industry, description) VALUES
        ('org1', 'TechFlow Solutions', 'Technology', 'Leading technology solutions provider'),
        ('org2', 'Green Café', 'Food & Beverage', 'Sustainable coffee and healthy food'),
        ('org3', 'EduSmart', 'Education', 'Online learning platform'),
        ('org4', 'HealthPlus Clinic', 'Healthcare', 'Modern healthcare services'),
        ('org5', 'StyleHub', 'Retail', 'Fashion and lifestyle products')
      `);

      // Insert products
      await pool.query(`
        INSERT INTO products (id, organization_id, name, description, price, category, target_audience, features) VALUES
        ('prod1', 'org1', 'Smart Analytics Dashboard', 'AI-powered business analytics', 15000, 'Software', 'SME Business Owners', ARRAY['Real-time data', 'AI insights', 'Custom reports']),
        ('prod2', 'org1', 'Cloud Security Suite', 'Enterprise security solution', 25000, 'Software', 'Tech Enthusiasts', ARRAY['Advanced encryption', '24/7 monitoring', 'Threat detection']),
        ('prod3', 'org2', 'Organic Coffee Blend', 'Premium organic coffee beans', 450, 'Beverage', 'Health-Conscious Consumers', ARRAY['100% organic', 'Fair trade', 'Rich flavor']),
        ('prod4', 'org2', 'Healthy Meal Box', 'Weekly healthy meal subscription', 1200, 'Food', 'Young Professionals (25–34)', ARRAY['Nutritionist approved', 'Fresh ingredients', 'Convenient delivery']),
        ('prod5', 'org3', 'Digital Learning Kit', 'Complete online learning package', 2500, 'Education', 'Students', ARRAY['Interactive content', 'Progress tracking', 'Certificate included']),
        ('prod6', 'org4', 'Health Monitoring Device', 'Personal health tracker', 3500, 'Medical Device', 'Health-Conscious Consumers', ARRAY['24/7 monitoring', 'Mobile app', 'Doctor consultation']),
        ('prod7', 'org5', 'Premium Fashion Collection', 'Luxury clothing line', 2800, 'Fashion', 'Young Women (18–30)', ARRAY['Designer quality', 'Sustainable materials', 'Limited edition']),
        ('prod8', 'org5', 'Smart Accessories', 'Tech-enabled fashion accessories', 1500, 'Accessories', 'Millennials (25–40)', ARRAY['Smart features', 'Stylish design', 'Long battery life'])
      `);

      // Insert services
      await pool.query(`
        INSERT INTO services (id, organization_id, name, description, price, duration, target_audience, features) VALUES
        ('serv1', 'org1', 'IT Consulting', 'Professional IT consultation services', 5000, '1 month', 'SME Business Owners', ARRAY['Expert advice', 'Custom solutions', 'Ongoing support']),
        ('serv2', 'org1', 'Digital Transformation', 'Complete digital transformation package', 50000, '6 months', 'Tech Enthusiasts', ARRAY['Full assessment', 'Implementation plan', 'Training included']),
        ('serv3', 'org2', 'Catering Service', 'Healthy catering for events', 800, 'Per event', 'Working Moms / Dads', ARRAY['Healthy options', 'Custom menus', 'Professional service']),
        ('serv4', 'org3', 'Online Tutoring', 'Personalized online tutoring', 1500, '1 month', 'Students', ARRAY['One-on-one sessions', 'Flexible schedule', 'Progress reports']),
        ('serv5', 'org3', 'Corporate Training', 'Professional development programs', 25000, '3 months', 'SME Business Owners', ARRAY['Customized curriculum', 'Expert trainers', 'Certification']),
        ('serv6', 'org4', 'Health Checkup Package', 'Comprehensive health screening', 3500, '1 day', 'Working Moms / Dads', ARRAY['Full body checkup', 'Lab tests', 'Doctor consultation']),
        ('serv7', 'org4', 'Wellness Program', 'Corporate wellness services', 15000, '6 months', 'Health-Conscious Consumers', ARRAY['Fitness plans', 'Nutrition guidance', 'Regular monitoring']),
        ('serv8', 'org5', 'Personal Styling', 'Professional styling consultation', 2500, '2 hours', 'Young Women (18–30)', ARRAY['Style assessment', 'Wardrobe planning', 'Shopping assistance'])
      `);

      console.log('Sample data inserted successfully');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Initialize database on startup
initDatabase();

// API endpoints for organizations, products, services
app.get('/api/organizations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM organizations ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Organizations error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Campaigns API endpoints
app.get('/api/campaigns', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Campaigns error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Campaign error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const data = req.body;
    const result = await pool.query(`
      INSERT INTO campaigns (name, objective, target_audience, platforms, budget, start_date, end_date, content_strategy, posting_frequency, campaign_data, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [data.name, data.objective, data.target_audience, data.platforms, data.budget, data.start_date, data.end_date, data.content_strategy, data.posting_frequency, data.campaign_data, data.status || 'draft']);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const fields = Object.keys(data).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(data);
    
    const result = await pool.query(`
      UPDATE campaigns SET ${fields}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *
    `, [...values, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM campaigns WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Supabase REST API endpoints
app.get('/rest/v1/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { select = '*', order } = req.query;
    
    let sql = `SELECT ${select} FROM ${table}`;
    if (order) {
      const [column, direction] = order.split('.');
      sql += ` ORDER BY ${column} ${direction === 'desc' ? 'DESC' : 'ASC'}`;
    }
    
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (error) {
    console.error('GET error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/rest/v1/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const data = req.body;
    
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`);
    
    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
    const result = await pool.query(sql, values);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('POST error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.patch('/rest/v1/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { id } = req.query;
    const data = req.body;
    
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `${col} = $${i + 1}`);
    
    const sql = `UPDATE ${table} SET ${setClause.join(', ')}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`;
    const result = await pool.query(sql, [...values, id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('PATCH error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/rest/v1/:table', async (req, res) => {
  try {
    const { table } = req.params;
    const { id } = req.query;
    
    const sql = `DELETE FROM ${table} WHERE id = $1`;
    await pool.query(sql, [id]);
    
    res.status(204).send();
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ error: error.message });
  }
});

// OpenAI generate-campaign endpoint
app.post('/api/v1/generate-campaign', async (req, res) => {
  try {
    const { mode = 'preview', ...campaignData } = req.body;
    console.log('Received campaign data:', JSON.stringify(campaignData, null, 2));
    
    let prompt;
    
    if (mode === 'preview') {
      // Build preview prompt
      prompt = `สร้างแคมเปญการตลาดสำหรับ:

ชื่อแคมเปญ: ${campaignData.name || 'ไม่ระบุ'}
วัตถุประสงค์: ${campaignData.objective || 'ไม่ระบุ'}
กลุ่มเป้าหมาย: ${campaignData.target_audience || 'ไม่ระบุ'}
แพลตฟอร์ม: ${campaignData.platforms?.join(', ') || 'ไม่ระบุ'}
งบประมาณ: ${campaignData.budget || 'ไม่ระบุ'}
กลยุทธ์เนื้อหา: ${campaignData.content_strategy || 'ไม่ระบุ'}
ความถี่การโพสต์: ${campaignData.posting_frequency || 'ไม่ระบุ'}

กรุณาตอบกลับเป็น JSON object เท่านั้น ไม่ต้องมีข้อความอื่น ไม่ต้องใส่ markdown code blocks:

{
  "campaign_summary": "สรุปแคมเปญ 2-3 ประโยค",
  "big_idea": "ไอเดียหลักของแคมเปญ",
  "key_messages": ["ข้อความสำคัญ 1", "ข้อความสำคัญ 2", "ข้อความสำคัญ 3"],
  "visual_direction": "คำแนะนำการออกแบบภาพ"
}

ตอบเป็นภาษาไทยเท่านั้น และตอบเป็น JSON object เท่านั้น`;
    } else if (mode === 'full') {
      // Build full campaign prompt
      const platforms = campaignData.platforms || [];
      const existingPreview = campaignData.existingPreview || {};
      
      // Calculate number of posts needed
      const frequency = campaignData.posting_frequency || 'daily';
      const startDate = new Date(campaignData.start_date || Date.now());
      const endDate = new Date(campaignData.end_date || Date.now() + 7 * 24 * 60 * 60 * 1000);
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      
      let postsNeeded = 1;
      if (frequency === 'daily') {
        postsNeeded = Math.min(daysDiff, 7);
      } else if (frequency === '3-per-week') {
        postsNeeded = Math.min(Math.ceil(daysDiff * 3 / 7), 5);
      } else if (frequency === 'weekly') {
        postsNeeded = Math.min(Math.ceil(daysDiff / 7), 3);
      }

      prompt = `สร้างเนื้อหาแคมเปญเต็มรูปแบบสำหรับแพลตฟอร์มที่เลือกไว้เท่านั้น:

ข้อมูลแคมเปญ:
ชื่อแคมเปญ: ${campaignData.name || 'ไม่ระบุ'}
วัตถุประสงค์: ${campaignData.objective || 'ไม่ระบุ'}
กลุ่มเป้าหมาย: ${campaignData.target_audience || 'ไม่ระบุ'}
แพลตฟอร์มที่เลือก: ${platforms.join(', ')}
งบประมาณ: ${campaignData.budget || 'ไม่ระบุ'}
โฟกัสแคมเปญ: ${campaignData.campaign_focus || 'general'}
กลยุทธ์เนื้อหา: ${campaignData.content_strategy || 'organic'}
ความถี่การโพสต์: ${campaignData.posting_frequency || 'daily'}
จำนวนโพสต์ที่ต้องการ: ${postsNeeded} โพสต์ต่อแพลตฟอร์ม

ข้อมูลจากตัวอย่าง:
สรุปแคมเปญ: ${existingPreview.campaign_summary || ''}
ไอเดียหลัก: ${existingPreview.big_idea || ''}
ข้อความสำคัญ: ${existingPreview.key_messages?.join(', ') || ''}

**สำคัญมาก: สร้างเนื้อหาที่แตกต่างกันในแต่ละวัน ห้ามใช้เนื้อหาเดียวกัน**
**สร้าง ${postsNeeded} โพสต์ที่มีเนื้อหาแตกต่างกันสำหรับแต่ละแพลตฟอร์ม**
**แต่ละโพสต์ต้องมีมุมมอง เนื้อหา และ CTA ที่แตกต่างกัน**

ตัวอย่างความแตกต่างของเนื้อหา:
- วันที่ 1: แนะนำ/เปิดตัว
- วันที่ 2: ประโยชน์/คุณค่า
- วันที่ 3: เคล็ดลับ/วิธีการ
- วันที่ 4: เรื่องราว/ตัวอย่าง
- วันที่ 5: รีวิว/ความคิดเห็น
- วันที่ 6: โปรโมชั่น/ข้อเสนอ
- วันที่ 7: สรุป/เรียกร้องให้ดำเนินการ

รูปแบบ JSON ที่ต้องการ:
{
  "campaign_summary": "สรุปแคมเปญ",
  "big_idea": "ไอเดียหลัก",
  "key_messages": ["ข้อความสำคัญ"],
  "visual_direction": "ทิศทางการออกแบบ",
  "posts": {
    ${platforms.map(platform => {
      if (platform === 'Facebook') {
        return `"Facebook": [${Array.from({length: postsNeeded}, (_, i) => `{"caption": "แคปชั่น Facebook วันที่ ${i+1} (เนื้อหาต่างจากวันอื่น)", "visual_prompt": "คำแนะนำภาพ Facebook วันที่ ${i+1}", "day": ${i+1}}`).join(', ')}]`;
      } else if (platform === 'Instagram') {
        return `"Instagram": [${Array.from({length: postsNeeded}, (_, i) => `{"caption": "แคปชั่น Instagram วันที่ ${i+1} (เนื้อหาต่างจากวันอื่น)", "visual_prompt": "คำแนะนำภาพ Instagram วันที่ ${i+1}", "day": ${i+1}}`).join(', ')}]`;
      } else if (platform === 'TikTok') {
        return `"TikTok": [${Array.from({length: postsNeeded}, (_, i) => `{"script": "สคริปต์ TikTok วันที่ ${i+1} (เนื้อหาต่างจากวันอื่น)", "hook": "Hook TikTok วันที่ ${i+1}", "day": ${i+1}}`).join(', ')}]`;
      } else if (platform === 'YouTube') {
        return `"YouTube": [${Array.from({length: postsNeeded}, (_, i) => `{"title": "หัวข้อ YouTube วันที่ ${i+1} (เนื้อหาต่างจากวันอื่น)", "description": "คำอธิบาย YouTube วันที่ ${i+1}", "day": ${i+1}}`).join(', ')}]`;
      } else if (platform === 'Line OA') {
        return `"Line OA": [${Array.from({length: postsNeeded}, (_, i) => `{"message": "ข้อความ Line OA วันที่ ${i+1} (เนื้อหาต่างจากวันอื่น)", "cta": "CTA วันที่ ${i+1}", "day": ${i+1}}`).join(', ')}]`;
      }
      return '';
    }).filter(Boolean).join(',\n    ')}
  }
}

ตอบเป็นภาษาไทยเท่านั้น และตอบเป็น JSON object เท่านั้น ห้ามใส่แพลตฟอร์มอื่นที่ไม่ได้เลือก`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || '${OPENAI_API_KEY}'}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Try to parse JSON response
    let result;
    try {
      // Clean up the content - remove markdown code blocks and extra text
      let cleanContent = content.trim();
      
      // Remove ```json and ``` markers
      cleanContent = cleanContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON object in the content
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }
      
      result = JSON.parse(cleanContent);
      
      // Ensure all required fields exist
      if (!result.campaign_summary) result.campaign_summary = 'สรุปแคมเปญจาก AI';
      if (!result.big_idea) result.big_idea = 'ไอเดียหลักจาก AI';
      if (!result.key_messages || !Array.isArray(result.key_messages)) {
        result.key_messages = ['ข้อความสำคัญ 1', 'ข้อความสำคัญ 2', 'ข้อความสำคัญ 3'];
      }
      if (!result.visual_direction) result.visual_direction = 'คำแนะนำการออกแบบจาก AI';
      
      // For full mode, ensure posts object exists and only includes selected platforms
      if (mode === 'full') {
        const platforms = campaignData.platforms || [];
        
        // If AI didn't generate posts or posts is empty, create fallback
        if (!result.posts || Object.keys(result.posts).length === 0) {
          result.posts = {};
        }
        
        // Generate multiple posts based on frequency and duration
        const filteredPosts = {};
        const frequency = campaignData.posting_frequency || 'daily';
        const startDate = new Date(campaignData.start_date || Date.now());
        const endDate = new Date(campaignData.end_date || Date.now() + 7 * 24 * 60 * 60 * 1000);
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Calculate number of posts per platform
        let postsPerPlatform = 1;
        if (frequency === 'daily') {
          postsPerPlatform = Math.min(daysDiff, 7); // Max 7 posts for demo
        } else if (frequency === '3-per-week') {
          postsPerPlatform = Math.min(Math.ceil(daysDiff * 3 / 7), 5);
        } else if (frequency === 'weekly') {
          postsPerPlatform = Math.min(Math.ceil(daysDiff / 7), 3);
        }
        
        // Create posts for each selected platform
        platforms.forEach(platform => {
          const posts = [];
          
          for (let i = 0; i < postsPerPlatform; i++) {
            let post = {
              day: i + 1,
              time: ['10:00', '14:00', '18:00', '20:00'][i % 4],
              postType: campaignData.content_strategy === 'paid' ? 'ad' : 
                       campaignData.content_strategy === 'mixed' && i % 2 === 1 ? 'boosted' : 'organic'
            };
            
            // Check if AI generated content for this specific day
            let aiContent = null;
            if (result.posts && result.posts[platform] && Array.isArray(result.posts[platform]) && result.posts[platform][i]) {
              aiContent = result.posts[platform][i];
            }
            
            // Add platform-specific content
            if (platform === 'Facebook') {
              post.caption = aiContent?.caption || `โพสต์ Facebook วันที่ ${i + 1} สำหรับ ${campaignData.name || 'แคมเปญ'} - เนื้อหาแตกต่างกันในแต่ละวัน`;
              post.visual_prompt = aiContent?.visual_prompt || `ภาพที่เหมาะสมกับ Facebook วันที่ ${i + 1}`;
            } else if (platform === 'Instagram') {
              post.caption = aiContent?.caption || `โพสต์ Instagram วันที่ ${i + 1} #${campaignData.name?.replace(/\s+/g, '') || 'แคมเปญ'} #Day${i + 1}`;
              post.visual_prompt = aiContent?.visual_prompt || `ภาพสวยสำหรับ Instagram วันที่ ${i + 1}`;
            } else if (platform === 'TikTok') {
              post.script = aiContent?.script || `สคริปต์ TikTok วันที่ ${i + 1} เกี่ยวกับ ${campaignData.name || 'แคมเปญ'} - มุมมองใหม่ในแต่ละวัน`;
              post.hook = aiContent?.hook || `Hook TikTok ที่ดึงดูดใจวันที่ ${i + 1}`;
            } else if (platform === 'YouTube') {
              post.title = aiContent?.title || `วิดีโอ YouTube วันที่ ${i + 1}: ${campaignData.name || 'แคมเปญ'} - เนื้อหาพิเศษ`;
              post.description = aiContent?.description || `คำอธิบายวิดีโอ YouTube วันที่ ${i + 1}`;
            } else if (platform === 'Line OA') {
              post.message = aiContent?.message || `ข้อความ Line OA วันที่ ${i + 1} สำหรับ ${campaignData.name || 'แคมเปญ'} - เนื้อหาใหม่ทุกวัน`;
              post.cta = aiContent?.cta || `เรียนรู้เพิ่มเติมวันที่ ${i + 1}`;
            }
            
            posts.push(post);
          }
          
          filteredPosts[platform] = posts;
        });
        
        result.posts = filteredPosts;
        console.log('Generated posts for platforms:', platforms, 'Frequency:', frequency, 'Posts per platform:', postsPerPlatform);
      }
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.log('Raw content:', content);
      
      // If JSON parsing fails, create structured response
      result = {
        campaign_summary: 'เกิดข้อผิดพลาดในการแปลง JSON - ใช้ข้อมูลตัวอย่าง',
        big_idea: 'ไอเดียหลัก: สร้างแคมเปญที่น่าสนใจและมีประสิทธิภาพ',
        key_messages: ['ข้อความสำคัญ 1: เน้นคุณค่าของผลิตภัณฑ์', 'ข้อความสำคัญ 2: สร้างความเชื่อมั่น', 'ข้อความสำคัญ 3: เรียกร้องให้ลูกค้าดำเนินการ'],
        visual_direction: 'ใช้สีสันสดใส ภาพที่มีคุณภาพสูง และการออกแบบที่สะอาดตา'
      };
    }

    console.log('Selected platforms:', campaignData.platforms);
    console.log('OpenAI Response:', result);
    res.json(result);
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Local Supabase server running on port ${port}`);
});