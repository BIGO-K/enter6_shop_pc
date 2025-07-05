/**
** 페이지 공통
**/

// /// 웹폰드 로드
// var _fontUrl = (mm._isPublish) ? '../css/fonts.css' : '/pc/css/fonts.css';// 실서버 폰트 경로 분기
// WebFont.load({
// 	custom: {
// 		families: ['Fontello', 'GothicA1', 'Jalnan'/*, 'NotoSansKR', 'Roboto', 'Ebrima'*/],
// 		urls: [_fontUrl]
// 	}
// });

// CDN 사용으로 폰트 전체 로드
var $linkFont = $('link.link_font');
if ($linkFont.attr('resource')) $linkFont.after($linkFont[0].outerHTML.replace('resource', 'href')).remove();
$('html').addClass('__font');
// $linkFont.attr({ 'href': $linkFont.attr('resource') }).removeAttr('resource');// attr 변경 시 ie에서 로드 안되는 경우 발생
///-- 웹폰드 로드

/// 모바일
if (mm.is.mobile()) {
	// 터치이벤트 확인
	// iframe은 인식 안됨(내부 스크립트 추가 필요)
	$(document).on('touchstart touchend', '*', function(__e) {

		switch(__e.type) {
			case 'touchstart':
				mm._isTouch = true;
			break;
			case 'touchend':
				mm._isTouch = false;
			break;
		}

	});

	// 모바일 로테이션
	$(window).on('orientationchange', function() {

		if (!mm._isPublish && !mm.is.mobile('app')) location.reload();

	});
}
///-- 모바일
/*
/// 아이폰 이슈
if (mm.is.mobile('ios')) {
	// 아이폰 위/아래 스크롤 막기
	var _touchCount = 0;
	var _touchBefore = 0;

	$('.mm_app').on('touchstart touchend touchcancel touchmove', function(__e) {

		var $scroller = $('.mm_scroller');
		if (!$scroller[0]) return;

		var _scrollHeight = $scroller[0].scrollHeight - $scroller.outerHeight();

		switch(__e.type) {
			case 'touchstart':
				_touchBefore = __e.originalEvent.touches[0].pageY;
				_touchCount = 0;
			break;
			case 'touchend':
			case 'touchcancel':
				//
			break;
			case 'touchmove':
				var _touchMove = __e.originalEvent.touches[0].pageY;
				if (_touchMove - _touchBefore < 0) {// 위로 스크롤
					if (_touchCount < 0) _touchCount = 0;
					_touchCount++;
				}
				if (_touchMove - _touchBefore > 0) {// 아래로 스크롤
					if (_touchCount > 0) _touchCount = 0;
					_touchCount--;
				}
				_touchBefore = _touchMove;
			break;
		}

		if ($scroller.scrollTop() < 1 && _touchCount < 0 || $scroller.scrollTop() > _scrollHeight - 1 && _touchCount > 0) {
			__e.preventDefault();
		}

	});
}
*/
/// 페이지
mm.page = (function() {

	/// private
	(function() {

		var $html = $('html');
		var $view = $('.mm_view');
		
		// 인쇄화면
		if ($('.__app_print__')[0]) {
			$('html, body').css({ 'overflow': 'auto', 'min-width': 1000, 'height': 'auto' });
		}

		// 아이프레임에서 필요없는 요소 제거, title 추가
		if (mm._isIframe) {
			$('.mm_toolbar, .mm_sidebar, .mm_popup, mm_cover, .mm_footer').remove();
			$(window.frameElement).attr({ 'title': function(__i, __value) {
				
				return __value || $('title').text();
				
			} });
		}
		
		// 팝업에서 min-width 제거
		if (mm._isPopup || mm._isModal) {
			// $('html, body').css({ 'min-width': 0 });// css로 적용
			
			$(window).on('load', function() {
				
				// 크기에 맞게 리사이즈
				if (mm._isPopup) mm.popup.resize();
				if (mm._isModal) mm.modal.resize();
				
			});
		}

		// 현재 페이지 연결
		mm.component.update();
		
		// 익스/엣지 브라우저에서 새로고침 할 때 라디오/체크박스의 기존 선택을 물고있는거나 날려버리는 이슈가 있어 초기화 후 재연결
		if (mm.is.ie()) {
			$(window).on('load', function() {
				 mm.instant(mm.form.update, { args: [$('[checked]').prop({ 'checked': true })] });
			});
		}

		/// a 링크
		$(document).on('click', 'a[data-href]', function(__e) {
			
			if (/blank/i.test(this.target)) return;// target blank 제외

			// jQuery .data('mm.name')에 저장할 기본 값
			var defaults = {
				_type: null,// :string - 고정 값, anchor/link/reload/back/forward/popup/modal
				_frameId: null,// popup, modal에서 iframe으로 노출할 때 id속성 지정
				_frameName: null,// popup, modal에서 iframe으로 노출할 때 name속성 지정
				_isRoot: false,// :boolean - window.top에서 실행
				_step: 1,// mm.history.back(forward) 옵션 설정 가능
				// mm.anchor 옵션 설정 가능
			};

			var $this = $(this);
			var datas = $this.data('mm.href') || mm.element.datas($this, 'data-href', defaults, true);
			var _attrHref = $this.attr('href');
			var _href = this.href;

			if (!datas._type) return;
			if (datas._type == 'link') {
				if ($.trim(_attrHref.replace('#', '')).length == 0 || /javascript\:/i.test(_attrHref)) return;
				
				if (_href.split('#')[0] == location.href.split('#')[0]) datas._type = 'reload';// 링크가 같으면 reload로 변경
				if (datas._type == 'reload' && /\#/.test(_href)) datas._type = 'anchor';// 링크가 같고 #이 있으면 anchor로 변경
			}

			__e.preventDefault();

			// 외부링크
			if (/link|popup/i.test(datas._type)) {
				if (_href.indexOf(location.host) < 0) {
					// mm.root('mm.popup.open', ['popup_externalLink.html?url=' + _href]);// 외부링크(https에서 외부 http 연결 안됨)
					window.open(_href);// 새 창 열림
					return;
				}
			}

			switch(datas._type) {
				case 'anchor':
					mm.anchor(_attrHref, datas);
				break;
				case 'link':
					if (datas._isRoot) mm.root('mm.link', [_href]);
					else mm.link(_href);// 기본 이동
				break;
				case 'reload':
					location.reload(true);
				break;
				case 'back':
					mm.history.back(datas._step);
				break;
				case 'forward':
					mm.history.forward(datas._step);
				break;
				case 'popup':
					mm.popup.open(_href, { openElement: this, _frameId: datas._frameId, _frameName: datas._frameName });
					if (mm.modal) mm.modal.close();// 모달 닫기
				break;
				case 'modal':
					mm.modal.open(_attrHref, { openElement: this, _frameId: datas._frameId, _frameName: datas._frameName });
				break;
			}

		});

		// 검색영역
		$('.mm_header-search .btn_search').on('click', function(__e) {
			
			__e.preventDefault();
			
			var $search = $('.mm_search');
			var _classOn = '__search-on';
			
			$html.addClass(_classOn);
			$search.find('.btn_search-close').on('click', function(__e) {
				
				$(this).off('click');
				$html.removeClass(_classOn);
				mm.scroll.on();
				
			});
			
			mm.form.update($search.find(':text').val('').focus());
			mm.scroll.off();
			
		});
		
		// 스크롤이벤트(사이드바)
		mm.getScroller().on('load scroll', function(__e) {
			
			var _classSticky = '__sidebar-sticky';
			var $sidebar = $('.mm_sidebar');
			
			if ($(this).scrollTop() >= $('.mm_page-content').offset().top) $sidebar.addClass(_classSticky);
			else $sidebar.removeClass(_classSticky);
			
		});
		
		// 사이드바 둥둥배너
		$('.mm_sidebar-floating').each(function() {
			
			var $ui = $(this);
			var $btnHide = $ui.find('.btn_hide');
			var _classExpand = '__floating-expand';
			
			$ui.children('a').on('click', function(__e) {
				
				if ($ui.hasClass(_classExpand)) return;
				
				__e.preventDefault();
				__e.stopImmediatePropagation();
				
				$ui.addClass(_classExpand);
				
			});
			
			$btnHide.on('click', function(__e) {
				
				var $this = $(this);
				if ($ui.hasClass(_classExpand)) $ui.removeClass(_classExpand);
				else $ui.remove();
				
			});
			
		});

	})();

	/// public
	return {
		//
	};

})();
///-- 페이지
/*
/// 사이드바
mm.sidebar = (function() {

	// var $html = $('html');
	var $sidebar = $('.mm_sidebar');
	var $btnOpen = $sidebar.find('.btn_sidebar-open');
	var $btnClose = $sidebar.find('.btn_sidebar-close');
	var viewer = '.mm_view';
	var _classOn = '__sidebar-on';

	if (!$sidebar[0]) return;

	// 사이드바 열기
	function sidebarOpen(__time) {

		var _time = (_.isNumber(__time)) ? __time : mm.times._fast;

		$sidebar.addClass(_classOn);
		mm.focus.in($sidebar);

		TweenMax.to(viewer, _time, { 'margin-left': $sidebar.outerWidth(), ease: Sine.easeInOut });
		TweenMax.to($sidebar, _time, { x: 0, ease: Sine.easeInOut });
		TweenMax.to('.image_ico', _time, { 'background-position': '0% 27px', ease: Sine.easeInOut });

		// mm.storage.set('session', 'IS_ADMIN_SIDEBAR_CLOSE', false);
		mm.cookie.set('IS_ADMIN_SIDEBAR_STATE', 'open');

	}

	// 사이드바 닫기
	function sidebarClose(__time) {

		var _time = (_.isNumber(__time)) ? __time : mm.times._fast;

		$sidebar.removeClass(_classOn);
		mm.focus.in(viewer);

		TweenMax.to(viewer, _time, { 'margin-left': $btnClose.outerWidth(), ease: Cubic.easeOut });
		TweenMax.to($sidebar, _time, { x: $btnClose.outerWidth() - $sidebar.outerWidth(), ease: Cubic.easeOut });
		TweenMax.to('.image_ico', _time, { 'background-position': '100% 27px', ease: Cubic.easeOut });

		// mm.storage.set('session', 'IS_ADMIN_SIDEBAR_CLOSE', true);
		mm.cookie.set('IS_ADMIN_SIDEBAR_STATE', 'close');

	}

	/// private
	(function() {

		// 브라우저에서 페이지 처음 접속, 닫기 상태가 아니면 open
		// var _isClose = mm.storage.get('session', 'IS_ADMIN_SIDEBAR_CLOSE');
		// if (!_isClose) sidebarOpen(0);
		if ($sidebar.hasClass('__open') || mm.cookie.get('IS_ADMIN_SIDEBAR_STATE') != 'close') {
			sidebarOpen(0);
			$sidebar.removeClass('__open');
		}

		// 아코디언 초기 펼침
		var $activeMenu = $('.mm_sidebar-menu .__on');
		mm.dropdown.open($activeMenu.closest('.mm_dropdown'), 0);
		// mm.instant(mm.anchor, { args: [$activeMenu, { scroller: mm.getScroller($sidebar), _time: mm.times.faster }] });
		mm.anchor($activeMenu, { scroller: mm.getScroller($sidebar), _time: 0 });

		$btnOpen.on('click', function(__e) {

			__e.preventDefault();
			sidebarOpen();

		});

		$btnClose.on('click', function(__e) {

			__e.preventDefault();
			sidebarClose();

		});

	})();

	/// public
	return {
		open: sidebarOpen,
		close: sidebarClose,
	};

})();
///-- 사이드바
*/
