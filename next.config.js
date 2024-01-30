/** @type {import('next').NextConfig} */
const nextConfig = {
    target: "node",
    node: {
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.node$/,
          loader: "node-loader",
        },
      ],
    },
};

module.exports = nextConfig;
