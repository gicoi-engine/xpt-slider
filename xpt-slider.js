(function( $ ) {
  $.fn.xptSlider = function() {
    return this.each(function() {
      //console.log($(this).attr('id') + ' / '+$(this).attr('slide-mode') + ' / '+ $(this).attr('slide-controls'));
      var $slider = $(this);
      if($slider.hasClass('carousel')){
        var intervalTime = parseInt($(this).attr('slide-interval'));
        intervalTime = (intervalTime < 5 ? 5 : intervalTime) * 1000 ;
        $slider.carousel({
          interval: intervalTime
        });

        // fix touch screen device issue
        // ref : https://github.com/twbs/bootstrap/issues/17118
        var hammertime = new Hammer(this, {
          recognizers: [
            [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }]
          ]
        });
        hammertime.on('swipeleft', function () {
          $slider.carousel('next');
        });
        hammertime.on('swiperight', function () {
          $slider.carousel('prev');
        });

        $slider.on('slid.bs.carousel', function (e) {
          $slider.carousel('cycle');
          //console.log($(e.target).find('.carousel-item').eq(e.to).find('video'));
          if($(e.target).find('.carousel-item').eq(e.from).find('video').length > 0){
            var thisVideo = document.getElementById($(e.target).find('.carousel-item').eq(e.from).find('video').attr('id'));
            // for more info. plz ref HTML5 `AV DOM` : https://www.w3schools.com/tags/ref_av_dom.asp
            thisVideo.pause();
          }
          if($(e.target).find('.carousel-item').eq(e.to).find('video').length > 0){
            var thisVideo = document.getElementById($(e.target).find('.carousel-item').eq(e.to).find('video').attr('id'));
            if($(e.target).find('.carousel-item').eq(e.to).find('video').attr('xpt-slider-autoplay') === 'true'){
              // for more info. plz ref HTML5 `AV DOM` : https://www.w3schools.com/tags/ref_av_dom.asp
              thisVideo.play();
              $slider.carousel('pause');
              var videoDuration = thisVideo.duration * 1000;
              setTimeout(function  () {
                $slider.carousel('cycle');
              } ,videoDuration);
              //console.log('set paused slide = videoDuration '+ videoDuration);
            }
          }
        })
      } else {
        var controls = $($(this).attr('slide-controls'));
        var intervalTime = parseInt($(this).attr('slide-interval'));
        var pervSlide = 0;
        var nextSlide = 1;
        var slideMethod = {
          in:'slideInUp',
          out:'fadeOutUp'
        };
        intervalTime = (intervalTime < 5 ? 5 : intervalTime) * 1000 ;
        var paused = false;

        switch($(this).attr('slide-mode').toLowerCase()){
          case 'right':
            slideMethod= {
              in:'slideInRight',
              out:'slideOutRight'
            }
            break;
          case 'left':
            slideMethod= {
              in:'slideInLeft',
              out:'slideOutLeft'
            }
            break;
          case 'up':
            slideMethod= {
              in:'slideInUp',
              out:'slideOutUp'
            }
            break;
          case 'down':
            slideMethod= {
              in:'slideInDown',
              out:'slideOutDown'
            }
            break;
        };

        var slideTo = function slideTo(slideId){
          if(pervSlide >= 0){
            controls.eq(pervSlide).removeClass(slideMethod.in).addClass(slideMethod.out);
            var pervSlideTmp = pervSlide;
            setTimeout(function  () {
              controls.eq(pervSlideTmp).hide();
            },300);
          }
          nextSlide = slideId;
          if((nextSlide >= controls.length) || (nextSlide < 0)){
            nextSlide = 0;
          }
          pervSlide = nextSlide;
          controls.eq(nextSlide).removeClass(slideMethod.out).addClass(slideMethod.in).addClass('show');
          nextSlide++;
        }
        var slideNext = function slideNext(){
          if(!paused){
            if(pervSlide >= 0){
              controls.eq(pervSlide).removeClass(slideMethod.in).addClass(slideMethod.out);
              var pervSlideTmp = pervSlide;
              setTimeout(function  () {
                controls.eq(pervSlideTmp).removeClass('show');
              },300);
            }
            if(nextSlide >= controls.length){
              nextSlide = 0;
            }
            pervSlide = nextSlide;
            controls.eq(nextSlide).removeClass(slideMethod.out).addClass(slideMethod.in).addClass('show');
            nextSlide++;
          } else {
          }
        }

        var slidePerv = function slidePerv(){
          if(!paused){
            if(pervSlide >= 0){
              controls.eq(pervSlide).removeClass(slideMethod.in).addClass(slideMethod.out);
              var pervSlideTmp = pervSlide;
              setTimeout(function  () {
                controls.eq(pervSlideTmp).removeClass('show');
              },300);
            }
            nextSlide = pervSlide - 1;
            if(nextSlide < 0 ){
              nextSlide = 0;
            }
            pervSlide = nextSlide;
            controls.eq(nextSlide).removeClass(slideMethod.out).addClass(slideMethod.in).addClass('show');
            nextSlide++;
          } else {
          }
        }

        controls.eq(0).removeClass(slideMethod.out).addClass(slideMethod.in).addClass('show');
        $slider.on('mouseenter',function() {
          paused = true;
        });
        $slider.on('mouseleave',function() {
          paused = false;
        });
        setInterval( slideNext, intervalTime);
      }
    });
  }
}( jQuery ));
