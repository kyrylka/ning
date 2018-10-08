var questionGlobalList=[];
/*replaces loader with search form*/
function getProfileQuestions(blackList, dependencies){
  var catRequest = new XMLHttpRequest();
  catRequest.open("GET","https://external.ningapis.com/xn/rest/adlogens/2.0/Network?xn_pretty=true&ID=7056184&fields=profileQuestions");
  catRequest.setRequestHeader('Authorization','OAuth oauth_signature_method="PLAINTEXT",oauth_consumer_key="'+cons_key+'",oauth_token="'+token+'",oauth_signature="'+signature+'"');
  catRequest.send();
  catRequest.onreadystatechange = function(){
    if(catRequest.readyState === 4 && catRequest.status === 200){
      var questionsListFull = JSON.parse(catRequest.responseText);
      questionsListFull = questionsListFull.entry[0].profileQuestions;
      questionGlobalList = questionsListFull;
      var formToPost="";
      var questionList=[];      
      // accepts JSON related to one question
      // output should have html code to be inserted
      
      if(typeof blackList === "undefined"){
        questionList=questionsListFull;
      }else{
        for(var i=0; i<questionsListFull.length; i++){
          if(blackList.indexOf(questionsListFull[i].title)===(-1)){
            questionList.push(questionsListFull[i]);            
          }
        }
      }      
      for(var i=0; i<questionList.length;i++){
        formToPost+='<div class="advancedSearchQuestion">';        
        if(typeof dependencies!="undefined" && dependencies.hasOwnProperty("q"+questionList[i].index)===true){
          formToPost+= '<div class="questionAndDependency">'+questionToHtml(questionList[i], dependencies) +'<div class="dependecyContainer"></div></div></div>';
        }else{
          formToPost+= questionToHtml(questionList[i], dependencies) + '</div>';
        }
      }
      formToPost = '<div class="advancedSearchContainer"><div class="questionsPull">'+formToPost+'<div id="searchButton" style="" onclick="searchOnClick()">Search</div><div id="searchResults">&nbsp;</div></div></div>';
      if(typeof x$==="undefined"){
        document.addEventListener("DOMContentLoaded", function(){
          x$(".advancedLoader").replaceWith(formToPost);
        });
      }else{
        x$(".advancedLoader").replaceWith(formToPost);
      }
    }
  }
}
function questionToHtml(question, dependencies){
  var helpText="Strict search - if activated (orange), only members with all choices selected will appear. If not activated (blue), members with at least one selected choices will be listed.";
  var helpText2="Strict search - if activated (orange), only members with all tags mentioned will appear. If not activated (blue), members with at least one mentioned tag will be listed.";
        var resultHtml;
        if(question.type==="text" || question.type==="url"){
          resultHtml = '<label class="advansedSearchLabel" for="q'+question.index+'">'+question.title+'</label><input class="advancedSeacrhInput" value="" id="q'+question.index+'" type="text"></input>';
          //tag related changes
          if(question.index === 33){
            resultHtml+='<div class="strictTriger" onclick="strictTriger(this)">&nbsp;</div><input type="hidden" value="true"></input><div class="multyHelp"><div onmouseover="showHelpMsg(this)" onmouseout="hideHelpMsg(this)">?</div><div class="multyHelpInfo" style="display:none">'+helpText2+'</div></div><style>label[name="q'+question.index+'"]:after{font-weight:normal; font-size: 12px; display: block; content:"*Please separate tags with one of the following: comma(,), period(.) or semicolon(;)"}</style>';            
          }
        }else if(question.type==="textarea"){
          resultHtml = '<label class="advansedSearchLabel" for="q'+question.index+'">'+question.title+'</label><textarea class="advancedSeacrhTextarea" value="" id="q'+question.index+'" rows="3"></textarea>';
        }else if(question.type==="select"){          
          var ifInDependecies ="";
          var idQ = 'q'+question.index;
          if(typeof dependencies!="undefined" && dependencies.hasOwnProperty(idQ)===true){
            var ifDependencies='onchange="setChoicesForCategory(this)';
            if(dependencies[idQ]==="none"){
              ifDependencies="";
            }
            resultHtml = '<label class="advansedSearchLabel" for="q'+question.index+'">'+question.title+'</label><select class="advansedSearchSelect" id="q'+question.index+'" '+ifDependencies+'"><option selected="selected" value="Not specified">-</option>';
            for(var j=0; j<question.choices.length; j++){
              resultHtml+='<option value="'+question.choices[j]+'">'+question.choices[j]+'</option>';
            }
            resultHtml+='</select>';
          }else{
            resultHtml = '<label class="advansedSearchLabel" for="q'+question.index+'">'+question.title+'</label><div class="multyReply">';
            for(var j=0; j<question.choices.length; j++){
              resultHtml+='<div class="elemOfMultyContainer"><input type="checkbox" id="q'+question.index+'c'+j+'" '+ifInDependecies+'></input><label for="q'+question.index+'c'+j+'">'+question.choices[j]+'</label></div>';
            }
            resultHtml+= "</div>";
          }
          if(question.multiple === true){
            resultHtml+='<div class="strictTriger" onclick="strictTriger(this)">&nbsp;</div><input type="hidden" value="true"></input><div class="multyHelp"><div onmouseover="showHelpMsg(this)" onmouseout="hideHelpMsg(this)">?</div><div class="multyHelpInfo" style="display:none">'+helpText+'</div></div>';
          }
        }else{
          resultHtml = '<p>Question "'+question.title+'" with id=id"'+question.index+'" is in unsupporte type< please modify your blackList JSON. Or modify "questionToHtml" function appropriately. Regularly this message shouln\'t be shown</p>';
        }        
        return resultHtml;
      }
