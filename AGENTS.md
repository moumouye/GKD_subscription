# AGENTS.md — 个人 GKD 订阅项目智能体操作指南

本项目是基于 `@gkd-kit` 标准工程化构建的个人 GKD 自定义规则在线订阅库（**YM 的 GKD 订阅**）。
当 AI Agent 在此项目中工作，特别是当用户上传**屏幕截图**、**快照 JSON 节点树**或提出规则编写需求时，必须无条件遵守本指南。

---

## 1. 核心前置依赖读取

在生成任何规则前，AI Agent 必须优先查阅本地根目录下的两份规范文档（已被 Git 忽略保护）：
1. **`gkd-prompt.txt`**：界面架构判定流程（Compose vs 原生 View）、无障碍点击策略与快查优化准则。
2. **`gkd-SKILL.md`**：`@gkd-kit/define` 官方 API 字段定义与规则属性规范。

---

## 2. 接收输入与标准处理流程（SOP）

当用户提供应用界面的**快照 JSON 节点树**和**屏幕截图**时，按以下流水线执行：

### Step 1: 提取元信息并保存截图
- 从 JSON 根对象中提取：
  - `appId`（如 `tv.danmaku.bili`）
  - `appInfo.name`（如 `哔哩哔哩`）
  - `activityId`（如 `com.bilibili.ship.theseus.detail.UnitedBizDetailsActivity`）
  - 快照 ID `id`（用于组装 `https://i.gkd.li/i/<id>`）
- 若用户上传了示例截图，将其保存至：
  `assets/examples/<appId>/<key>.png`

### Step 2: 严格执行组件架构判定（依据 gkd-prompt.txt）
在编写选择器前，必须检查目标节点或其祖先节点（pid 链路）：
- **判定为 Compose 组件**（父级含 `ComposeView` 或文本 `"textQf": false`）：
  - ❌ **严禁**配置 `fastQuery: true`（会导致节点无法检出而跳过）。
  -  **必须显式**配置 `action: 'clickCenter'`（模拟物理居中点击，防止事件被 Compose 吞掉）。
  - ❌ 若快照中 `activityId` 为 `null`，**严禁**配置 `activityIds`。
- **判定为原生 View**：
  - 目标节点或属性支持快速查找（`idQf: true` 或 `textQf: true`）时，可配置 `fastQuery: true`。
  - `action` 保持默认，优先定位 `clickable=true` 的有效父/子节点。

### Step 3: 选择器语法规范
-  允许的关系符：`>`（子节点）、`<`（父节点）、`+`（相邻后兄弟）、`-`（相邻前兄弟）。
- ❌ **严禁使用 CSS 通用兄弟符 `~`**（GKD 选择器引擎不支持）。

---

## 3. 命名规范与强制分类约束（必须遵守）

GKD 的云端校验工具（`checkSubscription`）要求**所有规则组名称必须严格以 `src/categories.ts` 中定义的分类之一开头，且紧跟短横线 `-`**：

当前允许的 4 个前缀：
- `开屏广告-<具体动作>`
- `全屏广告-<具体动作>`
- `局部广告-<具体动作>`
- `功能类-<具体动作>`

> ❌ **错误示范**：`自动点击【取消】弹窗`、`活动弹窗-关闭`（未加分类前缀，会导致 GitHub CI 构建直接报错红叉）。  
>  **正确示范**：`全屏广告-自动点击【取消】广告倒计时弹窗`、`全屏广告-活动弹窗`。

---

## 4. 代码结构与单文件组织

每个 App 独立一个文件，存放于 `src/apps/<appId>.ts`。代码模板如下：

```typescript
import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: '<appId>', // 应用包名（必须真实准确）
  name: '<appName>', // 应用名称
  groups: [
    {
      key: 101, // 组内唯一正整数
      name: '<分类名>-<规则简述>', // 必须符合第 3 条规范
      desc: '<详细描述>',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/examples/<appId>/<key>.png',
      ],
      rules: [
        {
          activityIds: [
            '<activityId>',
          ],
          matches: [
            '<选择器表达式>',
          ],
          actionCd: 2000,
          snapshotUrls: [
            'https://i.gkd.li/i/<snapshotId>',
          ],
        },
      ],
    },
  ],
});
```

---

## 5. 构建与部署铁律（禁止触碰产物）

1. ❌ **严禁手动编辑 `dist/` 目录下的任何文件**（如 `dist/gkd.json5`、`dist/gkd.version.json5` 等）。
2. ❌ **严禁手动修改版本号**。
3.  **规则写在 `src/apps/`，截图放在 `assets/`**。
4.  完成后执行推送：
   ```bash
   git add .
   git commit -m "feat: add <appName> (<appId>) rule"
   git push origin main
   ```
5.  推送后调用命令监控 GitHub Actions 流水线，确保云端 `check` 和 `build` 顺利通过（打绿色对勾 `✓`）。云端会自动打包并递增发布版本。
