import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'tv.danmaku.bili',
  name: '哔哩哔哩',
  groups: [
    {
      key: 103,
      name: '局部广告-播放器广告倒计时',
      desc: '播放视频时，自动点击播放器左下角“几秒后将展示广告”浮层中的【取消】按钮',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/screenshots/tv.danmaku.bili/103.png',
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
    {
      key: 104,
      name: '功能类-负反馈减少直播推荐-平板',
      desc: '在推荐视频长按反馈弹窗中，自动点击【减少直播推荐】',
      exampleUrls: [
        'https://raw.githubusercontent.com/moumouye/GKD_subscription/main/assets/screenshots/tv.danmaku.bili/104.png',
      ],
      rules: [
        {
          matches: [
            '[text="减少直播推荐"]',
          ],
          action: 'clickCenter',
          snapshotUrls: [
            'https://i.gkd.li/i/1790238525243',
          ],
        },
      ],
    },
  ],
});
