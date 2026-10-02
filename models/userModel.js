// models/userModel.js
const db = require('../config/db'); // Đường dẫn đến file cấu hình kết nối MySQL pool của bạn

const User = {
    // 1. Lấy tất cả user
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM users ORDER BY id DESC');
        return rows;
    },

    // 2. Đếm tổng số user và số user active (dùng cho thống kê dashboard)
    getStats: async () => {
        const [totalRows] = await db.query('SELECT COUNT(*) as total FROM users');
        const [activeRows] = await db.query("SELECT COUNT(*) as active FROM users WHERE status = 'active'");
        
        return {
            totalUsers: totalRows[0].total,
            activeUsers: activeRows[0].active
        };
    },

    // 3. Thêm mới user (Hỗ trợ lưu mật khẩu đã mã hóa)
    create: async (userData) => {
        const { name, email, hashedPassword, role, status } = userData;
        const query = 'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [name, email, hashedPassword, role, status]);
        return result;
    },

    // 4. Tìm user theo Email (dùng khi đăng nhập hoặc kiểm tra trùng lặp)
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },

    // 5. Tìm user theo ID (dùng khi bấm nút Sửa)
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, name, email, role, status FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    // 6. Cập nhật thông tin user theo ID
    update: async (id, userData) => {
        const { name, email, role, status } = userData;
        const query = 'UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?';
        const [result] = await db.query(query, [name, email, role, status, id]);
        return result;
    },

    // Thêm hàm xóa tài khoản
    deleteUser: async (id) => {
        try {
            const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }


};

module.exports = User;