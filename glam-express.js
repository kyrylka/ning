x$(window).load(function() {
        // SUSTITUTE FOR CSS FIRST-AND LAST-CHILD
        x$('.class-name li').last().css('margin-right',0);
        
        // INPUT FIELD AUTO CLEAR
        //x$('.clearField').clearField();        
        
        // PAGE LOADING
        x$(".loading").fadeOut(function(){
                setTimeout(function(){x$(".loading").remove(); },2000);
                x$('body').removeClass('hide');
        });
        
        // Menu Hover Effect
        x$('.menu-list > ul > li').bind('mouseenter',function(){
                x$('.menu-img img',this).stop(true).css('z-index','3').animate({'width':'166px','height':'166px','left':'0px','top':'-51px'},400,'easeOutBack');
                x$('.span1',this).css({'position':'absolute', 'left':'0', 'border':'1px solid #a4a3a3','padding':'50px 0px 50px 12px', 'width':'141px'});
                x$('.span1',this).animate({'top':'80px'},400,'easeOutBack', function(){
                        x$('.inner-list',this).css({'display':'block !important'}).show( "slide",{ direction: "left" }, 150);
                        
                });
        }).bind('mouseleave', function(){
                x$('.menu-img img',this).stop(true,true).css('z-index','0').animate({'width':'0','height':'0','left':'85px','top':'-0px'},400,'easeOutBack');
                x$('.span1',this).stop(true,true).css({'position':'absolute', 'left':'0', 'border':'none','padding':'24px 0px 24px 12px', 'width':'141px'});
                x$('.span1',this).stop(true,true).animate({'top':'0px'},400,'easeOutBack');
                x$('.inner-list, inner-list-2',this).hide();
        });
        

                        
        
        // Home Small Slider
        x$('#small-slider').flexslider({
                animation: "slide",
                smoothHeight: true,
                directionNav: false
        });
        
        // Home banner Slider
        x$('#banner-slider').flexslider({
                directionNav: false,
                smoothHeight: true,
                animation: "fade"
        });
        
        // Template Slider 
        x$('#template-slider').flexslider({
                directionNav: true,
                smoothHeight: true,
                animation: "slide"
        });
        
        x$('#giveaway-slider').flexslider({
                directionNav: true,
                controlNav: false,
                smoothHeight: true,
                animation: "slide"
        });
        
        // Video Slider 
        x$('#video-carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        slideshow: false,
        smoothHeight: true,
        itemWidth: 107,
        itemMargin: 5,
                minItems: 0,   
                maxItems: 0,
        asNavFor: '#video-slider'
    });

    x$('#video-slider').flexslider({
        animation: "slide",
        controlNav: false,
                directionNav: false,
        animationLoop: true,
        slideshow: false,
        smoothHeight: true,
        sync: "#video-carousel"
    });
        
        // Video Slider 
        x$('#photo-carousel').flexslider({
        animation: "slide",
        controlNav: false,
        animationLoop: true,
        smoothHeight: true,
        slideshow: false,
        itemWidth: 72,
        itemMargin: 5,
                minItems: 5,   
                maxItems: 5,
        asNavFor: '#photo-slider'
    });

    x$('#photo-slider').flexslider({
        animation: "slide",
        controlNav: false,
                directionNav: false,
        animationLoop: true,
        slideshow: false,
        smoothHeight: true,
        sync: "#photo-carousel"
    });
        
        
        // Member Giveaways
        x$(".date_year").datepicker({
                showOn: 'button',
                buttonImage: "images/member/calendar.jpg", 
                buttonText: '',
                buttonImageOnly: false,
                showAnim: 'fadeIn',
                dateFormat: 'mm/dd/yy',
                onClose: function (dateText, picker) {
                        dateArr = dateText.split('/');
                        x$(this).parent().siblings().children('.date_month').val(dateArr[0]);
                        x$(this).parent().siblings().children('.date_day').val(dateArr[1]);
                        x$(this).val(dateArr[2]);
                }
        });
        
        
        // Back to Top
        x$('.back-top').click(function(e) { x$('body, html').animate({scrollTop:x$(window).height() == 0}, 1000); event.preventDefault();});
        
        // Blog
        x$('.archives p').click(function(){
                x$(this).toggleClass('open');
                x$(x$(this).parent().children()[1]).slideToggle();
        });
        
        // Scroll
        x$(".scroll-holder,.pp-scroll").mCustomScrollbar({
                scrollEasing:"easeOutQuint",
                autoDraggerLength:false
        });
        
        // Top Trends
        x$('.top-trends').mouseenter(function(){
                x$('.trending').fadeIn();
        });
        
        x$('.top-trends').mouseleave(function(){
                x$('.trending').stop(true,true).fadeOut();
        });
        
        // Blog Post
        x$('.new-left ul li a').mouseenter(function(){
                x$('.link-hover',this).fadeIn();
        });
        x$('.new-left ul li a').mouseleave(function(){
                x$('.link-hover',this).stop(true,true).fadeOut();
        });
        
        // Join Message 
        x$('.join-now').addClass('bounceInUp animated');
        
        x$('.join-close').click(function(){
                x$('.join-now').removeClass('bounceInUp animated');
                x$('.join-now').addClass('bounceOutDown animated');
                
                return false;
        });
        
        // Message 
        // NOtification
        x$('.msgs').click(function(){
                x$('.message-pp').fadeIn();
        });
        
        
        var notH = 1,
    x$pop = x$('.message-pp').hover(function(){notH^=1;});
        x$(document).on('mouseup keyup', function( e ){
          if(notH||e.which==27) x$pop.stop().fadeOut();
        });
        
        // Photo Edit 
        x$('.photo-edit,.photo-single-holder,.video-main,.make-over-holder').height(innerHeight - 100 );
        
        // Mobile Menu 
        x$('.glam-mobile-menu li p').click(function(){
                x$(this).toggleClass('opens');
                x$(x$(this).parent().children()[1]).slideToggle();
        });
        
        // POP UP
        
        jQuery(".add-pp").colorbox({inline:true, minWidth:'94%', maxWidth:'94%', innerHeight:'auto'});
        jQuery(".add-pp").colorbox({inline:true, innerWidth:433 });
                
        var resizeTimer;
        function resizeColorBox()
                {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function() {
                        if (jQuery('#cboxOverlay').is(':visible')) {
                                        jQuery.colorbox.load(true);
                        }
                }, 300)
        }
        
        jQuery(window).resize(resizeColorBox);
        window.addEventListener("orientationchange", resizeColorBox, true);
        
        
});

