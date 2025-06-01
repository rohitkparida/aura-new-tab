const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      background: './src/background.ts',
      newtab: './src/newtab.ts',
      content: './src/content.ts',
      popup: './src/popup.ts',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: !isProduction,
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|woff2?|ttf|eot)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext][query]',
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
        cleanOnceBeforeBuildPatterns: ['**/*', '!assets/**/*'],
      }),
      new CopyPlugin({
        patterns: [
          // Required files
          { from: 'newtab.html', to: '.' },
          { from: 'manifest.json', to: '.' },
          { from: 'newtab.css', to: '.', noErrorOnMissing: true },
          
          // Directories
          { from: 'icons', to: 'icons', noErrorOnMissing: true },
          { from: 'assets', to: 'assets', noErrorOnMissing: true },
          { from: '_locales', to: '_locales', noErrorOnMissing: true },
          
          // Static files (consolidated pattern)
          { 
            from: '*.{html,css,png,svg}', 
            to: '.', 
            noErrorOnMissing: true,
            globOptions: { 
              ignore: ['**/node_modules/**', 'newtab.html', 'newtab.css'] 
            } 
          },
        ],
      }),
    ],
    optimization: {
      minimize: isProduction,
    },
  };
};
