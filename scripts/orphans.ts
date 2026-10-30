import fs from 'node:fs';
import path from 'node:path';
import subscription from '../src/subscription';

export interface OrphanReport {
  orphanScreenshots: string[];
  orphanSnapshots: string[];
}

export function detectOrphans(): OrphanReport {
  // 1. 从当前订阅中提取所有有效 App、规则 Key 以及 快照 ID
  const activeKeysByApp = new Map<string, Set<number>>();
  const activeSnapshotsByApp = new Map<string, Set<string>>();

  for (const app of subscription.apps ?? []) {
    const keys = new Set<number>();
    const snaps = new Set<string>();

    for (const group of app.groups ?? []) {
      if (typeof group.key === 'number') {
        keys.add(group.key);
      }

      // 提取 group 级别的 snapshotUrls
      const groupSnapshots: (string | unknown)[] = [];
      if (group.snapshotUrls) {
        if (Array.isArray(group.snapshotUrls)) {
          groupSnapshots.push(...group.snapshotUrls);
        } else {
          groupSnapshots.push(group.snapshotUrls);
        }
      }

      // 提取 rule 级别的 snapshotUrls 与 excludeSnapshotUrls
      const rules = Array.isArray(group.rules) ? group.rules : [group.rules];
      for (const rule of rules) {
        if (rule && typeof rule === 'object') {
          if ('snapshotUrls' in rule && rule.snapshotUrls) {
            const ruleSnaps = Array.isArray(rule.snapshotUrls) ? rule.snapshotUrls : [rule.snapshotUrls];
            groupSnapshots.push(...ruleSnaps);
          }
          if ('excludeSnapshotUrls' in rule && rule.excludeSnapshotUrls) {
            const excludeSnaps = Array.isArray(rule.excludeSnapshotUrls) ? rule.excludeSnapshotUrls : [rule.excludeSnapshotUrls];
            groupSnapshots.push(...excludeSnaps);
          }
        }
      }

      for (const u of groupSnapshots) {
        if (typeof u === 'string') {
          // 匹配提取快照数字 ID，如 "https://i.gkd.li/i/1793332395963"
          const match = u.match(/(?:i\/|^)(\d+)(?:\.json)?$/);
          if (match) {
            snaps.add(match[1]);
          } else {
            snaps.add(path.basename(u, '.json'));
          }
        }
      }
    }

    activeKeysByApp.set(app.id, keys);
    activeSnapshotsByApp.set(app.id, snaps);
  }

  const orphanScreenshots: string[] = [];
  const orphanSnapshots: string[] = [];

  // 2. 扫描 assets/screenshots 目录
  // 注意：存量规则“只有截图而无本地快照”属于正常合法状态，只要其 key 存在于对应 app 中，就不算孤儿。
  const screenshotsDir = path.resolve('assets/screenshots');
  if (fs.existsSync(screenshotsDir)) {
    const appDirs = fs.readdirSync(screenshotsDir, { withFileTypes: true });
    for (const dirent of appDirs) {
      if (dirent.isDirectory()) {
        const appId = dirent.name;
        const appDir = path.join(screenshotsDir, appId);
        const files = fs.readdirSync(appDir, { withFileTypes: true });
        const validKeys = activeKeysByApp.get(appId);

        for (const f of files) {
          if (f.isFile() && f.name.endsWith('.png')) {
            const keyStr = path.basename(f.name, '.png');
            const keyNum = parseInt(keyStr, 10);
            if (!validKeys || !validKeys.has(keyNum)) {
              orphanScreenshots.push(path.join(appDir, f.name));
            }
          }
        }
      }
    }
  }

  // 3. 扫描 assets/snapshots 目录
  const snapshotsDir = path.resolve('assets/snapshots');
  if (fs.existsSync(snapshotsDir)) {
    const appDirs = fs.readdirSync(snapshotsDir, { withFileTypes: true });
    for (const dirent of appDirs) {
      if (dirent.isDirectory()) {
        const appId = dirent.name;
        const appDir = path.join(snapshotsDir, appId);
        const files = fs.readdirSync(appDir, { withFileTypes: true });
        const validSnaps = activeSnapshotsByApp.get(appId);

        for (const f of files) {
          if (f.isFile() && f.name.endsWith('.json')) {
            const snapId = path.basename(f.name, '.json');
            if (!validSnaps || !validSnaps.has(snapId)) {
              orphanSnapshots.push(path.join(appDir, f.name));
            }
          }
        }
      }
    }
  }

  return { orphanScreenshots, orphanSnapshots };
}

export function cleanOrphans(report: OrphanReport): number {
  let count = 0;
  for (const file of [...report.orphanScreenshots, ...report.orphanSnapshots]) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`🗑️  [已删除孤儿资产] ${path.relative(process.cwd(), file)}`);
      count++;
    }
  }

  function removeEmptyDirs(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const sub = path.join(dirPath, entry.name);
        removeEmptyDirs(sub);
        const remaining = fs.readdirSync(sub).filter((n) => !n.startsWith('.'));
        if (remaining.length === 0) {
          fs.rmdirSync(sub);
        }
      }
    }
  }

  removeEmptyDirs(path.resolve('assets/screenshots'));
  removeEmptyDirs(path.resolve('assets/snapshots'));
  return count;
}

// CLI 执行入口
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const isClean = process.argv.includes('--clean');
  const report = detectOrphans();

  const total = report.orphanScreenshots.length + report.orphanSnapshots.length;

  console.log('🔍 [孤儿资产检查报告]');
  console.log(`   - 孤儿截图: ${report.orphanScreenshots.length} 个`);
  for (const f of report.orphanScreenshots) {
    console.log(`     * ${path.relative(process.cwd(), f)}`);
  }
  console.log(`   - 孤儿快照: ${report.orphanSnapshots.length} 个`);
  for (const f of report.orphanSnapshots) {
    console.log(`     * ${path.relative(process.cwd(), f)}`);
  }

  if (total === 0) {
    console.log('✨ 仓库中没有发现任何孤儿资产，所有截图与快照均被活跃规则健康引用！');
  } else if (isClean) {
    console.log('\n🧹 正在执行自动清理...');
    const cleaned = cleanOrphans(report);
    console.log(`🎉 成功清理 ${cleaned} 个孤儿文件！`);
  } else {
    console.log('\n⚠️  检测到存在未被规则引用的孤儿资产！');
    console.log('💡 运行 `pnpm exec tsx scripts/orphans.ts --clean` 可一键清理这些废弃文件。');
  }
}
