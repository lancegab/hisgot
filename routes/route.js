const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models').User;

const router = new express.Router();

router.post('/signup', function(req, res) {

		const username = req.body.username;
    const password = req.body.password;
    const confirmation = req.body.confirmation;

		User.findOne({ where: { username: username } }).then(function(user) {

					if (user !== null) {
			    //        req.flash('signUpMessage', 'Email is already in use.');
			            return res.redirect('/');
			        }
					if (password !== confirmation) {
			     //       req.flash('signUpMessage', 'Passwords do not match.');
				        return res.redirect('/');
				    }


	        const salt = bcrypt.genSaltSync();
	        const hashedPassword = bcrypt.hashSync(password, salt);

					User.create({
							username: username,
							password: hashedPassword,
							salt: salt
					}).then(function() {
					//		req.flash('signUpMessage', 'Signed up successfully!');
							req.session.user = user;
							req.session.ref_id = 0;
							return res.redirect('/forum');
					});
	    });
});

router.post('/signin', function(req, res) {
	const username = req.body.username;
  const password = req.body.password;
	const remember = req.body.remember;

		User.findOne({ where: { username: username } }).then(function(user) {

				if (user === null) {
          //  req.flash('signInMessage', 'Incorrect username.');
            return res.redirect('/');
        }

				const match = bcrypt.compareSync(password, user.password);
				if (!match) {
				//	req.flash('signInMessage', 'Incorrect password.');
					return res.redirect('/');
				}

		      //  req.flash('statusMessage', 'Signed in successfully!');
						req.session.user = user;
						req.session.ref_id = 0;
						req.session.topic_id = 0;
						//req.user = user;

				if (remember) {
					req.session.cookie.maxAge = 1000 * 60 * 60;
				}
				res.redirect('/forum');
    });
});


router.get('/signout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

module.exports = router;
