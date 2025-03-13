module.exports = {
  apps: [
    {
      name: 'react-test',
      script: 'node_modules/next/dist/bin/next',
      args: 'start --port 3050',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
