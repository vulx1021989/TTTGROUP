const User = require('../models/userModel');
const bcrypt = require('bcrypt'); // Thư viện mã hóa mật khẩu (nếu dự án của bạn đang dùng)

const userController = {
    // Xử lý thêm user mới từ Modal
    addUser: async (req, res) => {
        try {
            // Lấy dữ liệu từ form gửi lên (khớp với các name trong input của Modal)
            const { name, email, password, role, status } = req.body;

            // 1. Kiểm tra xem email đã tồn tại trong database chưa
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                // Bạn có thể tùy biến cách báo lỗi (ví dụ render lại trang kèm thông báo)
                return res.status(400).send('Email này đã được sử dụng bởi tài khoản khác!');
            }

            // 2. Mã hóa mật khẩu trước khi lưu (nếu có nhập password)
            // Nếu form của bạn không truyền password mặc định, có thể gán chuỗi mặc định
            const plainPassword = password || '123456'; 
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

            // 3. Gọi hàm create trong User Model để lưu vào cơ sở dữ liệu
            await User.create({
                name,
                email,
                hashedPassword,
                role: role || 'user',       // Giá trị mặc định nếu không chọn
                status: status || 'active'  // Giá trị mặc định nếu không chọn
            });

            // 4. Thêm thành công thì chuyển hướng về trang danh sách user
            res.redirect('/admin/users');

        } catch (error) {
            console.error('Lỗi khi thêm user:', error);
            res.status(500).send('Lỗi Server khi thêm người dùng mới.');
        }
    },
    // Hiển thị form/modal chỉnh sửa (hoặc trả về JSON nếu làm popup modal động)
    getEditUserForm: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('Không tìm thấy người dùng!');
            }
            // Nếu bạn dùng modal chung trên trang users, có thể trả về JSON hoặc render kèm
            res.json(user); 
        } catch (error) {
            console.error('Lỗi lấy thông tin user:', error);
            res.status(500).send('Lỗi Server');
        }
    },

    // Xử lý lưu cập nhật user
    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const { name, email, role, status } = req.body;

            // Gọi model cập nhật
            await User.update(userId, { name, email, role, status });

            // Cập nhật xong chuyển hướng về trang danh sách
            res.redirect('/admin/users');
        } catch (error) {
            console.error('Lỗi khi cập nhật user:', error);
            res.status(500).send('Lỗi Server khi cập nhật.');
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            await User.deleteUser(userId);
            res.redirect('/admin/users'); // Xóa xong load lại trang danh sách
        } catch (err) {
            console.error("Lỗi khi xóa tài khoản:", err);
            res.status(500).send("Lỗi Server: Không thể xóa tài khoản.");
        }
    }

    
};

module.exports = userController;