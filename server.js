//Initiallising node modules
var express = require("express");
var bodyParser = require("body-parser");
var sql = require("mssql");
var app = express();
var router  = express.Router();
const JSON = require('circular-json');
// Setting Base directory
app.use(bodyParser.json());

//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server || 8080 
 var server = app.listen(process.env.PORT ||  4000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

//Initiallising connection string
var dbConfig = {
    user:  "SKSPHRewriteUser",
    password: "test_1234",
    server: "SCS-P62",
    database: "HackathonReactJs"
};

//Function to connect to database and execute query
var  executeQuery = function(res, query){	

	sql.connect(dbConfig, function (err) {
		if (err) {   
			console.log("Error while connecting database :- " + err);
			res.send(err);
		}
		else {
			// create Request object
			var request = new sql.Request();
			// query to the database
			request.query(query, function (err, res) {
				if (err) {
					console.log("Error while querying database :- " + err);
					//res.send(err);
					//console.log(' Error '+ err);
				}
				else {
					//console.log(JSON.stringify(res));
					return JSON.stringify(res);
					return test;
					
					
				}
			});
		}
	});
	
}

app.get('/', function (req, res) {
	//res.send('root');
	var query = "select * from CandidateDetails";
	
	var json = executeQuery (res, query);

	console.log('Returned json' + JSON.stringify(res));
	res.setHeader('Content-Type', 'application/json');
	//res.writeHeader(200, {"Content-Type": "text/html"});  
	res.write(res);
	const jsono = JSON.stringify(json);
    //res.end(JSON.stringify(jsono));

  })
//req.body post 
app.get('/candidate/:id', function(req , res){
	console.log('candidate api' + req.params.id);
	var query = " SELECT cd.cand_id,cd.firstname,cd.lastname,cd.email,cdf.field_year,cdf.isveteran,cdf.feedback_due_date FROM CANDIDATEDETAILS cd inner join CandidateAdditionalFields cdf on cdf.cand_id= cd.cand_id  and cd.cand_id = "+  req.params.id+ "";
	
	var json = executeQuery (res, query);
	const jsono = JSON.stringify(json);
	res.setHeader('Content-Type', 'application/json');
	res.json(json);
	//console.log(res);
});

//POST API
 app.post('/candidate/:id', function(req , res){
	//console.log('post res' + JSON.stringify(res.query.firstname));//FirstName  LastName Email FeedbackDueDate IsVeteran FieldYear CandidateId
	console.log('post req' + JSON.stringify(req.query.FirstName));
	let candidate = {
		CandidateId: req.query.CandidateId,
		FirstName: req.query.FirstName,
		LastName: req.query.LastName,
		Email: req.query.Email,
		FeedbackDueDate: req.query.FeedbackDueDate,
		IsVeteran: req.query.IsVeteran,
		FieldYear: req.query.FieldYear
	};

	console.log('Candidate details ' + JSON.stringify(candidate));

	var query = "insert into CandidateDetails values( '"+candidate.FirstName +"',   '"+candidate.LastName +"',    '"+candidate.Email+"');  insert into CandidateAdditionalFields(cand_id,feedback_due_date,field_year,isveteran) values("+candidate.CandidateId+",'"+candidate.FeedbackDueDate+"',"+candidate.FieldYear+","+candidate.IsVeteran +");    ";

	executeQuery (res, query);
	res.end();
});

//PUT API
 app.put("/api/user/:id", function(req , res){
	var query = "UPDATE [user] SET Name= " + req.body.Name  +  " , Email=  " + req.body.Email + "  WHERE Id= " + req.params.id;
	executeQuery (res, query);
});

// DELETE API
 app.delete("/api/user /:id", function(req , res){
	var query = "DELETE FROM [user] WHERE Id=" + req.params.id;
	executeQuery (res, query);
});


app.post('/addevaluator',function(req,res){

	let evaluator = {SalutationId : req.query.SalutationId, 
		RefFirstName: req.query.RefFirstName,  
		RefLastName:req.query.RefLastName,
		RefEmail: req.query.RefEmail,
		Country: req.query.Country,
		City: req.query.City,
		RefState: req.query.RefState,
		WorkPhoneAreaCode: req.query.WorkPhoneAreaCode,
		WorkPhoneExtension:req.query.WorkPhoneExtension,
		WorkPhoneNumber:req.query.WorkPhoneNumber,
		RelationshipType:req.query.RelationshipType,
		RelationshipId:req.query.RelationshipId,
		StartMonth:req.query.StartMonth,
		EndMonth:req.query.EndMonth,
		StartYear:req.query.StartYear,
		EndYear:req.query.EndYear,
		JobTitleWithCandidate:req.query.JobTitleWithCandidate,
		Company:req.query.Company};

		var query = "INSERT INTO EvaluatorDetails(salutation_id,ref_firstname,ref_lastname,ref_email,country,city,ref_state,workphoneareacode,workphoneextension,workphonenumber,rdRelationshipType,relationshipid,startmonth,startyear,endmonth,endyear,JobTitleWithCandidate,company,cand_id) VALUES ("+evaluator.SalutationId+",'"+evaluator.RefFirstName+"','"+evaluator.RefLastName+"','"+evaluator.RefEmail+"','"+evaluator.Country+"','"+evaluator.City+"','"+evaluator.RefState+"',"+evaluator.WorkPhoneAreaCode+","+evaluator.WorkPhoneExtension+","+evaluator.EndYearWorkPhoneNumber+","+evaluator.RelationshipType+","+evaluator.RelationshipId+",'"+evaluator.StartMonth+"',"+evaluator.StartYear+",'"+evaluator.EndMonth+"',"+evaluator.EndYear+",'"+evaluator.JobTitleWithCandidate+"','"+evaluator.Company+"',"+evaluator.CandId+");";
		let json = executeQuery (res, query);
		res.end();
});