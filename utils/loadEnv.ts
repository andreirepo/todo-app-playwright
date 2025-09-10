const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const env = process.env.APP_ENV || 'dev';
const envFile = path.resolve(__dirname, '../config', `.env.${env}`);

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else if (!process.env.CI) {
  console.warn(`Environment file ${envFile} not found.`);
}
