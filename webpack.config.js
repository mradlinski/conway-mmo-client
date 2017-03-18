var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var plugins = [
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	}),
	new webpack.ProvidePlugin({
		'Promise': 'bluebird'
	}),
	new HtmlWebpackPlugin({
		template: 'src/index.html',
		hash: false,
		favicon: 'static/favicon.ico',
		filename: 'index.html',
		inject: 'body',
		minify: {
			collapseWhitespace: true
		}
	})
];

if (process.env.NODE_ENV === 'production') {
	plugins = plugins.concat([
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false,
				unused: true,
				dead_code: true,
				warnings: false
			}
		}),
		new webpack.optimize.AggressiveMergingPlugin()
	]);
}

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	devtool: process.env.NODE_ENV === 'production' ? undefined : 'source-map',
	plugins: plugins,
	module: {
		loaders: [{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		}]
	}
};
