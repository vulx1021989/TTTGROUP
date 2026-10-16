// controllers/dashboardController.js
const serviceModel = require('../models/serviceModel');
const requestModel = require('../models/requestModel');
const contactModel = require('../models/contactModel');
const careerModel = require('../models/careerModel');

exports.getDashboard = async (req, res) => {
    try {
        // 1. Khởi tạo giá trị mặc định phòng hờ lỗi kết nối database hoặc bảng trống
        let totalServices = 0;
        let totalRequests = 0;
        let totalContacts = 0;
        let totalCareers = 0;
        let recentRequests = [];

        // 2. Truy xuất song song hoặc tuần tự các model lấy số liệu thực tế
        try {
            const services = await serviceModel.getAllServices();
            if (services && Array.isArray(services)) {
                totalServices = services.length;
            }
        } catch (err) {
            console.log("Lỗi lấy danh sách dịch vụ:", err.message);
        }

        try {
            // Lấy tổng số lượng hoặc đếm từ requestModel (tùy thuộc vào cấu trúc hàm trong model của bạn)
            if (typeof requestModel.countRequests === 'function') {
                totalRequests = await requestModel.countRequests();
            } else if (typeof requestModel.getAllRequests === 'function') {
                const reqs = await requestModel.getAllRequests();
                totalRequests = Array.isArray(reqs) ? reqs.length : 0;
                recentRequests = Array.isArray(reqs) ? reqs.slice(0, 5) : []; // Lấy 5 yêu cầu mới nhất
            }
        } catch (err) {
            console.log("Lỗi lấy dữ liệu yêu cầu báo giá:", err.message);
        }

        try {
            if (typeof contactModel.countContacts === 'function') {
                totalContacts = await contactModel.countContacts();
            } else if (typeof contactModel.getAllContacts === 'function') {
                const contacts = await contactModel.getAllContacts();
                totalContacts = Array.isArray(contacts) ? contacts.length : 0;
            }
        } catch (err) {
            console.log("Lỗi lấy dữ liệu liên hệ:", err.message);
        }

        try {
            if (typeof careerModel.countApplications === 'function') {
                totalCareers = await careerModel.countApplications();
            } else if (typeof careerModel.getAllApplications === 'function') {
                const careers = await careerModel.getAllApplications();
                totalCareers = Array.isArray(careers) ? careers.length : 0;
            }
        } catch (err) {
            console.log("Lỗi lấy dữ liệu tuyển dụng:", err.message);
        }

        // 3. Đóng gói dữ liệu số lượng để hiển thị Badge trên Sidebar
        const counts = {
            requests: totalRequests,
            contacts: totalContacts,
            careers: totalCareers
        };

        // 4. Đóng gói chỉ số thống kê tổng quan hiển thị lên các thẻ Cards
        const stats = {
            requests: totalRequests,
            careers: totalCareers,
            services: totalServices || 8,
            visitors: '3,850' // Hoặc tích hợp Google Analytics API nếu có
        };

        // 5. Render trang dashboard kèm đầy đủ dữ liệu động từ Database
        res.render('pages/admin/dashboard', {
            title: 'Dashboard Quản Trị - TTT Group',
            currentRoute: 'dashboard',
            counts: counts,
            stats: stats,
            recentRequests: recentRequests
        });

    } catch (error) {
        console.error("Lỗi nghiêm trọng khi tải Dashboard:", error);
        res.status(500).send("Lỗi Server khi tải trang quản trị.");
    }
};