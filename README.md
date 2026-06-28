<div align="center">

# Diamond Track Atlas · 钻石田径图鉴

**探索世界顶级田径赛事数据、运动员档案与赛道纪录的交互式图鉴**
*An interactive atlas for Diamond League athletics — athletes, events, and race records.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[🌐 在线预览 / Live Demo](https://ptppppp.github.io/stdm/) · [📦 REST API 后端](#后端-apiserver) · [📄 数据流说明](#数据流说明) · [❓ 常见问题](#常见问题-faq)

</div>

---

## ✨ 项目简介

**Diamond Track Atlas（钻石田径图鉴）** 是一个面向田径爱好者的钻石联赛科普网站。它把运动员档案、项目科普、最近比赛记录、个人最好成绩（PB）/赛季最好成绩（SB）和数据核验状态聚合到一个清晰、可追溯的界面中。

每一条比赛记录都附带**原始来源链接**和**人工核验状态**，让你能一眼看清「这个数据从哪来、可信度如何」。站点强调数据可追溯与来源透明，而不是堆砌数字。

> ⚠️ **非官方数据源声明**：本站不是 Diamond League / World Athletics 的官方产品，所有成绩仅用于**科普与学习参考**，最终请以官方发布为准。`verified` 只代表本站人工核验过来源链接，**不代表本站具有官方权威**。

## 🌟 功能特性

- **运动员档案** — 资料、照片、国籍、主项，未授权图片自动回退为渐变占位图（首字母 + 国旗 + 主项）
- **项目科普** — 田径各项目的分类介绍与背景知识
- **比赛记录溯源** — 每条成绩都带来源链接与核验状态（`pending` / `verified` / `unverified`）
- **PB / SB 标记** — 仅在比赛记录明确标注 `recordTags` 时展示，且始终附带来源
- **自研 SVG 雷达图** — 不依赖第三方图表库，轻量且可定制
- **运动员对比面板** — 多维度横向对比
- **响应式设计** — 基于 Tailwind CSS，移动端 / 桌面端自适应
- **可选 REST API** — 独立的 Express 后端，把数据以标准接口暴露给第三方
- **自动化数据管道** — GitHub Actions 定时同步 + 自动生成 PR，人工核验后合并

## 🛠️ 技术栈

**前端**

- React 18 + TypeScript
- Vite 5（构建与开发服务器）
- React Router 6（路由）
- Tailwind CSS 3（样式）
- 自研 SVG 雷达图（零图表库依赖）
- Vitest + Testing Library（单元测试）

**后端（[`server/`](./server)）**

- Express + Helmet + CORS + express-rate-limit
- Zod（请求参数与环境变量校验）

**数据脚本（[`scripts/`](./scripts)）**

- Node scripts + tsx
- cheerio（Node 侧公开网页解析）
- sharp（图片压缩 / 转 WebP）

## 📁 项目结构

```text
src/
  app/                  应用入口、路由、providers
  pages/                页面编排
  components/           UI 组件
    athletes/           运动员卡片、详情、成绩表
    compare/            对比面板
    data/               来源链接、核验状态、数据新鲜度
    events/             项目卡片
    layout/             Layout / Navbar / Footer
    ui/                 通用基础组件
  domain/athletics/     类型、常量、纯函数、校验
  data/
    manual/             人工维护的运动员和项目数据
    generated/          脚本生成的比赛结果和数据元信息
    index.ts            前端唯一稳定数据入口
  hooks/
  lib/

scripts/data/           数据同步、导入、校验和生成脚本
scripts/images/         图片下载、压缩、转 WebP 脚本
data-import/
  raw/                  手动导入源文件
  normalized/           标准化中间数据
  audit/                同步和导入审计报告
server/                 可选的 Express 后端 API
  src/routes/           athletes / events / results / health
  src/middleware/       日志、限流、错误处理
  src/schemas/          Zod 校验
  src/services/         数据读取
.github/workflows/      GitHub Pages 部署 + 定时数据更新 PR
```

## 🚀 快速开始

### 前提条件

- Node.js ≥ 18（推荐 20 / 22）
- npm

### 本地运行

```bash
npm install      # 安装依赖
npm run dev      # 启动开发服务器（默认 http://localhost:5173）
npm run build    # 类型检查 + 生产构建
npm run preview  # 本地预览构建产物
```

### 常用检查

```bash
npm run data:validate   # 校验数据完整性
npm run lint            # ESLint 检查
npm test                # 运行单元测试（Vitest）
npm run check           # data:validate + build 一键检查
```

<details>
<summary><b>📖 可用脚本一览</b></summary>

| 脚本 | 说明 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | `tsc -b` 类型检查 + `vite build` |
| `npm run preview` | 预览构建产物 |
| `npm test` / `npm run test:watch` | 运行 / 监听单元测试 |
| `npm run lint` / `npm run lint:fix` | ESLint 检查 / 自动修复 |
| `npm run data:sync` | 同步钻石联赛公开数据 |
| `npm run data:normalize` | 标准化手动导入数据 |
| `npm run data:validate` | 校验数据完整性 |
| `npm run data:meta` | 生成数据元信息 |
| `npm run images:optimize` | 运动员图片压缩 / 转 WebP |
| `npm run check` | `data:validate` + `build` |

</details>

## 🔌 后端 API（server/）

`server/` 是一个**可选**的 Express 后端，把项目数据以 REST 接口暴露出来供前端或第三方读取。所有路由统一挂在 `/api` 下，响应格式为 `{ success, data }` 或分页 `{ success, data, pagination }`。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/health` | 健康检查 |
| GET | `/api/athletes` | 运动员列表（`q` / `country` / `gender` / `event` 及分页 `page` / `limit`） |
| GET | `/api/athletes/countries` | 国家列表 |
| GET | `/api/athletes/:id` | 运动员详情（含最近 5 条成绩） |
| GET | `/api/athletes/:id/results` | 该运动员全部比赛记录 |
| GET | `/api/events` | 项目列表（支持 `?category=`） |
| GET | `/api/events/:id` | 项目详情 |
| GET | `/api/events/:id/results` | 项目比赛记录（分页） |
| GET | `/api/results` | 成绩查询（`athleteId` / `event` / `competition` / `year` / `verified` / `sort` / `order` / 分页） |
| GET | `/api/results/events` | 所有比赛项目 |
| GET | `/api/results/competitions` | 所有赛事名称 |

### 启动后端

```bash
cd server
npm install
npm run dev      # tsx watch，默认 http://localhost:3001
```

环境变量见 [`server/.env.example`](./server/.env.example)：

- `PORT`（默认 `3001`）
- `CORS_ORIGIN`（默认 `http://localhost:5173`，即前端 dev 地址）
- `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS`（默认 100 次 / 分钟）

测试：

```bash
cd server && npm test
```

## 🔄 数据流说明

前端页面**只从** `src/data/index.ts` 读取数据：

```ts
import { athletes, competitionResults, dataMeta } from '../data';
```

最近比赛、PB、SB **不**写在页面组件里，也**不**从运动员资料字段直接展示，而是从 `competitionResults` 通过 `src/domain/athletics/resultUtils.ts` 计算得出。每条比赛记录都带 `source`，UI 会展示来源链接和核验状态。

这样设计的好处：**展示层只负责渲染，数据来源与计算逻辑集中可追溯。**

## 📥 手动导入数据流程

适用于自动解析失败，或需要人工录入特定比赛成绩的场景。

1. **复制示例文件**：

```powershell
Copy-Item data-import/raw/manual-results.example.json data-import/raw/manual-results.json
```

2. **填入比赛成绩**。脚本会用 `athleteEnglishName` / `athleteName` 匹配 `athletes.manual.ts` 中的运动员。

3. **运行标准化与校验**：

```bash
npm run data:normalize
npm run data:validate
npm run build
```

4. **如有未匹配运动员或缺字段**，查看审计报告：

```text
data-import/audit/unmatched-athletes.md
data-import/audit/manual-results-missing-fields.md
```

> 💡 手动导入脚本**不会**把输入中的 `verified` 自动升级为 `verified`。需要人工核验来源后，再在生成数据或 PR 中明确修改。

## 🔄 自动同步数据流程

自动同步**只在** Node scripts 或 GitHub Actions 中运行，**不会**在浏览器前端请求 Diamond League 或 World Athletics 页面。

```bash
npm run data:sync
```

同步脚本会：

- 从 `scripts/data/sources.ts` 读取公开数据源
- 用 `fetch + cheerio` 尝试解析官方公开页面
- 成功时写入 `data-import/normalized/results.normalized.json` 和 `src/data/generated/*`
- 自动同步生成的数据默认 `verified = "pending"`
- 失败或页面结构不稳定时**不猜测、不覆盖旧数据**，只生成审计报告：
  - `data-import/audit/sync-report.json`
  - `data-import/audit/sync-report.md`

> ⚠️ 官方网页结构变化、JS 渲染、限流或网络问题都可能导致同步失败。失败时推荐走[手动导入流程](#手动导入数据流程)。

## ✅ 数据核验规则

| 状态 | 含义 |
| --- | --- |
| `pending` | 脚本生成或待人工确认的数据 |
| `verified` | 人工核验过来源链接的数据 |
| `unverified` | 缺少可靠来源的数据 |

PB/SB 只有在比赛记录中带 `recordTags: ["PB"]` 或 `["SB"]` 时才展示，并且**仍会显示来源和核验状态**。

## 🤖 GitHub Actions 自动 PR

[`.github/workflows/update-results.yml`](./.github/workflows/update-results.yml) 每天运行一次（`cron: '0 8 * * *'`），也支持 `workflow_dispatch` 手动触发。

流程：

1. `npm ci`
2. `npm run data:sync`
3. `npm run data:validate`
4. `npm run build`
5. 若 `src/data/generated` 或 `data-import` 有变化，用 `peter-evans/create-pull-request` 创建 PR

PR 标题统一为：

```text
chore(data): update Diamond League results
```

### 推荐工作流

```text
GitHub Actions 定时同步  →  自动生成 PR  →  人工核验来源和 pending 数据
     →  必要时改为 verified  →  合并 main  →  自动重新部署
```

## ☁️ 部署

本项目同时支持 **GitHub Pages** 和 **Vercel** 两种部署方式。

### GitHub Pages（主要）

[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) 在 `main` 分支推送时自动构建并部署到 GitHub Pages。CI 环境下 Vite 的 `base` 会自动设为 `/stdm/`（见 `vite.config.ts`）。

### Vercel

Vercel 使用默认 Vite 构建即可，`vercel.json` 已配置 SPA fallback：

```bash
npm run build
```

合并到 main 后由 Vercel 自动部署。前端构建产物**不会**包含任何官方页面抓取逻辑。

## ❓ 常见问题 FAQ

**Q：为什么自动同步没有生成新数据？**
脚本只解析稳定的公开 HTML 表格。如果官方页面是 JS 渲染或结构变化，脚本会生成 audit 报告并保留旧数据。

**Q：为什么自动同步的数据都是 `pending`？**
自动化只能负责收集和标准化，不能替代人工核验。只有人工确认来源后才允许改为 `verified`。

**Q：以后怎么添加新的比赛？**
优先更新 `scripts/data/sources.ts`。如果自动解析失败，把成绩填入 `data-import/raw/manual-results.json` 后运行 `npm run data:normalize`。

**Q：前端会不会直接抓官方网页？**
不会。浏览器端只读取本项目已经生成的数据文件，所有外部抓取都发生在 Node 脚本 / CI 端。

## 🖼️ 运动员图片维护规范

### 图片存放位置

```text
public/images/athletes/      # 运动员照片
public/images/placeholders/  # 占位图（备用）
```

### 命名规则

图片文件名使用运动员 ID：

```text
public/images/athletes/noah-lyles.webp
public/images/athletes/shericka-jackson.webp
public/images/athletes/armand-duplantis.webp
```

### 如何添加一张新照片

1. **找到可授权图片**
   - 优先使用自己拍摄的照片
   - 使用 Wikimedia Commons 等带清晰许可证的图片
   - 官方明确允许使用的图片
   - ⚠️ 不要直接复制官网、社交媒体、摄影师网站的图片

2. **下载并压缩**
   - 转换为 WebP 格式
   - 单张控制在 200 KB – 500 KB 以内
   - 最大宽度 1200 px

3. **放入目录**
   ```bash
   cp downloaded-photo.webp public/images/athletes/athlete-id.webp
   ```

4. **更新数据文件**
   在 `src/data/manual/athletes.manual.ts` 中填写 `image` 字段：
   ```ts
   image: {
     src: '/images/athletes/athlete-id.webp',
     alt: '运动员姓名 competing in 项目',
     credit: '摄影师姓名',
     sourceName: 'Wikimedia Commons',
     sourceUrl: 'https://commons.wikimedia.org/wiki/File:...',
     license: 'CC BY-SA 4.0',
     licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
     usageStatus: 'verified',
     notes: 'Image verified on 2026-05-30.',
   },
   ```

5. **构建验证**
   ```bash
   npm run build
   ```

### 图片版权注意

- 不要直接复制官网、社交媒体、摄影师网站的图片
- 每张图片都要核对署名和许可证
- 未确认授权的图片只能标记 `pending`，不建议正式发布
- `usageStatus` 值说明：
  - `verified`：已核验来源和许可证
  - `pending`：待核验，来源未确认
  - `unavailable`：确认无授权
  - `placeholder`：无图片，显示占位图

### 没有图片怎么办

- 保持 `usageStatus: 'placeholder'`
- 页面会自动显示高级渐变占位图（运动员首字母 + 国家 + 主项）
- **不要为了好看使用来源不明的图片**

## 🤝 贡献

欢迎通过 Issue 和 Pull Request 参与贡献！提交前请：

1. 运行 `npm run lint` 与 `npm run check` 确保通过
2. 为新功能补充必要的测试
3. 涉及数据变更时，确认来源可追溯并标注核验状态

## 📄 许可证

本仓库的**源代码**以 [MIT License](./LICENSE) 开源，Copyright © 2026 PtPPPPP。

**运动员照片**的版权归原作者所有（见上方[运动员图片维护规范](#运动员图片维护规范)）；**比赛数据**来源于 Diamond League、World Athletics 等公开渠道，仅供科普参考。

## 🙏 致谢

- [Diamond League](https://www.diamondleague.com/) 与 [World Athletics](https://worldathletics.org/) 提供的公开赛事数据
- 所有为田径运动留下影像与记录的摄影师、媒体与志愿者
- 本项目使用的开源社区工具：React、Vite、Tailwind CSS、Express、cheerio、sharp 等
