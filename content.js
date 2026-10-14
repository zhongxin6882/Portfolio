/*
 * 作品配置：封面 image；详情图 gallery。把图片上传至 assets/，替换对应路径即可。
 * gallery 中按数组顺序排版：layout 为 wide（整行）或 pair（半行）。
 * 封面采用 Dribbble 视觉参考并明确标明作者；详情第二张为本站 UI 示意。
 * 参考图不是九月十五的项目交付，发布个人案例前请替换为真实作品。
 */
window.PORTFOLIO = {
  brand:'九月十五', name:'九月十五', location:'中国 · 交互与视觉设计',
  email:'',
  aboutTitle:'把复杂信息，\n设计得清晰。',
  about:[
    '你好，我是九月十五，一名交互与视觉设计师，专注于 B 端产品与复杂业务场景的体验设计。',
    '我的项目经历涵盖城市安防、城市管理、网络安全与数据治理。从需求梳理、交互流程到设计规范和动态可视化，我希望让信息更易理解，让操作更清晰。'
  ],
  focus:['B 端产品设计','交互流程','城市安防','数据可视化','设计规范','动态视觉'],
  experience:[{period:'2020 起',label:'旷视科技（AI）｜交互与视觉设计师'},{period:'2017—20',label:'奇安信｜产品 UI 设计师 / 数据产品组长'},{period:'2016—17',label:'华筑图文｜UI 设计师'}],
  social:[],
  projects:[
    {
      id:'police-ai',number:'04',title:'贵警智态',category:'AI 产品 · 警务工作台',year:'2026',
      image:'https://cdn.dribbble.com/userupload/48167068/file/1386e1157faef10f7191ae282b8a29b6.png?resize=1600x1200',
      reference:{author:'Latera Studio',title:'Velize — Smart City Command Center',url:'https://dribbble.com/shots/27500052-Velize-Smart-City-Command-Center-Dashboard-UI-UX-Design'},
      summary:'围绕警务场景中的信息研判与协同处置，梳理任务、数据与智能体之间的关系，让复杂流程更容易被理解和操作。',
      role:'交互设计 / 视觉设计',sector:'公共安全',tags:['AI 工作台','复杂业务','数据可视化'],
      gallery:[
        {src:'https://cdn.dribbble.com/userupload/48167068/file/1386e1157faef10f7191ae282b8a29b6.png?resize=1600x1200',layout:'wide',caption:'视觉参考 · Latera Studio / 设计社区',source:'https://dribbble.com/shots/27500052-Velize-Smart-City-Command-Center-Dashboard-UI-UX-Design'},
        {src:'assets/police-ai-detail.svg',layout:'wide',caption:'研判与指挥视图 · 界面示意'}
      ]
    },
    {
      id:'identity',number:'03',title:'零信任身份可信态势',category:'网络安全 · 数据产品',year:'2026',
      image:'https://cdn.dribbble.com/userupload/43647224/file/original-74db831864ea5925e307c68d2793e9bb.png?resize=1600x1200',
      reference:{author:'Rishika Choudhary',title:'GuardX Cyber Security Dashboard',url:'https://dribbble.com/shots/26130974-GuardX-Cyber-Security-Dashboard-Light-Dark-Mode'},
      summary:'将身份可信度、行为合规和异常事件放进统一的分析路径，帮助使用者从趋势发现问题，再下钻到具体对象。',
      role:'交互设计 / 数据可视化',sector:'网络安全',tags:['零信任','态势分析','下钻交互'],
      gallery:[
        {src:'https://cdn.dribbble.com/userupload/43647224/file/original-74db831864ea5925e307c68d2793e9bb.png?resize=1600x1200',layout:'wide',caption:'视觉参考 · Rishika Choudhary / 设计社区',source:'https://dribbble.com/shots/26130974-GuardX-Cyber-Security-Dashboard-Light-Dark-Mode'},
        {src:'assets/identity-detail.svg',layout:'wide',caption:'异常下钻列表 · 界面示意'}
      ]
    },
    {
      id:'flow',number:'02',title:'智能排版助手',category:'设计工具 · 产品设计',year:'2026',
      image:'https://cdn.dribbble.com/userupload/11796885/file/original-1bf33e0ce666984c9fa1ef2df4a3bd46.png?resize=1600x1200',
      reference:{author:'Jackie Brown / JBW',title:'Figma UI as a Bento Grid',url:'https://dribbble.com/shots/23197865-Figma-UI-as-a-Bento-Grid'},
      summary:'把画板扫描、排序与网格排版组织成一条清晰的操作流程，减少重复整理，同时保留可预览和复原的控制。',
      role:'产品设计 / 插件交互',sector:'设计工具',tags:['Figma 插件','工作流','效率工具'],
      gallery:[
        {src:'https://cdn.dribbble.com/userupload/11796885/file/original-1bf33e0ce666984c9fa1ef2df4a3bd46.png?resize=1600x1200',layout:'wide',caption:'视觉参考 · Jackie Brown / 设计社区',source:'https://dribbble.com/shots/23197865-Figma-UI-as-a-Bento-Grid'},
        {src:'assets/flowarrange-detail.svg',layout:'wide',caption:'识别与排序面板 · 界面示意'}
      ]
    },
    {
      id:'security',number:'01',title:'安管平台',category:'安全运营 · B 端平台',year:'2026',
      image:'https://cdn.dribbble.com/userupload/45736839/file/919a8e877d3be06a78afe5278799e703.png?resize=1600x1200',
      reference:{author:'Delbueno Studio',title:'Cyber Security Monitoring Dashboard',url:'https://dribbble.com/shots/26782942-Cyber-Security-Monitoring-Dashboard'},
      summary:'围绕资产、风险与处置记录建立一致的表格和详情层级，让使用者能快速筛选、定位并追踪处理结果。',
      role:'UI 设计 / 交互规范',sector:'安全运营',tags:['表格体验','风险分析','设计规范'],
      gallery:[
        {src:'https://cdn.dribbble.com/userupload/45736839/file/919a8e877d3be06a78afe5278799e703.png?resize=1600x1200',layout:'wide',caption:'视觉参考 · Delbueno Studio / 设计社区',source:'https://dribbble.com/shots/26782942-Cyber-Security-Monitoring-Dashboard'},
        {src:'assets/security-detail.svg',layout:'wide',caption:'明细与处置视图 · 界面示意'}
      ]
    }
  ]
};
