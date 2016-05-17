// https://www.paypal-engineering.com/2015/08/07/1450/
var path = require('path');
var WebpackNotifierPlugin = require('webpack-notifier');
var Webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

module.exports = {
	context: path.join( __dirname + '/public/assets/js'),
	entry: './main.js',
	devtool: 'source-map',
	output: {
		path: __dirname + '/public/assets/build/js',
		publicPath: '/assets/build/js/',
		filename: '[name].js',
		chunkFilename: 'partial.[name].js'
	},
	resolve: {
		modulesDirectories: ['public/assets/js', 'node_modules']
	},
	plugins: [
		new Clean([__dirname + '/public/assets/build']),
		new WebpackNotifierPlugin(),
		new Webpack.optimize.DedupePlugin(),
		new Webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};