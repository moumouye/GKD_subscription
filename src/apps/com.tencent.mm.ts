import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.tencent.mm',
  name: '微信',
  groups: [
    {
      key: 35,
      name: '局部广告-公众号文章内广告',
      desc: '在微信公众号文章中，当广告滑入视野时，自动点击【广告】及【关闭此广告】',
      activityIds: [
        '.plugin.brandservice.ui.timeline.preload.ui.TmplWebView',
        '.plugin.webview.ui.tools.fts.MMSosWebViewUI',
        '.plugin.webview.ui.tools.MMWebViewUI',
      ],
      rules: [
        {
          key: 0,
          actionDelay: 300,
          matches: [
            '@View[childCount<5][top>200 && bottom<1600] > [text^="广告"][text.length<4][visibleToUser=true][width>0 && height>0]',
          ],
          excludeMatches: [
            '[text="不感兴趣" || text="与我无关" || text="感谢你的反馈"][visibleToUser=true]',
          ],
          snapshotUrls: [
            'https://i.gkd.li/i/12642232',
            'https://i.gkd.li/i/13199281',
            'https://i.gkd.li/i/14006180',
            'https://i.gkd.li/i/17093010',
            'https://i.gkd.li/i/16796663',
            'https://i.gkd.li/i/16796725',
            'https://i.gkd.li/i/16798663',
            'https://i.gkd.li/i/15198455',
            'https://i.gkd.li/i/17276697',
          ],
          excludeSnapshotUrls: [
            'https://i.gkd.li/i/15198464',
          ],
          exampleUrls: [
            'https://e.gkd.li/e73bb653-cc79-455c-958b-38aff6687c37',
            'https://e.gkd.li/5915f80b-66b9-4441-9d36-3caa3fe1be58',
          ],
        },
        {
          key: 20,
          preKeys: [0],
          actionDelay: 200,
          matches: [
            '[text="关闭此广告"][visibleToUser=true]',
          ],
          snapshotUrls: [
            'https://i.gkd.li/i/16796729',
            'https://i.gkd.li/i/17113565',
          ],
        },
        {
          key: 25,
          preKeys: [0],
          actionDelay: 200,
          matches: [
            '[text="不感兴趣"][visibleToUser=true]',
          ],
          excludeMatches: [
            '[text="感谢你的反馈"][visibleToUser=true]',
            '[text="关闭此广告"][visibleToUser=true]',
          ],
          snapshotUrls: [
            'https://i.gkd.li/i/16796666',
            'https://i.gkd.li/i/16798661',
            'https://i.gkd.li/i/15198459',
          ],
          excludeSnapshotUrls: [
            'https://i.gkd.li/i/15061424',
            'https://i.gkd.li/i/16796729',
          ],
        },
        {
          key: 50,
          preKeys: [25],
          actionDelay: 200,
          matches: [
            '[text="与我无关"][visibleToUser=true]',
          ],
          snapshotUrls: [
            'https://i.gkd.li/i/16796674',
            'https://i.gkd.li/i/16796732',
            'https://i.gkd.li/i/16798658',
            'https://i.gkd.li/i/15198461',
          ],
        },
      ],
    },
  ],
});
