const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { leadSchema } = require('../schemas.js');
const leads = require('../controllers/leads');

const ExpressError = require('../utils/ExpressError');
const Lead = require('../models/leads');

const {validateLead, isLoggedIn} = require('../middleware');




router.route('/leads')
    .get(catchAsync(leads.index))
    .post(validateLead, catchAsync(leads.newLead))

router.get('/leads/new', leads.renderNewLead)


router.route('/leads/:id')
    .get(catchAsync(leads.showLeadById))
    .put(validateLead, catchAsync(leads.editLead))
    .delete(catchAsync(leads.deleteLead))



router.get('/leads/:id/edit', catchAsync(leads.renderLeadEditPage))

router.put('/leads/:id/contact', catchAsync (leads.incrementTimesContacted))

  
    




module.exports = router;