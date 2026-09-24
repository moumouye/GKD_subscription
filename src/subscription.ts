import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import { fileURLToPath } from 'node:url';
import categories from './categories';

const apps = await batchImportApps(fileURLToPath(new URL('./apps', import.meta.url)));

export default defineGkdSubscription({
  id: 1001,
  name: 'YM 的 GKD 订阅',
  version: 2,
  author: 'moumouye',
  checkUpdateUrl: './gkd.version.json5',
  supportUri: 'https://github.com/moumouye/GKD_subscription',
  categories,
  apps,
});
