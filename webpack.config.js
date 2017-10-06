const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const pkg = require("./package");
const widgetName = pkg.widgetName;
const name = pkg.widgetName.toLowerCase();

const widgetConfig = {
    entry: `./src/components/${widgetName}Container.ts`,
    output: {
        path: path.resolve(__dirname, "dist/tmp"),
        filename: `src/com/mendix/widget/custom/${name}/${widgetName}.js`,
        libraryTarget: "umd"
    },
    resolve: {
        extensions: [ ".ts", ".js", ".json", ".png" ],
        alias: {
            "tests": path.resolve(__dirname, "./tests")
        }
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            }) },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader!sass-loader"
            }) },
            { test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    devtool: "source-map",
    externals: [ "react", "react-dom" ],
    plugins: [
        new CopyWebpackPlugin([
            { from: "src/**/*.js" },
            { from: "src/**/*.xml" },
            { from: "src/**/*.png", to: `src/com/mendix/widget/custom/${name}/` }
        ], {
            copyUnmodified: true
        }),
        new ExtractTextPlugin({ filename: `./src/com/mendix/widget/custom/${name}/ui/${widgetName}.css` }),
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ]
};

module.exports = [ widgetConfig ];