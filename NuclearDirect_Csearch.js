var whiteList=["Company name","Country","City","Activities","Codes & Normes Certification","Turn Over","Association membership"];
function searchResults_v2(search_massive_str, condition, startP){var mass = JSON.parse(search_massive_str);var massInitLeng = mass.length;var mass_str;var stop;var k=0;var localRes = [];if ((mass.length-startP)>100){stop = startP + 100;console.log('start='+startP);console.log('stop='+stop);} else {stop = mass.length;console.log('start='+startP);console.log('stop='+stop);}loop1: for(var i=0; i<condition.q2search.length; i++){if(condition.q2search[i].result==="Not specified"){if(i==(condition.q2search.length-1)){if(typeof mass_str ==="undefined"){if(localRes.length>0){mass = localRes;mass_str = JSON.stringify(mass);return mass_str;}else{var checker = 0;for(var loc_i=0; loc_i<condition.q2search.length; loc_i++){if(condition.q2search[loc_i].result==="Not specified"){checker = checker + 1;}if(loc_i==(condition.q2search.length-1)){if(checker == condition.q2search.length){mass_str = "Empty search request";return mass_str;}else{mass_str = "No results";console.log(mass_str);return mass_str;}}}}}else{return mass_str;}}else{continue loop1;}}else{if(stop > mass.length){stop=mass.length;startP=0;}else{stop=stop;}loop2: for(var j=startP; j<stop; j++){console.log("j="+j);if(typeof localRes!='undefined'){console.log(JSON.stringify(localRes))}if(typeof mass[j] === "undefined"){if(typeof localRes!='undefined') {console.log("Kostil works here");mass=localRes;mass_str=JSON.stringify(mass);return mass_str;}} if(mass[j].hasOwnProperty("country")){mass[j].profileQuestions.push({'questionId':"country", "answer": {"answer":mass[j].country}});}if(mass[j].hasOwnProperty("location")){mass[j].profileQuestions.push({'questionId':"location", "answer": {"answer":mass[j].location}});}loop3: for(var q=0; q<mass[j].profileQuestions.length; q++){if(mass[j].profileQuestions[q].questionId===condition.q2search[i].id){if(condition.q2search[i].multy===true){var satisfyMulty = false;for(var h=0; h<condition.q2search[i].result.length; h++){if(mass[j].profileQuestions[q].answer.answer.indexOf(condition.q2search[i].result[h])>-1){satisfyMulty = true;break;}}if(satisfyMulty===true){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmt4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmt4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmt5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmt5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loopmt6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loopmt6;}}}}}else{continue loop3;}}}else if(condition.q2search[i].multy===false){var satisfyMulty = true;for(var h=0; h<condition.q2search[i].result.length; h++){if(mass[j].profileQuestions[q].answer.answer.indexOf(condition.q2search[i].result[h])===-1){satisfyMulty = false;break;}}if(satisfyMulty===true){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmf4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmf4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmf5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmf5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loopmf6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loopmf6;}}}}}else{continue loop3;}}}else{if(mass[j].profileQuestions[q].answer.answer==condition.q2search[i].result){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop6;}}}}}else{continue loop3;}}}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop7: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop7;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop8: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop8;}}}}}else{continue loop3;}}}if(j==(stop-1) && q==(mass[j].profileQuestions.length)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop9: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop9;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop10: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop10;}}}}}}}}}

/*start could stay unchanged fr groups*/
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
     
        searchResObtain(respons, request); // функция создания переменной с полным списком данных для поиска
      
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
          var obj = searchConverter(res_main);
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
              obj = searchConverter(obj.entry);
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


/*main function for test here only*/
function getGroupsList(){
  var groupRequest = new XMLHttpRequest();
  groupRequest.open('GET', 'https://external.ningapis.com/xn/rest/nucleardirect/2.0/Group/recent?xn_pretty=true&fields=title,slug,description,imageUrl,url&count=100', true);
  groupRequest.setRequestHeader('Authorization', 'OAuth oauth_signature_method="PLAINTEXT",oauth_consumer_key="55e6811f-906e-4a57-87a8-dd6c019c6012",oauth_token="f482f412-061b-4621-b30b-8978e8b80d41",oauth_signature="cd3db31a-afaf-4d24-8168-a70931bd935d%26751ba839-e3ad-48ab-a81d-5aff41fde43b"');
  groupRequest.send();
  groupRequest.onreadystatechange = function() {
    if(groupRequest.readyState === 4 && groupRequest.status === 200){
      var response = JSON.parse(groupRequest.responseText);
      console.log(response);
      searchConverter(response.entry);
      generateSearchField(whiteList);
    }
  }
}

