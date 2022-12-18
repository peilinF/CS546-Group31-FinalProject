const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');


const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ['views/partials/']
});

app.engine('handlebars', handlebarsInstance.engine);

app.set('view engine', 'handlebars');
app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    pageNow: '/',
    pageBefore: '',
    cookie: {maxAge: 365 * 24 * 60 * 60 * 1000}
  })
);
 

app.use (function (req, res, next) {
  if (!req.session.pageNow){
    req.session.pageNow = '/';
    req.session.pageBefore = '';
  }
  
  next();
});


app.use('/login', (req, res, next) => {
  if (req.session.user) {
    res.redirect('/profile');
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    //req.method = 'POST'; // if it req.method = 'POST', it will add route as: get login: http://localhost:3000/login
  }
  next();
});
configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});