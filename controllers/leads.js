const Lead = require('../models/leads');
const status= ['Contacted', 'Not contacted']
const states= ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
let today = new Date().toLocaleDateString();

module.exports.index= async (req, res) => {
    const leads = await Lead.find({})
    const title ='Leads'
    console.log(req.params)
    res.render('leads/index', { leads, title })}



module.exports.newLead= async (req, res) => {
        // adds time stamp to the request body object
    req.body.created = `${today}`;
    const newLead = new Lead(req.body);       
    await newLead.save();
    console.log(req.body)
    res.redirect(`/leads/${newLead._id}`)
    }


module.exports.renderNewLead = (req, res) => {
    const title = 'Create new lead'
    res.render('leads/new', {title, status, states})
}

module.exports.showLeadById = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findById(id)
    const title = `${lead.name} ${lead.lastName}`
    res.render('leads/show', { lead, title, status, states })
}

module.exports.editLead= async (req, res) => {
    const {id} = req.params;
    req.body.lastUpdated = `${today}`;
    const lead= await Lead.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    console.log(req.body);
    req.flash('success', 'Successfully updated lead!')
    res.redirect(`/leads/${lead._id}`)
  }

  module.exports.deleteLead = async (req, res) => {
    const {id} = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);
    res.redirect('/leads');
  }


  module.exports.renderLeadEditPage = async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findById(id)
    const title = `Edit ${lead.name} ${lead.lastName}`
    res.render('leads/edit', { lead, title, status, states })
  }

  module.exports.incrementTimesContacted = async (req, res) => {
    try {
      const lead = await Lead.findById(req.params.id);
      if (!lead) {
        return res.status(404).send('Lead not found');
      }
      lead.timesContacted += 1;
      await lead.save();
      res.sendStatus(200);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  
  }