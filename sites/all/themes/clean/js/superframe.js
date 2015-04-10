var miniframes = [];
var superframe;
var currFrame;
var currMiniframe = 0;
var firstInit = true;
var mobile = "";
var superTimeOut;
var timeOut;
var initialPageLoad = true;
var lastTime = new Date();
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
  mobile = "-mobile";
}

//Tools
jQuery.fn.replace = function()
{
  //Replace links by images
  var $this = this;
  
  $this.find(' a.link-to-img').replaceWith(function() {
    var src = (mobile == "") ? this.href : jQuery(this).attr('data-src-mobile');
    var div = jQuery('<div class="img-final" style="background-image:url(\'' + src + '\')" title="' + this.title + '"/>');
    
    //used for aesthetics, Safari renders linearily whereas FF renders when ready. iOS Safari yet different?!
    if (jQuery.browser.mozilla){div.hide();}
    var img = jQuery('<img />', {
      src: src,
      alt: this.alt,
      title: this.title,
    })
    .bind('load', function(){
      div.fadeIn('slow', function(){
        setTimeout(function(){$this.removeClass('img-loading')}, 1000);
      });               
    });
    return div;
  });
  return this;
};

jQuery.fn.replaceFirst = function()
{ 
  var title = this.parents('.views-row').attr('data-title');
  //Replace links by images
  this.find('.img-loading:not(:nth-child(2), .bcked)').addClass("bcked").each(function() 
  {
    var src = jQuery(this).attr('data-small-src');
    var load = jQuery(this).css("background-image");
    var img = load+',url("' + src +'")';
    jQuery(this).css({"background-image": img});
  });     
  return this;
};


