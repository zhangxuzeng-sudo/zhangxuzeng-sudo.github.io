# 海边的卡夫卡 · Kafka by the Sea

匿名研究主页，中英全文双语，关注 A 股与 AI 商业化。暖白与海蓝色，移动端阅读，文章搜索，RSS，网页内容后台。

## 目前状态

网站已在当前 GitHub 账号公开发布：[中文](https://zhangxuzeng-sudo.github.io/zh/)、[English](https://zhangxuzeng-sudo.github.io/en/)、[管理入口](https://zhangxuzeng-sudo.github.io/admin/)。GitHub Actions 自动发布已验证；Pages CMS 配置已保存，首次登录与仓库授权尚需本人完成。

## 本地预览

需要 Node.js 22 或更新版本；无第三方构建依赖，无需 npm install。

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

打开 http://127.0.0.1:4173/zh/，英文 /en/，管理入口 /admin/。

检查：`node --test tests/*.test.mjs`。测试会构建项目子路径版本，之后再执行本地构建。

## 首次发布

1. 当前仓库属于 zhangxuzeng-sudo，用户已明确接受网站与该账号关联。迁移至其他账号时，由本人完成账号登录与仓库创建。
2. 创建公开仓库，建议名称为 `<你的独立用户名>.github.io`，默认分支 main。若用其他仓库名，本站也支持项目子路径。
3. 仅上传此项目源文件。dist 已在 .gitignore 排除。
4. 仓库 Settings → Pages → Build and deployment → Source 选 GitHub Actions。运行 Build and publish 工作流。
5. 等待 Actions 成功，再打开它返回的实际 Pages 地址。工作流自动识别域名和子路径，生成正式 RSS 与 sitemap。
6. 登录 https://app.pagescms.org/，仅授权本站仓库，选择 main 分支。它读取根目录 .pages.yml 生成文章和站点资料表单。
7. 后台用测试文章验证一次保存、构建和上线，再验证删除或撤下。完成这一轮后，才算在线后台验收。

## 自己发文章

详见《网站维护手册.md》。Pages CMS 是在线后台，需要 GitHub 仓库写权限；网站 /admin/ 包含进入后台的按钮及不联网发布的本机写作台。访客访问 /admin/ 不会获得仓库权限。

后台首次登录前，也可在 GitHub 打开 content/posts 中的文章，点击 Edit this file 修改并提交；需要保留正确的 JSON 格式。提交后自动发布。网站本机写作台导出的 JSON 可通过 GitHub 上传到 content/posts。

文章一份 JSON 同时含中英文正文。两种语言均需完整，否则构建失败，以免上线半翻译文章。关闭 published 会移出页面、RSS 和搜索。未来日期文章也暂不展示；日期到来后需再运行工作流，未配置定时发布。

**公开仓库中 published=false 的文件仍是公开文件。** 私人草稿应保存在本机，不应提交。撤下网页也无法消除仓库历史及读者已保存的内容。

## 目录

- content/site.json：笔名、介绍和网站设置。
- content/posts/：双语文章及来源。
- .pages.yml：后台字段和栏目。
- public/assets/：样式、浏览器交互、图标。
- public/admin/：管理入口。
- scripts/：安全 HTML 输出、静态构建、本地预览。
- .github/workflows/pages.yml：自动构建与发布。
- tests/：内容注入、子路径链接、未发布内容隔离检查。

## 设计与限制

网站不接入评论、统计、广告或外部字体。没有服务器账号密码，也不在前端保存 GitHub token。在线 CMS 是外部服务，具体可用性取决于其服务及 GitHub 授权。

正文支持安全的基础 Markdown：段落、一级至三级标题、无序列表、粗体、行内代码、引用和 HTTP(S) 链接。原始 HTML 当作文本处理；当前不支持表格、图片上传和代码块。未来可添加，不承诺现有版本已具备。

首批四篇为自写双语阅读导读，链接原始资料，没有转载全文，也没有复制源文章的翻译。财务资料按原文日期标注；历史资料不作为最新行情或投资结论。

官方参考：[GitHub Pages 发布](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)、[Pages CMS 快速开始](https://pagescms.org/docs/quick-start/)、[后台配置](https://pagescms.org/docs/configuration/content/)。
