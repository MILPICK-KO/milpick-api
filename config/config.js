require('dotenv').config(); // .env 파일에서 환경변수를 불러오기 위한 설정

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    },
    pool: {
        max: 20,
        min: 5,
        acquire: true,
        idle: true,
    }
};