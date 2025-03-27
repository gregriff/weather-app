import eslint from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
    {
        ignores: ['**/node_modules/**'],
    },
    ...pluginVue.configs['flat/strongly-recommended'],
    eslint.configs.recommended,
    {
        rules: {
            'no-unused-vars': 'warn',
        },
    },
    ...vueTsEslintConfig(),
    {
        rules: {
            'vue/return-in-computed-property': 'off',
            'vue/multi-word-component-names': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
        },
    },
    eslintConfigPrettier,
];