/*convertes initial json into json which would work for the search*/
function searchConverter(entryArray){
  var arrLength = entryArray.length;
  for(var i=0; i< arrLength; i++){
    var companySharedInfo = htmlToJson(entryArray[i].description);
    var keysList = Object.keys(companySharedInfo);
    entryArray[i]["profileQuestions"]=[];
    for(var j=0; j< keysList.length; j++){
      let obj = {"questionId": keysList[j] , "answer":{"answer":companySharedInfo[keysList[j]]}};
      entryArray[i]["profileQuestions"].push(obj);
    }
    entryArray[i]["profileQuestions"].push({"Company name": entryArray[i].title});
  }
  console.log(entryArray);
  return entryArray;
}

/*Converts datat from description into JSON*/
function htmlToJson(htmlText){  
  var html = x$.parseHTML(htmlText);
  var dataJson ={};
  for(var i=0; i<x$(html).find('.firstColumnItem').length; i++){
    var name = x$(x$(html).find('.firstColumnItem')[i]).find('.firstColumnItemTitle p').text();
    var text = x$(x$(html).find('.firstColumnItem')[i]).find('.firstColumnItmeText p').text();    
    dataJson[name] = text;
  }
  dataJson["Client"] =[];
  dataJson["Project"] =[];
  for(var i=0;i<x$(html).find('.gridCompanyContainer').length; i++){
    var type ="Client";
    if(i===1){
      type="Project"
    }    
    for(var j=0; j<x$(x$(html).find('.gridCompanyContainer')[i]).find('.gridCompanyElelment').length; j++){
      var elemSelected = x$(x$(html).find('.gridCompanyContainer')[i]).find('.gridCompanyElelment')[j];
      var logoUrl = x$(elemSelected).find('img').attr('src');
      var itemName = x$(elemSelected).find('h3').text();
      var descr = x$(elemSelected).find('p').text();
      dataJson[type].push({'logoUrl':logoUrl,'itemName':itemName,'descr':descr}); 
    }
  }
  console.log(dataJson);
  return dataJson;
}
/*generates the html code to add to the site body*/
function generateSearchField(whiteList){
  var htmlToPost='<div class="companySearchContainer">';
  for(var i=0; i<whiteList.length; i++){
    if(whiteList[i]==="Turn Over"){
      htmlToPost+='<div class="advancedGroupSearch"><label class="advancedSearchLabel" for="'+whiteList[i]+'">'+whiteList[i]+'</label><select class="advansedSearchSelect" id="'+whiteList[i]+'"><option selected value="Not specified">-</option><option value="Less than 1">Less than 1</option><option value="1 - 1.1">1 - 1.1</option><option value="1.1 - 1.2">1.1 - 1.2</option><option value="1.2 - 1.3">1.2 - 1.3</option><option value="1.3 - 1.4">1.3 - 1.4</option><option value="More than 1.4">More than 1.4</option></select></div>';
    }else{
      htmlToPost+='<div class="advancedGroupSearch"><label class="advancedSearchLabel" for="'+whiteList[i]+'">'+whiteList[i]+'</label><input id="'+whiteList[i]+'" class="advancedSearchInput" type="text"></div>';
    }    
  }
  htmlToPost+='<div class="groupSearchBtn" onclick="groupOnClickSearch()">Search</div><div id="searchResults"></div></div>';
  x$('.advancedGroupSearchLoader').replaceWith(htmlToPost);
}
/*function which gets info from search fields correct temp before deploy*/
function groupOnClickSearch(){
  if(window.myInterval!=undefined&&window.myInterval!='undefined'){
    window.clearInterval(window.myInterval);
  }
  if(x$('#searchResults').children().length!=0){
    x$('#searchResults').children().remove();
  }
  results=null;
  //loaderActions('add'); - temporary
  search_conditions={};
  var q2searchArray=[];
  for(var i=0;i<x$('.advancedGroupSearch').length; i++){    
    var elem = x$(x$('.advancedGroupSearch')[i]);
    if(elem.find('input[type="text"]').length!=0){
      console.log("text input search triggered");
      var res = elem.find('input[type="text"]').val();
      if(res===""){
        res="Not specified";
      }else{
        res=[res];
      }
      q2searchArray.push({'id':elem.find('input[type="text"]').attr('id'), 'result': res, "multy": "true"});
      /*}else if(elem.find('select.advansedSearchSelect')){
        console.log("select input search triggered");
        console.log(elem[0]);
        q2searchArray.push({'id':elem.find('select').attr('id'), 'result': elem.find('select').val(), "multy": "what_ever"});*/
    }else if(elem.find('select[id="Turn Over"]').length!=0){
      var res = elem.find('select[id="Turn Over"]').val();
      q2searchArray.push({'id':"Turn Over", 'result': res, "multy": "what_ever"});
    }
  }
  search_conditions = {'q2search':q2searchArray,'location':'zip'};
  resPP_end=0;
  console.log(JSON.stringify(search_conditions));
  /*Temporary hidden for test purposes*//*
  // надо проверить пустой ли результат если что то есть то рольнуть что надо
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
        // тут функция добавления результатов на фронт
        addResultsToFront();
      }
    }
  } */ 
}

