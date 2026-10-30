import subscription from '../src/subscription';
import { checkSubscription, checkApiVersion } from '@gkd-kit/tools';
import { detectOrphans } from './orphans';

await checkApiVersion();

checkSubscription(subscription);

const orphans = detectOrphans();
const orphanTotal = orphans.orphanScreenshots.length + orphans.orphanSnapshots.length;
if (orphanTotal > 0) {
  console.warn(
    `\n[Warning] 检测到 ${orphanTotal} 个孤儿资产（未被任何规则引用的截图/快照），可运行 \`pnpm orphans --clean\` 自动清理。`,
  );
}

export default subscription;
