import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'tv.danmaku.bili',
  name: '哔哩哔哩',
  groups: [
    {
      key: 103,
      name: '全屏广告-自动点击【取消】广告倒计时弹窗',
      desc: '自动点击视频播放过程中“几秒后将展示广告”浮层中的“取消”按钮',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/examples/tv.danmaku.bili/103.png',
      ],
      rules: [
        {
          activityIds: [
            'com.bilibili.ship.theseus.detail.UnitedBizDetailsActivity',
          ],
          matches: [
            '[text*="后将展示广告" || text*="后将播放广告"] + [text="取消"][clickable=true]',
          ],
          actionCd: 2000,
          snapshotUrls: [
            'https://i.gkd.li/i/1789954995487',
          ],
        },
      ],
    },
  ],
});
