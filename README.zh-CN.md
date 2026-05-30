# OPC Symlink Skill

[English](README.md)

这是一个开源 skill，用来帮助 AI builder 型 OPC 从零散的工作区上下文和自然语言采访中提炼公开包装定位，生成结构化 JSON 元数据，并渲染一个独立的单页个人主页 HTML。

## 它能做什么

- 扫描可能包含用户上下文的文件，例如 `user.md`、`memory.md`、`soul.md`、个人简介、产品文档、博客文章和发布说明。
- 扫描 `memory/` 和 `memories/` 文件夹，但只读取最近 3 个月修改过的内容。
- 将扫描到的信息先总结为“包装假设”，再请用户确认包装方向和公开边界。
- 通过深度包装访谈，挖掘目标客群、痛点、转变、产品、服务、proof、CTA 和隐私边界。
- 生成 AI builder 个人主页 JSON 元数据。
- 基于元数据渲染一个可直接打开的单页个人主页 HTML。
- 渲染后用校验脚本确认 HTML 确实来自 bundled mjs renderer，而不是手写或手改。
- 支持三套可复用模板：`product-led`、`builder-os`、`proof-first`。
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
node opc-symlink-skill/scripts/render-homepage.mjs metadata.json homepage.html --template product-led
node opc-symlink-skill/scripts/verify-homepage.mjs metadata.json homepage.html
```

渲染器默认会拒绝单语 metadata。只有当用户明确要求单语页面时，才使用
`--single-language`，并把同样的参数传给校验脚本。

## 工作流程

1. 扫描当前工作区里的上下文线索和最近 3 个月 memory。
2. 把扫描结果总结成待确认的公开包装假设。
3. 深入访谈目标客群、痛点、转变、offer、proof、CTA 和隐私边界。
4. 确认包装方向和公开事实，不让用户审 raw JSON。
5. 内部生成 AI builder metadata，默认包含 `locales.zh-CN` 和 `locales.en` 两套内容。
6. 让用户选择 `product-led`、`builder-os` 或 `proof-first` 模板。
7. 渲染独立 HTML 个人主页，并运行校验脚本确认输出来自 mjs renderer。

## 隐私原则

这个 skill 默认把记忆文件和工作区内容视为“未确认材料”。即使发现了看起来很明确的信息，也不会直接写入公开主页；它会先向用户确认，再使用确认过的事实。

## 协议

本项目使用 GNU Affero General Public License v3.0 only 协议。详见 `LICENSE`。
