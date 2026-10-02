const db = require('../config/db'); // Đường dẫn đến cấu hình database của bạn

const loadGlobalData = async (req, res, next) => {
    try {
        // 1. Lấy danh sách dịch vụ cho menu (như logic cũ của bạn)
        const [services] = await db.execute("SELECT id, title, slug FROM services");
        res.locals.servicesMenu = services;

        // 2. Lấy tổng số lượng liên hệ cho sidebar admin
        const [contactRows] = await db.execute("SELECT COUNT(*) as total FROM contacts");
        res.locals.contactTotal = contactRows[0].total;

        // (Bạn có thể gom thêm các số liệu thống kê chung khác nếu cần tại đây)

    } catch (error) {
        console.error("Lỗi nạp dữ liệu toàn cục (menu/sidebar):", error);
        res.locals.servicesMenu = [];
        res.locals.contactTotal = 0;
    }
    next();
};

module.exports = loadGlobalData;