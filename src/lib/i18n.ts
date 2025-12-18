export type Language = 'en' | 'th';

export const translations = {
  en: {
    // Header
    aiPowered: 'AI Powered',
    backToHome: 'Back to Home',
    
    // Campaign Brief
    campaignBrief: 'Campaign Brief',
    campaignBriefDesc: 'Fill in your campaign details and let AI generate compelling content for you.',
    
    // Form labels
    industry: 'Industry',
    selectIndustry: 'Select industry',
    targetAudience: 'Target Audience',
    selectTargetAudience: 'Select target audience',
    campaignObjective: 'Campaign Objective',
    selectCampaignObjective: 'Select campaign objective',
    budget: 'Budget',
    budgetPlaceholder: 'e.g., $10,000 - $50,000',
    campaignDuration: 'Campaign Duration',
    startDate: 'Start date',
    endDate: 'End date',
    channels: 'Channels',
    creativeTheme: 'Creative Theme / Direction',
    creativePlaceholder: 'e.g., Minimalist luxury, Bold and energetic...',
    
    // Buttons
    generateCampaign: 'Generate Campaign',
    generatingCampaign: 'Generating Campaign...',
    generatePreview: 'Generate Preview',
    generatingPreview: 'Generating Preview...',
    generateFullCampaign: 'Generate Full Campaign',
    generatingFullCampaign: 'Generating Full Campaign...',
    createNewCampaign: 'Create New Campaign',
    createCampaign: 'Create Campaign',
    creatingCampaign: 'Creating Campaign...',
    publishAll: 'Publish All (Mock)',
    publishCampaign: 'Publish Campaign',
    publishTo: 'Publish to',
    scheduleForLater: 'Schedule for Later',
    editPost: 'Edit',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    preview: 'Preview',
    backToPreview: 'Back to Preview',
    backToEditBrief: 'Back to Edit Brief',
    backToCampaign: 'Back to Campaign',
    startNewCampaign: 'Start New Campaign',
    exportAsJson: 'Export as JSON',
    exportAsText: 'Export as Text',
    
    // Info panel
    poweredByAI: 'Powered by AI',
    poweredByAIDesc: 'Our AI analyzes your inputs and generates platform-optimized content tailored to your audience.',
    strategyMessaging: 'Campaign strategy & messaging',
    platformContent: 'Platform-specific content',
    visualGuidelines: 'Visual direction guidelines',
    readyToPublish: 'Ready-to-publish posts',
    proTip: 'Pro Tip',
    proTipText: 'The more specific your inputs, the better the AI-generated content will match your brand voice.',
    
    // Preview flow
    samplePostsPreview: 'Sample Posts Preview',
    samplePostsDesc: 'Here are 2-3 sample posts generated for your campaign. Review them and if you\'re satisfied, create the full campaign.',
    reviewSamplePosts: 'Review these sample posts before creating all posts for your campaign period.',
    likeWhatYouSee: 'Like what you see?',
    createAllPosts: 'Click "Create Campaign" to generate all posts for your campaign duration.',
    samplePost: 'Sample Post',
    
    // Full campaign preview
    fullCampaignPreview: 'Full Campaign Preview',
    fullCampaignDesc: 'All posts for your campaign period. Edit any post before publishing.',
    postsReadyForReview: 'posts ready for review',
    editBeforePublish: 'Click on any post to edit its content before publishing.',
    
    // Publishing
    publishingPreview: 'Publishing Preview',
    publishingDesc: 'Review your campaign posts before publishing. All content is ready for distribution across selected platforms.',
    readyToPublishPlatform: 'Ready to publish',
    scheduled: 'Scheduled',
    allSet: 'All Set!',
    platformsReady: 'platform(s) ready for publishing. Your campaign content has been reviewed and optimized for each channel.',
    
    // Tabs
    overview: 'Overview',
    platforms: 'Platforms',
    publish: 'Publish',
    kpis: 'KPIs',

    // Steps
    stepBrief: 'Brief',
    stepPreview: 'Preview',
    stepFinal: 'Final',
    stepPublish: 'Publish',
    stepOf: 'Step',
    of: 'of',

    // Campaign Preview Page
    campaignPreviewTitle: 'Campaign Preview',
    campaignPreviewDesc: 'Review your campaign strategy before generating the full content. This is a draft preview — platform-specific posts will be created in the next step.',
    previewDraftNotice: 'This is a Preview Draft',
    previewDraftDesc: 'Click "Generate Full Campaign" to create platform-specific content including posts, captions, scripts, and visual prompts for each selected channel.',

    // Campaign Final Page
    finalCampaignTitle: 'Final Campaign',
    finalCampaignDesc: 'Your complete campaign is ready with platform-specific content. Review all assets before publishing.',
    campaignKpis: 'Campaign KPIs',
    campaignDetails: 'Campaign Details',
    noKpisSelected: 'No KPIs were selected for this campaign.',

    // Campaign Publish Page
    publishCampaignTitle: 'Publish Campaign',
    publishCampaignDesc: 'Review your campaign posts and publish to each platform. Export your content for use with your preferred publishing tools.',
    campaignReady: 'Campaign Ready!',
    platformPostsReady: 'platform posts generated and ready for publishing',
    readyToPublishStatus: 'Ready to publish',
    ready: 'Ready',
    content: 'Content',
    socialApiIntegration: 'Social API Integration',
    socialApiDesc: 'Direct publishing to social platforms requires API integration with Facebook, Instagram, TikTok, YouTube, and LINE. This feature is available in the full version.',
    socialApiNote: 'For now, export your content and use it with your preferred scheduling tools like Buffer, Hootsuite, or native platform schedulers.',
    exportCampaign: 'Export Campaign',
    exportCampaignDesc: 'Download your complete campaign package for use with external publishing tools.',
    exportedAsJson: 'Exported as JSON',
    exportedAsJsonDesc: 'Campaign data downloaded successfully.',
    exportedAsText: 'Exported as Text',
    exportedAsTextDesc: 'Campaign content downloaded as plain text.',
    
    // Results
    campaignSummary: 'Campaign Summary',
    bigIdea: 'Big Idea',
    keyMessages: 'Key Messages',
    visualDirection: 'Visual Direction',
    
    // Footer
    footerText: 'AI Marketing Campaign Generator • Demo Prototype',
    
    // Language
    language: 'Language',
    english: 'English',
    thai: 'ไทย',
    
    // Post types
    caption: 'Caption',
    visualPrompt: 'Visual Prompt',
    carousel: 'Carousel Slides',
    hook: 'Hook',
    script: 'Script',
    title: 'Title',
    description: 'Description',
    message: 'Message',
    cta: 'Call to Action',
    
    // KPI Section
    kpiTitle: 'Key Performance Indicators (KPIs)',
    kpiDesc: 'Select the KPIs you want this campaign to optimize for. Recommended KPIs will be highlighted based on your selected objective.',
    kpiRecommended: 'Recommended',
    kpiSelected: 'KPI(s) selected',
    
    // Budget
    selectBudget: 'Select budget',
    customBudget: 'Custom budget',
    enterCustomBudget: 'Enter custom amount',
    
    // Campaign Brief
    campaignBriefLabel: 'Campaign Brief / Pre-prompt',
    campaignBriefPlaceholder: 'Describe your campaign goals, target message, brand voice, or any specific requirements for the AI to consider...',
  },
  th: {
    // Header
    aiPowered: 'ขับเคลื่อนด้วย AI',
    backToHome: 'กลับหน้าหลัก',
    
    // Campaign Brief
    campaignBrief: 'รายละเอียดแคมเปญ',
    campaignBriefDesc: 'กรอกรายละเอียดแคมเปญของคุณ แล้วให้ AI สร้างเนื้อหาที่น่าสนใจให้คุณ',
    
    // Form labels
    industry: 'อุตสาหกรรม',
    selectIndustry: 'เลือกอุตสาหกรรม',
    targetAudience: 'กลุ่มเป้าหมาย',
    selectTargetAudience: 'เลือกกลุ่มเป้าหมาย',
    campaignObjective: 'วัตถุประสงค์แคมเปญ',
    selectCampaignObjective: 'เลือกวัตถุประสงค์แคมเปญ',
    budget: 'งบประมาณ',
    budgetPlaceholder: 'เช่น 300,000 - 1,500,000 บาท',
    campaignDuration: 'ระยะเวลาแคมเปญ',
    startDate: 'วันเริ่มต้น',
    endDate: 'วันสิ้นสุด',
    channels: 'ช่องทาง',
    creativeTheme: 'ธีมครีเอทีฟ / ทิศทาง',
    creativePlaceholder: 'เช่น มินิมอลหรูหรา, กล้าหาญและมีพลัง...',
    
    // Buttons
    generateCampaign: 'สร้างแคมเปญ',
    generatingCampaign: 'กำลังสร้างแคมเปญ...',
    generatePreview: 'สร้างตัวอย่าง',
    generatingPreview: 'กำลังสร้างตัวอย่าง...',
    generateFullCampaign: 'สร้างแคมเปญเต็มรูปแบบ',
    generatingFullCampaign: 'กำลังสร้างแคมเปญเต็มรูปแบบ...',
    createNewCampaign: 'สร้างแคมเปญใหม่',
    createCampaign: 'สร้างแคมเปญ',
    creatingCampaign: 'กำลังสร้างแคมเปญ...',
    publishAll: 'เผยแพร่ทั้งหมด (ตัวอย่าง)',
    publishCampaign: 'เผยแพร่แคมเปญ',
    publishTo: 'เผยแพร่ไปยัง',
    scheduleForLater: 'กำหนดเวลาในภายหลัง',
    editPost: 'แก้ไข',
    saveChanges: 'บันทึกการเปลี่ยนแปลง',
    cancel: 'ยกเลิก',
    preview: 'ดูตัวอย่าง',
    backToPreview: 'กลับไปดูตัวอย่าง',
    backToEditBrief: 'กลับไปแก้ไขบรีฟ',
    backToCampaign: 'กลับไปแคมเปญ',
    startNewCampaign: 'เริ่มแคมเปญใหม่',
    exportAsJson: 'ส่งออกเป็น JSON',
    exportAsText: 'ส่งออกเป็นข้อความ',
    
    // Info panel
    poweredByAI: 'ขับเคลื่อนด้วย AI',
    poweredByAIDesc: 'AI ของเราวิเคราะห์ข้อมูลของคุณและสร้างเนื้อหาที่เหมาะสมกับแต่ละแพลตฟอร์มสำหรับกลุ่มเป้าหมายของคุณ',
    strategyMessaging: 'กลยุทธ์และข้อความแคมเปญ',
    platformContent: 'เนื้อหาเฉพาะแพลตฟอร์ม',
    visualGuidelines: 'แนวทางการออกแบบภาพ',
    readyToPublish: 'โพสต์พร้อมเผยแพร่',
    proTip: 'เคล็ดลับ',
    proTipText: 'ยิ่งคุณให้รายละเอียดมากเท่าไหร่ AI จะสร้างเนื้อหาที่ตรงกับเสียงแบรนด์ของคุณมากขึ้นเท่านั้น',
    
    // Preview flow
    samplePostsPreview: 'ตัวอย่างโพสต์',
    samplePostsDesc: 'นี่คือ 2-3 โพสต์ตัวอย่างที่สร้างขึ้นสำหรับแคมเปญของคุณ ตรวจสอบและหากพอใจ ให้สร้างแคมเปญเต็มรูปแบบ',
    reviewSamplePosts: 'ตรวจสอบโพสต์ตัวอย่างเหล่านี้ก่อนสร้างโพสต์ทั้งหมดสำหรับช่วงแคมเปญของคุณ',
    likeWhatYouSee: 'ชอบสิ่งที่เห็นไหม?',
    createAllPosts: 'คลิก "สร้างแคมเปญ" เพื่อสร้างโพสต์ทั้งหมดสำหรับระยะเวลาแคมเปญของคุณ',
    samplePost: 'โพสต์ตัวอย่าง',
    
    // Full campaign preview
    fullCampaignPreview: 'ตัวอย่างแคมเปญเต็มรูปแบบ',
    fullCampaignDesc: 'โพสต์ทั้งหมดสำหรับช่วงแคมเปญของคุณ แก้ไขโพสต์ใดก็ได้ก่อนเผยแพร่',
    postsReadyForReview: 'โพสต์พร้อมตรวจสอบ',
    editBeforePublish: 'คลิกที่โพสต์ใดก็ได้เพื่อแก้ไขเนื้อหาก่อนเผยแพร่',
    
    // Publishing
    publishingPreview: 'ตัวอย่างการเผยแพร่',
    publishingDesc: 'ตรวจสอบโพสต์แคมเปญของคุณก่อนเผยแพร่ เนื้อหาทั้งหมดพร้อมสำหรับการกระจายไปยังแพลตฟอร์มที่เลือก',
    readyToPublishPlatform: 'พร้อมเผยแพร่',
    scheduled: 'กำหนดเวลาแล้ว',
    allSet: 'พร้อมแล้ว!',
    platformsReady: 'แพลตฟอร์มพร้อมสำหรับการเผยแพร่ เนื้อหาแคมเปญของคุณได้รับการตรวจสอบและปรับแต่งสำหรับแต่ละช่องทาง',
    
    // Tabs
    overview: 'ภาพรวม',
    platforms: 'แพลตฟอร์ม',
    publish: 'เผยแพร่',
    kpis: 'KPIs',

    // Steps
    stepBrief: 'บรีฟ',
    stepPreview: 'ตัวอย่าง',
    stepFinal: 'สุดท้าย',
    stepPublish: 'เผยแพร่',
    stepOf: 'ขั้นตอน',
    of: 'จาก',

    // Campaign Preview Page
    campaignPreviewTitle: 'ตัวอย่างแคมเปญ',
    campaignPreviewDesc: 'ตรวจสอบกลยุทธ์แคมเปญก่อนสร้างเนื้อหาเต็มรูปแบบ นี่คือตัวอย่างเบื้องต้น — เนื้อหาเฉพาะแพลตฟอร์มจะถูกสร้างในขั้นตอนถัดไป',
    previewDraftNotice: 'นี่คือตัวอย่างเบื้องต้น',
    previewDraftDesc: 'คลิก "สร้างแคมเปญเต็มรูปแบบ" เพื่อสร้างเนื้อหาเฉพาะแพลตฟอร์ม รวมถึงโพสต์ แคปชั่น สคริปต์ และคำแนะนำภาพสำหรับแต่ละช่องทาง',

    // Campaign Final Page
    finalCampaignTitle: 'แคมเปญสุดท้าย',
    finalCampaignDesc: 'แคมเปญเต็มรูปแบบพร้อมเนื้อหาเฉพาะแพลตฟอร์มแล้ว ตรวจสอบทรัพยากรทั้งหมดก่อนเผยแพร่',
    campaignKpis: 'KPIs ของแคมเปญ',
    campaignDetails: 'รายละเอียดแคมเปญ',
    noKpisSelected: 'ไม่มี KPIs ที่เลือกสำหรับแคมเปญนี้',

    // Campaign Publish Page
    publishCampaignTitle: 'เผยแพร่แคมเปญ',
    publishCampaignDesc: 'ตรวจสอบโพสต์แคมเปญและเผยแพร่ไปยังแต่ละแพลตฟอร์ม ส่งออกเนื้อหาเพื่อใช้กับเครื่องมือเผยแพร่ที่คุณต้องการ',
    campaignReady: 'แคมเปญพร้อมแล้ว!',
    platformPostsReady: 'โพสต์แพลตฟอร์มถูกสร้างและพร้อมเผยแพร่',
    readyToPublishStatus: 'พร้อมเผยแพร่',
    ready: 'พร้อม',
    content: 'เนื้อหา',
    socialApiIntegration: 'การเชื่อมต่อ Social API',
    socialApiDesc: 'การเผยแพร่โดยตรงไปยังแพลตฟอร์มโซเชียลต้องการการเชื่อมต่อ API กับ Facebook, Instagram, TikTok, YouTube และ LINE ฟีเจอร์นี้มีในเวอร์ชันเต็ม',
    socialApiNote: 'สำหรับตอนนี้ ส่งออกเนื้อหาและใช้กับเครื่องมือตั้งเวลาที่คุณต้องการ เช่น Buffer, Hootsuite หรือตัวจัดเวลาของแพลตฟอร์ม',
    exportCampaign: 'ส่งออกแคมเปญ',
    exportCampaignDesc: 'ดาวน์โหลดแพ็คเกจแคมเปญเต็มรูปแบบเพื่อใช้กับเครื่องมือเผยแพร่ภายนอก',
    exportedAsJson: 'ส่งออกเป็น JSON แล้ว',
    exportedAsJsonDesc: 'ดาวน์โหลดข้อมูลแคมเปญสำเร็จ',
    exportedAsText: 'ส่งออกเป็นข้อความแล้ว',
    exportedAsTextDesc: 'ดาวน์โหลดเนื้อหาแคมเปญเป็นข้อความธรรมดาแล้ว',
    
    // Results
    campaignSummary: 'สรุปแคมเปญ',
    bigIdea: 'ไอเดียหลัก',
    keyMessages: 'ข้อความสำคัญ',
    visualDirection: 'ทิศทางการออกแบบ',
    
    // Footer
    footerText: 'AI Marketing Campaign Generator • Demo Prototype',
    
    // Language
    language: 'ภาษา',
    english: 'English',
    thai: 'ไทย',
    
    // Post types
    caption: 'แคปชั่น',
    visualPrompt: 'คำแนะนำภาพ',
    carousel: 'สไลด์แครูเซล',
    hook: 'ฮุค',
    script: 'สคริปต์',
    title: 'หัวข้อ',
    description: 'รายละเอียด',
    message: 'ข้อความ',
    cta: 'ปุ่มกระตุ้นการกระทำ',
    
    // KPI Section
    kpiTitle: 'ตัวชี้วัดผลลัพธ์หลัก (KPIs)',
    kpiDesc: 'เลือก KPIs ที่คุณต้องการให้แคมเปญนี้ปรับให้เหมาะสม KPIs ที่แนะนำจะถูกไฮไลท์ตามวัตถุประสงค์ที่คุณเลือก',
    kpiRecommended: 'แนะนำ',
    kpiSelected: 'KPI ที่เลือก',
    
    // Budget
    selectBudget: 'เลือกงบประมาณ',
    customBudget: 'งบประมาณกำหนดเอง',
    enterCustomBudget: 'กรอกจำนวนเงิน',
    
    // Campaign Brief
    campaignBriefLabel: 'บรีฟแคมเปญ / คำสั่งเบื้องต้น',
    campaignBriefPlaceholder: 'อธิบายเป้าหมายแคมเปญ ข้อความที่ต้องการสื่อ เสียงแบรนด์ หรือข้อกำหนดเฉพาะที่ต้องการให้ AI พิจารณา...',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

export const useTranslation = (lang: Language) => {
  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.en[key] || key;
  };
  return { t };
};
