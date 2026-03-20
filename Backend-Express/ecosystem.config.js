module.exports = {
  apps: [
    {
      name: "backend-api",

      // Chemin vers ton point d'entrée
      script: "./dist/index.js", // ou app.js / server.js selon ton projet

      // Mode cluster (recommandé en prod)
      exec_mode: "cluster",
      instances: "max",

      // Redémarrage automatique
      autorestart: true,
      watch: false,

      env: {
        NODE_ENV: "development",
        PORT: 3000
      },

      env_production: {
        APP_HOST: process.env.APP_HOST,
        PORT: process.env.PORT,
        DATABASE_URL: process.env.APPDATABASE_URL_HOST,
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_SECRET_EXPIRES_IN: process.env.AUTH_SECRET_EXPIRES_IN,
        AUTH_REFRESH_SECRET: process.env.AUTH_REFRESH_SECRET,
        AUTH_REFRESH_SECRET_EXPIRES_IN: process.env.AUTH_REFRESH_SECRET_EXPIRES_IN
      },

      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",

      restart_delay: 4000
    }
  ]
};