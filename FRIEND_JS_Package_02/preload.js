export class AssetPreloader {
  constructor(base) {
    this.base = base;
    this.cache = new Map();
  }

  preload(files) {
    const unique = [...new Set(files)];
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const slow = connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ''));
    const queue = slow ? unique.slice(0, 12) : unique;

    queue.forEach(file => {
      if (this.cache.has(file)) return;
      const img = new Image();
      img.decoding = 'async';
      img.src = this.base + encodeURIComponent(file).replaceAll('%2F','/');
      this.cache.set(file, img);
    });
  }
}
