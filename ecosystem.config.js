module.exports = {
  apps: [
    {
      name: "todo-api",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      increment_var: "PORT",
      env: {
        NODE_ENV: "development",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      prestart: "pnpm run build",
    },
  ],
};
