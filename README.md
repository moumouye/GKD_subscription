# Personal GKD Subscription (个人 GKD 自定义规则订阅)

本项目基于官方规范与 [AIsouler/GKD_subscription](https://github.com/AIsouler/GKD_subscription) 的工程化结构设计，用于将手机本地自定义规则转化为标准化的在线订阅，支持按应用分文件管理、GitHub Actions 自动构建与发布，并提供免翻墙国内 CDN 加速节点。

---

## 📱 在线订阅地址

当您将本项目推送到您的 GitHub 仓库后，将 `<你的用户名>/<你的仓库名>` 替换为您真实的 GitHub 路径，即可在 GKD 中添加以下任意一个订阅链接：

### 1. jsDelivr CDN 加速源（推荐，国内访问极速且无需代理）
```txt
https://cdn.jsdelivr.net/gh/<你的用户名>/<你的仓库名>@main/dist/gkd.json5
```

### 2. GitHub Raw 直链
```txt
https://raw.githubusercontent.com/<你的用户名>/<你的仓库名>/main/dist/gkd.json5
```

### 3. GitMirror 国内镜像源
```txt
https://raw.gitmirror.com/<你的用户名>/<你的仓库名>/main/dist/gkd.json5
```

---

## 🚀 如何在 GKD 中添加订阅

1. 打开手机上的 **GKD** 应用；
2. 点击底部导航栏的 **【订阅】** 标签页；
3. 点击右下角（或右上角）的 **【+】** 按钮；
4. 粘贴上方获取到的订阅链接（推荐 jsDelivr CDN 链接），点击确认添加；
5. 在订阅列表中点击进入本订阅，即可查看并开启已适配的应用规则（如酷狗音乐活动弹窗自动关闭）。

---

## 📁 项目目录结构

```
wise-curie/
├── .github/
│   └── workflows/
│       └── build.yml             # GitHub Actions 自动化构建与自动更新 dist 脚本
├── .gitignore                    # Git 忽略配置
├── package.json                  # 项目依赖与 GKD 规范元数据
├── tsconfig.json                 # TypeScript 编译配置
├── README.md                     # 项目使用与订阅指南
├── dist/                         # 编译产物目录（在线订阅核心文件）
│   ├── gkd.json5                 # 完整订阅规则文件
│   └── gkd.version.json5         # 订阅版本检测文件（GKD 客户端据此检查更新）
├── scripts/
│   ├── build.ts                  # 构建并输出 dist/ 的入口脚本
│   └── check.ts                  # 订阅格式与选择器语法校验脚本
└── src/
    ├── subscription.ts           # 订阅元信息（名称、作者、ID等）
    ├── categories.ts             # 规则分类精简定义
    └── apps/                     # 按应用包名拆分的规则目录
        └── com.kugou.android.ts  # 酷狗音乐规则（示例：活动弹窗自动关闭）
```

---

## 🛠️ 如何添加与维护新规则

### 1. 新增一个应用的规则
在 `src/apps/` 目录下创建一个以该应用的 **Package Name（包名）** 命名的 `.ts` 文件，例如 `com.tencent.mm.ts`：

```typescript
import { defineAppConfig } from '@gkd-kit/define';

export default defineAppConfig({
  id: 'com.example.app', // 目标应用包名
  name: '应用显示名称',
  groups: [
    {
      key: 101, // 组内唯一数值 key
      name: '弹窗广告-自动点击关闭',
      desc: '自动点击关闭按钮',
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

### 2. 字段规范说明
- `key`：每个规则组内的唯一整数 ID。
- `name`：规则简述（推荐遵循 `分类名-具体动作` 格式，如 `活动弹窗-自动点击关闭`）。
- `desc`：规则详细描述。
- `fastQuery`：启用快速无障碍查询（推荐设置为 `true` 以提升匹配速度并降低耗电）。
- `activityIds`：指定该规则生效的界面 Activity 名称，缩减匹配范围，避免在非目标页面误触。
- `matches`：选择器字符串或选择器数组。可参考 [GKD 选择器语法规范](https://gkd.li/selector/)。

---

## 🔄 自动化在线发布流程

1. 当您在本地或 GitHub 网页端修改了 `src/` 中的规则后：
   ```bash
   git add .
   git commit -m "feat: 新增/更新某应用规则"
   git push origin main
   ```
2. GitHub Actions 会自动触发 `.github/workflows/build.yml` 工作流；
3. Action 会自动完成依赖安装、规则校验、编译打包，并把更新后的 `dist/gkd.json5` 与 `dist/gkd.version.json5` 提交并推回仓库；
4. 手机端打开 GKD，在 **【订阅】** 页面下拉刷新，GKD 就会探测到最新版本并自动拉取更新！
