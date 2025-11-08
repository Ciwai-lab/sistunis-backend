module.exports = {
  apps: [
    {
      name: 'sistunis-backend',
      script: 'server.js', // <<< INI YANG HILANG!
      exec_mode: 'fork',   // <<< INI PENTING
      instances: 1,        // <<< INI PENTING
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production', // <<< INI PENTING
        DB_HOST: 'sistunis-db-prod.cnma20k02b83.ap-southeast-1.rds.amazonaws.com', 
        DB_USER: 'sistunis_admin',
        DB_DATABASE: 'sistunis_db',
        DB_PASSWORD: 'Fluburun6',
        JWT_SECRET: 'eT7fJp2Hk9sXlR4wA6qB3zC1vY8uM0N5iP9dO0kK7gG2jI4hF1aB8cZ3yX6wV9uT0sR7qP4oM1nL8kK5jI2hG9fF6eD3cZ0yX7wV4uT1sR8qP5oM2nL9kK6jI3hG0fF7eD4'
      }
    },
  ],
};
