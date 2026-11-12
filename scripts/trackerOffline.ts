import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import type { Plugin } from 'vite';

export function trackerOffline(): Plugin {
  return {
    name: 'mit2fit-tracker-offline',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const worker = readFileSync(new URL('./tracker-service-worker.js', import.meta.url), 'utf8');
      const index = bundle['index.html'];
      if (index?.type !== 'asset') return;

      const assets = [
        '/tracker',
        '/tracker.webmanifest',
        '/tracker-icons/icon-180.png',
        '/tracker-icons/icon-192.png',
        '/tracker-icons/icon-512.png',
        '/favicon.svg',
        ...Object.keys(bundle).filter(file => file.startsWith('assets/')).sort().map(file => '/' + file),
      ];
      const version = createHash('sha256')
        .update(worker)
        .update(index.source)
        .update(JSON.stringify(assets))
        .digest('hex')
        .slice(0, 16);
      this.emitFile({
        type: 'asset',
        fileName: 'tracker-sw.js',
        source: [
          'const CACHE_NAME = ' + JSON.stringify('mit2fit-tracker-' + version) + ';',
          'const TRACKER_ASSETS = ' + JSON.stringify(assets) + ';',
          worker,
        ].join('\n'),
      });
    },
  };
}
