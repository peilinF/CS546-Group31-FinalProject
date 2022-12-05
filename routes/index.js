const homeRoutes = require('./home');
const parkRoutes = require('./park');
const peopleRoutes = require('./people');
const rankRoutes = require('./rank')

const constructorMethod = (app) => {
  app.use('/', homeRoutes);
  app.use('/park', parkRoutes);
  app.use('/people', peopleRoutes);
  app.use('/rank', rankRoutes)
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
