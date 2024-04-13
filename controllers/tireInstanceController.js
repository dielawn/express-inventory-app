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

   try {
    const allTires = await Tire.find().sort({ model_name: 1}).exec();

    if (!allTires.length) {
        return res.render('tire_instance_form', {
            title: 'Create Tire Instance',
            tire_list: allTires,
            error: `No tires available, create tire before creating instance`
        });
    }  

    res.render('tire_instance_form', {
        title: 'Create Tire Instance',
        tire_list: allTires,
    });

   } catch (error) {
    return next(error)
   }
});
    
//handle TireInstance create on POST
exports.tire_instance_post = [
    body('tire', 'Tire must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('dot')
        .trim()
        .isLength({ min: 8, max: 13 })
        .matches(/^[0-9A-Za-z]+$/) //alphanumeric characters
        .escape(),
    body('date_code')
        .trim()
        .isLength({ min: 4, max: 4 })
        .matches(/^\d+$/) //numbers only
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        //create tire instance obj from val/san data
        const tireInstance = new TireInstance({
            tire: req.body.tire,
            dot: req.body.dot,
            date_code: req.body.date_code,
        });

        if (!errors.isEmpty()) {
            //yes errors
            const allTires = await Tire.find().sort({ model_name: 1}).exec();
                res.render('tire_instance_form', {
                    title: 'Create Tire Instance',
                    tire_list: allTires,
                    tireInstance: tireInstance,
                    error: errors.array(),
                });
        } else {
           try {
             //no errors
             await tireInstance.save()
            //increment tire.stock
            await Tire.findByIdAndUpdate(tireInstance.tire, { $inc: {stock: 1}})  
             res.redirect(tireInstance.url);
           } catch (dbError) {
            const allTires = await Tire.find().sort({ model_name: 1}).exec();
                res.render('tire_instance_form', {
                    title: 'Create Tire Instance',
                    tire_list: allTires,
                    tireInstance: tireInstance,
                    error: `Failed to create tire instance due to database error: ${dbError}`,
            });
           }
        }
    }),
];
    
//display TireInstance delete form on GET

//handle TireInstance delete on POST
    //--tire.stock
//display TireInstance update form on GET

//handle TireInstance update on POST