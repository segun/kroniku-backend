module.exports = {
  apps: [
    {
      name: 'kroniku-backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      time: true,
      merge_logs: true,
      out_file: 'logs/kroniku-out.log',
      error_file: 'logs/kroniku-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        LOG_LEVEL: 'debug',
        DB_LOGGING: 'error,warn',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        LOG_LEVEL: 'log',
        DB_LOGGING: 'error,warn',
      },
    },
  ],
};
