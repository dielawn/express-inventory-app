const express = require('express');
const router = express.Router();

const tire_controller = require('../controllers/tireController');
const tire_instance_controller = require('../controllers/tireInstanceController');
const mfr_controller = require('../controllers/manufacturerController');
const category_controller = require('../controllers/categoryController');
const tire_size_controller = require('../models/tire_size');



//GET home page
router.get('/', tire_controller.index);

// TIRE ROUTES //

//GET create
router.get('/tire/create', tire_controller.tire_create_get);
//POST create
router.get('/tire/create', tire_controller.tire_create_post);

//GET read list
router.get('/tires', tire_controller.tire_list);
//GET read detail
router.get('/tire/:id', tire_controller.tire_detail);

//GET update
router.get('/tire/:id/update', tire_controller.tire_update_get);
//POST update
router.get('/tire/:id/update', tire_controller.tire_update_post);

//GET delete
router.get('/tire/:id/delete', tire_controller.tire_delete_get)
//POST delete
router.get('/tire/:id/delete', tire_controller.tire_delete_post)


// TIRE INSTANCE ROUTES //

//GET create
router.get('/tireinstance/create', tire_instance_controller.tire_instance_create_get);
//POST create
router.get('/tireinstance/create', tire_instance_controller.tire_instance_create_post);

//GET read list
router.get('/tireinstances/', tire_instance_controller.tire_instance_list);
//GET read detail
router.get('/tireinstance/:id', tire_instance_controller.tire_instance_detail);

//GET update
router.get('/tireinstance/:id/update', tire_instance_controller.tire_instance_update_get);
//POST update
router.get('/tireinstance/:id/update', tire_instance_controller.tire_instance_update_post);

//GET delete
router.get('/tireinstance/:id/delete', tire_instance_controller.tire_instance_delete_get);
//POST delete
router.get('/tireinstance/:id/delete', tire_instance_controller.tire_instance_delete_post);



// MANUFACTURER ROUTES //

//GET create
router.get('/manufacturer/create', mfr_controller.mfr_create_get);
//POST create
router.get('/manufacturer/create', mfr_controller.mfr_create_post);

//GET read list
router.get('/manufacturers/', mfr_controller.mfr_list);
//GET read detail
router.get('/manufacturer/:id', mfr_controller.mfr_detail);

//GET update
router.get('/manufacturer/:id/update', mfr_controller.mfr_update_get);
//POST update
router.get('/manufacturer/:id/update', mfr_controller.mfr_update_post);

//GET delete
router.get('/manufacturer/:id/delete', mfr_controller.mfr_delete_get);
//POST delete
router.get('/manufacturer/:id/delete', mfr_controller.mfr_delete_post);



// CATEGORY ROUTES //

//GET create
router.get('/category/create', category_controller.category_create_get);
//POST create
router.get('/category/create', category_controller.category_create_post);

//GET read list
router.get('/categories', category_controller.category_list);
//GET read detail
router.get('/category/:id', category_controller.category_detail);

//GET update
router.get('/cateory/:id/update', category_controller.category_update_get);
//POST update
router.get('/category/:id/update', category_controller.category_update_post);

//GET delete
router.get('/category/:id/delete', category_controller.category_delete_get);
//POST delete
router.get('/category/:id/delete', category_controller.category_delete_post);



// SIZE ROUTES //

//GET create
router.get('/size/create', tire_size_controller.size_create_get);
//POST create
router.get('/size/create', category_controller.size_create_post);

//GET read list
router.get('/sizes', category_controller.size_list);
//POST read detail
router.get('/size/:id', category_controller.size_detail);

//GET update
router.get('/size/:id/update', category_controller.size_update_get);
//POST update
router.get('/size/:id/update', category_controller.size_update_post);

//GET delete
router.get('/size/:id/delete', category_controller.size_delete_get);
//POST delete
router.get('/size/:id/delete', category_controller.size_delete_post);