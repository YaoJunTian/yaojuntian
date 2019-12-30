const {
  join
} = require('path')
module.exports = {
  output: {
    path: join(__dirname, '../dist'),
    filename: 'script/[name].bundles.js',
    publicPath: '/'
  }
}