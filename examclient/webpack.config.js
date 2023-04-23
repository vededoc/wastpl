const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require('fs')

module.exports = {
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	devtool: 'inline-source-map',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		// clean: true, // true 일 경우 빌드할때 마다 output folder 삭제.
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html", // 템플릿 위치
		}),
	],
	devServer: {
		host: 'localhost',
		// https 설정
		// https: {
		// 	key: fs.readFileSync('/data/cert/privkey.pem'),
		// 	cert: fs.readFileSync('/data/cert/fullchain.pem'),
		// 	requestCert: true,
		// },

		// hot: false,
		// proxy: {
		// 	'/api': 'http://localhost:11000'
		// },
		
		// 외부 시스템에서 devServer 로 접근할 때 필요하다 (invalid host header 응답 방지)
		// allowedHosts: 'all',

		// port: 8000,

		// static: {
		// 	directory: path.join(__dirname, 'public'),
		// },
	},
};