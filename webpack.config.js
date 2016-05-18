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
	module: {
	        preLoaders: [
				{
					test: /\.js$/,
					loader: 'eslint-loader',
					exclude: [/node_modules/, 'public/assets/js/libs'],
				}
				/*{
	                test: /\.js$/, // include .js files
	                exclude: [/node_modules/, 'public/assets/js/libs'], // exclude any and all files in the node_modules folder
	                loader: 'jshint-loader'
	            }*/
	        ]
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