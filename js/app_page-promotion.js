/**
** 기획전페이지
**/

$(function() {
	
	// 앵커메뉴
	(function() {
		
		var $anchor = $('.m-promo-anchor');
		var $btnAnchor = $anchor.find('a');
		var $list = $('.m-promo-product');
		var _classSticky = '__anchor-sticky';
		var _marginY = 0;
		
		if (!$anchor[0]) return;
		
		$anchor.height($anchor.children().outerHeight());
		_marginY = ($anchor.height() > $btnAnchor.height() * 1.5) ? -$anchor.height() + $btnAnchor.height() : 0;
		
		$btnAnchor.on('click', function(__e) {
			
			__e.preventDefault();
			mm.anchor($(this).attr('href'), { _margin: _marginY });
			
		});
		
		// 스크롤
		mm.getScroller().on('load scroll', function(__e) {
			
			var $this = $(this);
			
			if ($this.scrollTop() >= $anchor.offset().top) {
				$anchor.addClass(_classSticky);
				
				$list.each(function(__i) {
					
					if ($this.scrollTop() >= $(this).offset().top + _marginY - $btnAnchor.height()) {
						$btnAnchor.removeClass('__on').removeAttr('title')
						.eq(__i).addClass('__on').attr({ 'title': '선택됨' });
					}
					
				});
			}
			else {
				$anchor.removeClass(_classSticky);
				$btnAnchor.removeClass('__on').removeAttr('title');
			}
			
		});
		
	})();

});
