const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 1. Khai báo thư viện jsonwebtoken

// Khóa bí mật JWT (trong thực tế nên lưu vào biến môi trường process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET;

// Hiển thị trang đăng nhập
const getLoginPage = (req, res) => {
    res.render('pages/login', { 
        title: 'Đăng Nhập - TTT Infrastructure',
        error: null 
    });
};

// Xử lý logic đăng nhập
const postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Lấy user ra trước
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? OR name = ?', 
            [username, username]
        );

        console.log(users);

        if (users && users.length > 0) {
            const user = users[0];
            // Dùng bcrypt.compare để so sánh mật khẩu thô người dùng nhập với chuỗi hash trong DB
            const match = await bcrypt.compare(password, user.password);
            
            if (match) {
                // 2. Tạo JWT Token chứa thông tin định danh của user
                const token = jwt.sign(
                    { 
                        id: user.id, 
                        name: user.name, 
                        email: user.email, 
                        role: user.role 
                    },
                    JWT_SECRET,
                    { expiresIn: '2h' } // Token có hiệu lực trong 2 giờ
                );

                // 3. Lưu token vào HttpOnly Cookie để bảo mật tuyệt đối
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 2 * 60 * 60 * 1000 // 2 giờ tính bằng mili-giây
                });

                return res.redirect('/admin/users');
            }
        }
        
        // Nếu sai tài khoản hoặc mật khẩu
        res.render('pages/login', { 
            title: 'Đăng Nhập - TTT Infrastructure',
            error: 'Email/Tên đăng nhập hoặc mật khẩu không chính xác!' 
        });

    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).send("Lỗi Server: Không thể xử lý đăng nhập.");
    }
};

module.exports = {
    getLoginPage,
    postLogin
};