// models/settingModel.js
const db = require('../config/db');

const SettingModel = {
    // 1. Lấy toàn bộ cài đặt và chuyển thành Object { key_name: key_value }
    getSettings: async () => {
        try {
            const [rows] = await db.execute('SELECT key_name, key_value FROM settings');
            const settingsObj = {};
            
            // Duyệt qua từng dòng và đưa vào object để view dễ sử dụng
            rows.forEach(row => {
                settingsObj[row.key_name] = row.key_value;
            });
            
            return settingsObj; 
        } catch (error) {
            throw error;
        }
    },

    // 2. Cập nhật danh sách cài đặt theo dạng Key-Value
    updateSettings: async (formData) => {
        try {
            // Duyệt qua từng trường được gửi từ form lên và lưu vào DB
            for (const [key, value] of Object.entries(formData)) {
                await db.execute(
                    'INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = ?',
                    [key, value, value]
                );
            }
        } catch (error) {
            throw error;
        }
    }
};

module.exports = SettingModel;