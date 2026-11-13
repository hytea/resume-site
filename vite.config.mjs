import { fileURLToPath } from 'node:url';
import { applicationPages } from './scripts/application-pages.mjs';

const entry = file => fileURLToPath(new URL(file, import.meta.url));

export default {
  root: '.',
  base: '/', // Root path for custom domain
  plugins: [applicationPages()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: entry('./index.html'),
        maker: entry('./maker.html'),
        resume: entry('./resume/index.html'),
        applicationTemplate: entry('./application-template.html'),
      },
    },
  },
};
