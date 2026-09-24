import { defineAppConfig } from '@gkd-kit/define';

export default defineAppConfig({
  id: 'com.kugou.android',
  name: '酷狗音乐',
  groups: [
    {
      key: 101,
      name: '活动弹窗-自动点击关闭',
      desc: '自动点击福利活动弹窗底部的关闭按钮',
      exampleUrls: [
        'https://cdn.jsdelivr.net/gh/<你的用户名>/<你的仓库名>@main/assets/examples/com.kugou.android/101.png',
      ],
      rules: [
        {
          fastQuery: true,
          activityIds: [
            'com.kugou.android.app.splash.foresplash.ForeSplashActivity',
          ],
          matches: [
            '[vid="ahe"][clickable=true]',
          ],
        },
      ],
    },
  ],
});
