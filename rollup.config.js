import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

const isTest = process.env.BUILD === 'test';

const config = {
  input: 'lib/index.ts',
  output: [{
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
  ],
};

export default commandLineArgs => {

  if (isTest) {
    config.input = './spec/index.ts';
    config.output = [{
        file: 'spec/dist/index.js',
        format: 'cjs',
      },
      {
        file: 'spec/dist/index.es.js',
        format: 'es',
      },
    ];
    config.plugins = [
      typescript({
        typescript: require('typescript'),
        tsconfig: 'spec/tsconfig.json',
      }),
    ];
    config.external.push(...Object.keys(pkg.devDependencies || {}));
  }

  return config;
}
