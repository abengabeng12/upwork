const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http');
const unirest = require('unirest');
const superagent = require('superagent');
const host = 'https://lt-nlgservice.herokuapp.com';
var pastWord = "";
var past = "";
var yes = "";
var passVal = "";
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))
app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})

app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // Check the parameter
  //let food = req.body['item_name']; //JSON request from postman

  let query = req.body.queryResult.intent.displayName;
  const arr = ['for', 'is', 'and', 'of', 'what', 'is'];
  query = query.replace(/['"]+/g, '');
  
  for(var i = 0; i <= arr.length; i++){
    query = query.replace(arr[i], '');
  }

   console.log(JSON.stringify(req.body))
  if(query.includes("Past participle")){
    let word = req.body.queryResult.parameters['word'] //JSON request from dialogflow
    console.log('==========', word)
    
    console.log(JSON.stringify(req.body))
    callDictApi(word).then((output) => {
      console.log(output)
      // Return the results of the API to Dialogflow
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
      res.status(200).end();
      }).catch((error) => {
        // If there is an error let the user know
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
        res.status(500).end()
    });
  }else if(query.includes("Present Tense")){
    let word = req.body.queryResult.parameters['word']
     //JSON request from dialogflow
   
    presentTense(word).then((output) => {
      console.log(output)
      // Return the results of the API to Dialogflow
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
      res.status(200).end();
      }).catch((error) => {
        // If there is an error let the user know
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
        res.status(500).end()
    });
  }else if(query.includes("Past simple")){
    let word = req.body.queryResult.parameters['word'] 
    let wordsimplepast = req.body.queryResult.parameters['wordsimplepast']
    //JSON request from dialogflow
    pastSimple(word).then((output) => {
      console.log(output)
      // Return the results of the API to Dialogflow
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
      res.status(200).end();
      }).catch((error) => {
        // If there is an error let the user know
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
        res.status(500).end()
    });
  }else if(query.includes("Future Tense")){
      let word = req.body.queryResult.parameters['word'] //JSON request from dialogflow
      console.log(true)
      futureTense(word).then((output) => {
      console.log(output)
      // Return the results of the API to Dialogflow
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
      res.status(200).end();
      }).catch((error) => {
        // If there is an error let the user know
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
        res.status(500).end()
    });
  }else if(query.includes("practice_present_tenses")){
    let word = req.body.queryResult.queryText;//JSON request from dialogflow
 
    console.log(">>>>>>>>>> "+word)
    yes = req.body.queryResult.queryText;
    if(yes == "Yes" || yes == "yes" || yes == "YES"){
    
      try{
        past = req.body.queryResult.fulfillmentText;
        console.log(yes)
        console.log(past)
        past = past.replace("What is the present tense of the word \"", "");
        past = past.replace("\"?", ""); 
        console.log(past)  
      }catch(TypeError){}
    }
     var cond = false;
     
      if(query.includes(" no")){
        
        past = past.replace("What is the present tense of the word ", "");
        past = past.replace('"', "");
        past = past.replace('"?', "")
        past = past.replace(" ","")
        past = past.replace('?', "")
        let word2 = req.body.queryResult.parameters['word'];
        console.log("word1234: "+word2);
        stopPracticePresent(word2).then((output) => {
          console.log(output)
          // Return the results of the API to Dialogflow
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
          res.status(200).end();
          }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(500).end()
        });;
      }else{
        if(word != "no" || word != "No" || word != "NO") {
          cond = false;
          console.log(cond)
          checkPresent(word, cond).then((output) => {
            console.log(output)
            // Return the results of the API to Dialogflow
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(200).end();
            }).catch((error) => {
              // If there is an error let the user know
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
              res.status(500).end()
          });
        }
      }
    
  }else if(query.includes("practice_past_participle_tenses")){
    let word1 = req.body.queryResult.queryText;
    
    yes = req.body.queryResult.queryText;
    console.log("><<>><<<<<<"+yes)
    if(yes == "Yes" || yes == "yes" || yes == "YES"){
    
      try{
        past = req.body.queryResult.fulfillmentText;
        console.log(yes)
        console.log(past)
        past = past.replace("What is the past participle of the word \"", "");
        past = past.replace("\"?", "");
      }catch(TypeError){}
    }
    
    var cond = false;
      if(query.includes(" no")){
        console.log("word1: "+word1);
        stopPractice(past).then((output) => {
          console.log(output)
          // Return the results of the API to Dialogflow
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
          res.status(200).end();
          }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(500).end()
        });;
      }else{
        if(word1 != "no" || word1 != "No" || word1 != "NO") {
          cond = false;
        
          console.log(cond)
          checkParticiple(word1, cond).then((output) => {
          console.log(output)
          // Return the results of the API to Dialogflow
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
          res.status(200).end();
          }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(500).end()
      });
      }else{
          cond = true;
          console.log("else;"+cond)
          checkParticiple(word1, cond).then((output) => {
            console.log(output)
            // Return the results of the API to Dialogflow
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(200).end();
            }).catch((error) => {
              // If there is an error let the user know
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
              res.status(500).end()
          });
        }
    } 
  }else if(query.includes("practice_past_simple")){
    let word1 = req.body.queryResult.queryText;
    
    yes = req.body.queryResult.queryText;
    console.log("><<>><<<<<<"+yes)
    if(yes == "Yes" || yes == "yes" || yes == "YES"){
    
      try{
        past = req.body.queryResult.fulfillmentText;
        console.log(yes)
        console.log(past)
        past = past.replace("What is the simple past tense  of the word \"", "");
        past = past.replace("\"?", "");
      }catch(TypeError){}
    }
    
    var cond = false;
      if(query.includes(" no")){
    
        console.log("word1: "+query);
        stopPracticeSimple(past).then((output) => {
          console.log(output)
          // Return the results of the API to Dialogflow
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
          res.status(200).end();
          }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(500).end()
        });;
      }else{
        if(word1 != "no" || word1 != "No" || word1 != "NO") {
          cond = false;
        
          console.log(cond)
          checkPastSimple(word1, cond).then((output) => {
          console.log(output)
          // Return the results of the API to Dialogflow
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
          res.status(200).end();
          }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(500).end()
      });
      }else{
          cond = true;
          console.log("else;"+cond)
          checkPastSimple(word1, cond).then((output) => {
            console.log(output)
            // Return the results of the API to Dialogflow
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(200).end();
            }).catch((error) => {
              // If there is an error let the user know
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
              res.status(500).end()
          });
        }
    } 
  }else if(query.includes("practice_future_tense")){
let word = req.body.queryResult.queryText;//JSON request from dialogflow
 
    console.log(">>>>>>>>>> "+word)
    yes = req.body.queryResult.queryText;
    if(yes == "Yes" || yes == "yes" || yes == "YES"){
    
      try{
        past = req.body.queryResult.parameters['word1'];   
      }catch(TypeError){}
    }
     var cond = false;
     
      if(query.includes(" no")){
        
        past = past.replace("What is the future tense of", "");
        past = past.replace('"', "");
        past = past.replace('"?', "")
        past = past.replace(" ","")
        past = past.replace('?', "")
        console.log("word: "+past);
        stopPracticeFuture(past).then((output) => {
          console.log(output)
          // Return the results of the API to Dialogflow
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
          res.status(200).end();
          }).catch((error) => {
            // If there is an error let the user know
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(500).end()
        });;
      }else{
        if(word != "no" || word != "No" || word != "NO") {
          cond = false;
          console.log(past);
          passVal = word;
          word = word.replace("will ", "");
          checkFuture(word, cond).then((output) => {
            console.log(output)
            // Return the results of the API to Dialogflow
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
            res.status(200).end();
            }).catch((error) => {
              // If there is an error let the user know
              res.setHeader('Content-Type', 'application/json');
              res.send(JSON.stringify({ 'speech': output, 'fulfillment_text': output }));
              res.status(500).end()
          });
        }
      }
    
  }else{
    //I want to check the past participle
    console.log("test")
  }
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})

