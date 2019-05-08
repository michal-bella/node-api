const mongoose = require('mongoose');
module.exports = function(req, res, next) {
    // kontorluje ci je validne ID, ak nie hodi 404
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) 
        return res.status(404).send('Invalid ID');
    next(); // ak je validne spristupnime pristup do dalsej middleware funkcie
};
