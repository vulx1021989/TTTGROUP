const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController'); // Import controller mới
const settingController = require('../controllers/settingController');
const contactController = require('../controllers/contactController');
const serviceController = require('../controllers/serviceController');
const careerController = require('../controllers/careerController'); // Import controller tuyển dụng (nếu có)
const RequestController = require('../controllers/requestController');

const verifyToken = require('../middlewares/authMiddleware');
router.use(verifyToken);

// Các route trang quản trị
router.get('/users', adminController.getUsersPage);
router.post('/users/add', userController.addUser);
router.get('/users/edit/:id', userController.getEditUserForm);
router.post('/users/update/:id', userController.updateUser);
router.get('/users/delete/:id', userController.deleteUser);

// settings
router.get('/settings', adminController.getSettingsPage);
router.get('/admin/settings', settingController.getSettingsPage);
router.post('/settings/update', settingController.updateSetting);

// Contact
router.get('/contacts', contactController.getAdminContactsPage);
router.post('/contacts/update-status/:id', contactController.updateStatus);
router.get('/contacts/delete/:id', contactController.deleteContact);

// service
router.get('/services', serviceController.getAllServices); 
router.get('/services/edit/:id', serviceController.getEditServicePage);
router.post('/services/edit/:id', serviceController.updateService);
router.get('/services/delete/:id', serviceController.deleteService);
router.post('/services/add', serviceController.addService);

// Careers (Quản lý Tuyển dụng & Hồ sơ ứng tuyển)
router.get('/careers', careerController.getAllCareers);
router.post('/careers/add', careerController.addCareer);
router.get('/careers/edit/:id', careerController.getEditCareerPage);
router.post('/careers/edit/:id', careerController.updateCareer);
router.get('/careers/delete/:id', careerController.deleteCareer);
router.get('/careers/applications', careerController.getApplications); // Xem danh sách CV ứng tuyển

// Route xóa hồ sơ ứng tuyển
router.get('/careers/applications/delete/:id', careerController.deleteApplication);
// Hoặc nếu bạn dùng router.post:

// Quản lý yêu cầu khảo sát & báo giá
router.get('/requests', RequestController.renderRequestsList);
router.post('/requests/:id/status', RequestController.updateStatus);
router.delete('/requests/:id', RequestController.deleteRequest);

module.exports = router;