function callDictApi(word){
    return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
      
      console.log('API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugated_forms[2][1]);
        result = result.replace(/['"]+/g, '');
        
        let output = "The past participle of "+word+" is "+result;
        output = output + ". Would you like to practice more past participle tenses with me?"
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}

function presentTense(word){
    return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
      console.log('API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugation_tables.indicative[0].forms[2][1]);
        result = result.replace('am', '');
        let output = "The simple present tense of that verb is "+result;
        output = output + ". Would you like to practice more simple present tenses with me?"
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}

function stopPractice(word){
 return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
      console.log('API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugated_forms[2][1]);
        result = result.replace(/['"]+/g, '');
        let output = "The past participle of "+word+" is "+result; 
        
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}

function stopPracticePresent(word2){
 return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word2)}`;
      console.log('API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugation_tables.indicative[0].forms[2][1]);
        result = result.replace(/['"]+/g, '');
        let output = "The simple present tense of '"+word2+"' is "+result +"'.";
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}

function stopPracticeFuture(word){
 return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
      console.log('HEllo API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
         var result = JSON.stringify(response.body.conjugation_tables.indicative[8].forms[0][1]);
        result = result.replace(/['"]+/g, '');
        let output = "The future tense of that word is "+result;
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}

function pastSimple(word){
    return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
      
      console.log('API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugated_forms[1][1]);
        
        let output = "The past simple tense of the verb  "+word+" is "+result;
         output = output + ". Would you like to practice more past simple tenses with me?"
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}

function futureTense(word){
   return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
      console.log('API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugation_tables.indicative[8].forms[0][1]);
        result = result.replace('am', '');
        let output = "The future tense of that verb is "+result;
        output = output + ". Would you like to practice more future tenses with me?"
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}

function checkParticiple(word1, answer){
  return new Promise((resolve, reject ) => {
     let path = `/rest/english/conjugate?verb=${encodeURIComponent(word1)}`;
     var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugated_forms[2][1]);
        var check = JSON.stringify(response.body.conjugated_forms[0][1]);
        result = result.replace(/['"]+/g, '');
        word1 = word1.replace(/['"]+/g, '');
        check = check.replace("to ", '');
        
        if(answer == false) {
          if(result == word1) {
            resolve("Great job! The past participle of that word is "+ result+". Would you like to practice more?");
          }else{
            resolve("That's not correct. Would you like to try again? If yes, kindly enter the past participle of that word, otherwise type 'no' if you want to reveal the correct answer.")
          }
        }else{
          resolve("The past participle of that word  is "+result+" \n.?");
        }
        console.log(result);
      
      })();
  }).catch(alert);
  
}


function checkPresent(word, answer){
  return new Promise((resolve, reject ) => {
     let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
     console.log(true);
     var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugation_tables.indicative[0].forms[2][1]);
        var check = JSON.stringify(response.body.conjugated_forms[0][1]);
        result = result.replace(/['"]+/g, '');
        word = word.replace(/['"]+/g, '');
        check = check.replace("to ", '');
        result = result.replace("am", '');
        result = result.replace(" ","")
        console.log("IM here: result: "+result +" : "+word)
        
        if(answer == false) {
          if(result == word) {
            resolve("Great job! The present tense of that word is "+result+".");
          }else{
            resolve("That's not correct. Would you like to try again? If yes, kindly enter the simple present tense of that word, otherwise type 'no' if you want to reveal the correct answer.")
          }
        }else{
          resolve("The present tense "+' is '+result+" \n.?");
        }
        console.log(result);
      
      })();
  }).catch(alert);
}

function checkFuture(word1, answer){
  return new Promise((resolve, reject ) => {
     let path = `/rest/english/conjugate?verb=${encodeURIComponent(word1)}`;
     console.log(true);
     var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugation_tables.indicative[8].forms[0][1]);
       
        var check = JSON.stringify(response.body.conjugated_forms[0][1]);
        result = result.replace(/['"]+/g, '');
        word1 = word1.replace(/['"]+/g, '');
        check = check.replace("to ", '');
        word1 = passVal;
        console.log("IM here: result: "+result +" : "+word1)
        
        if(answer == false) {
          if(result == word1) {
            
            resolve("Great job! The future tense of the word "+check+' is '+result+".");
          }else{
            resolve("That's not correct. Would you like to try again? If yes, kindly enter the future tense of that word, otherwise type 'no' if you want to reveal the correct answer.")
          }
        }else{
          resolve("The future tense of the word "+' is '+result+" \n.?");
        }
        console.log(result);
      
      })();
  }).catch(alert);
}

function checkPastSimple(wordsimplepast, answer){
  return new Promise((resolve, reject ) => {
     let path = `/rest/english/conjugate?verb=${encodeURIComponent(wordsimplepast)}`;
     var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugated_forms[2][1]);
        var check = JSON.stringify(response.body.conjugated_forms[0][1]);
        result = result.replace(/['"]+/g, '');
        wordsimplepast = wordsimplepast.replace(/['"]+/g, '');
        check = check.replace("to ", '');
        
        if(answer == false) {
          if(result == wordsimplepast) {
            resolve("Great job! The simple past tense of that word is "+ result+".");
          }else{
            resolve("That's not correct. Would you like to try again? If yes, kindly enter the simple past tense of that word, otherwise type 'no' if you want to reveal the correct answer.")
          }
        }else{
          resolve("The past simple past tense of that word  is "+result+" \n.?");
        }
        console.log(result);
      
      })();
  }).catch(alert);
  
}

function stopPracticeSimple(word){
 return new Promise((resolve, reject) => {
      let path = `/rest/english/conjugate?verb=${encodeURIComponent(word)}`;
      console.log('API Request: ' + host + path);
      var url = host+path;
      (async function(){
        const response = await superagent.get(url)
        var result = JSON.stringify(response.body.conjugated_forms[2][1]);
        result = result.replace(/['"]+/g, '');
        let output = "The simple past tense of "+word+" is "+result; 
        
        resolve(output);
      })();
      
    }).catch((alert) => {
      console.log(alert);
    });
}
