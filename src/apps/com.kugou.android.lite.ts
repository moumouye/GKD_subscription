import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.kugou.android.lite',
  name: '酷狗概念版',
  groups: [
    {
      key: 101,
      name: '全屏广告-活动弹窗',
      desc: '在福利活动弹窗中，自动点击底部的【关闭】按钮',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/screenshots/com.kugou.android.lite/101.png',
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
          snapshotUrls: [
            'https://i.gkd.li/i/1790227505803',
          ],
        },
      ],
    },
    {
      key: 102,
      name: '全屏广告-领取明日畅听弹窗关闭',
      desc: '在领取明日畅听弹窗中，自动点击右上角的【关闭】按钮',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/screenshots/com.kugou.android.lite/102.png',
      ],
      rules: [
        {
          activityIds: [
            'com.kugou.framework.musicfees.ui.feeintercept.FeeInterceptWebActivity',
          ],
          matches: [
            '@TextView[visibleToUser=true] + View > [text*="明日畅听"]',
          ],
          action: 'clickCenter',
          snapshotUrls: [
            'https://i.gkd.li/i/1792406931744',
          ],
        },
      ],
    },
    {
      key: 103,
      name: '局部广告-发现页卡片广告关闭',
      desc: '在发现页信息流中，自动点击卡片广告右上角的【关闭】按钮',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/screenshots/com.kugou.android.lite/103.png',
      ],
      rules: [
        {
          fastQuery: true,
          activityIds: [
            'com.qq.e.tg.ADActivity',
          ],
          matches: [
            '[vid="bnt"] + [vid="cdf"][clickable=true]',
          ],
          snapshotUrls: [
            'https://i.gkd.li/i/1792576975836',
          ],
        },
      ],
    },
  ],
});
