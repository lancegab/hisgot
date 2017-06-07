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

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
app.use(require('./routes/route'));

app.get('/', function(req, res) {
	res.render('index.html');
});

app.post('/signup', function(req, res){
	const name = req.body.name;
	console.log(req.body);
});


app.get('/retrieveMessages', middlewares.requireSignedIn, function(req,res){

  res.send(Messages.findAll({where : {topic_id : req.session.ref_id}}));

});


app.get('/forum', middlewares.requireSignedIn, function(req,res){

  Messages.findAll({where : {topic_id : req.session.ref_id}}).then(function(msgs){

    Topics.findAll({where : {category : req.session.category_id}, order: '"createdAt" DESC'}).then(function(tpcs){

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


app.get('/viewReplies', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  req.session.ref_id = req.body.message_id;
  //var replyContainer = document.getElementById(req.session.ref_id);

  Messages.findAll({where : {topic_id : req.session.ref_id}}).then(function(msgs){

  res.send(msgs);
  //   var htmlString = "";
  // //  for(i = 0; i < msgs.length; i++){
  // //    htmlString += "<p>" + msgs[i].content + "</p>";
  // //  }
    // res.render('forum.html', {
    //   replies : msgs
    // });
  //   //replyContainer.insertAdjacentHTML('beforeend', "This is awesome");
  });
});

app.post('/send', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  const content = req.body.content;
  const user = req.user;
  console.log("SENDING");
  console.log(req.session.ref_id);
  var message =  Messages.create({
      content : content,
      topic_id : req.session.ref_id,
      sender: user.username,
      votes: 0
    }).then(function(){
      //req.flash('postTopicMessage', 'Successfully posted a topic!');
      res.redirect('/forum');
    });

//    res.send(message);

});

app.post('/viewCategory', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  req.session.category_id = req.body.category_id;
  req.session.category_name = req.body.category_name;
  refresh(req,res);
  res.redirect('/forum');
})

app.post('/viewTopic', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  req.session.ref_id = req.body.topic_id;
  console.log(req.session.ref_id);
  console.log("HERE OH ");
  res.redirect('/forum');
});

// app.post('/replyToMessage', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
//   req.session.ref_id = req.body.message_id;
//   res.redirect('/forum');
// });

app.post('/createTopic', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){
  const headline = req.body.headline;
  const user = req.user;
  const category_id = req.session.category_id;

  console.log(headline);
  console.log(user.id);

  Topics.create({
    headline : headline,
    user_id : user.id,
    votes: 0,
    category : category_id
  }).then(function(){
    req.flash('postTopicMessage', 'Successfully posted a topic!');
    res.redirect('/forum');
  });
});

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

app.post('/upvoteTopic', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){

  const topic_id = req.session.ref_id;
  Topics.findOne({where : {id : topic_id}}).then(function(topic){
    topic.votes = topics.votes + 1;
  })
});


app.post('/upvoteMessage', middlewares.requireSignedIn, middlewares.retrieveSignedInUser, function(req,res){

  const topic_id = req.session.ref_id;

});

function refresh(req, res) {
    req.session.ref_id = null;
}


app.listen(3000, function() {
	console.log('Server is now running at port 3000');
});
