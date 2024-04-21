const TireInstance = require('../models/tireInstance.js');
const Tire = require('../models/tire.js');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

//display list of all tire inventory
exports.tire_instance_list = asyncHandler(async (req, res, next) => {
    try {
        const allTireInstances = await TireInstance.find()
            .populate({ path: 'tire', populate: { path: 'manufacturer category' }})
            .populate('size') 
            .sort({ dot: -1 })
            .exec();

        res.render('tire_instance_list', {
            title: 'Complete Inventory',
            tire_instances: allTireInstances
    });
    } catch (dbError) {
        const error = encodeURIComponent(`Database POST Create Error: ${dbError}.`)
        return res.redirect(`/catalog/tireinstances?error=${error}`);
    }   
});


//display details page for each TireInstance
exports.tire_instance_detail = asyncHandler(async (req, res, next) => {
    try {
        const tireInstance = await TireInstance.findById(req.params.id)                            
            .populate({ path: 'tire', populate: { path: 'manufacturer category' }})
            .populate('size')
            .exec()

        if (tireInstance === null) {
            const error = encodeURIComponent(`Tire instance with ID: ${req.params.id} not found.`);
            return res.redirect(`/catalog/tireinstances?error=${error}`)
        }                  

        res.render('tire_instance_detail', {
            title:  `Tire: ${tireInstance.tire ? tireInstance.dot : 'Unknown'}`,
            tire_instance: tireInstance,        
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database POST Create Error: ${dbError}.`)
        return res.redirect(`/catalog/tireinstances?error=${error}`);
    }
});

//display create new TireInstance form on GET
exports.tire_instance_create_get = asyncHandler(async (req, res, next) => {

   try {
    const allTires = await Tire.find().sort({ model_name: 1}).exec();
    //no tires to create instance of
    if (!allTires.length) {
        const error = encodeURIComponent(`No tires available, create tire before creating instance`);
        res.redirect(`/catalog/tires?error=${error}`);
    }  
    //display form
    res.render('tire_instance_form', {
        title: 'Create Tire Instance',
        tire_list: allTires,
    });
    //database error redirect to tire list
   } catch (dbError) {
        const error = encodeURIComponent(`Database GET error: ${dbError.message}`);
        res.redirect(`/catalog/tireinstances?error=${error}`);
   }
});
    
//handle TireInstance create on POST
exports.tire_instance_create_post = [
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
      

        if (!errors.isEmpty()) {
            //yes errors
            const allTires = await Tire.find().sort({ model_name: 1}).exec();
                res.render('tire_instance_form', {
                    title: 'Create Tire Instance',
                    tire_list: allTires,
                    tireInstance: req.body, //pass submitted data back to form
                    error: errors.array(),
                });
        } else {
            //create tire instance obj from val/san data
            const tireInstance = new TireInstance({
                tire: req.body.tire,
                dot: req.body.dot,
                date_code: req.body.date_code,
            });
            try {
            //no errors create instance
            await tireInstance.save()
            res.redirect(tireInstance.url);
            } catch (dbError) {
            const allTires = await Tire.find().sort({ model_name: 1}).exec();
                res.render('tire_instance_form', {
                    title: 'Create Tire Instance',
                    tire_list: allTires,
                    tireInstance: req.body,
                    error: `Failed to create tire instance due to database error: ${dbError}`,
            });
           }
        }
    }),
];
    
//display TireInstance delete form on GET
exports.tire_instance_delete_get = asyncHandler(async (req, res, next) => {
    try {
   const tireInstance = await TireInstance.findById(req.params.id)
    .populate({ path: 'tire', populate: { path: 'manufacturer category' }})
    .populate('size')
    .exec();   

    if (!tireInstance) {
        const error = encodeURIComponent('Invalid instance cannot delete what was not found.')
        return res.redirect(`/catalog/tireinstances?error=${error}`);
    }

    res.render('tire_instance_delete', {
        title: `Delete Tire Instance: ${tireInstance.dot}`,
        tireInstance: tireInstance,
    });
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET delete Error: ${dbError}.`)
        return res.redirect(`/catalog/tireinstances?error=${error}`);
    }
});

//handle TireInstance delete on POST
exports.tire_instance_delete_post = asyncHandler(async (req, res, next) => {
    const tireInstance = await TireInstance.findById(req.params.id);
   
    if(!tireInstance) {
        const error = encodeURIComponent('Tire instance not found.')
        return res.redirect(`/catalog/tireinstances?error=${error}`);
    }

    //delete instance
    await TireInstance.findByIdAndDelete(req.params.id)    
    res.redirect('/catalog/tireinstances');
});
    
//display TireInstance update form on GET
exports.tire_instance_update_get = asyncHandler(async (req, res, next) => {
    //get tire
    const tireInstance = await TireInstance.findById(req.params.id)
            .populate({ path: 'tire', populate: { path: 'manufacturer category' }})
            .populate('size')
            .exec()

    if (!tireInstance) {
        const error = encodeURIComponent('Tire instance not found.')
        return res.redirect(`/catalog/tireinstances?error=${error}`)
    }

    res.render('tire_instance_form', {
        title: 'Update Tire Instance',
        tireInstance: tireInstance,
    })
})
//handle TireInstance update on POST
exports.tire_instance_update_post = [
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

        if (!errors.isEmpty()) {
            //yes errors
            const tireInstance = await TireInstance.findById(req.params.id)
                .populate({ path: 'tire', populate: { path: 'manufacturer category' }})
                .populate('size')
                .exec();

                res.render('tire_instance_form', {
                    title: 'Update Tire Instance',
                    tireInstance: tireInstance,
                    error: errors.array(),
                });
        } else {
            //data is valid
           try {
            const updatedTireInstance = await TireInstance.findByIdAndUpdate(req.params.id, {
                tire: req.body.tire,
                dot: req.body.dot,
                date_code: req.body.date_code,
            }, { new: true });
                res.redirect(updatedTireInstance.url);
                
           } catch (dbError) {            
                res.render('tire_instance_form', {
                    title: 'Update Tire Instance',
                    tireInstance: await TireInstance.findById(req.params.id)
                    .populate({ path: 'tire', populate: { path: 'manufacturer category' }})
                    .populate('size'),
                    error: `Failed to Update tire instance due to database error: ${dbError}`,
            });
           }
        }

    }),
];