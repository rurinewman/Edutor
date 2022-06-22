const moment = require('moment');
const express = require('express');
const router = express.Router();
const Consultation = require('../models/Booking');
const flashMessage = require('../helpers/messenger');
// for recaptcha
const fetch = require('isomorphic-fetch')
// for file upload
const fs = require('fs');
const upload = require('../helpers/imageUpload');
// for validation
// const ensureAuthenticated = require('../helpers/auth');

// ROUTING: 
router.get('/main', (req, res) => {
    Consultation.findAll({
        // where: { userId: req.user.id },
        order: [['date']],
        raw: true
    })
        .then((consultations) => {
            // pass object to consultation.hbs
            res.render('consultation/consultation', { consultations });
        })
        .catch(err => console.log(err));
    // res.render('tutor/consultation');
});

router.get('/create', (req, res) => {
    res.render('consultation/addConsultation');
});

router.get('/editConsultation/:id', (req, res) => {
    Consultation.findByPk(req.params.id)
        .then((consultation) => {
            res.render('consultation/editConsultation', { consultation });
        })
        .catch(err => console.log(err));
});



// CODING LOGIC (CRUD)
// CREATE
router.post('/create/', (req, res) => {
    let title = req.body.title;
    let consultationURL = req.body.consultationURL;
    let price = req.body.price;
    let description = req.body.description;
    let start_time = moment(req.body.start_time, 'HH:mm:ss');
    let end_time = moment(req.body.end_time, 'HH:mm:ss');
    let date = moment(req.body.consultDate, 'DD/MM/YYYY');

    // mysql
    const resKey = req.body['g-recaptcha-response'];
    const secretKey = '6LdLCYogAAAAAH7S5icpeSR4cCVxbhXF3LTHN4ur';
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${resKey}`

    fetch(url, { method: 'post', })
        .then((response) => response.json())
        .then((google_response) => {
            if (google_response.success == true) {
                console.log({ response: 'Successful' })
            } else {
                console.log({ response: 'Failed' })
            }
        })
        .catch((error) => {
            console.log({ error })
        })

    // flash
    const message = 'Consultation slot successfully submitted';
    flashMessage(res, 'success', message);


    // saving to mysql
    Consultation.create({ title, consultationURL, price, description, date, start_time, end_time })
        .then((consultation) => {
            console.log(consultation.toJSON());
            res.redirect('/tutor/consultation/main');
        })
        .catch(err => console.log(err));
});


// EDIT
router.post('/editConsultation/:id', (req, res) => {
    let title = req.body.title;
    let consultationURL = req.body.consultationURL;
    let price = req.body.price;
    let description = req.body.description;

    let start_time = moment(req.body.start_time, 'HH:mm');
    let end_time = moment(req.body.end_time, 'HH:mm');
    let date = moment(req.body.consultDate, 'DD/MM/YYYYs');

    Consultation.update(
        { title, consultationURL, price, description, date, start_time, end_time },
        { where: { id: req.params.id } }
    )
        .then((result) => {
            console.log(result[0] + ' consultation updated');
            res.redirect('/tutor/consultation/main');
        })
        .catch(err => console.log(err));
});



// DELETE
router.get('/deleteConsultation/:id', async function (req, res) {
    try {
        let consultation = await Consultation.findByPk(req.params.id);
        if (!consultation) {
            flashMessage(res, 'error', 'Consultation not found');
            res.redirect('/tutor/consultation/main');
            return;
        }
        /*
        if (req.user.id != consultation.userId) {
            flashMessage(res, 'error', 'Unauthorised access');
            res.redirect('/consultation/listConsultations');
            return;
        }
        */

        let result = await Consultation.destroy({ where: { id: consultation.id } });
        console.log(result + ' consultation deleted');
        res.redirect('/tutor/consultation/main');
    }
    catch (err) {
        console.log(err);
    }
});




// image upload
router.post('/upload', (req, res) => {
    // create user id directory for upload if not exist
    if (!fs.existsSync('./public/uploads/' + 1)) {
        fs.mkdirSync('./public/uploads/' + 1, {
            recursive:
                true
        });
    }
    upload(req, res, (err) => {
        if (err) {
            // e.g. File too large
            res.json({ file: '/uploads/profile/profile.png', err: err });
        }
        else {
            res.json({
                file: `/uploads/1/${req.file.filename}`
            });
        }
    });

});





module.exports = router;