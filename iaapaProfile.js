function init(){
    var controlsList={"comments":'https://firebasestorage.googleapis.com/v0/b/iaapalikecalculator.appspot.com/o/comments.svg?alt=media&token=46e56e46-294c-4e0b-8575-5b16ad024f51',
    "share":'https://firebasestorage.googleapis.com/v0/b/iaapalikecalculator.appspot.com/o/share.svg?alt=media&token=7f3b598e-00d4-4306-b872-3a1027d88a17',
    "thumbUp":'https://firebasestorage.googleapis.com/v0/b/iaapalikecalculator.appspot.com/o/thumb_up.svg?alt=media&token=dc5d775c-5e39-42b6-9a3f-55ee61067542'};
    x$('.activityFeed-counts').each(function(){
        if(x$(this).find(".activityThumbUp").length===0){
        var curGreenContainer = this;
        if(x$(curGreenContainer).find('.activityFeed-commentFormDisplay').length!=0){
            let elem = x$(curGreenContainer).find('.activityFeed-commentFormDisplay');
            elem.empty().append('<div class="activityComments"><span class="number"></span><img src="'+controlsList.comments+'"><span class="text">Comments</span></div>')
        }else{
            x$(curGreenContainer).append('<div class="activityComments" onclick="btnClicked(this)"><span class="number"></span><img src="'+controlsList.comments+'"><span class="text">Comments</span></div>');
        }
        x$(curGreenContainer).append('<div class="activityThumbUp"><span class="number"></span><img src="'+controlsList.thumbUp+'"><span class="text">Thumbs Up</span></div>');
        x$(curGreenContainer).append('<div class="activityShare"><span class="number"></span><img src="'+controlsList.share+'"><span class="text">Shares</span></div>');
        var commentBtn = x$(curGreenContainer).children('.activityComments');
        var url=x$(curGreenContainer).parent().find('.activityFeed-more > a').attr('href');             
        //commentBtn[0].addEventListener("click", initComments, false);        
        commentBtn = x$(curGreenContainer).children('.activityThumbUp');        
        commentBtn[0].addEventListener("click", initLike, false);
        var url2;
        if(typeof url === "undefined"){
            url=[];
            url[1] = "notspecified";
        }else{
            url2=url.slice(8).split('/');
            url2=encodeURI(url2[1]);
        }                
        commentBtn[0].infoToPass=url2;
        if(typeof url!="undefined"){
            getCount(url).then((totals)=>{
                x$(curGreenContainer).find('.activityShare > span.number').text(totals);
            }, (err)=>{
                console.log("Error "+err+' occured.Please review the code');
            });
                      
            likeActions(url2, "read", "none").then((message)=>{
                if(typeof message !="string"){
                    x$(curGreenContainer).find('.activityThumbUp > span.number').text(message);
                }else{
                    popUp(message);
                }                
            }, (err)=>{
                console.log("Error "+err+' occured.Please review the code');
            });
        }
    }     
    });
    x$('.videoListPage-row:last-child').each(function(){
        if(x$(this).find(".activityThumbUp").length===0){
        var curGreenContainer = this;        
        x$(curGreenContainer).append('<div class="activityComments" onclick="btnClicked(this)"><span class="number"></span><img src="'+controlsList.comments+'"><span class="text">Comments</span></div>');
        x$(curGreenContainer).append('<div class="activityThumbUp"><span class="number"></span><img src="'+controlsList.thumbUp+'"><span class="text">Thumbs Up</span></div>');
        x$(curGreenContainer).append('<div class="activityShare"><span class="number"></span><img src="'+controlsList.share+'"><span class="text">Shares</span></div>');
        var commentBtn = x$(curGreenContainer).children('.activityComments');
        var url=x$(curGreenContainer).find('.videoListPage-metaComments > a').attr('href');             
        //commentBtn[0].addEventListener("click", initComments, false);        
        commentBtn = x$(curGreenContainer).children('.activityThumbUp');        
        commentBtn[0].addEventListener("click", initLike, false);
        var url2;
        if(typeof url === "undefined"){
            url=[];
            url[1] = "notspecified";
        }else{
            url2=url.slice(8).split('/');
            url2=encodeURI(url2[1]);
        }                
        commentBtn[0].infoToPass=url2;
        if(typeof url!="undefined"){
            getCount(url).then((totals)=>{
                x$(curGreenContainer).find('.activityShare > span.number').text(totals);
            }, (err)=>{
                console.log("Error "+err+' occured.Please review the code');
            });
                      
            likeActions(url2, "read", "none").then((message)=>{
                if(typeof message !="string"){
                    x$(curGreenContainer).find('.activityThumbUp > span.number').text(message);
                }else{
                    popUp(message);
                }                
            }, (err)=>{
                console.log("Error "+err+' occured.Please review the code');
            });
        }
    }     
    });
}
function initComments(event){
    var commentsButton=x$(event.target);
    if(commentsButton.hasClass('.activityComments')===false){
        commentsButton = x$(commentsButton).closest('.activityComments');
    }
    //commentsButton[0].infoToPass - info abou the parnt is stored here;
    commentsButton[0].addEventListener("click", function(event){
        console.log(event.target);
        btnClicked(commentsButton[0]);
    });    
}
/*
function addButtons(){
    if(x$('.section-member-activity').length!=0){
        x$('.feed-story').each(function(){
            var child = x$(this).find('.activityFeed-comments');
            if(x$(child).length!=0){
                var itemId = x$(child).attr('data-parent-item-id');
                console.log(itemId);
                var det = itemId.split(':');
                if(det[1]==="BlogEntry"){
                    x$(this).find('.js-activityFeedReactions').append('<div class="btn_frame" onclick="btnClicked(this)">Comment</div>');
                }
            }
        });
    }
}
*/
function initLike(event){
    var likeButton=x$(event.target);
    if(likeButton.hasClass('.activityThumbUp')===false){
        likeButton = x$(likeButton).closest('.activityThumbUp');
    }    
    if(ning.CurrentProfile!= null && typeof ning.CurrentProfile != 'undefined'){
        likeActions(likeButton[0].infoToPass, "update", ning.CurrentProfile.id).then((message)=>{
            if(typeof message !="string"){
                likeButton.find('span.number').text(message);
            }else{
                popUp(message);
            }
        });
    }
    
}

