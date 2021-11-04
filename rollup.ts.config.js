// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'test/index.ts',
    output: {
        dir: 'output',
        format: 'cjs',
    },
    plugins: [typescript()],
};
