const db = require("../config/db"); // Đường dẫn đến cấu hình database của bạn
const RequestModel = require("../models/requestModel");
// Import thêm model tuyển dụng nếu có (ví dụ: careerModel)
const careerModel = require("../models/careerModel"); // Thay đổi đường dẫn nếu cần

const loadGlobalData = async (req, res, next) => {
    try {
        // 1. Lấy danh sách dịch vụ cho menu trang chủ/header công khai
        const [services] = await db.execute("SELECT id, title, slug FROM services");
        res.locals.servicesMenu = services;

        // 2. Lấy tổng số lượng liên hệ cho sidebar admin
        const [contactRows] = await db.execute("SELECT COUNT(*) as total FROM contacts");
        res.locals.contactTotal = contactRows[0].total || 0;

        // 3. Lấy tổng số lượng yêu cầu tư vấn/báo giá
        res.locals.requestTotal = (typeof RequestModel.countTotal === 'function') 
            ? await RequestModel.countTotal() 
            : 0;

        // 4. Lấy tổng số lượng hồ sơ tuyển dụng (cho badge sidebar admin)
        let careerTotal = 0;
        try {
            if (careerModel && typeof careerModel.countTotal === 'function') {
                careerTotal = await careerModel.countTotal();
            } else {
                // Hoặc query trực tiếp nếu chưa có hàm trong model
                const [careerRows] = await db.execute("SELECT COUNT(*) as total FROM careers");
                careerTotal = careerRows[0].total || 0;
            }
        } catch (err) {
            careerTotal = 0; // Phòng hờ lỗi nếu bảng careers chưa khởi tạo
        }
        res.locals.careerTotal = careerTotal;


        // 4. Lấy tổng số lượng hồ sơ ứng tuyển (jobApplicationTotal)
        let jobAppsTotal = 0;
        try {
            if (careerModel && typeof careerModel.countTotal === 'function') {
                jobAppsTotal = await careerModel.countTotal();
            } else {
                // Truy vấn trực tiếp bảng lưu hồ sơ ứng tuyển (ví dụ: bảng 'careers' hoặc 'job_applications')
                const [careerRows] = await db.execute("SELECT COUNT(*) as total FROM careers");
                jobAppsTotal = careerRows[0].total || 0;
            }
        } catch (err) {
            console.log("Không thể đếm số lượng hồ sơ tuyển dụng:", err.message);
            jobAppsTotal = 0;
        }
        
        // Gán biến toàn cục phục vụ cho view và sidebar
        res.locals.jobApplicationTotal = jobAppsTotal;


        // Đóng gói chung vào một object `counts` để dễ quản lý nếu cần dùng chung
        res.locals.counts = {
            requests: res.locals.requestTotal,
            contacts: res.locals.contactTotal,
            careers: res.locals.careerTotal,
            jobApplications: res.locals.jobApplicationTotal,

        };

    } catch (error) {
        console.error("Lỗi nạp dữ liệu toàn cục (menu/sidebar):", error);
        res.locals.servicesMenu = [];
        res.locals.contactTotal = 0;
        res.locals.requestTotal = 0;
        res.locals.careerTotal = 0;
        res.locals.jobApplicationTotal = 0;
        res.locals.counts = { requests: 0, contacts: 0, careers: 0, jobApplicationTotal: 0 };
    }
    next();
};

module.exports = loadGlobalData;