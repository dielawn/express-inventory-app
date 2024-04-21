const Manufacturer = require('../models/manufacturer.js');
const Tire = require('../models/tire.js');

const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');

//display list of all Manufacturers
exports.mfr_list = asyncHandler(async (req, res, next) => {
    try {
        const allMfrs = await Manufacturer.find().sort({ name: 1 }).exec()

        res.render('mfr_list', {
            title: 'Manufacturer List',
            mfrs: allMfrs,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database read list Error: ${dbError.message}.`)
        return res.redirect(`/catalog/manufacturers?error=${error}`);
    }
});

//display details page for each Manufacturer
exports.mfr_detail = asyncHandler(async (req, res, next) => {
    try {
        const [mfr, tiresOfMfr] = await Promise.all([
            Manufacturer.findById(req.params.id).exec(),
            Tire.find({ manufacturer: req.params.id }).populate('category').exec(),//get all tires made by mfr
        ])
             
        if(!mfr) {
            const error = encodeURIComponent(`Invalid Id: ${req.params.id}.`)
            return res.redirect(`/catalog/mfr_list?error=${error}`);
        }
        
        res.render('mfr_detail', {
            title: `Manufacturer Details ${mfr.name}`,
            mfr: mfr,
            mfr_tires: tiresOfMfr,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database read detail Error: ${dbError.message}.`)
        return res.redirect(`/catalog/manufacturers?error=${error}`);
    }   
});

//display create new Manufacturer form on GET
exports.mfr_create_get = asyncHandler(async (req, res, next) => {  
    try {
        res.render('mfr_form', {
            title: 'Create Manufacturer',
        })
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET Create Error: ${dbError}.`)
        return res.redirect(`/catalog/manufacturers?error=${error}`);
    }   
});

//handle Manufacturer create on POST
exports.mfr_create_post = [
    body('name', 'Manufacturer name required.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('location', 'Manufacturer location required.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        try {
            const existingMfr = await Manufacturer.findOne({ name: req.body.name }).exec();
            if (existingMfr) {
                //mfr exists redirect to details pg w error
                const error = encodeURIComponent('Manufacturer already in database.');
                return res.redirect(`/catalog/${existingMfr._id}?error=${error}`)
            }
        } catch (dbError) {
            const error = encodeURIComponent(`Database error during data retrieval: ${dbError.message}`);
            return res.redirect(`/catalog/tires?error=${error}`);
        }
        if (!errors.isEmpty()) {
            //is error
            res.render('mfr_form', {
                title: 'Create Manufacturer',
                mfr: req.body,
                errors: errors.array()
            });
        } else {
            //is valid
            const newMfr = new Manufacturer({
                name: req.body.name,
                location: req.body.location,
            });
            await newMfr.save();
            res.redirect(newMfr.url)
        }
    })
];
//display Manufacturer delete form on GET
exports.mfr_delete_get = asyncHandler(async (req, res, next) => {
    try {
        const mfr = await Manufacturer.findById(req.params.id).exec()
        //check for associated tires
        const associatedTires = await Tire.find({ manufacturer: req.params.id }).exec();

        if (!mfr) {
            return res.redirect('/catalog/manufacturers')
        }

        if (associatedTires.length > 0) {
            return res.redirect(`/catalog/mfr_delete/${req.params.id}`)
        }

        res.render('mfr_delete', {
            title: 'Delete Manufacturer',
            mfr: mfr,
            tiresByMfr: associatedTires //list of tires made by manufacturer
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET delete Error: ${dbError.message}.`)
        return res.redirect(`/catalog/manufacturers?error=${error}`);
    }
});
//handle Manufacturer delete on POST
exports.mfr_delete_post = asyncHandler(async (req, res, next) => {
    try{
    const mfr = await Manufacturer.findById(req.params.id)
    if (!mfr) {
        const error = encodeURIComponent('Manufacturer not found.')
        return res.redirect(`/catalog/manufacturers?error=${error}`);
    }

    const associatedTires = await Tire.find({ manufacturer: req.params.id }).exec();
    if (associatedTires.length > 0) {
        const error = encodeURIComponent('Delete associated tires first.')
        return res.redirect(`/catalog/tires?error=${error}`)
    }

    await Manufacturer.findByIdAndDelete(req.params.id)
    res.redirect('/catalog/manufacturers');
} catch (dbError) {
    const error = encodeURIComponent(`Database POST delete Error: ${dbError.message}.`)
    return res.redirect(`/catalog/manufacturers?error=${error}`);
}
});

//display Manufacturer update form on GET
exports.mfr_update_get = asyncHandler(async (req, res, next) => {
    try {
        const mfr = await Manufacturer.findById(req.params.id).exec()
        if(!mfr) {
            const error = encodeURIComponent('Manufacturer not found.')
            return res.redirect(`/catalog/manufacturers?error=${error}`)
        }
        res.render('mfr_form', {
            title: 'Update Manufacturer',
            mfr: mfr,
        });
    } catch (dbError) {
        const error = encodeURIComponent(`Database GET update Error: ${dbError.message}.`)
        return res.redirect(`/catalog/manufacturers?error=${error}`);
    }
});
//handle Manufacturer update on POST
exports.mfr_update_post = [
    
    body('name', 'Manufacturer name required.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('location', 'Manufacturer location required.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    
    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            try {
                //is error
                const mfr = await Manufacturer.findById(req,params.id)
                res.render('mfr_form', {
                    title: 'Update Manufacturer',
                    mfr: mfr,
                    error: errors.array(),
            });
            } catch (dbError) {
                const error = encodeURIComponent(`Database error during data retrieval: ${dbError.message}`);
                return res.redirect(`/catalog/tires?error=${error}`);
            } 
        } else {
            //data is valid
            try {                
                const updatedMfr = await Manufacturer.findByIdAndUpdate(req.params.id, {
                    name: req.body.name,
                    location: req.body.location,
                }, { new: true });
                if (updatedMfr) {
                    res.redirect(updatedMfr.url);
                } else {
                    throw new Error('Failed to update Manufacturer.');
                }
            } catch (dbError) {
                const mfr = await Manufacturer.findById(req,params.id)
                res.render('mfr_form', {
                    title: 'Update Manufacturer',
                    mfr: mfr,
                    error: `Database error: ${dbError}`
                });
            }
        }
    }),
];