require('dotenv').config(); // <-- Phải đặt ở dòng 1 tuyệt đối của file server.js

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser'); // <-- Thêm dòng khai báo này vào đây
const mainRouter = require('./routes/mainRouter');
const adminRouter = require('./routes/admin'); // Gọi đúng đường dẫn file admin trong thư mục routes

const app = express();
const port = 3000;

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs');

// 2. Trỏ views về thư mục gốc để quản lý cả pages và components
app.set('views', path.join(__dirname));

// 3. Cấu hình thư mục chứa file tĩnh (CSS, JS, hình ảnh)
app.use(express.static(path.join(__dirname, 'public/assets')));

// 4. Middleware đọc dữ liệu gửi lên từ form (POST request) và dữ liệu dạng JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // <-- Phải đặt ở đây trước các router

// 5. Sử dụng Middleware load dịch vụ cho toàn bộ các trang (phải đặt TRƯỚC các router)
const loadServicesMenu = require('./middlewares/menuMiddleware');
app.use(loadServicesMenu);

// 5. Sử dụng các Router điều hướng
app.use('/', mainRouter);
app.use('/admin', adminRouter); // Gắn admin router vào tiền tố /admin

// 6. Khởi động server
app.listen(port, () => {
    console.log(`Server đang chạy tại http://127.0.0.1:${port}/`);
});