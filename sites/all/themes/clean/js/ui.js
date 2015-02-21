(function ($) {

	Drupal.behaviors.ui = {
		attach: function (context, settings) {
			$('#menu').click(function(){
				$('body').toggleClass('menu-open');
			});
			var titles = $('.title');
			titles.click(function(e){
				$(this).toggleClass('open');
				var exps = $(this).next('.bio-exps');
				exps.toggleClass('open').slideToggle()

				var isVisible = false;
				$('.bio-exps').each(function(){
					console.log("$(this).hasClass('open')", $(this).hasClass('open'))
					if($(this).hasClass('open')){	
						isVisible = true;
					}
				})
				$(this).parents('.text-slide-content').toggleClass('bio-open', isVisible);
			});
		}
	}
})(jQuery);