const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const consolidate = require('consolidate');

const database = require('./database');
const middlewares = require('./middlewares');

const User = require('./models').User;
const Topics = require('./models').Topics;
const Messages = require('./models').Messages;
const Categories = require('./models').Categories;


//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var xhr = new XMLHttpRequest();

const app = express();

app.engine('html', consolidate.nunjucks);
app.set('views', './views');

app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(cookieparser('secret-cookie'));
app.use(session({ resave: false, saveUninitialized: false, secret: 'secret-cookie' }));
app.use(flash());


app.use('/static', express.static('./static'));
app.use(require('./routes/auth'));

//-------------------------------------------------------------//



//renders the main page
app.get('/', function(req, res) {
	res.render('index.html');
});

//renders the addTopic page
app.get('/addTopic', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  res.render('addTopic.html');
});

//renders the main view: the forum itself
app.get('/forum', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  Topics.findAll({where : {category : req.session.category_id}, order: '"createdAt" DESC'}).then(function(tpcs){
     Messages.findAll({where : {id : req.session.message_id}}).then(function(msgs){
      Categories.findAll({order: '"createdAt" DESC'}).then(function(ctgry){
        res.render('forum.html',{
          currentCategory : req.session.category_name,
          categories : ctgry,
          topics : tpcs,
          messages : msgs
        });
      });
    });
  });
});

//sends an object that contains all the replies of the current message
app.get('/viewReplies', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  Messages.findAll({where : {ref_id : req.session.ref_id}}).then(function(msgs){
    res.send(msgs);
  });
});

//sets the current message
app.get('/currentMessage', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  req.session.ref_id = req.query.id;
  res.send("Ok");
});

//creates a new message that references a parent message
app.post('/reply', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  const content = req.body.content;
  req.session.ref_id = req.body.message_id;
  const user = req.user;

  var message =  Messages.create({
      content : content,
      ref_id : req.session.ref_id,
      sender: user.username,
      votes: 0
    }).then(function(){
      res.redirect('/forum');
    });

});

//changes the session's category_id; changes the current category viewed by the user
app.post('/viewCategory', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  req.session.category_id = req.body.category_id;
  req.session.category_name = req.body.category_name;
  refresh(req,res);
  res.redirect('/forum');
})

//changes the session's topic_id; changes the topic viewed by the user
app.post('/viewTopic', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  req.session.topic_id = req.body.topic_id;
  req.session.message_id = req.body.message_id;
  res.redirect('/forum');
});

//creates a new topic, based on the current category
app.post('/createTopic', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  const headline = req.body.headline;
  const content = req.body.content;
  const user = req.user;
  const category_id = req.session.category_id;

  Messages.create({
      content : content,
      ref_id : null,
      sender: user.username,
      votes: 0
    }).then(function(msg){
      Topics.create({
        headline : headline,
        message_id : msg.id,
        user_id : user.id,
        votes: 0,
        category : category_id
      }).then(function(){
        req.flash('postTopicMessage', 'Successfully posted a topic!');
        res.redirect('/forum');
      });
    });


});

//creates a new category; a hidden function for devs only
app.post('/createCategory', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  const name = req.body.category;
  const user = req.user;

  Categories.create({
    name : name,
    user_id : user.id,
    views: 0,
  }).then(function(){
    //req.flash('postTopicMessage', 'Successfully posted a topic!');
    res.redirect('/forum');
  });
});

//increments a topic's votes
app.post('/upvoteTopic', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){

  const topic_id = req.session.ref_id;
  Topics.findOne({where : {id : topic_id}}).then(function(topic){
    topic.votes = topics.votes + 1;
  })
});

//increments a message's votes
app.post('/upvoteMessage', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){

  const topic_id = req.session.ref_id;

});

function refresh(req, res) {
    req.session.ref_id = null;
}


app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
