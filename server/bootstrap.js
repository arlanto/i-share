const path = require('path')
const tsConfigPaths = require('tsconfig-paths')
const tsconfig = require('./tsconfig.json')

const baseUrl = path.join(__dirname, 'dist')

tsConfigPaths.register({
  baseUrl,
  paths: tsconfig.compilerOptions.paths,
})
