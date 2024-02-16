/** @type {import('next').NextConfig} */
const os = require("os");
const nextConfig = {
  compiler: {
    styledComponents: true
  },
    webpack: (config, { dev, isServer, webpack, nextRuntime }) => {
        config.module.rules.push({
            test: /\.node$/,
            use: [
                {
                    loader: "nextjs-node-loader",
                    options: {
                        flags: os.constants.dlopen.RTLD_NOW,
                        outputPath: config.output.path,
                    },
                },
            ],
        });
        return config;
    },
};

module.exports = nextConfig;
