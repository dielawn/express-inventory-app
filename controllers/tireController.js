const Tire = require('../models/tire.js');
const TireInstance = require('../models/tireInstance.js');
const Manufacturer = require('../models/manufacturer.js');
const Category = require('../models/category.js');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
const manufacturer = require('../models/manufacturer.js');
const category = require('../models/category.js');


//display list of all tires
exports.tire_list = asyncHandler(async (req,res, next) => {
    const allTires = await Tire.find().sort({ tire_name: 1 }).exec();
    res.render('tire_list', {
        title: 'Tires',
        tire_list: allTires,
    });
});

//display details page for each tire
exports.tire_detail = asyncHandler(async (req, res, next) => {
    
    const [tire, tireInstances] = await Promise.all([
        Tire.find().sort({ tire_name_rating: 1 }).exec(),
        TireInstance.find().sort({ tire: req.params.id }).exec()
    ]);

    res.render('tire_detail', {
        title: 'Tire Instances',
        tire: tire,
        tire_instances: tireInstances,
    });
});

//display create new tire form on GET
exports.tire_create_get = asyncHandler(async (req, res, next) => {
    
    const [manufacturer, category] = await Promise.all([
        Manufacturer.findById(req.params.id).exec(),
        Category.findById(req.params.id).exec()
    ]);

    res.render('tire_form', {
        title: 'New Tire Form',
        manufacturer: manufacturer,
        category: category,
    })
})


//handle tire create on POST
exports.tire_create_post = [
    //san & val
    body('manufacturer', 'Manufacturer must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('model_name', 'Tire model must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('size', '7 digits Tire Size is required, no "/".')
        .trim()
        .isLength({ min: 7, max: 7 })
        .escape(),
    body('info', 'Tire information must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('sku', 'SKU must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('category', 'Tire speed or load rating must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('stock', 'Stock must not be empty')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('cost_price', 'Cost must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('list_price', 'List must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        //create tire object with escaped and trimmed data
        const tire = new Tire({           
            manufacturer: req.body.manufacturer,
            model_name: req.body.model_name,
            size: req.body.size,
            info: req.body.info,
            sku: req.body.sku,
            category: req.body.category,
            stock: req.body.stock,
            cost_price: req.body.cost_price,
            list_price: req.body.list_price,    
        });

        if (!errors.isEmpty()) {
            //there are errors
            res.render('tire_form', {
                title: 'New Tire Form',
                manufacturer: allManufacturers,
                category: allCategories,
            });        
        
            const [manufacturer, categories] = await Promise.all([
                Manufacturer.findById(req.params.id).exec(),
                Category.findById(req.params.id).exec()
            ]);

            res.render('tire_form', {
                title: 'New Tire Form',
                manufacturer: manufacturer,
                category: categories,
                tire: tire,
                errors: errors.array(),
            });
        } else {
            //form data is valid
            await tire.save()
            res.rediirect(tire.url);
        }
    }),
];

//display tire delete form on GET

//handle tire delete on POST

//display tire update form on GET

//handle tire update on POST