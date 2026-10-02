
const db = require('../config/db');
const ServiceModel = require('../models/serviceModel');

const getAllServices = async (req, res) => {
    try {
        // Truy vấn danh sách dịch vụ từ bảng services trong cơ sở dữ liệu
        const [services] = await db.query('SELECT * FROM services ORDER BY id DESC');
        const serviceList = Array.isArray(services) ? services : [];

        // Render ra file EJS tương ứng trong thư mục pages/admin/services.ejs
        res.render('pages/admin/services', { 
            title: 'Danh mục Dịch vụ - TTT Admin',
            services: serviceList,
            currentRoute: '/admin/services' 
        });
    } catch (err) {
        console.error("Lỗi truy vấn database services:", err);
        res.status(500).send("Lỗi Server: Không thể tải danh mục dịch vụ.");
    }
};


// 1. Hiển thị form chỉnh sửa dịch vụ
const getEditServicePage = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await ServiceModel.getServiceById(serviceId);
        if (!service) {
            return res.status(404).send("Không tìm thấy dịch vụ");
        }
        res.render('admin/editService', { service }); // Tạo view form chỉnh sửa tương ứng
    } catch (error) {
        console.error("Lỗi lấy thông tin dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
};

// 2. Xử lý lưu thông tin sau khi sửa
const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { title, slug, description } = req.body;
        await ServiceModel.updateService(serviceId, { title, slug, description });
        res.redirect('/admin/services'); // Chuyển hướng về trang danh sách
    } catch (error) {
        console.error("Lỗi cập nhật dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
};

// 3. Xử lý xóa dịch vụ
const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        await ServiceModel.deleteService(serviceId);
        res.redirect('/admin/services');
    } catch (error) {
        console.error("Lỗi xóa dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
};

const addService = async (req, res) => {
    try {
        const { title, slug, description } = req.body;
        await ServiceModel.addService({ title, slug, description }); // Viết hàm INSERT tương ứng trong model
        res.redirect('/admin/services'); // Thêm thành công thì load lại trang danh sách
    } catch (error) {
        console.error("Lỗi thêm dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
};

module.exports = {
    getAllServices,
    getEditServicePage,
    updateService,
    addService,
    deleteService
};