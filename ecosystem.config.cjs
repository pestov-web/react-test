module.exports = {
  apps: [
    {
      name: 'dvgames-front',
      port: '3050',
      exec_mode: 'cluster',
      instances: 'max',
      script: 'next start',
    },
  ],
};
