# OPC Symlink Skill

[English](README.md)

这是一个开源 Codex Skill，用来帮助用户把零散的工作区上下文和自然语言采访内容整理成可信的公开个人资料，并生成结构化 JSON 元数据和一个独立的单页个人主页 HTML。

## 它能做什么

- 扫描可能包含用户上下文的文件，例如 `user.md`、`memory.md`、`soul.md`、个人简介、产品文档、博客文章和发布说明。
- 扫描 `memory/` 和 `memories/` 文件夹，但只读取最近 3 个月修改过的内容。
- 将扫描到的信息先总结为“待确认线索”，再请用户确认、纠正或删除不适合公开的信息。
- 通过多轮自然语言采访，逐步了解用户的身份、工作、产品、企业、合作伙伴、客户、公开成果、联系方式和合作诉求。
- 生成公开可用的个人名片 JSON 元数据。
- 基于元数据渲染一个可直接打开的单页个人主页 HTML。

## 安装

使用 skills CLI 安装：

```bash
npx skills add https://github.com/cnzhihao/opc-symlink-skill
```

也可以把下面这段提示词交给 AI Coding Agent，让它帮你安装：

```text
帮我安装 opc-symlink-skill。请把
https://github.com/cnzhihao/opc-symlink-skill 克隆到
~/.claude/skills/opc-symlink-skill，安装完成后检查
opc-symlink-skill/SKILL.md、opc-symlink-skill/agents/、
opc-symlink-skill/references/、opc-symlink-skill/scripts/
是否存在。
```

安装后这样调用：

```text
Use $opc-symlink-skill to interview me and create a single-page personal card homepage.
```

也可以用中文提出需求：

```text
使用 $opc-symlink-skill 采访我，并帮我生成个人名片主页。
```

## 工作流程

1. 扫描当前工作区里的上下文线索。
2. 把扫描结果总结成待确认画像。
3. 向用户求证哪些内容正确、哪些需要删除或保密。
4. 进行简短多轮采访，补齐定位、产品、证明、链接和合作信息。
5. 生成 JSON 元数据。
6. 渲染独立 HTML 个人主页。

## 隐私原则

这个 skill 默认把记忆文件和工作区内容视为“未确认材料”。即使发现了看起来很明确的信息，也不会直接写入公开主页；它会先向用户确认，再使用确认过的事实。

## 协议

本项目使用 GNU Affero General Public License v3.0 only 协议。详见 `LICENSE`。
