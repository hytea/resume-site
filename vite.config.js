import { resolve } from 'path';

export default {
  root: '.',
  base: '/', // Root path for custom domain
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        resume: resolve(__dirname, 'resume/index.html'),
      },
    },
  },
};
