function searchResults_v2(search_massive_str, condition, startP){var mass = JSON.parse(search_massive_str);var massInitLeng = mass.length;var mass_str;var stop;var k=0;var localRes = [];if ((mass.length-startP)>100){stop = startP + 100;console.log('start='+startP);console.log('stop='+stop);} else {stop = mass.length;console.log('start='+startP);console.log('stop='+stop);}loop1: for(var i=0; i<condition.q2search.length; i++){if(condition.q2search[i].result==="Not specified"){if(i==(condition.q2search.length-1)){if(typeof mass_str ==="undefined"){if(localRes.length>0){mass = localRes;mass_str = JSON.stringify(mass);return mass_str;}else{var checker = 0;for(var loc_i=0; loc_i<condition.q2search.length; loc_i++){if(condition.q2search[loc_i].result==="Not specified"){checker = checker + 1;}if(loc_i==(condition.q2search.length-1)){if(checker == condition.q2search.length){mass_str = "Empty search request";return mass_str;}else{mass_str = "No results";console.log(mass_str);return mass_str;}}}}}else{return mass_str;}}else{continue loop1;}}else{if(stop > mass.length){stop=mass.length;startP=0;}else{stop=stop;}loop2: for(var j=startP; j<stop; j++){console.log("j="+j);if(typeof localRes!='undefined'){console.log(JSON.stringify(localRes))}if(typeof mass[j] === "undefined"){if(typeof localRes!='undefined') {console.log("Kostil works here");mass=localRes;mass_str=JSON.stringify(mass);return mass_str;}}loop3: for(var q=0; q<mass[j].profileQuestions.length; q++){if(mass[j].profileQuestions[q].questionId===condition.q2search[i].id){if(condition.q2search[i].multy===true){var satisfyMulty = false;for(var h=0; h<condition.q2search[i].result.length; h++){if(mass[j].profileQuestions[q].answer.answer.indexOf(condition.q2search[i].result[h])>-1){satisfyMulty = true;break;}}if(satisfyMulty===true){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmt4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmt4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmt5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmt5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loopmt6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loopmt6;}}}}}else{continue loop3;}}}else if(condition.q2search[i].multy===false){var satisfyMulty = true;for(var h=0; h<condition.q2search[i].result.length; h++){if(mass[j].profileQuestions[q].answer.answer.indexOf(condition.q2search[i].result[h])===-1){satisfyMulty = false;break;}}if(satisfyMulty===true){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmf4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmf4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmf5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmf5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loopmf6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loopmf6;}}}}}else{continue loop3;}}}else{if(mass[j].profileQuestions[q].answer.answer==condition.q2search[i].result){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop6;}}}}}else{continue loop3;}}}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop7: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop7;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop8: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop8;}}}}}else{continue loop3;}}}if(j==(stop-1) && q==(mass[j].profileQuestions.length)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop9: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop9;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop10: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop10;}}}}}}}}}
function addResultsToResults(){
  if(typeof search_conditions != "undefined"){
  if(typeof res_main != "undefined"){
    var mass = JSON.parse(res_main);
    var start;
    if(results === null){
      var localResults;
      var numbers = (mass.length-mass.length%100)/100;
      if (numbers === 0){
        start = 0;
        localResults = searchResults_v2(res_main, search_conditions, start);
        if(localResults === "Empty search request"){
          errorMessage('Please choose some search criterias');
        }else if(localResults === "No results") {
          errorMessage("No results satisfy this search request");
        }else {
          results = localResults;
        }
      }else{
        loop1:
        for (var i=0; i<=numbers; i++){
          start = i*100;
          var extraLocalResults = searchResults_v2(res_main, search_conditions, start);
          if (typeof localResults != "undefined"){
            if (extraLocalResults === "Empty search request"){
              console.log('This has happened');
            }else if(extraLocalResults === "No results"){
              if(i===numbers){
                if(typeof localResults!=undefined){
                  if (localResults === "Empty search request" || results === "No results"){
                    localResults = extraLocalResults;
                    if(i===numbers){results = localResults;}
                  }else{
                    results = localResults;
                  }
                }else{
                  localResults = "No results";
                  results = localResults;
                  continue loop1;
                }
              }              
              continue loop1;
            }else{
              if (localResults === "Empty search request" || localResults === "No results"){
                localResults = extraLocalResults;
                if(i===numbers){results = localResults;}
              }else{
                localResults= localResults.slice(0, -1);
                extraLocalResults = extraLocalResults.slice(1);
                localResults = localResults + ',' + extraLocalResults;
                if(i===numbers){results = localResults;}
              }
            }
          } else {
            localResults = extraLocalResults;
            if(i===numbers){results = localResults;}
          }     
        }
      }
    } else {
      if((mass.length%100)!=0){
        start =mass.length - (mass.length%100);
      } else {
        start = mass.length - 100;
      }
      var localResults = searchResults_v2(res_main, search_conditions, start);
      if (typeof results != "undefined" || results != null){
        if (localResults === "Empty search request"){
          console.log('This has happened');
        }else if(localResults === "No results"){
          return;
        }else{
          if (results === "Empty search request" || results === "No results"){
            results = localResults;        
          }else{
            results= results.slice(0, -1);
            localResults = localResults.slice(1);
            results = results + ',' + localResults;
          }        
        }
      } else {
        results = localResults;
      }
    }
  }else{
    errorMessage('Unexpected error');
  } 
} else {return;}
}
function clearMyInterval(){if(window.myInterval!=undefined&&window.myInterval!='undefined'){window.clearInterval(window.myInterval);}}
function addResultsToFront(){  
  window.myInterval=setInterval(function() {
    if ((typeof results != "undefined" && results!="No results")||(results != null && results!="No results")){
      var resLocal = JSON.parse(results);
      if(resLocal === null){clearMyInterval(); return;}
      console.log("Results in array=" + resLocal.length);
      var resOnPage = x$('.searchResult').length;
      console.log('Already shown results='+resOnPage);
console.log('f'+f);
      var stop;      
      if(f===1 && resLocal.length==resOnPage){
        clearMyInterval();
        console.log('stopped');
        if(x$('#searchMore').length!=0){
          moreActions("remove");
        }
if(x$('#searchLoader').length!=0){
          loaderActions("remove");
        }
      }
      for(var i=resOnPage ;i<((resPP_end - resOnPage)+resOnPage);i++){
        if(i<resLocal.length){
          appendResLoc(resLocal, i);
        }
      }
    }else{
      if( f===1){
        errorMessage('No results satisfy the search request');
      }
    }
    if(x$('.searchResult').length === resPP_end){
      loaderActions("remove");
      if(x$('#searchMore').length==0){
        moreActions("add");
      }
    }    
    console.log('running...');
  },500);
}
function errorMessage(str){

  clearMyInterval();
  if (str === "RenumFailed500"){
    if(x$('body').length!=0){
      str = "The issue has occured, please click continue updating in order to retry, from the point where the server has failed";
    x$('#searchRequestErorrMessage').remove();
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Error!</strong></p><p>'+str+'</p><div class="reNum" onclick="reNum2()">Continue updating</div></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();      
        loaderActions("remove");      
    });    
  }else {
    str = "The issue has occured, please click continue updating in order to retry, from the point where the server has failed";
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Error!</strong></p><p>'+str+'</p><div class="reNum" onclick="reNum2()">Continue updating</div></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });
  }
  }else if (str === "ReNumFinished"){
     if(x$('body').length!=0){
      str = "The numbers have been updated, you can close this page";
    x$('#searchRequestErorrMessage').remove();
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Info</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });    
  }else {
    str = "The numbers have been updated, you can close this page";
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Error!</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });
  }
  }else if (str === "RenumStarted"){
     var locResMain = JSON.parse(res_main);
     if(x$('body').length!=0){       
      str = "The renumeration has started, please keep your browser window opened untill everrything is done. Aproximately it will take= "+(0.025 * locResMain.length) +"min";
    x$('#searchRequestErorrMessage').remove();
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Info</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });    
  }else {
    str = "The renumeration has started, please keep your browser window opened untill everrything is done. Aproximately it will take= "+(0.025 * locResMain.length) +"min";
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Error!</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });
  }
  }else if (str === "RenumWillStart"){
     if(x$('body').length!=0){
      str = "Please keep your browser window opened, we are preparing the list of members for the renumeration. Once it's ready the renumeration will start immediately";
    x$('#searchRequestErorrMessage').remove();
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Info</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });    
  }else {
    str = "The numbers have been updated, you can close this page";
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Error!</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });
  }
  }else {
     if(x$('body').length!=0){
     x$('#searchRequestErorrMessage').remove();
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Error!</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });    
  }else {
    x$('body').append('<div class="messageContainer" id="searchRequestErorrMessage"><div class="message"><div id="advancedSearchClose">X</div><p style="color:red"><strong>Error!</strong></p><p>'+str+'</p></div></div>');
     x$('#advancedSearchClose').on('click', function(){
      x$('#searchRequestErorrMessage').remove();
loaderActions("remove");
    });
  }
    
  }  
}
function loaderActions(str){
  if(str==="remove"){
    x$('#searchLoader').remove();
  }else if(str==="add"){
    x$('#searchResults').append('<div id="searchLoader">Loading...</div>');
  }else{
    errorMessage('action to perform with loader is not recognised');
  }
}
function appendResLoc(resLocal, i){
var photo, locaLoc;
if(resLocal[i].hasOwnProperty('photo')===false){
  photo='https://storage.ning.com/topology/rest/1.0/file/get/87266458?profile=original&width=180&height=180&crop=1%3A1';
}else{
  if (resLocal[i].photo != null){
    photo = resLocal[i].photo;
  }else{
    photo='https://storage.ning.com/topology/rest/1.0/file/get/87266458?profile=original&width=180&height=180&crop=1%3A1';
  }
}
if(resLocal[i].hasOwnProperty('location')===false){
  locaLoc = "";
}else{
  locaLoc = resLocal[i].location;
}
x$('#searchResults').append('<div class="searchResult"><div class="media-frame matrix-item"><a class="media-img avatar-frame" href="https://nucleardirect.ning.com/xn/detail/'+resLocal[i].id+'"><span class="wrap__avatar avatar avatar-90"><img class="photo avatar avatar-90" src="'+photo+'"></span></a><div class="media-body membersListPage-userInfo"><p class="membersListPage-userName"><a href="https://nucleardirect.ning.com/xn/detail/'+resLocal[i].id+'">'+resLocal[i].fullName+'</a></p><p class="membersListPage-userFeaturedAnswer">'+locaLoc+'</p></div></div></div>');
}
function start() {
var request = new XMLHttpRequest();
request.open("GET", url , true);
request.setRequestHeader('Authorization','OAuth oauth_signature_method="PLAINTEXT",oauth_consumer_key="'+cons_key+'",oauth_token="'+token+'",oauth_signature="'+signature+'"');
request.send();
request.onreadystatechange = function () {
  if(request.readyState === 4 && request.status === 200) {
    var respons = request.responseText;
    var det = JSON.parse(respons);
    if (det.entry.length!=0){//проверка на пустоту ответа сервера
      det = det.entry[0].id.split(":");
      /*****************************************/
      /*Тут начинаеть дефрагментация запросов
      разделение происходит по айди ответа, что б 
      определять тип данных которые заходят
      но это по сути ответы только на гет запросы
      /*****************************************/
      if (det[1]==='User'){
        searchResObtain(respons, request); // функция создания переменной с полным списком данных для поиска
      } else {
        /*Запрос не соответвует не одной функции, проверь че ты ваще делаешь*/
        console.log('Unrecognized entry '+det);      
      }
    }else if(request.readyState === 4){
      /*Тут будем размещать обработчики запросов которые не содержайт айди, не уверен что такие есть но авось*/
      /*Появляеться в случае пустого ответа с сервера на запрос, внимание не ошибка со стороны сервера а его пустой ответб может прийти только в конце запросов*/
      f=1;
      console.log('Oops! Empty respons');
    }
  }else if(request.readyState === 4 && request.status != 200){
    /* Errors provided by thу API*/
    console.log("The error code:" + request.status);
    var respons = request.responseText;
    var resp_work = JSON.parse(respons);
    console.log ("Reason:" + resp_work.reason + "; code:"+resp_work.code +"; subcode:"+ resp_work.subcode);
  }
}
}
function searchResObtain(respons, request){
          if( first_iter===undefined ) {
          /* первое срабатывание*/
          first_iter = JSON.parse(respons); // парсим в объекты первые результаты
          res_main = JSON.parse(respons);
          var obj = res_main.entry;
          res_main = JSON.stringify(obj);
          addResultsToResults();
          console.log('Search is ready to be executed for the first items obtained');
          t=1;//идентифицирует что все готово к поиску и что уже раз инфа ушла в переменную
          if (first_iter.lastPage===false){
            /* случай когда возможны итерации после первой*/
            url = 'https://external.ningapis.com/xn/rest/'+subdomain+'/'+ query+'&'+ count + '&anchor='+first_iter.anchor;
            request.open("GET", url , true);
            request.setRequestHeader('Authorization','OAuth oauth_signature_method="PLAINTEXT",oauth_consumer_key="'+cons_key+'",oauth_token="'+token+'",oauth_signature="'+signature+'"');
            request.send();        
          }else{
            /* Случай когда первая итерация и последняя совпадают*/
            console.log('The first itereation is the last one, no need for XMLHTTP requests any more');        
          } 
      }else{
          //тут нужно расширять большой объект
          var obj = JSON.parse(respons);
          if(obj.lastPage === false){
            if ( obj.anchor!=null){
              /* функция парса для не полсденей страницы*/
              var anchor = obj.anchor;
              obj = obj.entry;
              var obj_str = JSON.stringify(obj);
              res_main= res_main.slice(0, -1);
              obj_str = obj_str.slice(1);
              res_main = res_main + ',' + obj_str;
              t=t+1;
              addResultsToResults();
              url = 'https://external.ningapis.com/xn/rest/'+subdomain+'/'+ query+'&'+ count + '&anchor='+ anchor;
              console.log('The new values have been added to the massive of data, and the new request is sent, with anchor='+anchor+' so the url is '+ url); 
              request.open("GET", url , true);
              request.setRequestHeader('Authorization','OAuth oauth_signature_method="PLAINTEXT",oauth_consumer_key="'+cons_key+'",oauth_token="'+token+'",oauth_signature="'+signature+'"');
              request.send();
            } else{
              /*случай когля якорь страницы все же нулевой*/
              f=1;
              console.log('All values are added to the massive of data');
            }
          
          }else{
            /*функция парса для последенй страницы*/
            obj = obj.entry;
            var obj_str = JSON.stringify(obj);
            res_main= res_main.slice(0, -1);
            obj_str = obj_str.slice(1);
            res_main = res_main + ',' + obj_str;
            f=1;
            console.log('All values are added to the massive of data');
          }      
        }
}
var questionGlobalList=[];
/*replaces loader with search form*/
function getProfileQuestions(blackList, dependencies){
  var catRequest = new XMLHttpRequest();
  catRequest.open("GET","https://external.ningapis.com/xn/rest/nucleardirect/2.0/Network?xn_pretty=true&ID=7056184&fields=profileQuestions");
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
        var resultHtml;
        if(question.type==="text" || question.type==="url"){
          resultHtml = '<label class="advansedSearchLabel" for="q'+question.index+'">'+question.title+'</label><input class="advancedSeacrhInput" value="" id="q'+question.index+'" type="text"></input>';
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
        if(res===""){
          res="Not specified";
        }
        q2searchArray.push({'id':elem.find('input[type="text"]').attr('id'), 'result': res, "multy": "what_ever"});
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
