const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const serviceModel = require('../models/serviceModel');

// 1. Import các Controllers và Routers
const adminRouter = require('./admin');
const authController = require('../controllers/authController');
const contactController = require('../controllers/contactController');
const careerController = require('../controllers/careerController');
const requestController = require('../controllers/requestController');

const loadGlobalData = require('../middlewares/menuMiddleware');
router.use(loadGlobalData);

// Kiểm tra và tự động tạo thư mục lưu trữ CV nếu chưa tồn tại
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

// 2. Route Trang Chủ - Tích hợp SEO Object
router.get(['/', '/trang-chu', '/index', '/home.html', '/index.html'], (req, res) => {
    res.render('pages/trang-chu', { 
        title: 'Trang Chủ - Tập đoàn TTT',
        seo: {
            title: 'Trang Chủ | TTT Group - Tổng Thầu EPC & Hạ Tầng Môi Trường',
            description: 'Tập đoàn TTT (TTT Technology) - Đơn vị uy tín hàng đầu trong lĩnh vực Hạ Tầng Kỹ Thuật, Giao Thông, Hệ Thống Nước và Công Nghệ Môi Trường tại Việt Nam.',
            keywords: 'TTT Group, tổng thầu EPC, hạ tầng môi trường, xử lý nước thải, vận hành O&M',
            canonical: 'https://tttgroup.com/',
            ogImage: 'https://tttgroup.com/images/slide/banner-nhan-su-TTT.png'
        }
    });
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

// 5. ROUTE TUYỂN DỤNG (CAREERS)
router.get(['/tuyen-dung', '/careers.html', '/careers'], careerController.getCareersPage);
router.post('/careers/apply', upload.single('cv_file'), careerController.submitApplication);

// Route nhận fetch POST từ các form dịch vụ
router.post('/contact/send', requestController.submitRequest || requestController.submitContact);

// 6. Route cho các dịch vụ con động (Lấy SEO từ Database hoặc tự động tạo theo Service)
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
            service: service,
            seo: {
                title: service.seo_title || `${service.title} | TTT Group`,
                description: service.seo_desc || service.description || 'Dịch vụ hạ tầng kỹ thuật và môi trường chuyên nghiệp từ TTT Group.',
                keywords: service.seo_keywords || 'TTT Group, dịch vụ hạ tầng, xử lý nước thải, O&M',
                canonical: `https://tttgroup.com/dich-vu/${serviceSlug}`,
                ogImage: service.image || 'https://tttgroup.com/images/logo-ttt.png',
                customCss: service.css_file || ''
            }
        });
    } catch (error) {
        console.error("Lỗi hiển thị chi tiết dịch vụ:", error);
        res.status(500).send("Lỗi Server");
    }
});

// Route Liên hệ
router.get('/contact', contactController.getContactPage);
router.post('/contact', contactController.submitContact);

// 7. Route động cho các trang chung dạng slug ngắn (ĐẶT Ở CUỐI) - Tích hợp SEO linh hoạt theo từng trang
router.get('/:page', (req, res) => {
    let pageName = req.params.page.replace('.html', '');
    
    if (pageName === 'services' || pageName === 'assets' || pageName === 'components' || pageName === 'admin' 
         || pageName === 'login' || pageName === 'ico' || pageName === 'careers') return;

    // Cấu hình SEO mặc định hoặc phân tách theo từng trang cụ thể
    let seoData = {
        title: 'Tập Đoàn TTT - Hạ Tầng & Môi Trường',
        description: 'Đơn vị tổng thầu EPC, hạ tầng kỹ thuật và xử lý nước thải uy tín tại Việt Nam.',
        keywords: 'TTT Group, hạ tầng môi trường, EPC',
        canonical: `https://tttgroup.com/${pageName}`
    };

    if (pageName === 've-chung-toi') {
        seoData = {
            title: 'Về Chúng Tôi | TTT Group - Tổng Thầu EPC & Hạ Tầng Môi Trường',
            description: 'Tìm hiểu về TTT Group - Tầm nhìn, sứ mệnh, giá trị cốt lõi và đội ngũ lãnh đạo giàu kinh nghiệm trong lĩnh vực hạ tầng & môi trường.',
            keywords: 'về chúng tôi ttt group, lịch sử phát triển ttt, ban lãnh đạo ttt technology',
            canonical: 'https://tttgroup.com/ve-chung-toi',
            customCss: 'about-us.css'
        };
    } else if (pageName === 'lien-he') {
        seoData = {
            title: 'Liên Hệ | TTT Group - Tư Vấn Dự Án Hạ Tầng & Môi Trường',
            description: 'Liên hệ ngay với TTT Group để được tư vấn các giải pháp kỹ thuật, tổng thầu EPC và dịch vụ vận hành bảo trì (O&M) chuyên nghiệp.',
            keywords: 'liên hệ ttt group, địa chỉ ttt technology, tư vấn dự án hạ tầng',
            canonical: 'https://tttgroup.com/lien-he'
        };
    }

    res.render(`pages/${pageName}`, { 
        title: seoData.title,
        seo: seoData 
    });
});

module.exports = router;