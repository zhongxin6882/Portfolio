# 九月十五 · 设计作品集

纯静态站点。GitHub Pages 发布源设置为 `main` 分支、`/(root)`。

- 修改简介、经历与项目：`content.js`
- 修改布局与动效：`styles.css`、`app.js`
- 替换图片：`assets/`

动画使用项目内的 GSAP 3.15.0 与 ScrollTrigger。`motion.js` 管理入场、滚动和详情切换；`assets/vendor/` 中的运行文件随 GitHub Pages 一起部署，无需外部 CDN。升级时运行 `npm install`，再运行 `npm run vendor:gsap` 将依赖复制到静态资源目录。`npm run check` 可检查脚本语法。系统开启“减少动态效果”后会跳过主要 GSAP 动画。

## 添加与排版项目图片

1. 将图片放入 `assets/`（例如 `assets/my-project-01.webp`）。
2. 在 `content.js` 中修改项目的 `image`（列表封面）与 `gallery`（详情图片）。`gallery` 数组的先后顺序就是详情页的滚动顺序。
3. 每项可写 `src`、`caption`、`layout`。`layout: 'wide'` 占整行，`layout: 'pair'` 占半行；相邻两张 `pair` 会并排。网页会按原图比例展示，不裁切详情图。
4. 修改同一项目的 `title`、`category`、`year`、`summary`、`role`、`sector` 等字段。列表按年份倒序，同年按 `number` 倒序。

点击列表封面一次可铺满右侧并显示类型与时间，再点一次打开详情。详情右侧滚动到底会看到下一项目封面；点击底部右侧 × 或按 Esc 可关闭。

PLAYGROUND 使用 8 张封面与 UI 示意片段；左侧数字随片段滚动，右侧卡片靠近视口中心时由小变大。动画写在 `motion.js`，图片来源仍在预览里标明。

当前四张封面是 Dribbble 设计师的视觉参考，直接引用 Dribbble 图片地址；封面、详情和预览都标注来源，详情可打开原作品。它们并非九月十五的项目交付。详情第二张是本站制作的 UI 示意 SVG。展示个人案例时，请用真实项目画面替换这些参考图，并核对文案与年份。外部图片由原站提供，若原链接变化则需更新 `content.js`。
