var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var config;

if (process.env.npm_lifecycle_event === 'deploy') {
	config = {
		entry: "./app/nexientAnimation/app/app",
		resolve: {
			extensions: ['', '.js', '.jsx']
		},
		output: {
			path: './dist/',
			filename: "bundle.js",
			libraryTarget: 'amd'
		},
		module: {
			loaders: [{
				test: /\.css$/,
				loader: 'style!css'
			}, {
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			}]
		}
	};
} else {
	config = {
		entry: "./app/entry.js",
		resolve: {
			extensions: ['', '.js', '.jsx']
		},
		output: {
			path: './dist/',
			filename: "bundle.js"
		},
		module: {
			loaders: [{
				test: /\.css$/,
				loader: 'style!css'
			}, {
				test: /\.jsx?$/,
				loader: 'monkey-hot!babel-loader',
				exclude: /node_modules/
			}]
		},
		devtool: 'eval-source-map',
		devServer: {
			historyApiFallback: true,
			hot: true,
			inline: true,
			progress: true
		},
		plugins: [
			new HtmlwebpackPlugin({
				title: 'Nexient Animation'
			}),
			new webpack.HotModuleReplacementPlugin()
		]
	};
}

module.exports = config;
