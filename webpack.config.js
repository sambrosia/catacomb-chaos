const path = require("path");

module.exports = {
    devtool: "source-map",
    entry: "./src/boot.js",
    output: {
        filename: "catacomb-chaos.js"
    },
    resolve: {
        alias: {
            fae: "fae/src/index.js"
        }
    },
    node: {
        fs: "empty"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "node_modules/fae")
                ],
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env"]
                    }
                }
            }
        ]
    }
};