function likeActions(url, action, user){
    var promiseObj = new Promise(function(resolve, reject) {        
        url ="https://us-central1-iaapalikecalculator.cloudfunctions.net/addMessage?url=" + url + "&action="+action+"&user="+user;
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.send();
        request.onreadystatechange = function() {
          if (request.status === 200 && request.readyState === 4) {
                var resp = JSON.parse(request.responseText);
                var message;
                if(resp.status==="success"){
                    message = resp.likes;
                }else{
                    if(resp.hasOwnProperty("message")){
                        message = resp.message;
                    }else{
                        message = "Unexpected error has occurred";
                    }
                }
                resolve(message);
          } else if(request.readyState === 4 && request.status != 200){
                reject(request.status);
            }
        };
    });
    return promiseObj;
}


function getCount(url) {    
    var promiseObj = new Promise(function(resolve, reject) {
        if(typeof url==="undefined"|| url.indexOf("notspecified")>0){
           resolve(0);
        }
      url = encodeURIComponent(url);
      url ="https://api.sharedcount.com/v1.0/?url=" + url + "&apikey=e303061bf34ee5a296810302cdcd933f6cc0502a";
      var request = new XMLHttpRequest();
      request.open("GET", url, true);
      request.send();
      request.onreadystatechange = function() {
        if (request.status === 200 && request.readyState === 4) {
            var resp = JSON.parse(request.responseText);
            var totals = ifNull(resp.GooglePlusOne) + ifNull(resp.StumbleUpon) + ifNull(resp.LinkedIn) + resp.Pinterest + resp.Facebook.share_count;
            console.log(totals);
            resolve(totals);
        } else if(request.readyState === 4 && request.status != 200){
            reject(request.status);
        }
      };
    });
    return promiseObj;
}  
function ifNull(number) {
    if (number === null) {
        number = 0;
        return number;
    } else {
        return number;
    }
}

function popUp(message){
    alert(message);
}
