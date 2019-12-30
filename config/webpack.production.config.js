const {
  join
} = require('path')
module.exports = {
  output: {
    path: join(__dirname, '../dist'),
    filename: 'script/[name].[hash:5].bundles.js',
    publicPath: ""
  }
}