# YM 的 GKD 订阅

个人 GKD 自定义规则订阅。

---

## 订阅地址

- **GitHub Raw**
  ```txt
  https://raw.githubusercontent.com/moumouye/GKD_subscription/main/dist/gkd.json5
  ```
- **jsDelivr CDN**
  ```txt
  https://cdn.jsdelivr.net/gh/moumouye/GKD_subscription@main/dist/gkd.json5
  ```
- **GitMirror**
  ```txt
  https://raw.gitmirror.com/moumouye/GKD_subscription/main/dist/gkd.json5
  ```

---

## 使用方法

1. 打开 **GKD** 应用；
2. 进入底部 **【订阅】** 页面；
3. 点击 **【+】** 按钮添加订阅链接；
4. 添加完成后，在订阅列表中查看并管理应用规则。

---

## 目录结构

```
├── .github/workflows/    # 自动化构建与发布工作流
├── dist/                 # 订阅产物目录
│   ├── gkd.json5         # 订阅规则文件
│   └── gkd.version.json5 # 订阅版本文件
├── scripts/              # 校验与构建脚本
└── src/
    ├── subscription.ts   # 订阅元信息
    ├── categories.ts     # 规则分类
    └── apps/             # 各应用规则文件（以应用包名命名）
```

---

## 规则编写说明

在 `src/apps/` 目录下创建以目标应用包名命名的 `.ts` 文件（如 `com.example.app.ts`）：

```typescript
import { defineAppConfig } from '@gkd-kit/define';

export default defineAppConfig({
  id: 'com.example.app',
  name: '应用名称',
  groups: [
    {
      key: 101,
      name: '规则名称',
      desc: '规则描述',
      rules: [
        {
          fastQuery: true,
          activityIds: [
            'com.example.app.MainActivity',
          ],
          matches: [
            '[vid="close_btn"][clickable=true]',
          ],
        },
      ],
    },
  ],
});
```

### 字段说明
- `id`：目标应用包名（Package Name）。
- `name`：应用显示名称。
- `key`：组内唯一数值标识。
- `fastQuery`：是否启用快速无障碍查询。
- `activityIds`：规则生效的 Activity 列表。
- `matches`：选择器表达式。

---

## 更新与构建

修改 `src/` 下的代码后推送到 `main` 分支，GitHub Actions 会自动触发校验与构建，并更新 `dist/` 中的订阅文件：

```bash
git add .
git commit -m "feat: 更新规则"
git push origin main
```
