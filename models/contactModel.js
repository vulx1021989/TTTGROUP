const db = require('../config/db');

const ContactModel = {
    getAllContacts: async () => {
        try {
            await db.query("SET NAMES 'utf8mb4'"); // Đảm bảo hiển thị chuẩn tiếng Việt

            const [rows] = await db.execute(`
                SELECT contacts.*, services.title AS service_name 
                FROM contacts 
                LEFT JOIN services ON contacts.service_id = services.id 
                ORDER BY contacts.id DESC
            `);

            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Thêm hàm này để lưu thông tin liên hệ mới từ khách hàng
    createContact: async (contactData) => {
        try {
            await db.query("SET NAMES 'utf8mb4'");
            const { name, company, service_id, phone, email, message } = contactData;

            console.log(contactData);
            
            const [result] = await db.execute(
                `INSERT INTO contacts (full_name, company, service_id, phone, email, message, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
                [
                    name || null, 
                    company || null, 
                    service_id || null, 
                    phone || null, 
                    email || null, 
                    message || null
                ]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    updateContactStatus: async (id, status) => {
        try {
            await db.query("SET NAMES 'utf8mb4'");
            const [result] = await db.execute(
                'UPDATE contacts SET status = ? WHERE id = ?',
                [status, id]
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAllContacts: async (filters = {}) => {
        try {
            await db.query("SET NAMES 'utf8mb4'");
            let query = `
                SELECT c.*, s.title AS service_name 
                FROM contacts c 
                LEFT JOIN services s ON c.service_id = s.id 
                WHERE 1=1
            `;
            let queryParams = [];

            // Xử lý tìm kiếm theo từ khóa (Tên, Công ty, Số điện thoại)
            if (filters.search) {
                query += ` AND (c.full_name LIKE ? OR c.company LIKE ? OR c.phone LIKE ?)`;
                const keyword = `%${filters.search}%`;
                queryParams.push(keyword, keyword, keyword);
            }

            // Xử lý lọc theo trạng thái
            if (filters.status) {
                query += ` AND c.status = ?`;
                queryParams.push(filters.status);
            }

            // Xử lý lọc theo dịch vụ
            if (filters.service_id) {
                query += ` AND c.service_id = ?`;
                queryParams.push(filters.service_id);
            }

            query += ` ORDER BY c.created_at DESC`;

            const [rows] = await db.execute(query, queryParams);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    deleteContact: async (id) => {
        try {
            await db.query("SET NAMES 'utf8mb4'");
            const [result] = await db.execute('DELETE FROM contacts WHERE id = ?', [id]);
            return result;
        } catch (error) {
            throw error;
        }
    }

};

module.exports = ContactModel;