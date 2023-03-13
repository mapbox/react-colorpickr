/* global module */
module.exports = ({ env }) => ({
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  ignore: env('test')
    ? ['src/types']
    : ['src/types', '**/*.test.tsx', '**/*.test.ts']
});
