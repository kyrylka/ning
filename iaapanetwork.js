document.addEventListener('DOMContentLoaded', function (){
  window.addEventListener('resize', function(){
    if(window.matchMedia("(max-width: 768px)").matches){
      if(x$('.tabContainerSection-tabs.subnavline.menuCopy').length===0){
        mobMenu();
      }else{
        x$('.tabContainerSection-tabs.subnavline.menuCopy').show();        
        //x$(x$('.tabContainerSection-tabs.subnavline')[0]).css('display');
      }      
    }
  });
});
function mobMenu(){
  x$('.tabContainerSection-tabs.subnavline').clone().addClass("menuCopy").removeClass('.tabContainerSection-tabs').appendTo('body');
  var originalMenu = x$('.tabContainerSection-tabs.subnavline');
  for(var i=0; i<originalMenu.length; i++){
    if(x$(originalMenu[i]).hasClass('menuCopy')===false){
      originalMenu=originalMenu[i];
    }
  }
  var originalMenuElements = x$(originalMenu).children();
  console.log(originalMenuElements);
  x$('.tabContainerSection-tabs.subnavline.menuCopy').children().each(function(){
    var el=x$(this);
    el.off();
    console.log(el.hasClass('current'));
    var relatedElement='';
    for(let i=0; i< originalMenuElements.length; i++){
       if(el[0].innerText.trim()===originalMenuElements[i].innerText.trim()){
         relatedElement=originalMenuElements[i];
       }
    }
    el.on("click", function(){
      console.log(el[0]);
      relatedElement.click();
      x$('.tabContainerSection-tabs.subnavline.menuCopy .current').removeClass('current');
      el.addClass('current');
      
    });    
  });  
}
