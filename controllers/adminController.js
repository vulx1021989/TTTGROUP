const db = require('../config/db');
const SettingModel = require('../models/settingModel');

// Hàm lấy dữ liệu danh sách user cho trang quản trị
const getUsersPage = async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users ORDER BY id DESC');
        const userList = Array.isArray(users) ? users : [];
        const totalUsers = userList.length;
        const activeUsers = userList.filter(u => u.status === 'active').length;

        res.render('pages/admin/users', { 
            title: 'Quản Lý Tài Khoản Quản Trị - TTT Group',
            users: userList,
            totalUsers: totalUsers,
            activeUsers: activeUsers,
            currentRoute: '/admin/users' 
        });
    } catch (err) {
        console.error("Lỗi truy vấn database:", err);
        res.status(500).send("Lỗi Server: Không thể tải danh sách tài khoản.");
    }
};


// Hàm xử lý trang Cài đặt chung
const getSettingsPage = async (req, res) => {
    try {
        // 1. Lấy dữ liệu cấu hình từ database (thường là bản ghi đầu tiên id = 1)
        const settings = await SettingModel.getSettings(); // Hoặc hàm tương ứng trong Model của bạn

        console.error("Lỗi tải trang cài đặt:", settings);


        // 2. Render ra file EJS và truyền thêm biến settings sang view
        res.render('pages/admin/settings', { 
            title: 'Cài đặt chung - TTT Admin',
            currentRoute: '/admin/settings',
            settings: settings // <-- Truyền biến settings xuống view tại đây
        });
    } catch (err) {
        console.error("Lỗi tải trang cài đặt:", err);
        res.status(500).send("Lỗi Server: Không thể tải trang cài đặt.");
    }
};

module.exports = {
    getUsersPage,
    getSettingsPage // Thêm dòng này
};