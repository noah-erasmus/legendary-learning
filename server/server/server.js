var path = require('path');
var cors = require('cors');
require('dotenv').config();
var express = require('express');
var data = require('../data.js');
var app = express();
var logger = require('./logger')
var authenticator = require('./authenticator');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

var urlpath = path.join(__dirname, '../frontend/build/');


var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(logger);
app.use(cors(corsOptions));
app.use(express.static(urlpath));
app.use(cookieParser());
app.use(bodyParser.json())
// app.use(authenticator);

// app.get('/', function (request, response) {
//     response.sendFile(__dirname + '/frontend/index.html')
// });

app.post('/api/login', (request, response) => {
    var loginDetails = request.query;
    console.log(loginDetails);
    const token = jwt.sign(loginDetails, process.env.ACCESS_TOKEN_SECRET);
    response.cookie("token", token);
    response.json({ token: token });
});

app.get('/api/protected', authenticator, (request, response) => {
    response.json(request.user)
});

//1. List of all the classes
app.get('/api/classes', function (request, response) {
    response.json(data.classes);
});

//2. Details of a particular class, including:
app.get('/api/details/:classId', function (request, response) {
    var results = { subject: null, teacher: null, learners: [], times: [], classroom: null };

    var classId = parseInt(request.params.classId, 10);

    var lesson = data.classes.find((c) => c.id === classId);

    results.subject = lesson.subject;

    //a. teacher of the class
    var teacher = data.teachers.find((t) => t.classes.includes(classId));
    results.teacher = teacher.name;

    //b. students in the class
    var students = data.learners.filter((s) => s.classes.includes(classId));

    results.learners = students;

    //c. time of the class
    var timeSlot = data.slots.find((ts) => ts.slot === lesson.slot);
    results.times = timeSlot.times;

    //d. classroom number
    results.classroom = lesson.classroom;

    response.json(results);
});

//3. School of Interaction Arts Project Brief
//I was unsure what kind of placeholder information to use here.
app.get('/api/brief', function (request, response) {
    var interactionArtsBrief = data.briefs.find((ia) => ia.subject === "interaction-arts");
    response.json(interactionArtsBrief);
});

//4. Subject
//I was also confused here, I assume that the task is for a query that provides the subject of a class.
app.get('/api/subject/:classId', function (request, response) {
    var classId = parseInt(request.params.classId, 10);
    var lesson = data.classes.find((c) => c.id === classId);
    response.json(lesson.subject);
});

//5. List of classes taught by particular teacher
app.get('/api/classes/teachers/:teacherId', function (request, response) {
    var teacherId = parseInt(request.params.teacherId, 10);
    var teacher = data.teachers.find((t) => t.id === teacherId);

    var classList = [];
    for (var i = 0; i < teacher.classes.length; i++) {
        var classTaught = data.classes.find((ct) => ct.id === teacher.classes[i])
        classList.push(classTaught);
    }
    response.json(classList);
});

//6. List of classes taken by particular learner
app.get('/api/classes/learners/:learnerId', function (request, response) {
    var learnerId = parseInt(request.params.learnerId, 10);
    var learner = data.learners.find((l) => l.id === learnerId);

    var classList = [];
    for (var i = 0; i < learner.classes.length; i++) {
        var classTaken = data.classes.find((ct) => ct.id === learner.classes[i]);
        classList.push(classTaken);
    }
    response.json(classList);
});

// app.get('/api/slots/:slotId', function (request, response) {
//     var slotId = parseInt(request.params.slotId, 10);
//     var times = [];
//     for (var i = 0; i < data.slots.length; i++) {
//         if (data.slots[i].slot === slotId) {
//             times = data.slots[i].times;
//         }
//     }

//     response.json(times);
// });

//7. User id when a valid email and password are supplied
app.get('/api/login', function (request, response) {
    var reply = "Incorrect login details."
    for (var i = 0; i < data.teachers.length; i++) {
        if (data.teachers[i].email === request.query.usn) {
            if (data.teachers[i].password === request.query.pass) {
                reply = "Welcome user " + data.teachers[i].id
            }
        }
    }
    response.json(reply);
});

app.get('/api/slots', function (request, response) {
    response.json(data.slots);
})

app.listen(8000, function () {
    console.log('Listening on port 8000.');
});