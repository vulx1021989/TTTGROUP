// controllers/contactController.js
const ServiceModel = require('../models/serviceModel');
const ContactModel = require('../models/contactModel');

const getContactPage = async (req, res) => {
    try {
        const services = await ServiceModel.getAllServices();
        res.render('pages/contact', { services }); // Truyền biến services sang view contact.ejs
    } catch (err) {
        console.error("Lỗi tải trang contact:", err);
        res.status(500).send("Lỗi Server");
    }
};

const getAdminContactsPage = async (req, res) => {
    try {
        const { search, status, service_id } = req.query;

        // Lấy danh sách liên hệ dựa trên bộ lọc
        const contacts = await ContactModel.getAllContacts({ search, status, service_id });
        
        // Lấy danh sách services để đổ dữ liệu vào ô dropdown lọc dịch vụ
        const services = await ServiceModel.getAllServices(); // Hoặc model tương ứng lấy dịch vụ của bạn

        res.render('pages/admin/contacts', {
            title: 'Quản Lý Yêu Cầu Liên Hệ - TTT Admin',
            currentRoute: '/admin/contacts',
            contacts,
            services,
            search: search || '',
            status: status || '',
            service_id: service_id || '',
            layout: false // Hoặc tùy cấu hình view engine của bạn
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách liên hệ admin:", error);
        res.status(500).send("Lỗi Server");
    }
};

const updateStatus = async (req, res) => {
    try {
        const contactId = req.params.id;
        const { status } = req.body;
        
        await ContactModel.updateContactStatus(contactId, status);
        res.redirect('/admin/contacts'); // Cập nhật xong load lại trang quản lý
    } catch (err) {
        console.error("Lỗi cập nhật trạng thái liên hệ:", err);
        res.status(500).send("Lỗi Server: Không thể cập nhật trạng thái.");
    }
};

const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        await ContactModel.deleteContact(contactId);
        res.redirect('/admin/contacts'); // Xóa xong load lại trang quản lý liên hệ
    } catch (err) {
        console.error("Lỗi khi xóa liên hệ:", err);
        res.status(500).send("Lỗi Server: Không thể xóa liên hệ.");
    }
};

const submitContact = async (req, res) => {
    try {
        const { name, company, service_id, phone, email, message } = req.body;
        
        // Gọi model để lưu vào database bảng contacts
        await ContactModel.createContact({
            name,
            company,
            service_id,
            phone,
            email,
            message,
            status: 'pending' // Trạng thái mặc định khi khách vừa gửi
        });

        // Sau khi lưu thành công, thông báo cho khách hoặc chuyển hướng
        return res.redirect('/contact?success=true');
    } catch (error) {
        console.error("Lỗi khi gửi liên hệ:", error);
        return res.status(500).send("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
};

module.exports = {
    getContactPage,
    getAdminContactsPage,
    deleteContact, // Đừng quên export hàm này
    updateStatus,
    submitContact
};