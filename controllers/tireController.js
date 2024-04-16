const Tire = require('../models/tire.js');
const TireInstance = require('../models/tireInstance.js');
const Manufacturer = require('../models/manufacturer.js');
const Category = require('../models/category.js');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');


//display details of tires, tire instances, mfg, and categories
exports.index = asyncHandler(async (req, res, next) => {
    const [
        numTires,
        numTireInstances,
        numMfr,
        numCat,
    ] = await Promise.all([
        Tire.countDocuments({}).exec(),
        TireInstance.countDocuments({}).exec(),
        Manufacturer.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
    ]);

    res.render('index', {
        title: 'Tire Inventory',
        tire_count: numTires,
        instance_count: numTireInstances,
        mfr_count: numMfr,
        category_count: numCat,
    });
});


//display list of all tire models
exports.tire_list = asyncHandler(async (req,res, next) => {
    try {
        const allTires = await Tire.find().sort({ model_name: 1 }).exec();
        res.render('tire_list', {
            title: 'All Tires',
            tire_list: allTires,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database read list Error: ${dbError.message}.`)
        return res.redirect(`/catalog/tire?error=${error}`);
    }
});

//display details page for each tire
exports.tire_detail = asyncHandler(async (req, res, next) => {
    try {
        const [tire, tireInstances] = await Promise.all([
            Tire.findById(req.params.id).populate('manufacturer').populate('category').exec(),
            TireInstance.find().sort({ tire: req.params.id }).exec()
        ]);

        res.render('tire_detail', {
            title: 'Tire Details',
            tire: tire,
            tire_instances: tireInstances,
    });
    } catch (dbError) {
        const error = encodeURIComponent(`Database read detail Error: ${dbError}.`)
        return res.redirect(`/catalog/tire?error=${error}`);
    }
});

//display create new tire form on GET
exports.tire_create_get = asyncHandler(async (req, res, next) => {
    try {
        const [manufacturer, category] = await Promise.all([
            Manufacturer.find({}).exec(),
            Category.find({}).exec()
        ]);

        res.render('tire_form', {
            title: 'New Tire Form',
            manufacturer: manufacturer,
            category: category,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET Create Error: ${dbError}.`)
        return res.redirect(`/catalog/tire?error=${error}`);
    }
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
            try {
                //there are errors      
                const [manufacturers, categories] = await Promise.all([
                    Manufacturer.find().exec(),
                    Category.find().exec()
                ]);

                res.render('tire_form', {
                    title: 'New Tire Form',
                    manufacturer: manufacturers,
                    category: categories,
                    tire: tire,
                    errors: errors.array(),
                })
            } catch (dbError) {
                const error = encodeURIComponent(`Database error during data retrieval: ${dbError.message}`);
                return res.redirect(`/catalog/tires?error=${error}`);
            } 
        } else {
            try {
                //form data is valid
                await tire.save()
                res.redirect(tire.url);
            } catch (dbError) {
                const error = encodeURIComponent(`Database POST Create Error: ${dbError}.`)
                return res.redirect(`/catalog/tire?error=${error}`);
            }
        }
    }),
];

//display tire delete form on GET
exports.tire_delete_get = asyncHandler(async (req,res, next) => {
    try {
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
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET Delete Error: ${dbError}.`)
        return res.redirect(`/catalog/tire?error=${error}`);
    }
});

//handle tire delete on POST
exports.tire_delete_post = asyncHandler(async (req, res, next) => {

    try {
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

    } catch (dbError) {
        const error = encodeURIComponent(`Database POST Delete Error: ${dbError}.`)
        return res.redirect(`/catalog/tire?error=${error}`);
    }

});

//display tire update form on GET
exports.tire_update_get = asyncHandler(async (req, res, next) => {

    try {
        const [tire, allManufacturers, allCategories] = await Promise.all([
            Tire.findById(req.params.id).populate('manufacturer').populate('category').exec(),
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
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET Update Error: ${dbError}.`)
        return res.redirect(`/catalog/tire?error=${error}`);
    }
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

        if (!errors.isEmpty()) {
            try {
                //there are errors      
                const [tire, manufacturer, categories] = await Promise.all([
                    Tire.findById(req.params.id).populate('manufacturer').populate('category').exec(), 
                    Manufacturer.find().exec(),
                    Category.find().exec()
                ]);

                res.render('tire_form', {
                    title: 'Update Tire',
                    manufacturer: manufacturer,
                    category: categories,
                    tire: {...tire.toObject(), ...req.body}, // Merge persistent tire data with user inputs
                    errors: errors.array(),
                });
            } catch (dbError) {
                const error = encodeURIComponent(`Database error during data retrieval: ${dbError}.`)
                return res.redirect(`/catalog/tire?error=${error}`);
            }
        } else {
          
            try {
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
            } catch (dbError) {
                const error = encodeURIComponent(`Database POST Update Error: ${dbError}.`)
                return res.redirect(`/catalog/tire?error=${error}`);
            }
        }
    }),
];