/* simply converts "true" into true and "false" into false, other text would stay unchanged  */
function textToBool(str){
  if(str==="true"){
    str=true;
  }else if(str==="false"){
    str=false;
  }else{
    str=str;
  }
  return str;
}
/* activates the strictc mode */
function strictTriger(elem){
  elem=x$(elem);
  var inptVal = elem.parent().children('input[type="hidden"]').val();
  if(inptVal === "true"){
    elem.parent().children('input[type="hidden"]').val("false");
    elem.addClass("triggered");
  }else{
    elem.parent().children('input[type="hidden"]').val("true");
    elem.removeClass("triggered");
  }
}
/* these two functions hide and unhide help message near ? sign */
function showHelpMsg(elem){
  elem=x$(elem);
  elem.parent().children('.multyHelpInfo').fadeIn(300);
}
function hideHelpMsg(elem){
  elem=x$(elem);
  elem.parent().children('.multyHelpInfo').fadeOut(300);
}
/* Adds dependencies depends on the input changes 
   elem here is the check box in the pull*/
function setChoicesForCategory(elem) {
  /*lets first of all get as much usefull info as possible*/  
  var questionId = x$(elem).attr('id');
 
  // check if in dependecies
  var pickedCategory = x$(elem).val();
  var dependecyContainer = x$(elem).parent().find(".dependecyContainer");
  if(dependecyContainer.children().length!=0){
      dependecyContainer.children().remove();
    } 
  if(dependenciesInit.hasOwnProperty(questionId)===true){
    var idsToPost = Object.keys(dependenciesInit[questionId][pickedCategory]);    
    for(var i=0; i<idsToPost.length; i++){
      for(var j=0; j<questionGlobalList.length; j++){
        if(questionGlobalList[j].index==idsToPost[i].slice(1)){
          var reply = questionToHtml(questionGlobalList[j], dependenciesInit);          
          dependecyContainer.append(reply);
        }        
      } 
    }    
  }
}