// Phote Edit 
x$(window).resize(function(){
        x$('.photo-edit,.photo-single-holder,.video-main,.make-over-holder').height(innerHeight - 100 );
});



        //blocksit define
        x$(window).load( function() {
                x$('#container').BlocksIt({
                        numOfCol: 4,
                        offsetX: 8,
                        offsetY: 8
                });
        });
        
        
        //window resize
        var currentWidth = 871;
        x$(window).resize(function() {
                var winWidth = x$(window).width();
                var conWidth;
                if(winWidth < 450) {
                        conWidth = 203;
                        col = 1
                } else if(winWidth < 660) {
                        conWidth = 450;
                        col = 2
                } else if(winWidth < 880) {
                        conWidth = 660;
                        col = 3
                } else if(winWidth < 871) {
                        conWidth = 871;
                        col = 4;
                } else {
                        conWidth = 871 ;
                        col = 4;
                }
                
                if(conWidth != currentWidth) {
                        currentWidth = conWidth;
                        x$('#container').width(conWidth);
                        x$('#container').BlocksIt({
                                numOfCol: col,
                                offsetX: 8,
                                offsetY: 8
                        });
                }
        });
        
        x$(window).load(function() {
                var winWidth = x$(window).width();
                var conWidth;
                if(winWidth < 450) {
                        conWidth = 203;
                        col = 1
                } else if(winWidth < 660) {
                        conWidth = 450;
                        col = 2
                } else if(winWidth < 880) {
                        conWidth = 660;
                        col = 3
                } else if(winWidth < 871) {
                        conWidth = 871;
                        col = 4;
                } else {
                        conWidth = 871 ;
                        col = 4;
                }
                
                if(conWidth != currentWidth) {
                        currentWidth = conWidth;
                        x$('#container').width(conWidth);
                        x$('#container').BlocksIt({
                                numOfCol: col,
                                offsetX: 8,
                                offsetY: 8
                        });
                }
        });


