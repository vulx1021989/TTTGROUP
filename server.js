require('dotenv').config(); // <-- Phải đặt ở dòng 1 tuyệt đối của file server.js

const express = require('express');
const path = require('path');
const http = require('http'); // <-- Thêm http module
const { Server } = require('socket.io'); // <-- Thêm socket.io
const cookieParser = require('cookie-parser');
const mainRouter = require('./routes/mainRouter');
const adminRouter = require('./routes/admin');

const app = express();
const port = 3000;

// 1. Tạo HTTP server từ ứng dụng Express và khởi tạo Socket.io
const server = http.createServer(app);
const io = new Server(server);

// Lưu instance của io vào app để dùng ở controller khi có contact mới
app.set('socketio', io);

io.on('connection', (socket) => {
    console.log('Admin đã kết nối Real-time qua Socket.io');
});

// 1. Cấu hình View Engine là EJS
app.set('view engine', 'ejs');

// 2. Trỏ views về thư mục gốc để quản lý cả pages và components
app.set('views', path.join(__dirname));

// 3. Cấu hình thư mục chứa file tĩnh (CSS, JS, hình ảnh)
app.use(express.static(path.join(__dirname, 'public/assets')));

// 4. Middleware đọc dữ liệu gửi lên từ form (POST request) và dữ liệu dạng JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// 5. Sử dụng Middleware load dịch vụ và dữ liệu toàn cục (phải đặt TRƯỚC các router)
const loadServicesMenu = require('./middlewares/menuMiddleware');
app.use(loadServicesMenu);

// 5. Sử dụng các Router điều hướng
app.use('/', mainRouter);
app.use('/admin', adminRouter);

// 6. Khởi động server bằng server.http thay vì app.express đơn thuần
server.listen(port, () => {
    console.log(`Server đang chạy tại http://127.0.0.1:${port}/`);
});