function searchOnClick(){
  if(window.myInterval!=undefined&&window.myInterval!='undefined'){
    window.clearInterval(window.myInterval);
  }
  if(x$('#searchResults').children().length!=0){
    x$('#searchResults').children().remove();
  }
  results=null;
  loaderActions('add');
  search_conditions={};
  var q2searchArray=[];
  for(var i=0;i<x$('.advancedSearchQuestion').length; i++){    
    var elem = x$(x$('.advancedSearchQuestion')[i]);
    if(elem.find('.questionAndDependency').length!=0){
      console.log("cat search triggered");
      var elemId = elem.find('select').attr('id');
      q2searchArray.push({ 'id':elemId, 'result': elem.find('select').val(), 'multy':"what_ever"});
      if(elem.find('input[type="checkbox"]').length!=0){
        var dependencyArray=[];
        for(var j=0; j<elem.find('input[type="checkbox"]').length; j++){
          var checkBox = x$(elem.find('input[type="checkbox"]')[j]);
          if(checkBox[0].checked===true){
            var boxId=checkBox.attr('id');
            dependencyArray.push(elem.find('label[for="'+boxId+'"]').text());
          }
        }
        var multyLoc = textToBool(elem.find('input[type="hidden"]').val());
        if(dependencyArray.length===0){
          dependencyArray="Not specified";
          multyLoc = "what_ever";
        }
        q2searchArray.push({'id': elem.find('.dependecyContainer > label').attr("for"), 'result':dependencyArray, 'multy': multyLoc});
      }
    }else{
      if(elem.find('input[type="text"]').length!=0){
        console.log("text input search triggered");
        var res = elem.find('input[type="text"]').val();
        var multyLoc = textToBool(elem.find('input[type="hidden"]').val());
        if(res===""){
          res="Not specified";
          multyLoc = "what_ever";
        }                
        if(elem.find('input[type="text"]').attr('id')===33){
          res=res.split(/[.,;]/);          
        }
        q2searchArray.push({'id':elem.find('input[type="text"]').attr('id'), 'result': res, "multy": multyLoc});
      /*}else if(elem.find('select.advansedSearchSelect')){
        console.log("select input search triggered");
        console.log(elem[0]);
        q2searchArray.push({'id':elem.find('select').attr('id'), 'result': elem.find('select').val(), "multy": "what_ever"});*/
      }else if(elem.children('.multyReply').length!=0){
        console.log("multy search triggered");
        console.log("problem place");
        var depArray=[];
        for(var l=0; l<elem.find('input[type="checkbox"]').length; l++){
          var checkBox = x$(elem.find('input[type="checkbox"]')[l]);
          if(checkBox[0].checked===true){
            var boxId=checkBox.attr('id');
            depArray.push(elem.find('label[for="'+boxId+'"]').text());
          }
        }               
        var multy = true;
        if(depArray.length===0){
          depArray="Not specified";
          multy = "what_ever";
        }
        q2searchArray.push({'id': elem.children('label').attr("for"), 'result':depArray, 'multy': multy});
      }else if(elem.find('textarea').length!=0){
        console.log("textarea input search triggered");
        var res = elem.find('textarea').val();
        if(res===""){
          res="Not specified";
        }
        q2searchArray.push({'id':elem.find('textarea').attr('id'), 'result': res, "multy": "what_ever"});
      }else{
        console.log("Oops. Something went wrong");
      }      
    }
  }
  search_conditions = {'q2search':q2searchArray,'location':'zip'};
  resPP_end=0;
  var checker=0;
  for(var loc_i=0; loc_i<search_conditions.q2search.length; loc_i++){
    if(search_conditions.q2search[loc_i].result==="Not specified"){
      checker = checker + 1;
    }
    if(loc_i==(search_conditions.q2search.length-1)){
      if(checker == search_conditions.q2search.length){
        errorMessage('Please choose some search criterias');
      }else{
        addResultsToResults();
        resPP_end=resPP_end + resPP;        
        addResultsToFront();
      }
    }
  } 
}
