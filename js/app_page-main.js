/**
** 메인페이지
**/

$(function() {

	// 상단 히어로배너 컨트롤
	(function() {

		var $menu = $('.m-main-hero-menu');
		var $menuItem = $menu.find('a');
		var datas = $('.m-main-hero > .mm_swiper').data('mm.swiper');
		var _classOn = '__on';

		datas.Swiper.on('transitionStart', function() {
			
			heroMenuChange(this.realIndex);

		});

		$menuItem.on('mouseenter', function() {

			var _index = $(this).closest('li').data('index');
			datas.Swiper.slideTo(_index);
			// heroMenuChange(_index - 1);

		});

		function heroMenuChange(__index) {
			
			$menu.find('.' + _classOn).removeClass(_classOn).removeAttr('title');
			$menuItem.parent().filter('[data-index="' + (__index + 1) + '"]').children('a').addClass(_classOn).attr({ 'title': '선택됨' })
			.parentsUntil('.m-main-hero-menu', 'li').last().addClass(_classOn);

		}

	})();

});
