import beaconEslintConfig from '@beacon/eslint-config-node';

export default [
  ...beaconEslintConfig,
  {
    ignores: ['dist'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
