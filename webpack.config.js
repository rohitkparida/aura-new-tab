const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Environment
const isProduction = process.env.NODE_ENV === 'production';

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
          { from: 'newtab.html', to: '.' },
          { from: 'manifest.json', to: '.' },
          // Only copy these directories if they exist
          { from: 'assets', to: 'assets', noErrorOnMissing: true },
          { from: 'styles', to: 'styles', noErrorOnMissing: true },
          { from: 'fonts', to: 'fonts', noErrorOnMissing: true },
          { from: '_locales', to: '_locales', noErrorOnMissing: true },
          // Copy legacy files if they exist
          { from: 'newtab.css', to: 'legacy.css', noErrorOnMissing: true },
          { from: 'grain-effect.js', to: '.', noErrorOnMissing: true },
          // Copy other assets
          { from: '*.css', to: '.', globOptions: { ignore: ['**/node_modules/**'] } },
          { from: '*.html', to: '.', globOptions: { ignore: ['**/node_modules/**', 'newtab.html'] } },
          { from: '*.png', to: '.', globOptions: { ignore: ['**/node_modules/**'] } },
          { from: '*.svg', to: '.', globOptions: { ignore: ['**/node_modules/**'] } },
          { from: '*.json', to: '.', globOptions: { ignore: ['**/node_modules/**', 'package.json', 'package-lock.json', 'tsconfig.json'] } },
        ],
      }),
    ],
    optimization: {
      minimize: isProduction,
    },
  };
};
