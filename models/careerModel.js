const db = require('../config/db'); // Kết nối MySQL dùng mysql2/promise
const fs = require('fs');
const path = require('path');

const CareerModel = {
    // 1. Lấy tất cả tin tuyển dụng
    getAllCareers: async () => {
        const [rows] = await db.query('SELECT * FROM careers ORDER BY created_at DESC');
        return rows;
    },

    // 2. Lấy chi tiết tin tuyển dụng theo ID
    getCareerById: async (id) => {
        const [rows] = await db.query('SELECT * FROM careers WHERE id = ?', [id]);
        return rows;
    },

    // 3. Thêm mới tin tuyển dụng
    addCareer: async (data) => {
        const { title, location, type, description, requirements, salary, status } = data;
        const query = `
            INSERT INTO careers (title, location, type, description, requirements, salary, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await db.query(query, [title, location, type, description, requirements, salary, status || 'active']);
        return result;
    },

    // 4. Cập nhật tin tuyển dụng
    updateCareer: async (id, data) => {
        const { title, location, type, description, requirements, salary, status } = data;
        const query = `
            UPDATE careers 
            SET title = ?, location = ?, type = ?, description = ?, requirements = ?, salary = ?, status = ?
            WHERE id = ?
        `;
        const [result] = await db.query(query, [title, location, type, description, requirements, salary, status, id]);
        return result;
    },

    // 5. Xóa tin tuyển dụng
    deleteCareer: async (id) => {
        const [result] = await db.query('DELETE FROM careers WHERE id = ?', [id]);
        return result;
    },

    // 6. Lấy danh sách hồ sơ/CV ứng tuyển
    getAllApplications: async () => {
        const [rows] = await db.query('SELECT * FROM job_applications ORDER BY created_at DESC');
        return rows;
    },
    deleteApplication: async (id) => {
        // Lấy thông tin file CV trước khi xóa bản ghi
        const [rows] = await db.query('SELECT cv_file_path FROM job_applications WHERE id = ?', [id]);
        if (rows && rows.length > 0 && rows[0].cv_file_path) {
            const filePath = path.join(__dirname, '../public', rows[0].cv_file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Xóa file CV vật lý khỏi hệ thống
            }
        }
        
        // Xóa hồ sơ trong CSDL
        const [result] = await db.query('DELETE FROM job_applications WHERE id = ?', [id]);
        return result;
    }

};

module.exports = CareerModel;