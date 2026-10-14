# 董众鑫 · 设计作品集

纯静态站点。GitHub Pages 发布源设置为 `main` 分支、`/(root)`。

- 修改简介、经历与项目：`content.js`
- 修改布局与动效：`styles.css`、`app.js`
- 替换图片：`assets/`

## 添加与排版项目图片

1. 将图片放入 `assets/`（例如 `assets/my-project-01.webp`）。
2. 在 `content.js` 中修改项目的 `image`（列表封面）与 `gallery`（详情图片）。`gallery` 数组的先后顺序就是详情页的滚动顺序。
3. 每项可写 `src`、`caption`、`layout`。`layout: 'wide'` 占整行，`layout: 'pair'` 占半行；相邻两张 `pair` 会并排。网页会按原图比例展示，不裁切详情图。
4. 修改同一项目的 `title`、`category`、`year`、`summary`、`role`、`sector` 等字段。列表按年份倒序，同年按 `number` 倒序。

点击列表封面一次可铺满右侧并显示类型与时间，再点一次打开详情。详情右侧滚动到底会看到下一项目封面；点击底部右侧 × 或按 Esc 可关闭。

目前的 SVG 为原创 UI 示意画面，文案和年份也应在对外展示前按真实项目资料核对和替换。
