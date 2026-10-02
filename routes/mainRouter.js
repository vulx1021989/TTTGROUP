const express = require('express');
const router = express.Router();

const serviceModel = require('../models/serviceModel');

// 1. Import các router con và controller
const adminRouter = require('./admin');
const authController = require('../controllers/authController'); // Đảm bảo đường dẫn đúng tới thư mục controllers
const contactController = require('../controllers/contactController');

// 2. Route cho Trang Chủ (hỗ trợ cả /, /home, /index)
router.get(['/', '/home', '/index', '/home.html', '/index.html'], (req, res) => {
    res.render('pages/home', { title: 'Trang Chủ - Tập đoàn TTT' });
});

// 3. Route Đăng Nhập (GET hiển thị form & POST xử lý đăng nhập)
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);

// 4. Gắn adminRouter vào tiền tố /admin (ĐẶT TRƯỚC route /:page)
router.use('/admin', adminRouter);

// Chặn/bỏ qua yêu cầu lấy favicon.ico để không bị lỗi render
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/logout', (req, res) => {
    res.redirect('/login'); 
});

// 5. Route cho các dịch vụ con
// Route xử lý động cho tất cả các dịch vụ
router.get('/dich-vu/:slug', async (req, res) => {
    try {
        // Lấy trực tiếp slug ngắn gọn từ URL (ví dụ: cho-thue-bao-tri-he-thong-may-lanh)
        const serviceSlug = req.params.slug;
        
        // Truy vấn database theo slug ngắn gọn
        const service = await serviceModel.getServiceBySlug(serviceSlug);
        
        if (!service) {
            return res.status(404).send("Không tìm thấy dịch vụ!");
        }

        // service.file_path trong CSDL sẽ lưu tên file view (ví dụ: aircon, lighting,...)
        const viewName = service.file_path || serviceSlug;

        res.render(`pages/services/${viewName}`, {
            title: service.title,
            service: service // Truyền dữ liệu dịch vụ sang trang EJS
        });
    } catch (error) {
        console.error("Lỗi hiển thị chi tiết dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
});

// Khi người dùng bấm vào trang liên hệ (GET /contact), hàm getContactPage sẽ chạy và lấy dịch vụ đổ ra view
router.get('/contact', contactController.getContactPage);
router.post('/contact', contactController.submitContact);

// 6. Route cho các trang chung dạng slug ngắn gọn (ĐẶT Ở CUỐI)
router.get('/:page', (req, res) => {
    let pageName = req.params.page.replace('.html', '');
    
    // Thêm 'login' vào danh sách bỏ qua để ưu tiên dùng authController ở trên
    if (pageName === 'services' || pageName === 'assets' || pageName === 'components' || pageName === 'admin' 
         || pageName === 'login' || pageName === 'ico') return;

    res.render(`pages/${pageName}`, { title: 'Tập đoàn TTT' });
});


module.exports = router;