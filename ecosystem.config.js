module.exports = {
  apps: [{
    name: 'mygig-backend',
    script: './backend/index.js',
    cwd: '/var/www/my-gig-guide',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