(function ($) {

  Drupal.behaviors.superframe = {
    attach: function (context, settings) {
//disable cycle logging
$.fn.cycle.log = $.noop;
//move superframe to top level
$('.superframe').appendTo('body');
//init currFrame
currFrame = $('.miniframe:first .proj-wrapper');

// Controls
//previous project
up_ = function(e) {
  e.preventDefault();
  lastTime = new Date();
  $('body').addClass('in-transit');
  superframe.cycle('prev');
}
//next project
down_ = function(e) {
  e.preventDefault();
  lastTime = new Date();
  $('body').addClass('in-transit');
  superframe.cycle('next');
}
//previous frame
left_ = function(e) {
  lastTime = new Date();
  currFrame.cycle('prev');    
}
$('.cycle-slide-active:first-child .img-final').bind('touch click', function(e){
  right_(e);
});
//next frame
right_ = function(e) {
  lastTime = new Date();
  currFrame.cycle('next');
}

//bind all events before they fire! :D
//load further images
$(document).bind('cycle-before', function(event, optionHash, outgoingSlideEl, incoming, ff){
  //cancel whatever had been scheduled
  if($('body').hasClass('menu-open'))
  {
    $('body').removeClass('menu-open')
  }
  //if this is superframe
  if(event.target.className == "view-content")
  {
    $('body').addClass('nothing-left');
    var classToRemove = $(outgoingSlideEl).attr('data-title');

    if(classToRemove !== void 0)
    {
      $('body').removeClass(classToRemove);
    }
    $('body').addClass($(incoming).attr('data-title'));
    //activate project in list
    currMiniframe = 0;
    $('.active-proj').removeClass('active-proj');
    var nid = $(incoming).data('nid');
    $('.pager[data-nid=' + nid + ']').addClass('active-proj');
    var c = currFrame;
    setTimeout(function(){c.cycle(0);}, 500);
  //update current project
    currFrame = $('.proj-wrapper', incoming);
    if($('.slide',currFrame).length > 0)
    {
      $('body').removeClass('nothing-right');
    }
    //replace the image
    clearTimeout(superTimeOut);
    clearTimeout(timeOut);
    timeOut = setTimeout(function(){
      currFrame.replaceFirst();
    }, 1500);
    superTimeOut = setTimeout(function(){
      $('.img-loading:first, .img-loading:eq(1)', incoming).replace();
      //according to direction, load next() or prev() slide (or first or last)
      if(optionHash.direction)      
        if( $(incoming).next().find('.img-loading:first').replace().length == 0)
        {
          $('.miniframe:first .img-loading:first').replace();
        }
        if( $(incoming).prev().find('.img-loading:first').replace().length == 0 )
        {
          $('.miniframe:last .img-loading:first').replace();
        }

      }, 900);
    if(optionHash.nextSlide == optionHash.slideCount - 1)
    {
      $('body').addClass('nothing-down');
    }
    else{
     $('body').removeClass('nothing-down'); 
    }
  }
  else //if miniframe
  {
    currMiniframe = optionHash.nextSlide;
    if(optionHash.currSlide == 0 && optionHash.nextSlide == 1)
    {
      $(incoming).parents('.proj-wrapper').replaceFirst();

    }
    else
    {
      clearTimeout(timeOut);
      timeOut = setTimeout(function(){
        $(incoming).replace();
        $(incoming).next().replace();
        $(incoming).prev().replace();
      }, 500);
    }

    //fade arrows
    if(optionHash.nextSlide == 0){
      $('body').addClass('nothing-left');
    }
    else if(optionHash.nextSlide == optionHash.slideCount - 1)
    {
      $('body').addClass('nothing-right');
      $('body').removeClass('nothing-left');
    }
    else{
      $('body').removeClass('nothing-left');
      $('body').removeClass('nothing-right');
    }
  }
});

$(document).bind('cycle-after', function(event, optionHash, outgoingSlideEl, incoming, forwardFlag)   {
      //if this is superframe
    });

    //initialize cycle
    $(document).bind('cycle-post-initialize', function(event, optionHash){  
      //if this is superframe

      if(event.target.className == "view-content")
      {
       initialPageLoad = false;
       var initialSlide = optionHash.currSlide;
       $('.work-list-item').eq(initialSlide).addClass('active-proj');
       $('body').addClass($(optionHash.slides[optionHash.currSlide]).attr('data-title'));
       currFrame = $('.proj-wrapper', optionHash.slides[optionHash.currSlide]);
       currFrame.replaceFirst().find('.img-loading:first, .img-loading:eq(1)').each(function(){$(this).replace()});

       if(optionHash.slideCount - optionHash.nextSlide == 1 && firstInit)
       {
        firstInit = !firstInit;
      }

        //bind keys
        Mousetrap.bind('up', up_);
        Mousetrap.bind('down', down_);
        up.once('sfed', function(){$(this).on('click.nav', up_) });
        down.once('sfed',function(){ $(this).on('click.nav', down_) });
      }
    });

    //Create listeners and attach them to DOM
    var up = $('<div id="up" class="nav arrow nav-vert">up</div>');
    var down = $('<div id="down" class="nav arrow nav-vert">down</div>');
    var left = $('<div id="left" class="nav arrow nav-horz">left</div>');
    var right = $('<div id="right" class="nav arrow nav-horz">right</div>');
    
    var nav = up.add(down).add(left).add(right).appendTo($('body'));

    var interval;
    //miniframes
    var opts = {
      timeout: 0,
      fx: 'scrollHorz',
      slides: '> .slide',
      autoHeight: false,
      allowWrap: false,
    }

    $('.proj-wrapper').each(function() {
      var c = $(this).cycle(opts);
    });
    superopts = {
      timeout: 0,
      fx: 'scrollVert',
      slides: '.miniframe',
      autoHeight: false,
      swipe: false,
      reverse: false,
      allowWrap: false
    }
    
    superframe = $('.superframe .view-content').cycle(superopts);
    

    //List
    $(document).bind('click', '.pager',function(e){
      var $this = $(e.target).parents("[data-nid]");
      var nid = $(e.target).attr('data-nid') || $this.attr('data-nid');
      var index = $('.miniframe[data-nid="'+nid+'"]').index();
      superframe.cycle(index);
    });

    //bind swipe
    // $('.slide-image').bind('swipedown', up_);
    // $('.slide-image').bind('swipeup', down_);
    // $('.slide-image').bind('swipeleft', right_);
    // $('.slide-image').bind('swiperight', left_);
    //prevent swipeVert on info
    // $('.proj-info').bind('touchstart', function(e)
    // {
    //   e.stopPropagation();
    // });

    //bind key events (rest is bound on init)
    Mousetrap.bind('left', left_);
    Mousetrap.bind('right', right_);

    //bind arrows
    left.once('sfed', function(){$(this).on('click.nav', left_)});
    right.once('sfed', function(){$(this).on('click.nav', right_)});
    $('#intro').click(function(){
      down_();
    });
    //bind mousewheel
    // $('.slide-image').on('mousewheel', wheelMove);
    // $(document, '.slide-image').on('mousewheel swipedown swipeup swiperight swipeleft', function(e){e.stopPropagation();})
    // function wheelMove(e, deltaY) {
    //   //superframe.unbind('mousewheel', wheelMove);
    //   var threshold = 0;
    //   if(new Date() - lastTime > 900)
    //   {
    //     lastTime = new Date();
    //     if(e.deltaX < threshold){
    //       left_(e);
    //       return;
    //     }
    //     else if(e.deltaX > threshold){
    //       right_(e);
    //       return;
    //     }
    //     if (e.deltaY > threshold) {
    //       up_(e);
    //     }
    //     else if (e.deltaY < -threshold) {
    //       down_(e);
    //     }
    //   }
    // }

  //EOBEHAVIOR  
}
};

})(jQuery);