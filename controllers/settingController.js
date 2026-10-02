// controllers/settingController.js
const SettingModel = require('../models/settingModel');


// 1. Hiển thị trang cài đặt chung
exports.getSettingsPage = async (req, res) => {
    try {
        // Gọi Model lấy dữ liệu cấu hình
        const settings = await SettingModel.getSettings();

        res.render('admin/settings', {
            title: 'Cài Đặt Chung Hệ Thống',
            settings: settings || {}
        });
    } catch (error) {
        console.error('Lỗi tải trang cài đặt:', error);
        res.status(500).send('Lỗi Server khi tải trang cài đặt.');
    }
};

// 2. Xử lý cập nhật cài đặt
exports.updateSetting = async (req, res) => {
    try {
        // Lấy dữ liệu thô từ form gửi lên
        const formData = {
            site_name: req.body.site_name,
            site_slogan: req.body.site_slogan,
            site_description: req.body.site_description,
            contact_email: req.body.contact_email,
            contact_hotline: req.body.contact_hotline,
            contact_address: req.body.contact_address,
            // Xử lý checkbox: Nếu có tích thì lưu là 1, ngược lại là 0
            maintenance_mode: req.body.maintenance_mode ? 1 : 0,
            allow_guest_inquiry: req.body.allow_guest_inquiry ? 1 : 0
        };

        // Gọi Model thực hiện câu lệnh UPDATE vào database
        await SettingModel.updateSettings(formData);

        // Chuyển hướng lại trang cài đặt sau khi lưu thành công
        res.redirect('/admin/settings');
    } catch (error) {
        console.error('Lỗi khi cập nhật cài đặt:', error);
        res.status(500).send('Lỗi Server khi lưu cài đặt.');
    }
};