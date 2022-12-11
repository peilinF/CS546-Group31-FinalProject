const homeRoutes = require('./home');
const parkRoutes = require('./park');
const peopleRoutes = require('./people');
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
  app.use('/people', peopleRoutes);
  app.use('/rank', rankRoutes)
  app.use('/register',registerRoutes);
  app.use('/login',loginRoutes);
  app.use('/logout',logoutRoutes);
  app.use('/review', commentRoutes);
  app.use('/park', reviewsRoutes);
  app.use('/forget', forgetRoutes);
  app.use('/profile',profileRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
