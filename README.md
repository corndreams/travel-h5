# travel-h5（前端）

AI 旅游行程规划助手的移动端 H5 前端：输入目的地/预算/天数生成行程规划，并支持与 AI 流式对话咨询。

## 功能

- 行程规划：填写城市、预算、天数，生成按天（早/中/晚）的行程安排
- 预算明细：展示住宿/餐饮/交通/门票/其他预算分配
- AI 对话：流式展示 AI 回复，支持 Markdown 渲染
- 交互与校验：基于 Vant 组件完成表单校验、加载态与空态展示

## 技术栈

- Vue 3 + Vite + Vue Router
- Vant（移动端 UI）
- Axios（常规请求）+ Fetch Stream（流式请求）
- Marked（Markdown 渲染）

## 快速开始

环境要求：建议 Node.js 18+，包管理器 pnpm

```bash
pnpm install
pnpm dev
```

## 后端地址配置

前端请求地址在 `src/api/requset.js` 中配置：

- `baseURL`：后端服务地址（默认写死为 `http://127.0.0.1:3300`）
- 流式接口会请求：`${baseURL}/travel/chat`
- 行程推荐接口会请求：`${baseURL}/travel/recommend`

确保后端服务端口与这里保持一致。
