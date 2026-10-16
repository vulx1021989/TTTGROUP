const RequestModel = require('../models/requestModel');

const RequestController = {
    // Thêm hàm nhận dữ liệu từ các trang dịch vụ gửi lên
    submitRequest: async (req, res) => {
        try {
            const { service_name, company, name, phone, facility_type, message } = req.body;

            if (!company || !name || !phone) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các trường bắt buộc (*).' });
            }

            // Gọi truy vấn lưu vào cơ sở dữ liệu MySQL
            const db = require('../config/db');
            const query = `INSERT INTO contact_requests (service_name, company, name, phone, facility_type, message) VALUES (?, ?, ?, ?, ?, ?)`;
            
            await db.execute(query, [
                service_name || 'Dịch vụ kỹ thuật', 
                company, 
                name, 
                phone, 
                facility_type || null, 
                message || null
            ]);

            return res.status(200).json({ success: true, message: 'Gửi yêu cầu thành công!' });
        } catch (error) {
            console.error('Lỗi lưu contact request:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
        }
    },
    // Hiển thị danh sách tất cả các yêu cầu tư vấn/báo giá trong Admin Panel
    renderRequestsList: async (req, res) => {
        try {
            const requests = await RequestModel.getAllRequests();
            
            // Kiểm tra an toàn sự tồn tại của session trước khi truy xuất
            const currentUser = (req.session && req.session.adminUser) ? req.session.adminUser : null;
            const pendingRequestsCount = await RequestModel.countPending(); // hàm đếm trong model

            // Render ra view EJS trong thư mục admin (views/admin/requests.ejs)
            res.render('pages/admin/requests', {
                title: 'Quản Lý Yêu Cầu Khảo Sát & Báo Giá - TTT Group Admin',
                requests: requests,
                user: currentUser,
                pendingCount: pendingRequestsCount,
                currentRoute: '/admin/requests'
            });
        } catch (error) {
            console.error('Lỗi lấy danh sách yêu cầu liên hệ:', error);
            res.status(500).send('Lỗi máy chủ nội bộ');
        }
    },

    // Cập nhật trạng thái xử lý yêu cầu (AJAX hoặc Form Submit từ trang quản trị)
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'processing', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ.' });
            }

            const affectedRows = await RequestModel.updateStatus(id, status);

            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu cần cập nhật.' });
            }

            return res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công!' });
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái yêu cầu:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
        }
    },

    // Xóa yêu cầu liên hệ
    deleteRequest: async (req, res) => {
        try {
            const { id } = req.params;
            const affectedRows = await RequestModel.deleteRequest(id);

            if (affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu để xóa.' });
            }

            return res.status(200).json({ success: true, message: 'Đã xóa yêu cầu thành công!' });
        } catch (error) {
            console.error('Lỗi xóa yêu cầu liên hệ:', error);
            return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
        }
    }
};

module.exports = RequestController;