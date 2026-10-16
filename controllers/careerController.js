const CareerModel = require('../models/careerModel');
const db = require('../config/db'); // Thêm dòng này để kết nối database trực tiếp

const careerController = {

    // 1. Lấy danh sách việc làm và trả về trang tuyển dụng
    getCareersPage: async (req, res) => {
        try {
            // Lấy danh sách tin tuyển dụng từ database
            const careers = await CareerModel.getAllCareers();
            
            // Lọc các tin đang mở (nếu có trường status) hoặc lấy tất cả
            const jobs = careers ? careers.filter(item => !item.status || item.status === 'active') : [];

            // Render ra trang tuyen-dung.ejs (hoặc careers.ejs)
            res.render('pages/tuyen-dung', {
                title: 'Tuyển Dụng - TTT Technology',
                jobs: jobs,
                seo: {
                    title: 'Tuyển Dụng | Cơ Hội Nghề Nghiệp Tại TTT Group',
                    description: 'Gia nhập đội ngũ TTT Group để phát triển sự nghiệp trong lĩnh vực hạ tầng kỹ thuật, tổng thầu EPC và môi trường với chế độ đãi ngộ hấp dẫn.',
                    keywords: 'tuyển dụng ttt group, việc làm hạ tầng môi trường, tuyển kỹ sư ttt',
                    canonical: 'https://tttgroup.com/tuyen-dung'
                }
            });
        } catch (error) {
            console.error('Lỗi khi tải trang tuyển dụng:', error);
            res.render('pages/tuyen-dung', {
                title: 'Tuyển Dụng - TTT Technology',
                jobs: []
            });
        }
    },
    // 1. Hiển thị danh sách tuyển dụng trong Admin
    getAllCareers: async (req, res) => {
        try {
            const careers = await CareerModel.getAllCareers();
            res.render('pages/admin/careers', {
                title: 'Quản Lý Tuyển Dụng - Admin Panel',
                careers: careers || [],
                currentRoute: '/admin/careers'
            });
        } catch (err) {
            console.error('Lỗi khi lấy danh sách tuyển dụng:', err);
            res.status(500).send('Lỗi máy chủ nội bộ');
        }
    },

    // 2. Thêm vị trí tuyển dụng mới
    addCareer: async (req, res) => {
        try {
            await CareerModel.addCareer(req.body);
            res.redirect('/admin/careers');
        } catch (err) {
            console.error('Lỗi khi thêm tin tuyển dụng:', err);
            res.status(500).send('Lỗi thêm dữ liệu');
        }
    },

    // 3. Lấy thông tin chỉnh sửa tin tuyển dụng
    getEditCareerPage: async (req, res) => {
        try {
            const results = await CareerModel.getCareerById(req.params.id);
            if (!results || results.length === 0) {
                return res.status(404).send('Không tìm thấy bài tuyển dụng');
            }
            res.render('admin/careers-edit', {
                title: 'Chỉnh Sửa Tin Tuyển Dụng',
                career: results[0]
            });
        } catch (err) {
            console.error('Lỗi khi lấy thông tin tuyển dụng:', err);
            res.status(500).send('Lỗi máy chủ');
        }
    },

    // 4. Cập nhật tin tuyển dụng
    updateCareer: async (req, res) => {
        try {
            await CareerModel.updateCareer(req.params.id, req.body);
            res.redirect('/admin/careers');
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err);
            res.status(500).send('Lỗi cập nhật dữ liệu');
        }
    },

    // 5. Xóa tin tuyển dụng (Sửa lại redirect đúng URL)
    deleteCareer: async (req, res) => {
        try {
            await CareerModel.deleteCareer(req.params.id);
            res.redirect('/admin/careers');
        } catch (err) {
            console.error('Lỗi khi xóa:', err);
            res.status(500).send('Lỗi xóa dữ liệu');
        }
    },

    // 6. Hiển thị danh sách các hồ sơ ứng tuyển trong trang Admin
    getApplications: async (req, res) => {
        try {
            const applications = await CareerModel.getAllApplications();
            const pendingCount = applications.filter(app => app.status === 'pending').length;

            res.render('pages/admin/applications', {
                title: 'Danh Sách Hồ Sơ Ứng Tuyển',
                applications: applications || [],
                jobApplicationTotal: pendingCount,
                currentRoute: '/admin/applications'
            });
        } catch (err) {
            console.error('Lỗi khi lấy danh sách ứng tuyển:', err);
            res.status(500).send('Lỗi máy chủ');
        }
    },

    // Xử lý nhận hồ sơ ứng tuyển từ website khách hàng (POST /careers/apply)
    submitApplication: async (req, res) => {
        try {
            // Hứng đúng tên trường do form gửi lên (name và message)
            const { name, phone, email, position, message } = req.body;
            
            const full_name = name;
            const cover_letter = message;
            const cv_file_path = req.file ? `/uploads/cv/${req.file.filename}` : '';
            const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            // Kiểm tra các trường bắt buộc
            if (!full_name || !phone || !email || !position) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ các thông tin bắt buộc!' });
            }

            const sql = `
                INSERT INTO job_applications (full_name, phone, email, position, cv_file_path, cover_letter, ip_address)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            await db.query(sql, [full_name, phone, email, position, cv_file_path, cover_letter, ip_address]);

            // Bắn Socket.io cập nhật số lượng badge real-time cho admin
            const io = req.app.get('io');
            if (io) {
                const applications = await CareerModel.getAllApplications();
                const pendingCount = applications.filter(app => app.status === 'pending').length;
                io.emit('updateJobApplicationTotal', pendingCount);
            }

            res.json({ success: true, message: 'Nộp hồ sơ ứng tuyển thành công! Bộ phận tuyển dụng sẽ liên hệ lại với bạn sớm.' });
        } catch (err) {
            console.error('Lỗi khi lưu hồ sơ ứng tuyển:', err);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi máy chủ, vui lòng thử lại sau.' });
        }
    },
    deleteApplication: async (req, res) => {
        try {
            const { id } = req.params;
            await CareerModel.deleteApplication(id);

            // Phát tín hiệu Socket.io cập nhật badge số lượng hồ sơ real-time
            const io = req.app.get('io');
            if (io) {
                const applications = await CareerModel.getAllApplications();
                const pendingCount = applications ? applications.filter(app => app.status === 'pending').length : 0;
                io.emit('updateJobApplicationTotal', pendingCount);
            }

            res.redirect('/admin/careers/applications'); // Chuyển hướng về lại danh sách hồ sơ
        } catch (err) {
            console.error('Lỗi khi xóa hồ sơ ứng tuyển:', err);
            res.status(500).send('Lỗi máy chủ khi xóa hồ sơ');
        }
    }
};

module.exports = careerController;