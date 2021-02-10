const path = require('path');
module.exports = {
  entry: './app/main.js', // assumes your entry point is the index.js in the root of your project folder
  mode: 'development',
  output: {
    path: __dirname, // assumes your bundle.js will also be in the root of your project folder
    filename: 'public/bundle.js'
  },
  devtool: 'source-map', // make debugging easier and tells us where the error originated, rather than where in the bundle.js
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  watchOptions: {
    ignored: [path.resolve(__dirname, 'server', 'docker', 'tmp')]
  }
};
