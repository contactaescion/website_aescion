
module.exports = {
  apps: [
    {
      name: 'aescion-backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add other environment variables here or use a .env file
      },
    },
  ],
};
