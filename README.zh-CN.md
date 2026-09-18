# OPC Symlink Skill

[English](README.md)

这是一个开源 skill，用来帮助 AI builder 型 OPC 从零散的工作区上下文和自然语言采访中提炼公开包装定位，生成结构化 JSON 元数据，然后让用户选择生成本地 HTML，或通过 OPC Symlink CLI 上传 metadata，获得平台托管的个人主页。

## 它能做什么

- 扫描可能包含用户上下文的文件，例如 `user.md`、`memory.md`、`soul.md`、个人简介、产品文档、博客文章和发布说明。
- 扫描 `memory/` 和 `memories/` 文件夹，但只读取最近 3 个月修改过的内容。
- 将扫描到的信息先总结为“包装假设”，再请用户确认包装方向和公开边界。
- 通过深度包装访谈，挖掘目标客群、痛点、转变、产品、服务、proof、CTA 和隐私边界。
- 生成 AI builder 个人主页 JSON 元数据，然后让用户选择本地 HTML 或 OPC Symlink CLI 上传。
- 对 headline、CTA、卡片、列表、关键词等可见文案做长度硬校验，超长时要求修改 metadata。
- 选择本地 HTML 时，基于元数据渲染一个可直接打开的单页个人主页 HTML。
- 选择本地 HTML 时，用校验脚本确认 HTML 确实来自 bundled mjs renderer，而不是手写或手改。
- 选择 OPC Symlink CLI 时，使用 `opc-symlink upload` 上传 metadata JSON，让平台使用当前模板生成托管主页。
- 支持 `currentWork` 元数据，用于展示当前项目、合作状态、近期更新和可审核的当前工作历史。
- 本地预览和托管 CLI 使用同一套当前 15 个 portfolio 模板 ID：`gridline`、`split-signal`、`cozy-archive`、`handwritten`、`quiet-product`、`fireline`、`tile-playground`、`night-director`、`pattern-field`、`continuous-axis`、`three-column`、`pixel-arcade`、`copy-collage`、`ink-hover`、`grainy-lab`。
- 默认生成中英双语版本：metadata 使用 `locales.zh-CN` 和 `locales.en`，最终仍然只输出一个带语言切换的 HTML 文件。

## 安装

使用 skills CLI 安装：

```bash
npx skills add cnzhihao/opc-symlink-skill -y -g
```

也可以把下面这段提示词交给 AI Coding Agent，让它用非交互方式安装：

```text
帮我安装 opc-symlink-skill，请执行：
npx skills add cnzhihao/opc-symlink-skill -y -g
```

安装后这样调用：

```text
Use $opc-symlink-skill to interview me and create a single-page personal card homepage.
```

也可以用中文提出需求：

```text
使用 $opc-symlink-skill 采访我，并帮我生成个人名片主页。
```

也可以直接调用渲染器：

```bash
node opc-symlink-skill/scripts/render-homepage.mjs metadata.json homepage.html --template gridline
node opc-symlink-skill/scripts/verify-homepage.mjs metadata.json homepage.html
```

渲染器默认会拒绝单语 metadata。只有当用户明确要求单语页面时，才使用
`--single-language`，并把同样的参数传给校验脚本。

渲染器也会拒绝超长可见文案和英文页面里的中文内容。请先压缩或翻译
metadata，再重新渲染。

如果准备发布到托管主页，可以先只预检 metadata，不生成 HTML：

```bash
node opc-symlink-skill/scripts/validate-metadata.mjs metadata.json --template quiet-product
```

运行 bundled 回归测试：

```bash
node --test opc-symlink-skill/evals/render-homepage.test.mjs
```

如果不生成本地 HTML，而是发布到 OPC Symlink，可以使用 CLI：

```bash
npm install -g opc-symlink@latest
opc-symlink login
opc-symlink upload metadata.json --slug your-name --template quiet-product
opc-symlink suggest your-name suggestion.json
opc-symlink suggest --homepage-id homepage-id suggestion.json
opc-symlink current-work suggest your-name current-work.json
opc-symlink current-work export your-name --out current-work-history.json
opc-symlink list
opc-symlink pull your-name --out metadata.json
opc-symlink search "AI automation" --limit 10 --sort best
opc-symlink profile your-name --out profile.json
opc-symlink whoami
opc-symlink logout
```

CLI 上传的是 metadata JSON，不上传 HTML。`upload` 用于创建新主页；已有主页使用 `suggest` 或 `current-work suggest`，根据主页权限模式可能自动生效，否则进入 Dashboard 审核。完整契约见
`opc-symlink-skill/references/opc-symlink-cli.md`。

## 工作流程

1. 扫描当前工作区里的上下文线索和最近 3 个月 memory。
2. 把扫描结果总结成待确认的公开包装假设。
3. 深入访谈目标客群、痛点、转变、offer、proof、CTA 和隐私边界。
4. 确认包装方向和公开事实，不让用户审 raw JSON。
5. 内部生成 AI builder metadata，默认包含 `locales.zh-CN` 和 `locales.en` 两套内容。
6. 压缩 metadata 文案，确保 CTA、标题、卡片和列表内容符合长度预算。
7. 让用户选择下一步：使用 bundled scripts 生成本地 HTML，或使用 OPC Symlink CLI 登录并上传 metadata。
8. 如果选择本地 HTML，从当前 15 个模板 ID 中选择一个，渲染并校验输出。
9. 如果选择 OPC Symlink CLI，使用同一个模板 ID 上传 metadata JSON，返回平台生成的主页 URL、slug 和模板。

## 隐私原则

这个 skill 默认把记忆文件和工作区内容视为“未确认材料”。即使发现了看起来很明确的信息，也不会直接写入公开主页；它会先向用户确认，再使用确认过的事实。

## 协议

本项目使用 GNU Affero General Public License v3.0 only 协议。详见 `LICENSE`。
