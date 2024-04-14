const Manufacturer = require('../models/manufacturer.js');
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
//display list of all Manufacturers
exports.mfr_list = asyncHandler(async (req, res, next) => {
    const allMfrs = await Manufacturer.find().sort({ name: 1 }).exec()

    res.render('mfr_list', {
        title: 'Manufacturer List',
        mfrs: allMfrs,
    });
});

//display details page for each Manufacturer
exports.mfr_detail = asyncHandler(async (req, res, next) => {
    const mfr = await Manufacturer.findById(req,params.id).exec();

    if(!mfr) {
        const error = encodeURIComponent(`Invalid Id: ${req.params.id}.`)
        return res.redirect(`/catalog/mfr_list?error=${error}`);
    }

    res.render('mfr_detail', {
        title: 'Manufacturer Details',
        mfr: mfr,
    });
});

//display create new Manufacturer form on GET
exports.mfr_create_get = asyncHandler(async (req, res, next) => {  
    res.render('mfr_form', {
        title: 'Create Manufacturer',
    })
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

        const existingMfr = await Manufacturer.findOne({ name: req.body.name }).exec();
        if (existingMfr) {
            //mfr exists redirect to details pg w error
            const error = encodeURIComponent('Manufacturer already in database.');
            return res.redirect(`/catalog/${existingMfr._id}?error=${error}`)
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
} catch (error) {
        const encodedError = encodeURIComponent('Error processing your request.');
        res.redirect(`/catalog/manufacturers?error=${encodedError}`);
    }
});

//display Manufacturer update form on GET
exports.mfr_update_get = asyncHandler(async (req, res, next) => {
    const mfr = await Manufacturer.findById(req.params.id).exec()
    if(!mfr) {
        const error = encodeURIComponent('Manufacturer not found.')
        return res.redirect(`/catalog/manufacturers?error=${error}`)
    }
    res.render('mfr_form', {
        title: 'Update Manufacturer',
        mfr: mfr,
    });
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
        const mfr = await Manufacturer.findById(req,params.id)

        if (!errors.isEmpty()) {
            //is error
            res.render('mfr_form', {
                title: 'Update Manufacturer',
                mfr: mfr,
                error: errors.array(),
            });
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
                res.render('mfr_form', {
                    title: 'Update Manufacturer',
                    mfr: mfr,
                    error: `Database error: ${dbError}`
                });
            }
        }
    }),
];