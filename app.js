const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000}
  })
);

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/profile');
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    //req.method = 'POST'; // if it req.method = 'POST', it will add route as: get login: http://localhost:3000/login
    next();
  }
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});