const { leadSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Lead = require('./models/leads');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}



module.exports.validateLead = (req, res, next) => {
    const { error } = leadSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
