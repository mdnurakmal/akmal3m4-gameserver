const merge = require("webpack-merge");
const path = require("path");
const base = require("./base");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin'); // To copy your //
module.exports = merge(base, {
  mode: "production",
  output: {
    publicPath: '../client',
    filename: "bundle.min.js"
  },
  devServer: {
    writeToDisk: true,
    inline: true,
    hot:true,
    historyApiFallback: true,
    publicPath: 'http://localhost:8080/client',
    compress: true,
    disableHostCheck: true,   // That solved it
 

 },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  plugins: [
    new CopyPlugin({ 
       patterns: [
          { from: './client/', to: 'client/' }, // Configure // the path from where webpack will copy your assets from and the  // path where it will put it when the build is done, change it     // according to your app organization   
       ],
    }),
 ]
});
