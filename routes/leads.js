const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { leadSchema } = require('../schemas.js');
const leads = require('../controllers/leads');

const ExpressError = require('../utils/ExpressError');
const Lead = require('../models/leads');

const {isLoggedIn,validateLead} = require('../middleware');




router.route('/leads')
    .get(isLoggedIn,catchAsync(leads.index))
    .post(isLoggedIn,validateLead, catchAsync(leads.newLead))

router.get('/leads/new', leads.renderNewLead)


router.route('/leads/:id')
    .get(isLoggedIn,catchAsync(leads.showLeadById))
    .put(isLoggedIn,validateLead, catchAsync(leads.editLead))
    .delete(isLoggedIn,catchAsync(leads.deleteLead))



router.get('/leads/:id/edit', isLoggedIn,catchAsync(leads.renderLeadEditPage))




module.exports = router;