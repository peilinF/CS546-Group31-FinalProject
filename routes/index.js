const homeRoutes = require('./home');
const parkRoutes = require('./park');
const userRoutes = require('./user');
const rankRoutes = require('./rank')
const registerRoutes = require('./register');
const loginRoutes = require('./login');
const logoutRoutes = require('./logout');
const reviewsRoutes = require('./review');
const commentRoutes = require('./comment');
const forgetRoutes = require('./forget');
const profileRoutes = require('./profile');

const constructorMethod = (app) => {
  app.use('/', homeRoutes);
  app.use('/park', parkRoutes);
  app.use('/user', userRoutes);
  app.use('/rank', rankRoutes)
  app.use('/register',registerRoutes);
  app.use('/login',loginRoutes);
  app.use('/logout',logoutRoutes);
  app.use('/review', reviewsRoutes);
  app.use('/comment', commentRoutes);
  app.use('/forget', forgetRoutes);
  app.use('/profile',profileRoutes);

  app.use('*', (req, res) => {
    let error = "Page not found"
    res.status(404).render('error', { path: '', statuscode: 404, error: error });
  });
};

module.exports = constructorMethod;
