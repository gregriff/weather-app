/// <reference types="vite/client" />
import { URL, fileURLToPath } from 'node:url';
import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [Vue()],
    build: {},
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern',
                silenceDeprecations: ['mixed-decls', 'color-functions', 'global-builtin', 'import'], // ridiculous number of warnings with newest sass. Bootstrap 6 when??
            },
        },
    },
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.json', '.vue'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
