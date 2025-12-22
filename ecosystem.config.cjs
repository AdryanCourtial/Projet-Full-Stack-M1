// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "app",
      cwd: "./Back",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "500M",
      time: true
    }
  ]
};
