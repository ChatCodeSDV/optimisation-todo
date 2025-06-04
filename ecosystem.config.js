module.exports = {
  apps: [
    {
      name: 'todo-api',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      instance_var: 'INSTANCE_ID',
      increment_var: 'PORT',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      prestart: 'pnpm run build'
    },
    {
      name: 'todo-worker',
      script: './dist/workers/report.worker.js', // Path to the compiled worker file
      instances: 1, // Only one instance of the worker
      exec_mode: 'fork', // Fork mode for a single process
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
