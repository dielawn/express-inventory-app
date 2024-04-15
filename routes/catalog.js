const express = require('express');
const router = express.Router();

const tire_controller = require('../controllers/tireController');
const mfr_controller = require('../controllers/manufacturerController');
const tire_instance_controller = require('../controllers/tireInstanceController');
const catagory_controller = require('../controllers/categoryController');

//Tire Routes

//GET home page
router.get('/', tire_controller.index);



