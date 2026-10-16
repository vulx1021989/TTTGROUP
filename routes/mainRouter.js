const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Thêm thư viện quản lý file hệ thống

const serviceModel = require('../models/serviceModel');

// 1. Import các Controllers và Routers
const adminRouter = require('./admin');
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');
const careerController = require('../controllers/careerController'); // Controller Tuyển dụng
// Import controller hiện tại của bạn (ví dụ: requestController hoặc contactController)
const requestController = require('../controllers/requestController');

const loadGlobalData = require('../middlewares/menuMiddleware');
router.use(loadGlobalData);

// Kiểm tra và tự động tạo thư mục lưu trữ CV nếu chưa tồn tại (Tránh lỗi ENOENT)
const uploadDir = path.join(__dirname, '../public/uploads/cv');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer lưu file CV tải lên
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'cv-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 2. Route Trang Chủ (hỗ trợ cả /, /home, /index)
router.get(['/', '/trang-chu', '/index', '/home.html', '/index.html'], (req, res) => {
    res.render('pages/trang-chu', { title: 'Trang Chủ - Tập đoàn TTT' });
});

// 3. Route Đăng Nhập
router.get('/login', authController.getLoginPage);
router.post('/login', authController.postLogin);

// 4. Gắn adminRouter vào tiền tố /admin
router.use('/admin', adminRouter);

// Chặn/bỏ qua yêu cầu lấy favicon.ico
router.get('/favicon.ico', (req, res) => res.status(204).end());

router.get('/logout', (req, res) => {
    res.redirect('/login'); 
});

// 5. ROUTE TUYỂN DỤNG (CAREERS) - Sử dụng careerController
router.get(['/tuyen-dung', '/careers.html', '/careers'], careerController.getCareersPage);
router.post('/careers/apply', upload.single('cv_file'), careerController.submitApplication);

// Đảm bảo route này tồn tại để nhận fetch POST từ các trang dịch vụ
router.post('/contact/send', requestController.submitRequest || requestController.submitContact);

// 6. Route cho các dịch vụ con
router.get('/dich-vu/:slug', async (req, res) => {
    try {
        const serviceSlug = req.params.slug;
        const service = await serviceModel.getServiceBySlug(serviceSlug);
        
        if (!service) {
            return res.status(404).send("Không tìm thấy dịch vụ!");
        }

        const viewName = service.file_path || serviceSlug;

        res.render(`pages/services/${viewName}`, {
            title: service.title,
            service: service
        });
    } catch (error) {
        console.error("Lỗi hiển thị chi tiết dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
});

// Route Liên hệ
router.get('/contact', contactController.getContactPage);
router.post('/contact', contactController.submitContact);

// 7. Route động cho các trang chung dạng slug ngắn (ĐẶT Ở CUỐI)
router.get('/:page', (req, res) => {
    let pageName = req.params.page.replace('.html', '');
    
    if (pageName === 'services' || pageName === 'assets' || pageName === 'components' || pageName === 'admin' 
         || pageName === 'login' || pageName === 'ico' || pageName === 'careers') return;

    res.render(`pages/${pageName}`, { title: 'Tập đoàn TTT' });
});

module.exports = router;