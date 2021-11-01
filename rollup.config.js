export default [{
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'ceddl'
  }
},{
  input: 'src/index.js',
  output: {
    file: 'dist/index.esm.js',
    format: 'esm',
    name: 'ceddl'
  }
}];
