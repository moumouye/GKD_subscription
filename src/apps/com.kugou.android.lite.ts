import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.kugou.android.lite',
  name: '酷狗概念版',
  groups: [
    {
      key: 101,
      name: '全屏广告-活动弹窗',
      desc: '自动点击福利活动弹窗底部的关闭按钮',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/examples/com.kugou.android.lite/101.png',
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