/*dont change at any cost, accepts everything in string format*/
function searchResults_v2(search_massive_str, condition, startP){
  var mass = JSON.parse(search_massive_str);var massInitLeng = mass.length;var mass_str;var stop;var k=0;var localRes = [];if ((mass.length-startP)>100){stop = startP + 100;console.log('start='+startP);console.log('stop='+stop);} else {stop = mass.length;console.log('start='+startP);console.log('stop='+stop);}loop1: for(var i=0; i<condition.q2search.length; i++){if(condition.q2search[i].result==="Not specified"){if(i==(condition.q2search.length-1)){if(typeof mass_str ==="undefined"){if(localRes.length>0){mass = localRes;mass_str = JSON.stringify(mass);return mass_str;}else{var checker = 0;for(var loc_i=0; loc_i<condition.q2search.length; loc_i++){if(condition.q2search[loc_i].result==="Not specified"){checker = checker + 1;}if(loc_i==(condition.q2search.length-1)){if(checker == condition.q2search.length){mass_str = "Empty search request";return mass_str;}else{mass_str = "No results";console.log(mass_str);return mass_str;}}}}}else{return mass_str;}}else{continue loop1;}}else{if(stop > mass.length){stop=mass.length;startP=0;}else{stop=stop;}loop2: for(var j=startP; j<stop; j++){console.log("j="+j);if(typeof localRes!='undefined'){console.log(JSON.stringify(localRes))}if(typeof mass[j] === "undefined"){if(typeof localRes!='undefined') {console.log("Kostil works here");mass=localRes;mass_str=JSON.stringify(mass);return mass_str;}}loop3: for(var q=0; q<mass[j].profileQuestions.length; q++){if(mass[j].profileQuestions[q].questionId===condition.q2search[i].id){if(condition.q2search[i].multy===true){var satisfyMulty = false;for(var h=0; h<condition.q2search[i].result.length; h++){if(mass[j].profileQuestions[q].answer.answer.indexOf(condition.q2search[i].result[h])>-1){satisfyMulty = true;break;}}if(satisfyMulty===true){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmt4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmt4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmt5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmt5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loopmt6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loopmt6;}}}}}else{continue loop3;}}}else if(condition.q2search[i].multy===false){var satisfyMulty = true;for(var h=0; h<condition.q2search[i].result.length; h++){if(mass[j].profileQuestions[q].answer.answer.indexOf(condition.q2search[i].result[h])===-1){satisfyMulty = false;break;}}if(satisfyMulty===true){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmf4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmf4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loopmf5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loopmf5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loopmf6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loopmf6;}}}}}else{continue loop3;}}}else{if(mass[j].profileQuestions[q].answer.answer==condition.q2search[i].result){if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){localRes[k]=mass[j];k=k+1;mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop4: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop4;}}}}}else{localRes[k]=mass[j];k=k+1;}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop5:for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop5;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop6: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop6;}}}}}else{continue loop3;}}}}else{if(j==(stop-1) && q==(mass[j].profileQuestions.length-1)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop7: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop7;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop8: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{continue loop8;}}}}}else{continue loop3;}}}if(j==(stop-1) && q==(mass[j].profileQuestions.length)){if(localRes.length!=0){mass=localRes;localRes=[];k=0;if(i==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{loop9: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified"){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str=JSON.stringify(mass);return mass_str;}else{continue loop9;}}}}}else{if(i==(condition.q2search.length-1) || i==0){mass_str = "No results";return mass_str;}loop10: for(var f=(i+1);f<condition.q2search.length;f++){if(condition.q2search[f].result!="Not specified" && mass.length==massInitLeng){continue loop1;}else{if(f==(condition.q2search.length-1)){mass_str = "No results";return mass_str;}else{
  continue loop10;}}}}}}}}}

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
function clearMyInterval(){
  if(window.myInterval!=undefined&&window.myInterval!='undefined'){
    window.clearInterval(window.myInterval);
  }
}
/*adds results for user to see them*/
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
function appendResLoc(resLocal, i){
  var photo, locaLoc;
  if(resLocal[i].hasOwnProperty('imageUrl')===false){
    photo='https://storage.ning.com/topology/rest/1.0/file/get/126716692?profile=RESIZE_710x';
  }else{
    if(resLocal[i].imageUrl != null){
      photo = resLocal[i].imageUrl;
      if(photo.indexOf("http:")===0){
        photo = photo.split("://");
        photo = '//'+photo[1];
      }      
    }else{
      photo='https://storage.ning.com/topology/rest/1.0/file/get/126716692?profile=RESIZE_710x';
    }
  }  
  $('#searchResults').append('<div class="matrix-item matrix-sheet"><a href="'+resLocal.url+'" class="matrix-media-1-1 " style="display:block;background-image:url('+photo+');"><div class="groupHub-groupTitleContainer"><div class="groupHub-groupTitle"><span data-ux="name-group-inlist">'+resLocal[i].title+'</span></div></div></a></div>');
}

