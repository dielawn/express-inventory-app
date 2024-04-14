const Tire = require('../models/tire.js');
const TireInstance = require('../models/tireInstance.js');
const Manufacturer = require('../models/manufacturer.js');
const Category = require('../models/category.js');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');


//display list of all tire models
exports.tire_list = asyncHandler(async (req,res, next) => {
    const allTires = await Tire.find().sort({ model_name: 1 }).exec();
    res.render('tire_list', {
        title: 'All Tires',
        tire_list: allTires,
    });
});

//display details page for each tire
exports.tire_detail = asyncHandler(async (req, res, next) => {
    
    const [tire, tireInstances] = await Promise.all([
        Tire.findById(req.params.id).populate('manufacturer').populate('category').exec(),
        TireInstance.find().sort({ tire: req.params.id }).exec()
    ]);

    res.render('tire_detail', {
        title: 'Tire Details',
        tire: tire,
        tire_instances: tireInstances,
    });
});

//display create new tire form on GET
exports.tire_create_get = asyncHandler(async (req, res, next) => {
    
    const [manufacturer, category] = await Promise.all([
        Manufacturer.find({}).exec(),
        Category.find({}).exec()
    ]);

    res.render('tire_form', {
        title: 'New Tire Form',
        manufacturer: manufacturer,
        category: category,
    });
});


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
            const [manufacturer, categories] = await Promise.all([
                Manufacturer.find().exec(),
                Category.find().exec()
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
            res.redirect(tire.url);
        }
    }),
];

//display tire delete form on GET
exports.tire_delete_get = asyncHandler(async (req,res, next) => {
    //get details of tire
    const [tire, tireInstances] = await Promise.all([
        Tire.findById(req.params.id).exec(),
        TireInstance.find({ tire: req.params.id }).exec(),
    ]);

    if (!tire) {
        //nothing to delete
        res.redirect('/catalog/tires')
        return;
    }

    res.render('tire_delete', {
        title: 'Delete Tire',
        tire: tire,
        tire_instances: tireInstances,
    });
});

//handle tire delete on POST
exports.tire_delete_post = asyncHandler(async (req, res, next) => {

    const [tire, tireInstances] = await Promise.all([
        Tire.findById(req.params.id).exec(),
        TireInstance.find({ tire: req.params.id }).exec(),
    ]); 

    if (tireInstances.length > 0) {
        res.render('tire_delete', {
            title: 'Delete Tire',
            tire: tire,
            tire_instances: tireInstances,
            error: 'Cannot delete tire, delete tire instances first.'
        });
        return
    } else {
        await Tire.findByIdAndDelete(req.params.id);
        res.redirect('/catalog/tires')
    }

});

//display tire update form on GET
exports.tire_update_get = asyncHandler(async (req, res, next) => {

    const [tire, allManufacturers, allCategories] = await Promise.all([
        Tire.findById(req.params.id).populate('manufacturer').populate('catagory').exec(),
        Manufacturer.find().sort({ company: 1 }).exec(),
        Category.find().sort({ load_speed_rating: 1 }).exec()
    ]);

    if (tire === null) {
        //no results
        const error = encodeURIComponent(`Book: "${tire.model_name}" not found`);
        return res.redirect(`/catalog/tires?error=${error}`)
    }

    allCategories.forEach((category) => {
        if (tire.category.equals(category._id)) category.checked = 'true';
    });

    res.render('tire_form', {
        title: 'Update Tire Form',
                manufacturer: allManufacturers,
                category: allCategories,
                tire: tire,
    });
});

//handle tire update on POST
exports.tire_update_post = [
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
            _id: req.params.id,
        });
        if (!errors.isEmpty()) {

            //there are errors      
            const [manufacturer, categories] = await Promise.all([
                Manufacturer.find().exec(),
                Category.find().exec()
            ]);

            res.render('tire_form', {
                title: 'Update Tire',
                manufacturer: manufacturer,
                category: categories,
                tire: tire,
                errors: errors.array(),
            });
        } else {
            //update the tire using the data from the form
            const updatedTire = await Tire.findByIdAndUpdate(req.params.id, {
                manufacturer: req.body.manufacturer,
                model_name: req.body.model_name,
                size: req.body.size,
                info: req.body.info,
                sku: req.body.sku,
                category: req.body.category,
                stock: req.body.stock,
                cost_price: req.body.cost_price,
                list_price: req.body.list_price
            }, { new: true });
        
            res.redirect(updatedTire.url);
        }
    }),
];