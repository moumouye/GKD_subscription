import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import categories from './categories';

const apps = await batchImportApps(`${import.meta.dirname}/apps`);

export default defineGkdSubscription({
  id: 1001,
  name: 'Personal GKD Subscription',
  version: 1,
  author: 'moumouye',
  checkUpdateUrl: './gkd.version.json5',
  supportUri: 'https://github.com/moumouye/GKD_subscription',
  categories,
  apps,
});
