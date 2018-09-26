function deleteFieldSet(elem){
  x$(elem).parent().remove();
}

function addFieldSet(elem) {
  var type = x$(elem).parent();
  var limit = parseInt(type.attr('data-max'));
  console.log(limit);
  var name = type.attr('class');
  var clientLogoPlaceHolder = 'https://storage.ning.com/topology/rest/1.0/file/get/80427588?profile=original';
  var projectLogoPlaceHolder = 'https://storage.ning.com/topology/rest/1.0/file/get/80427588?profile=original';
  if(x$(type).children('.preset').length>=limit){
    console.log("ERROR - limit of presets for " + type.attr('class'));    
  } else {
    var imgPlaceHolderUrl;
    if(name==="Client"){
      imgPlaceHolderUrl = 'https://storage.ning.com/topology/rest/1.0/file/get/124895260?profile=original';
    } else {
      imgPlaceHolderUrl = 'https://storage.ning.com/topology/rest/1.0/file/get/124895240?profile=original';
    }
    type.append('<fieldset class="preset"><legend>'+name+'</legend><div class="logoUploadContainer"><div class="imgContainer"><img src="'+imgPlaceHolderUrl+'"></div><p>Upload '+name.toLowerCase()+'\'s logo.</p><p>*180 px or bigger is recommended</p><p class="photoErr" style="color:red; visibility: hidden; font-size: 12px">Please choose some logo</p><input type="file" class="hidden" name="logo" accept=".jpg, .jpeg, .png"><div class="chooseFileBtn" onclick="uploadPhoto(this)">Choose File</div></div><div class="textBlock"><input type="text" name="itemname" val="" placeholder="'+name+' name"><textarea rows="14" name="description" placeholder="Description"></textarea></div><div class="removeFieldSet icons" onclick="deleteFieldSet(this)">-</div></fieldset>');
  }
}

function uploadPhoto(btn){ 
  var batya = x$(btn).parent();
  batya.children('input[name="logo"]').click();
  batya.children('input[name="logo"]').on('change', function() {
    var batya = x$(this).parent();
    var file = batya.children('input[name="logo"]')[0].files[0];
    var url = window.URL.createObjectURL(file);
    batya.find('.imgContainer img').attr('src', url);
    batya.children('p.photoErr').attr('style','color:red; visibility: hidden; font-size: 12px');
    upload(file).then(function(ImgUrl){
      batya.find('.imgContainer img').attr('src', ImgUrl);
    });
  });
}

