var _functions = {};

jQuery(function($) {

	"use strict";

	/*================*/
	/* 01 - VARIABLES */
	/*================*/
	var swipers = [], winW, winH, winScr, lastWinScr, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i), _isFF = 'MozAppearance' in document.documentElement.style;

	/*========================*/
	/* 02 - page calculations */
	/*========================*/
	_functions.pageCalculations = function(){
		winW = $(window).width();
		winH = $(window).height();
	};

	/*=================================*/
	/* 03 - function on document ready */
	/*=================================*/

	// Check if mobile mobile device
	if(_ismobile) $('body').addClass('mobile');

	// Main set time out for content loaded
	setTimeout( function() {
		// Add class after page loaded
		$('body').addClass('loaded');

		$('.stickyWrapper').css('height', $('.stickyContent').outerHeight());

		// Page calculations functuin
		_functions.pageCalculations();

		// // Custom select init
		if( $('.SelectBox').length ) $('.SelectBox').SumoSelect(); 


		if( $('.stickyWrapper').length ) $('.stickyWrapper').css('height', $('.stickyContent').outerHeight());

		// Delate main page loader
		$('#loader-wrapper').fadeOut(300);

		// Swiper init function
		_functions.initSwiper();

		// World map
		if ( $('#map-wrapper').length ) $('map').imageMapResize();

		// Jarallax
	    if ( $('.jarallax').length && !_ismobile ) {
	    	$('.jarallax').jarallax({
			    speed: 0.2
			});
	    }

	    // Page animations
	    if (!_ismobile) {
	    	sectionCoordinates();
	    	animateSections();

	    	if ( $(document).height() == $(window).scrollTop() + $(document).height() ) {
				$('footer').addClass('animetLines');
			}

			// Scroll bar
			if ( $(".customScrollBar").length ) {
		    	$(".customScrollBar").mCustomScrollbar({
					callbacks:{
					    onCreate: function(){
					      	overflowContent(); 
					    }
					}
		    	});
			}
	    }

	}, 800);

	/*==============================*/
	/* 04 - function on page resize */
	/*==============================*/
	_functions.resizeCall = function(){
		_functions.pageCalculations();
	};
	
	if(!_ismobile){
		$(window).resize(function(){
			_functions.resizeCall();

			setTimeout(function() {
				overflowContent();
			},0);

		});
	} else{
		window.addEventListener("orientationchange", function() {
			_functions.resizeCall();
		}, false);
	}

	/*==============================*/
	/* 05 - function on page scroll */
	/*==============================*/
	$(window).scroll(function(){
		_functions.scrollCall();
	});

	_functions.scrollCall = function(){
		winScr = $(window).scrollTop();

		// Sticky content function
		sticky();

		// Counter number function
		counterNumber();

		// Scroll up/down 
		if (winScr < lastWinScr) { // Scroll up
	       $('body').removeClass('headerHidden');
	    } else if ( $('.stickyWrapper').length && winScr >= ( $('.stickyWrapper').offset().top + $('.headerTopBar').outerHeight() ) ) { // Scroll down
	    	$('body').addClass('headerHidden');
	    }
	    lastWinScr = winScr; // last winSrc step

		// Header scrolled styles
		if ( $('header').outerHeight() < winScr ) {
			$('header').addClass('scrolled');
		} else {
			$('header').removeClass('scrolled');
		}

		if ( $('.locationNaVPosition').length &&  winScr > $('.bannerWrapper').offset().top + $('.bannerWrapper').outerHeight() - $('header').outerHeight() ) {
			$('.stickyContent').addClass('stickyBorders');
		} else {
			$('.stickyContent').removeClass('stickyBorders');
		}

		// Anchor sticky menu
		if ( $('.anchorNav').length ) {
			$('.listNav.anchorNav a').each(function () {
		        var $t = $(this),
		        	scrollPath = $($t.attr("href")),
		        	thisOffset = $('header').outerHeight() + $('.stickyWrapper').outerHeight();

		        if ( _ismobile && scrollPath.offset().top <= winScr && scrollPath.offset().top + scrollPath.outerHeight() > winScr ) {
					$('.stickyTitle').html( $('.listNav li.active a').html() );
		        }

		        if ( ( scrollPath.offset().top - thisOffset ) <= winScr && scrollPath.offset().top + scrollPath.outerHeight() > winScr) {
		            $('.listNav li').removeClass("active");
		            $t.parent().addClass("active");
		        }
		        else{
		            $t.parent().removeClass("active");
		        }
		    });
		}

		if ( $('.stickyWrapper').length && winScr === 0) {
			$('.destopSticky').removeClass('sticky');
			$('body').removeClass('headerHidden');
		}

		if (!_ismobile) {
			// Page animations
			animateSections();

			// Footer lines anination
			if ( $(document).height() == winScr + winH ) {
				$('footer').addClass('animetLines');
			}
		}
	};

	/*=====================*/
	/* 06 - swiper sliders */
	/*=====================*/
	var initIterator = 0;
	_functions.initSwiper = function(){
		$('.swiper-container').not('.initialized').each(function(){								  
			var $t = $(this);								  

			var index = 'swiper-unique-id-'+initIterator;
			
			$t.addClass('swiper-'+index+' initialized').attr('id', index);
			$t.parent().find('.swiper-pagination').addClass('swiper-pagination-'+index);
			$t.parent().find('>.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.parent().find('>.swiper-button-next').addClass('swiper-button-next-'+index);
			$t.parent().find('>.swiper-scrollbar').addClass('swiper-scrollbar-'+index);

			var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1;
			if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);

			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				pagination: '.swiper-pagination-'+index,
		        paginationClickable: true,
		        nextButton: '.swiper-button-next-'+index,
		        prevButton: '.swiper-button-prev-'+index,
		        scrollbar:'.swiper-scrollbar-'+index,
        		scrollbarHide: false,
        		scrollbarDraggable: true,
        		scrollbarSnapOnRelease: true,
		        slidesPerView: slidesPerViewVar,
		        slidesPerGroup: ($t.is('[data-group]'))?parseInt($t.attr('data-slides-per-view'), 10):1,
		        autoHeight:($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
		        loop: ($t.is('[data-loop]'))?parseInt($t.data('loop'), 10):0,
				autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
		        breakpoints: ($t.is('[data-breakpoints]'))? { 
		        	767: { slidesPerView: parseInt($t.attr('data-xs-slides'), 10), slidesPerGroup: ($t.attr('data-xs-slides')!='auto' && $t.data('center')!='1' && $t.data('group')=='1')?parseInt($t.attr('data-xs-slides'), 10):1 }, 
		        	991: { slidesPerView: parseInt($t.attr('data-sm-slides'), 10),slidesPerGroup: ($t.attr('data-sm-slides')!='auto' && $t.data('center')!='1' && $t.data('group')=='1')?parseInt($t.attr('data-xs-slides'), 10):1 }, 
		        	1199: { slidesPerView: parseInt($t.attr('data-md-slides'), 10),slidesPerGroup: ($t.attr('data-md-slides')!='auto' && $t.data('center')!='1' && $t.data('group')=='1')?parseInt($t.attr('data-xs-slides'), 10):1 }, 
		        	1500: {slidesPerView: parseInt($t.attr('data-lt-slides'), 10),slidesPerGroup: ($t.attr('data-lt-slides')!='auto' && $t.data('center')!='1' && $t.data('group')=='1')?parseInt($t.attr('data-xs-slides'), 10):1} } : {},
		        initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
		        speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
		        keyboardControl: true,
		        mousewheelControl: ($t.is('[data-mousewheel]'))?parseInt($t.data('mousewheel'), 10):0,
		        mousewheelReleaseOnEdges: true,
		        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
				spaceBetween: ($t.is('[data-space]'))?parseInt($t.data('space'), 10):0,
				parallax: (_isFF)?($t.data('parallax'), 0): ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
				centeredSlides: ($t.is('[data-centered]'))?parseInt($t.data('centered'), 10):0,
				simulateTouch:($t.is('[data-touch]')) ? 'false' : true,
				onProgress: function(swiper) { 
					if ( $('.swiper-counter').length ) { // Mobile counter
						if ( $('.swiper-counter').length && winW < 768 ) {
							$('.swiper-slide').removeClass('swiper-counter');
							$t.find('.swiper-slide-active, .swiper-slide-next, .swiper-slide-next + .swiper-slide, .swiper-slide-next + .swiper-slide + .swiper-slide ').addClass("swiper-counter");
							
							setTimeout( function(){
								counterNumber();
							},0 );

						} else if ( $('.swiper-counter').length ) {
							$('.swiper-slide').removeClass('swiper-counter');
							$t.find('.swiper-slide-active, .swiper-slide-next, .swiper-slide-next + .swiper-slide, .swiper-slide-next + .swiper-slide + .swiper-slide ').addClass("swiper-counter");
							
							setTimeout( function(){
								counterNumber();
							},0 );
						}
					}
				},
				onTransitionEnd: function(swiper) {
					if ( $('.swiper-counter').length && winW < 768 ) { // Mobile counter
						$('.swiper-slide').removeClass('swiper-counter');
						$t.find('.swiper-slide-active').addClass("swiper-counter");
						
						setTimeout( function(){
							counterNumber();
						},0 );

					} else if ( $('.swiper-counter').length ) {
						$('.swiper-slide').removeClass('swiper-counter');
						$t.find('.swiper-slide-active, .swiper-slide-next, .swiper-slide-next + .swiper-slide, .swiper-slide-next + .swiper-slide + .swiper-slide ').addClass("swiper-counter");
						
						setTimeout( function(){
							counterNumber();
						},0 );
					}
				},
				onInit: function(swiper) {

					if ( $('.swiper-counter').length && winW < 768 ) {
						setTimeout(function() { // Mobile counter
							$t.find('.swiper-slide-active').addClass("swiper-counter");
							counterNumber();
						}, 0);
					} else {
						setTimeout(function() {
							$t.find('.swiper-slide-active, .swiper-slide-next, .swiper-slide-next + .swiper-slide, .swiper-slide-next + .swiper-slide + .swiper-slide ').addClass("swiper-counter");
							counterNumber();
						}, 0);
					}
				}
			});
			swipers['swiper-'+index].update();
			initIterator++;
		});

		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-top').attr('id')];
		});
	};

	$('.swiper-control-bottom .swiper-slide').on('click', function(){
		swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-top').attr('id')].slideTo($(this).index());
	});

	/*==============================*/
	/* 07 - buttons, clicks, hovers */
	/*==============================*/

	//open and close popup
	$(document).on('click', '.open-popup', function(e){
		e.preventDefault();
		if ( $(this).attr('data-video-src') ) { //Check if video popup
	 		var videoSrc = $(this).attr('data-video-src');

				setTimeout(function() {
					$('.popupContent').find('iframe').attr('src', videoSrc + '??modestbranding=1;iv_load_policy=0;modestbranding=1;showinfo=0&amp;autoplay=1');
				},400);
				$('.popupContent').removeClass('active');
			}

		if (  $(this).closest('iframePopup') ) { //Check if iframe world popup
			var iframeSrc = $(this).attr('data-iframe');

			setTimeout(function() {
					$('.popupContent').find('iframe').attr('src', iframeSrc );
				},400);

			$('.popupContent').removeClass('active');
		}
		$('.popupContent').removeClass('active');
		$('.popupWrapper, .popupContent[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	});

	$(document).on('click', '.popupWrapper .buttonClose, .popupWrapper .layerClose', function(){
		$('.popupWrapper, .popupContent').removeClass('active');
		$('.popupContent').find('iframe').attr('src', '');
		$('html').removeClass('overflow-hidden');
		setTimeout(function(){
			$('.ajax-popup').remove();
		},300);
		return false;
	});
	
	//Function OpenPopup
	function openPopup(foo){
		$('.popup-content').removeClass('active');
		$('.popup-wrapper, .popup-content[data-rel="'+foo+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	}

	//Tabs
	var tabsFinish = 0;
	$('.tabMenu').on('click', function() {
		if($(this).hasClass('active') || tabsFinish) return false;
		tabsFinish = 1;

        var tabsWrapper = $(this).closest('.tabsBlock'),
        	tabsMenu = tabsWrapper.find('.tabMenu'),
        	tabsItem = tabsWrapper.find('.tabEntry'),
        	index = tabsMenu.index(this);
        
        tabsItem.removeClass('tabAnimated');

        tabsItem.filter(':visible').fadeOut( function(){
        	tabsItem.eq(index).fadeIn(500, function(){
        		tabsFinish = 0;
        	});
        	tabsItem.eq(index).addClass('tabAnimated');
        });
        tabsMenu.removeClass('active');
        $(this).addClass('active');

        if ( $('.mobileTabMenu').is(':visible') ) {
        	$('.mobileTabMenu .as').html($(this).find('.tabTitle').html());
        	$('.mobileTabMenu .angleIconDown').removeClass('rotate');
        	$(this).closest('.tabsMenuWrapp').slideUp(300);

        }
    });

    // Counter number animation
    
    function counterNumber() {
        
	    if ( $('.count').length && ( $('.counterWrapper').offset().top - $(window).height() /1.5 ) < $(window).scrollTop() ) {
	    	$('.counterWrapper .swiper-counter').not('.countEnd').each(function () {
	        	var thisCount = $(this).find('.countValue');

	        	$(this).addClass('countEnd');
	            thisCount.parent().addClass('showNumber');

	            thisCount.prop('Counter',0).animate({ 
	                Counter: thisCount.text()
	            }, {
	                duration: thisCount.parent().attr('data-counter-duration') ? parseInt(thisCount.parent().attr('data-counter-duration')  ) : 6000,
	                easing: 'linear',
	                step: function (now) {
	                    thisCount.text(Math.ceil(now));
	                }
	            });
	        });
	    }
    }

    // World map 
    $('#map-wrapper area').on('mouseover', function(){ //Hover on
        $('.image-hover').removeClass('active');
        $('.map-title').removeClass('active');
        $('.image-hover[data-rel="'+$(this).data('rel')+'"]').addClass('active');
        $('.map-title[data-rel="'+$(this).data('rel')+'"]').addClass('active');
    });

    $('#map-wrapper area').on('mouseout', function(){ //Hover out
        $('.image-hover').removeClass('active');
        $('.map-title').removeClass('active');
    });

    $('#map-wrapper area').on('click', function() { //Click on continents for show brands detail
        $('.mapDetailsWrapper').addClass('active');
        $('.mapDetail').removeClass('active');
        $('.mapDetail[data-mapCode="' + $(this).data('rel') + '"]' ).addClass('active');
    });

    $('.mapDetailsWrapper .buttonClose').on('click', function() {
    	$('.mapDetailsWrapper').removeClass('active');
    });

    // Mobile map select
    $('.responsiveTabNav').on('click', function() {
    	$(this).find('i').toggleClass('rotate');
    	$(this).siblings('.responsiveMapList').slideToggle(350);
    });

    $('.responsiveMapList li').on('click', function() {
        var listMapName = $(this).attr('data-mapCode');
        $('.responsiveTabNav .as').html($(this).html());
        $('.mapDetailsWrapper').addClass('active');
        $('.mapDetail').removeClass('active');
        $('.mapDetail[data-mapCode="' + listMapName + '"]').addClass('active');
        $(this).parent().slideUp(350);
        $('.responsiveTabNav').removeClass('active');
        $('.responsiveTabNav i').removeClass('rotate');
    });

    // Mobile sticky
    $('.mobileStickynav').on('click', function() {
    	$(this).parent().find('.listNav').slideToggle(350);
    	$(this).find('i').toggleClass('rotate');
    });

    // Header search
    $('.searchToggle').on('click', function() {
    	// setTimeout( function() {
    	// 	$('.seacrhInput .simpleInput').focus();
    	// }, 0);

    	$('header').toggleClass('searchActive');

    	if ( $('header').hasClass('searchActive') ) {
    		checkInput();
    		
    	} else {
    		clearTimeout(checkInputFocus);
    	}

    });

    // Header search
    var checkInputFocus; // Hide search affter 5s inactive
    function checkInput() {
    	if ( $('.seacrhInput').is(':visible') ) {
    		checkInputFocus = setTimeout( function() {
    			$('header').removeClass('searchActive');
    		}, 5000);
    	}
    }

    $('.seacrhInput .simpleInput').focus(function() {
    	clearTimeout(checkInputFocus);
    });

    $('.seacrhInput .simpleInput').blur(function() {
    	checkInput();
    });

    // Mobile page language
    $('.pageLanguage').on('click', function() {
    	if ( $('.hamburger').is(':visible') ) {
    		$(this).find('ul').slideToggle(350);
    	}
    });

    // Hamburger
    $('.hamburger').on('click', function() {
    	$(this).toggleClass('active');
    	$('.headerNav').toggleClass('active');
    	$('header').removeClass('searchActive');
    });

    // Mobile menu
    $('nav li > i').on('click', function() {
    	if ( !_ismobile ) return false;
    	$(this).parent().find('.dropDown').slideToggle(350);
    	$(this).toggleClass('rotate');
    });

    $('.dropDown .navColumn').on('click', function() {

    	if ( $('.hamburger').is(':visible') ) {
    		$(this).find('i').toggleClass('rotate');
    		$(this).closest('.navColumn').find("> .twoColumnList, > ul").slideToggle(350);
    	}

    });

    // Input focus
    $('.simpleInput').focus(function() {
    	$(this).closest('label').addClass('active');
    });

    // Input blur
    $('.simpleInput').blur(function() {
    	$(this).closest('label').removeClass('active');
    });

    // Sticky nav
    $('.listNav a').on('click' , function(e) {
    	if ( $(this).hasClass('anchorScrolling') ) {
    		e.preventDefault();

    		var anchorOffset;

    		anchorOffset = $($(this).attr('href')).offset().top - $('.stickyContent').outerHeight();

    		if (_ismobile) {
    			anchorOffset = $($(this).attr('href')).offset().top - ( $('header').outerHeight() + $('.stickyWrapper').outerHeight() );
    		}
    		
    		$('.listNav li').removeClass('active');
    		$('html,body').stop().animate({scrollTop: anchorOffset}, 777, function() {
    			setTimeout( function() { // After animate we scroll 1px for change sticky title
    				if ( $('.mobileStickynav').is(':visible') ) window.scrollBy(0, 1);
    				$(this).parent().addClass('active');
    			}, 50);
    		});

    		if ( $('.mobileStickynav').is(':visible') ) {
    			$('.mobileStickynav .angleIconDown').removeClass('rotate');
    			$(this).closest('.listNav').slideUp(350);
    		}
    	}
    });

    $('.mobileTabMenu').on('click', function() {
    	$(this).find('.angleIconDown').toggleClass('rotate');
    	$(this).parent().find('.tabsMenuWrapp').slideToggle(350);
    });

	// Detail info
	$('.simpleThumbnail').on('click', function(e) {
		e.preventDefault();
		$('.detailInfoWrapper').addClass('active');
		$(this).closest('.detailInfoWrapper').find('.detailInfo').eq($(this).attr('data-info')).addClass('active');

		$('html, body').animate({scrollTop: $(this).closest('.detailInfoWrapper').offset().top - $('header').outerHeight() - $('.stickyContent').outerHeight()},777);
		
	}); 

	// Close detail info content
	$('.detailInfo .buttonClose').on('click', function() {
		$('.detailInfo').removeClass('active');
		$('.detailInfoWrapper').removeClass('active');
		$(this).closest('.detailInfoWrapper').removeClass('active');
	});

	$('.mobileSideBar').on('click', function() {
		$('.mediaSideBar').addClass('active');
		$('.closeSBlayer').addClass('active');
	});

	$('.mobileClose, .closeSBlayer').on('click', function() {
		$('.mediaSideBar').removeClass('active');
		$('.closeSBlayer').removeClass('active');
	});

	// PDF link change
	$('.docWrapper li').on('click', function() {
		$('.docWrapper li').removeClass('active');
		$(this).addClass('active');
		$('.docDownload').attr('href', $(this).attr('data-link-href') );
	});

	// Page animations
	function sectionCoordinates(){
		$('.animateSection').each(function(){
			$(this).data('top', $(this).offset().top );
		});
	}
	function animateSections() {
		$('.animateSection').each(function(){

			if ($(this).data('top') <= $(window).scrollTop() + $(window).height() / 1.25 ){
				$(this).addClass('animated');
			} 

		});
	}

	// Overflow content
	function overflowContent() {
		$('.overflowContent').each(function() {
			if ( $(this).outerHeight() > 180 ) {
				$(this).addClass('overFlowHeight');
			}
		});
	}

	function sticky() {
		if ( _ismobile ) { //mobile Sticky
			if ( $('.stickyWrapper').length && $('.stickyOffset').offset().top - $('header').outerHeight() < winScr ) {
				$('.stickyContent').addClass('sticky');
			} else {
				$('.stickyContent').removeClass('sticky');
			}
		} else { //Desktop sticky
			if ( $('.stickyWrapper').length && $('.stickyOffset').offset().top < winScr ) { 
				$('.stickyContent').addClass('sticky');
			} else {
				$('.stickyContent').removeClass('sticky');
			}
		}
	}

	// function scrollTop() {
	// 	$(window).scroll( function() {
	// 	   if (winScr < lastWinScr) {
	// 	       $('body').removeClass('headerHidden');
	// 	   } 
	// 	   lastWinScr = winScr;
	// 	});
	// }

});
