const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    historyApiFallback: true,
    stats: 'errors-only',
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    overlay: {
      errors: true,
      warnings: true
    }
  }
})

exports.lintJavaScript = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'eslint-loader',
        options
      }
    ]
  }
})

exports.loadCSS = ({ include, exclude } = {}) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,

        use: [
          'style-loader',
          {
            loader: 'css-loader'
            // options: {modules: true}
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => ([
                require('postcss-cssnext')(),
                // cssnext includes autoprefixer!
                // require('autoprefixer'),
                require('precss')
              ])
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        // yeticss
        stylus: {
          use: [require('yeticss')]
        }
      }
    })
  ]
})

exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: '[name].css'
  })

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: plugin.extract({
            use,
            fallback: 'style-loader'
          })
        }
      ]
    },
    plugins: [ plugin ]
  }
}
