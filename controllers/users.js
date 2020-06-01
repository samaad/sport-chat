module.exports = function(_, passport, User, validator){
  return {
    SetRouting : function(router){
      router.get('/', this.indexPage);
      router.get('/signup', this.signupPage);
      router.get('/home', this.homePage);

       router.post('/', [
          validator.check('email').not().isEmpty().isEmail()
              .withMessage('Email is invalid'),
          validator.check('password').not().isEmpty()
              .withMessage('Password is required and must be at least 5 characters.'),
        ], this.postValidation, this.postLogin);
      // router.post('/signup', User.SignUpValidation,  this.postSignup);
       router.post('/signup', [
                validator.check('username').not().isEmpty().isLength({min: 5}).withMessage('Username is required and must be at least 5 characters.'),
                validator.check('email').not().isEmpty().isEmail()
                    .withMessage('Email is invalid'),
                validator.check('password').not().isEmpty()
                    .withMessage('Password is required and must be at least 5 characters.'),
            ], this.postValidation, this.postSignup);
    },
    indexPage: function(req, res){
      const errors = req.flash('error');
      return res.render('index', {title: 'Sport-Chat | Login', messages: errors,
        hasErrors: errors.length > 0});
    },
    signupPage: function(req, res){
      const errors = req.flash('error');
      return res.render('signup', {title: 'Sport-Chat | Login', messages: errors, hasErrors: errors.length > 0});
    },
    homePage: function(req, res){
      return res.render('home');
    },


     postValidation: function(req, res, next) {
        const err = validator.validationResult(req);
        const reqErrors = err.array();
        const errors = reqErrors.filter(e => e.msg !== 'Invalid value');
        let messages = [];
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        // req.flash('error', messages);
        if (messages.length > 0) {
            req.flash('error', messages);
            if (req.url === '/signup') {
                res.redirect('/signup');
            } else if(req.url === '/') {
                res.redirect('/');
            }
        }
        return next();
    },
        

    postSignup: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
    }),
    postLogin: passport.authenticate('local.login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }),
  }
}