const mysql = require('mysql2');

// Khởi tạo pool kết nối đến MySQL sử dụng biến môi trường từ file .env
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',          
    user: process.env.DB_USER || 'root',              
    password: process.env.DB_PASSWORD, // Lấy mật khẩu từ file .env
    database: process.env.DB_NAME || 'ttt_group_db',  
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Xuất ra để các file controller/route có thể gọi sử dụng bằng async/await
module.exports = pool.promise();