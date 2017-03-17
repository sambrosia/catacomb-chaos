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
    }
};
