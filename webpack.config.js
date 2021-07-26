const path = require('path');

module.exports = {
  entry: {index: './mainapp/static/app1/index.js',
	  results: './mainapp/static/app1/results.js'
	},
  module: {
	rules: [
	    {
	      test: /\.m?js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
	        loader: 'babel-loader',
        	options: {
	          presets: ['@babel/preset-env', '@babel/preset-react'],
		  plugins: ['transform-class-properties']
        	}
	      }
	    }
	  ]
    },
  output: {
    path: path.resolve(__dirname, './mainapp/static/app1/dist'),
    filename: '[name].bundle.js'
  }
};