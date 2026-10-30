import fs from 'node:fs';
import path from 'node:path';

interface SnapshotNode {
  id?: number;
  pid?: number;
  idQf?: boolean | null;
  textQf?: boolean | null;
  attr?: {
    id?: string | null;
    vid?: string | null;
    name?: string | null;
    text?: string | null;
    desc?: string | null;
    clickable?: boolean;
    focusable?: boolean;
    checkable?: boolean;
    checked?: boolean;
    editable?: boolean;
    longClickable?: boolean;
    visibleToUser?: boolean;
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
    width?: number;
    height?: number;
    childCount?: number;
    index?: number;
    depth?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface SnapshotData {
  id?: number | string;
  appId?: string;
  activityId?: string;
  screenHeight?: number;
  screenWidth?: number;
  isLandscape?: boolean;
  appInfo?: {
    id?: string;
    name?: string;
    versionCode?: number;
    versionName?: string;
    isSystem?: boolean;
    mtime?: number;
    hidden?: boolean;
    enabled?: boolean;
    userId?: number;
    [key: string]: unknown;
  };
  gkdAppInfo?: {
    id?: string;
    name?: string;
    versionCode?: number;
    versionName?: string;
    isSystem?: boolean;
    mtime?: number;
    hidden?: boolean;
    enabled?: boolean;
    userId?: number;
    [key: string]: unknown;
  };
  device?: {
    device?: string;
    model?: string;
    manufacturer?: string;
    brand?: string;
    sdkInt?: number;
    release?: string;
    [key: string]: unknown;
  };
  nodes?: SnapshotNode[];
  [key: string]: unknown;
}

export function sanitizeSnapshot(data: SnapshotData): {
  ghostCleared: number;
  maskedCount: number;
  originalDevice: string;
} {
  const originalDevice = `${data.device?.brand || ''} ${data.device?.model || ''}`.trim() || 'Unknown';

  // 1. 硬件指纹匿名化（保留底层 SDK 版本以便必要时进行版本条件适配）
  data.device = {
    device: 'generic',
    model: 'Generic Device',
    manufacturer: 'Android',
    brand: 'generic',
    sdkInt: data.device?.sdkInt ?? 34,
    release: data.device?.release ?? '14',
  };

  // 2. 清除应用安装与更新时间戳及内部用户 ID
  if (data.appInfo) {
    data.appInfo.mtime = 0;
    data.appInfo.userId = 0;
  }
  if (data.gkdAppInfo) {
    data.gkdAppInfo.mtime = 0;
    data.gkdAppInfo.userId = 0;
  }

  // 3. 扫描节点：剔除幽灵暗藏文本与执行敏感正则打码
  const sw = data.screenWidth ?? 1080;
  const sh = data.screenHeight ?? 2400;
  let ghostCleared = 0;
  let maskedCount = 0;

  function maskSensitive(text: string): string {
    // 手机号脱敏
    let res = text.replace(/(?:\+?86)?(1[3-9]\d)\d{4}(\d{4})/g, '$1****$2');
    // 身份证号脱敏
    res = res.replace(/\b([1-9]\d{5})(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}([\dXx])\b/g, '$1********$2');
    // 邮箱脱敏
    res = res.replace(/([a-zA-Z0-9_.+-])[a-zA-Z0-9_.+-]*@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g, '$1***@$2');
    if (res !== text) maskedCount++;
    return res;
  }

  for (const node of data.nodes ?? []) {
    const attr = node.attr;
    if (!attr) continue;

    const vis = attr.visibleToUser;
    const w = attr.width ?? 0;
    const h = attr.height ?? 0;
    const l = attr.left ?? 0;
    const t = attr.top ?? 0;
    const r = attr.right ?? 0;
    const b = attr.bottom ?? 0;

    // 幽灵节点判断：不可见、无面积或超出屏幕可视坐标
    const isGhost = vis === false || (w <= 0 && h <= 0) || r <= 0 || l >= sw || b <= 0 || t >= sh;
    if (isGhost) {
      if (attr.text != null || attr.desc != null) {
        ghostCleared++;
        attr.text = null;
        attr.desc = null;
      }
    } else {
      if (typeof attr.text === 'string') {
        attr.text = maskSensitive(attr.text);
      }
      if (typeof attr.desc === 'string') {
        attr.desc = maskSensitive(attr.desc);
      }
    }
  }

  return { ghostCleared, maskedCount, originalDevice };
}

export function importSnapshotFile(filePath: string): string {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`快照文件不存在: ${fullPath}`);
  }

  const raw = fs.readFileSync(fullPath, 'utf-8');
  const data = JSON.parse(raw) as SnapshotData;

  if (!data.appId) {
    throw new Error(`快照缺失 appId: ${fullPath}`);
  }
  if (!data.id) {
    throw new Error(`快照缺失 id: ${fullPath}`);
  }

  const stats = sanitizeSnapshot(data);

  const outDir = path.resolve('assets/snapshots', data.appId);
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${data.id}.json`);

  fs.writeFileSync(outFile, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✅ [已脱敏并归档] Snapshot: ${data.id}`);
  console.log(`   - 目标应用: ${data.appId}`);
  console.log(`   - 原始设备: ${stats.originalDevice} -> Generic Device`);
  console.log(`   - 幽灵文本清理: ${stats.ghostCleared} 处`);
  console.log(`   - 敏感信息打码: ${stats.maskedCount} 处`);
  console.log(`   - 存储路径: ${path.relative(process.cwd(), outFile)}`);

  return outFile;
}

// CLI 执行入口
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.log('使用方式: pnpm exec tsx scripts/snapshot.ts <快照JSON文件路径...>');
    process.exit(1);
  }

  for (const file of files) {
    try {
      importSnapshotFile(file);
    } catch (err) {
      console.error(`❌ 处理快照失败 [${file}]:`, err instanceof Error ? err.message : err);
      process.exitCode = 1;
    }
  }
}
