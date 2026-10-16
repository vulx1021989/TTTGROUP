const db = require('../config/db'); // Đường dẫn đến file kết nối cơ sở dữ liệu của bạn

const RequestModel = {
    // Lấy toàn bộ danh sách yêu cầu liên hệ / báo giá (Sắp xếp mới nhất lên đầu)
    getAllRequests: async () => {
        const [rows] = await db.query(
            'SELECT * FROM contact_requests ORDER BY created_at DESC'
        );
        return rows;
    },

    // Lấy chi tiết một yêu cầu theo ID
    getRequestById: async (id) => {
        const [rows] = await db.query(
            'SELECT * FROM contact_requests WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // Cập nhật trạng thái xử lý của yêu cầu (pending, processing, completed)
    updateStatus: async (id, status) => {
        const [result] = await db.query(
            'UPDATE contact_requests SET status = ? WHERE id = ?',
            [status, id]
        );
        return result.affectedRows;
    },

    // Xóa một yêu cầu liên hệ khỏi hệ thống
    deleteRequest: async (id) => {
        const [result] = await db.query(
            'DELETE FROM contact_requests WHERE id = ?',
            [id]
        );
        return result.affectedRows;
    },
    // ĐẾM SỐ LƯỢNG YÊU CẦU CHỜ XỬ LÝ (Khắc phục lỗi countPending)
    countPending: async () => {
        const [rows] = await db.query("SELECT COUNT(*) as total FROM contact_requests WHERE status = 'pending'");
        return rows[0].total;
    },

    // Đếm tổng số lượng yêu cầu
    countTotal: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM contact_requests');
        return rows[0].total;
    },

    // Thống kê tổng số lượng yêu cầu theo trạng thái (dùng cho Dashboard Admin nếu cần)
    countRequestsByStatus: async () => {
        const [rows] = await db.query(
            'SELECT status, COUNT(*) as count FROM contact_requests GROUP BY status'
        );
        return rows;
    }
};

module.exports = RequestModel; // Hoặc module.exports = RequestModel;