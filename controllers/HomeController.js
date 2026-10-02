// Ví dụ trong HomeController hoặc ServiceController
const serviceModel = require('../models/serviceModel'); // Đường dẫn tới model của bạn

const getHomePage = async (req, res) => {
    try {
        // Lấy tất cả dịch vụ từ database
        const services = await serviceModel.getAllServices(); 
        res.render('pages/components/header', {
            services: services // Truyền biến services sang file EJS
        });
    } catch (error) {
        console.error("Lỗi lấy dữ liệu dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
};