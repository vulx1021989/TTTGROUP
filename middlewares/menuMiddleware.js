const serviceModel = require('../models/serviceModel');

const loadServicesMenu = async (req, res, next) => {
    try {
        const services = await serviceModel.getAllServices();
        res.locals.services = services;
        next();
    } catch (error) {
        console.error("Lỗi load menu dịch vụ:", error);
        res.locals.services = [];
        next();
    }
};

module.exports = loadServicesMenu;