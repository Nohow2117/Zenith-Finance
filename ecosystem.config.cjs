module.exports = {
  apps: [
    {
      name: "artdefinance",
      script: "server.js",
      cwd: "/home/artdefinance/app",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
