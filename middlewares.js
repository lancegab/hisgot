module.exports = {
  retrieveSignedInUser : function(req, res, next) {
  		req.user = req.session.user;
      next();
  },

  requireSignedIn : function(req, res, next) {
      if (!req.session.user) {
          return res.redirect('/');
      }
      next();
  }
};
