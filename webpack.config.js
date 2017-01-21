module.exports = {
  entry: './app.js',
  output: {
    filename: './bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader?presets[]=es2015'
      }
    ]
  }
}
