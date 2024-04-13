const TireInstance = require('../models/tireinstance.js');
const Tire = require('../models/tire.js');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

//display list of all tire inventory
exports.tire_instance_list = asyncHandler(async (req, res, next) => {

    const allTireInstances = await TireInstance.find()
        .populate({ path: 'tire', populate: { path: 'manufacturer category' }})
        .sort({ dot: -1 })
        .exec();

    res.render('tire_instance_list', {
        title: 'Complete Inventory',
        tire_instances: allTireInstances
    });
});


//display details page for each TireInstance
exports.tire_instance_detail = asyncHandler(async (req, res, next) => {
    
    const tireInstance = await TireInstance.findById(req.params.id)                            
        .populate({ path: 'tire', populate: { path: 'manufacturer category' }});

    if (tireInstance === null) {
        const error = new Error(`Tire instance with ID: ${req.params.id} not found.`);
        error.status = 404
        return next(error);
    }                  

    res.render('tire_instance_detail', {
        title:  `Tire: ${tireInstance.tire ? tireInstance.tire.model_name : 'Unknown'}`,
        tireInstance: tireInstance,        
    });
});

//display create new TireInstance form on GET
exports.tire_instance_get = asyncHandler(async (req, res, next) => {

    const allTires = await Tire.find().sort({ model_name: 1}).exec();

    res.render('tire_instance_form', {
        title: 'Create Tire Instance',
        tire_list: allTires,
    });
});
    
//handle TireInstance create on POST
    //++tire.stock  
//display TireInstance delete form on GET

//handle TireInstance delete on POST
    //--tire.stock
//display TireInstance update form on GET

//handle TireInstance update on POST