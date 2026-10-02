const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController'); // Import controller mới
const settingController = require('../controllers/settingController');
const contactController = require('../controllers/contactController');
const serviceController = require('../controllers/serviceController');

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

module.exports = router;