function upload(file){ // should be checked on pre - live only
var promiseObj = new Promise(function (resolve, reject) {
  var url = 'https://storage.ning.com/topology/rest/1.0/file/upload/7050604' /*+ ning.CurrentApp.appId*/;
  var formData = new FormData();
  var request1 = new XMLHttpRequest();
  formData.append('file', file, file.name, file.type);  
  request1.open("PUT", url, true);
  request1.setRequestHeader("Content-Type","multipart/form-data");
  request1.send();
  request1.onreadystatechange = function(){
    if(request1.readyState === 4 && request1.status === 200){
      var respons = request1.responseText;
      respons = JSON.parse(respons);
      if (respons.status === 'ok' && respons.hasOwnProperty('location')===true){ 
        url = respons.location;
        console.log(respons.location);
        x$.ajax({
          url: url,
          type: 'POST',
          data: formData,
          cache: false,
          contentType: false,
          processData: false,
          xhr: function() {
            var myXhr = x$.ajaxSettings.xhr();
            if (myXhr.upload) {
              // For handling the progress of the upload
              myXhr.upload.addEventListener('progress', function(e) {
                if (e.lengthComputable) {
                  x$('progress').attr({
                    value: e.loaded,
                    max: e.total,
                  });
                }
              } , false);
            }
            return myXhr;
          },
        success: function(response, status, xhr){ 
          var ct = xhr.getResponseHeader("content-type") || "";
          if (ct.indexOf('html') > -1) {
            //do something
            console.log("Wrong, request");
            reject(error);
          }
          if (ct.indexOf('json') > -1) {
            var ImgUrl = response;
            resolve(ImgUrl);
          }
        }
      });
    }
  }
}
});
  return promiseObj;
}
/* returns promise obj with json replies data inside it */
/* calibrated working fine */
function getToSendData() {
  var promiseObj = new Promise(function (resolve, reject){
    var toSendDataJson = {};
    for (var i=0; i<x$('.columnGroup>.form-field> input').length; i++){
      var name  = x$(x$('.columnGroup>.form-field> input')[i]).attr('name');
      toSendDataJson[name] = x$('.columnGroup input[name="'+name+'"]').val();
      console.log(toSendDataJson[name]);
    }
    toSendDataJson["turnover"]=x$('select[name="turnover"]').val();
    toSendDataJson["Client"] =[];
    toSendDataJson["Project"] =[];  
    x$('fieldset').each(function(){
      var type = x$(this).children("legend").text();
      var logoUrl = x$(this).find('.imgContainer img').attr('src');
      var file;
      var itemName = x$(this).find('input[name="itemname"]').val();
      if(itemName===""){return;}
      var descr = x$(this).find('textarea[name="description"]').val();
      if (logoUrl.indexOf('blob')!=-1){
        file = x$(this).find('input[name="logo"]')[0].files[0];  
        upload(file).then(function(ImgUrl){
          logoUrl = ImgUrl;
          toSendDataJson[type].push({'logoUrl':logoUrl,'itemName':itemName,'descr':descr});
        });
      } else{
        toSendDataJson[type].push({'logoUrl':logoUrl,'itemName':itemName,'descr':descr});
      }
    });
    resolve(toSendDataJson);
  });
 return promiseObj;
}
/* converts dataJson into preset that would be shown on page in case */
function jsonToHtmlPreset(dataJson){
  /* trun over pre selelec*/
  var reply = '<div class="columnGroup"><div class="form-field"><label for="number">Contact Number</label><input clas name="number" value="'+dataJson.number+'"></div><div class="form-field"><label for="comanyUrl">Company URL</label><input name="url" value="'+dataJson.url+'"></div><div class="form-field"><label for="turnover">Turn Over</label><select name="turnover"><option value="Less than 1">Less than 1</option><option value="1 - 1.1">1 - 1.1</option><option value="1.1 - 1.2">1.1 - 1.2</option><option value="1.2 - 1.3">1.2 - 1.3</option><option value="1.3 - 1.4">1.3 - 1.4</option><option value="More than 1.4">More than 1.4</option></select></div><div class="form-field"><label for="turnover">Codes & Normes Certification</label><input name="codes" value="'+dataJson.codes+'"></div><div class="form-field"><label for="turnover">Association membership</label><input name="assoc" value="'+dataJson.assoc+'"></div></div><div class="columnGroup">';
  var text = reply.split('value="'+dataJson.turnover+'"');
  text[0] += 'value="'+dataJson.turnover+'" selected';
  reply  = text[0]+text[1];
  reply += '<h2>Client(s)</h2><div class="Client" data-max="6"><div class="addFieldset" onclick="addFieldSet(this)">Add Client</div>';
  for (var i = 0; i<dataJson.Client.length; i++){
    text = '<fieldset class="preset"><legend>'+dataJson.Client[i].itemName+'</legend><div class="logoUploadContainer"><div class="imgContainer"><img src="'+dataJson.Client[i].logoUrl+'"></div><p>Upload clients\'s logo</p><p>*180 px or bigger is recommended</p><p class="photoErr" style="color:red; visibility: hidden; font-size: 12px">Please choose some logo</p><input type="file" class="hidden" name="logo" accept=".jpg, .jpeg, .png"><div class="chooseFileBtn" onclick="uploadPhoto(this)">Choose File</div></div><div class="textBlock"><input type="text" name="itemname" val="" placeholder="'+dataJson.Client[i].itemName+' value="'+dataJson.Client[i].itemName+'"><textarea rows="14" name="description" placeholder="'+dataJson.Client[i].Description+' value="dataJson.Client[i].Description"></textarea></div><div class="removeFieldSet icons" onclick="deleteFieldSet(this)">-</div></fieldset>';
  }
  reply+=text + '</div>';
  reply += '<h2>Project(s)</h2><div class="Project" data-max="6"><div class="addFieldset" onclick="addFieldSet(this)">Add Client</div>';
  for (var i = 0; i<dataJson.Project.length; i++){
    text = '<fieldset class="preset"><legend>'+dataJson.Project[i].itemName+'</legend><div class="logoUploadContainer"><div class="imgContainer"><img src="'+dataJson.Project[i].logoUrl+'"></div><p>Upload project\'s logo</p><p>*180 px or bigger is recommended</p><p class="photoErr" style="color:red; visibility: hidden; font-size: 12px">Please choose some logo</p><input type="file" class="hidden" name="logo" accept=".jpg, .jpeg, .png"><div class="chooseFileBtn" onclick="uploadPhoto(this)">Choose File</div></div><div class="textBlock"><input type="text" name="itemname" val="" placeholder="'+dataJson.Project[i].itemName+' value="'+dataJson.Project[i].itemName+'"><textarea rows="14" name="description" placeholder="'+dataJson.Project[i].Description+' value="'+dataJson.Client[i].Description+'"></textarea></div><div class="removeFieldSet icons" onclick="deleteFieldSet(this)">-</div></fieldset>';
  }
  reply+=text + '</div></div>';
  return reply;
}
/* html from text area to DataJson*/
/* calibrated working fine */
function htmlToJson(htmlText){
  var html = x$.parseHTML(htmlText);
  var dataJson ={};
  for(var i=0; i<x$(html).find('.firstColumnItem').length; i++){
    var name = x$(x$(html).find('.firstColumnItem')[i]).find('.firstColumnItemTitle p').text();
    var text = x$(x$(html).find('.firstColumnItem')[i]).find('.firstColumnItmeText p').text();
    name = nameConverter(name);
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
  return dataJson;
}
/*DataJson to Html that should be posted in textarea*/
function jsonToHtml(dataJson) {
  var htmlText;
  var htmlText_firstColumn="";
  var htmlText_secondColumn="";  
  var keys = Object.keys(dataJson);
  for(var i=0; i<keys.length; i++){
    if(keys[i]==="Client" || keys[i] === "Project"){
      if(keys[i]==="Client"){
        htmlText_secondColumn+="<h2>Clients</h2>";
      }else{
        htmlText_secondColumn+="<h2>Projects</h2>";
      }
      var entry='<div class="gridCompanyContainer">';
      for(var j=0; j<dataJson[keys[i]].length; j++){
        entry+='<div class="gridCompanyElelment"><div class="gridImgContainer"><img src="' + dataJson[keys[i]][j].logoUrl + '"></div><h3>' + dataJson[keys[i]][j].itemName + '</h3><p>' + dataJson[keys[i]][j].descr + '</p></div>';
        if(j===(dataJson[keys[i]].length-1)){
          entry+= '</div>';          
        }        
      }
      htmlText_secondColumn+=entry;
    }else{
      htmlText_firstColumn+='<div class="firstColumnItem"><div class="firstColumnItemTitle"><p>' + nameConverter(keys[i]) + '</p></div><div class="firstColumnItmeText"><p>' + dataJson[keys[i]] + '</p></div></div>';      
    }
  }
  /*end of function here*/
  htmlText = '<div class="aboutCompany"><div class="aboutCompanyColumn"><div class="aboutCompanyContainer">'+htmlText_firstColumn+'</div></div><div class="aboutCompanyColumn"><div class="aboutCompanyContainer">'+htmlText_secondColumn+'</div></div></div>';
  return htmlText;  
}
/*Convert label into name and backwards*/
function nameConverter(txt) {
  var name;
  switch (txt){
    case "Contact Number": 
      name = "number";
      break;
    case "Company URL": 
      name = "url";
      break;
    case "Turn Over": 
      name = "turnover";
      break;
    case "Codes & Normes Certification": 
      name = "codes";
      break;
    case "Association membership": 
      name = "assoc";
      break;
    case "assoc": 
      name = "Association membership";
      break;
    case "codes": 
      name = "Codes & Normes Certification";
      break;
    case "turnover": 
      name = "Turn Over";
      break;
    case "url": 
      name = "Company URL";
      break;
    case "number": 
      name = "Contact Number";
      break;
    default:
      name = "Undefined"
      break;
  }
  return name;
}
