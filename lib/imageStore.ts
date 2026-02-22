/**
 * 图片数据临时存储
 * 使用 IndexedDB 存储大图片数据，容量通常 50MB+
 * 避免 localStorage 5-10MB 的限制
 */

interface ImageData {
  model: string;
  outfits: string[];
  timestamp: number;
}

const DB_NAME = 'ImageAI_Store';
const DB_VERSION = 1;
const STORE_NAME = 'images';

let db: IDBDatabase | null = null;

/**
 * 初始化 IndexedDB
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
  });
}

/**
 * 存储图片数据到 IndexedDB
 */
export async function storeImageData(data: ImageData): Promise<string> {
  const key = `img_${data.timestamp}`;

  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // 存储数据，5分钟后自动过期
    const storeData = {
      key,
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000 // 5分钟后过期
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(storeData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log('[ImageStore] 数据已存储到 IndexedDB:', key);

    // 清理过期数据
    cleanupExpiredData();

    return key;
  } catch (e) {
    console.error('[ImageStore] IndexedDB 存储失败:', e);
    throw new Error('存储空间不足，请减少上传的图片数量');
  }
}

/**
 * 从 IndexedDB 获取图片数据
 */
export async function getImageData(key: string): Promise<ImageData | null> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const result = await new Promise<any>((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!result) {
      console.warn('[ImageStore] 未找到数据:', key);
      return null;
    }

    // 检查是否过期
    if (result.expiresAt && result.expiresAt < Date.now()) {
      console.warn('[ImageStore] 数据已过期:', key);
      // 删除过期数据
      removeImageData(key);
      return null;
    }

    console.log('[ImageStore] 从 IndexedDB 获取数据:', key);
    return result.data;
  } catch (e) {
    console.error('[ImageStore] 获取数据失败:', e);
    return null;
  }
}

/**
 * 删除图片数据
 */
export async function removeImageData(key: string): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log('[ImageStore] 数据已删除:', key);
  } catch (e) {
    console.error('[ImageStore] 删除数据失败:', e);
  }
}

/**
 * 清理过期数据
 */
async function cleanupExpiredData(): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const now = Date.now();
    let cleaned = 0;

    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        if (cursor.value.expiresAt && cursor.value.expiresAt < now) {
          store.delete(cursor.key);
          cleaned++;
        }
        cursor.continue();
      }
    };

    if (cleaned > 0) {
      console.log('[ImageStore] 清理过期数据:', cleaned, '条');
    }
  } catch (e) {
    console.error('[ImageStore] 清理过期数据失败:', e);
  }
}

/**
 * 清理所有数据
 */
export async function cleanupImageStore(): Promise<void> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log('[ImageStore] 已清理所有数据');
  } catch (e) {
    console.error('[ImageStore] 清理数据失败:', e);
  }
}

/**
 * 获取存储统计
 */
export async function getStoreStats(): Promise<{ size: number; keys: string[] }> {
  try {
    const database = await initDB();
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const keys = await new Promise<string[]>((resolve, reject) => {
      const request = store.getAllKeys();
      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });

    return {
      size: keys.length,
      keys
    };
  } catch (e) {
    return { size: 0, keys: [] };
  }
}
