/** @type {import('next').NextConfig} */
const os = require("os");
const nextConfig = {
    async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              {
                key: 'Access-Control-Allow-Credentials',
                value: 'true',
              },
              {
                key: 'Access-Control-Allow-Origin',
                value: 'https://dashboard.jamiat.org.pk',
              },
              {
                key: 'Access-Control-Allow-Methods',
                value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
              },
              {
                key: 'Access-Control-Allow-Headers',
                value:
                  'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
              },
            ],
          },
        ];
      },
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
