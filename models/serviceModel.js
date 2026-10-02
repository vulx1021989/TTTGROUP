// models/serviceModel.js
const db = require('../config/db');

const ServiceModel = {
    // Lấy tất cả dịch vụ (nếu chưa có)
    getAllServices: async () => {
        const [rows] = await db.execute("SELECT * FROM services ORDER BY id DESC");
        return rows;
    },

    // Lấy chi tiết 1 dịch vụ theo ID (dùng cho trang Edit)
    getServiceById: async (id) => {
        const [rows] = await db.execute("SELECT * FROM services WHERE id = ?", [id]);
        return rows[0];
    },

    // Cập nhật dịch vụ
    updateService: async (id, serviceData) => {
        const { title, slug, description } = serviceData;
        const [result] = await db.execute(
            "UPDATE services SET title = ?, slug = ?, description = ? WHERE id = ?",
            [title, slug, description, id]
        );
        return result;
    },

    // Thêm dịch vụ mới vào cơ sở dữ liệu
    addService: async (serviceData) => {
        try {
            const { title, slug, description } = serviceData;
            const [result] = await db.execute(
                "INSERT INTO services (title, slug, description, created_at) VALUES (?, ?, ?, NOW())",
                [title, slug, description]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    getServiceBySlug: async (slug) => {
        try {
            const [rows] = await db.execute("SELECT * FROM services WHERE slug = ?", [slug]);
            return rows[0]; // Trả về một object dịch vụ duy nhất
        } catch (error) {
            console.error("Lỗi lấy dịch vụ theo slug:", error);
            return null;
        }
    },

    // Xóa dịch vụ
    deleteService: async (id) => {
        const [result] = await db.execute("DELETE FROM services WHERE id = ?", [id]);
        return result;
    }
};


module.exports = ServiceModel;

