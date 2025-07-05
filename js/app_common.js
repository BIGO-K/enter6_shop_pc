/**
** 앱 공통 컴포넌트/헬퍼
** mm 오브젝트에 구성되어 있습니다.
**/

/// mm선언
var mm = {
	_isPublish: /publish/.test(location.host),// 퍼블리싱 테스트 경로인지 확인합니다.
	_isTouch: false,// 터치 상태를 확인합니다.
	_isIframe: (window.frameElement) ? true : false,// 현재 페이지가 iframe 안에 있는지 확인합니다.
	_isModal: (document.getElementsByClassName('__mm_modal__').length > 0) ? true : false,// 현재 페이지가 modal 인지 확인합니다.
	_isPopup: (document.getElementsByClassName('__mm_popup__').length > 0) ? true : false,// 현재 페이지가 popup 인지 확인합니다.
};
///-- mm선언

/// 시간(초, css transition)
mm.times = {
	_faster: 0.1,
	_fast: 0.2,
	_base: 0.4,
	_slow: 0.7,
	_slower: 1,
};
///-- 시간

/// 확인(true/false)
mm.is = (function() {

	// 모바일확인
	function isMobile(__type) {

		var types = {
			iphone: function() {
				return 'iphone';
			},
			ipad: function() {
				return 'ipad';
			},
			ipod: function() {
				return 'ipod';
			},
			ios: function() {
				return this.iphone() + '|' + this.ipad() + '|' + this.ipod();
			},
			android: function() {
				return 'android';
			},
			blackberry: function() {
				return 'blackberry|bb10|playbook';
			},
			window: function() {
				return 'iemobile|windows phone|windows mobile';
			},
			opera: function() {
				return 'opera mini';
			},
			// 앱에 userAgent 코드 추가 필요
			app_ios: function() {
				return 'app_ios';
			},
			app_android: function() {
				return 'app_android';
			},
			app: function() {
				return this.app_ios() + '|' + this.app_android();
			},
			app_kitkat: function() {
				return 'android 4.4';
			},
			app_first: function() {
				return 'app_first';// 앱 최초실행
			},
		}
		var _type = (!__type) ? types.ios() + '|' + types.android() + '|' + types.blackberry() + '|' + types.window() + '|' + types.opera() + '|webos|bada|zunewp7|nokia' : (typeof types[__type] == 'function') ? types[__type]() : String(__type);

		return new RegExp(_type, 'i').test(navigator.userAgent);

	}

	// 익스, 엣지 확인
	function isIE(__type) {

		var types = {
			ie6: function() {
				return 'msie 6';
			},
			ie7: function() {
				return 'msie 7';
			},
			ie8: function() {
				return 'msie 8';
			},
			ie9: function() {
				return 'msie 9';
			},
			ie10: function() {
				return 'msie 10';
			},
			ie11: function() {
				return 'rv:11';
			},
			ie: function() {
				return this.ie6() + '|' + this.ie7() + '|' + this.ie8() + '|' + this.ie9() + '|' + this.ie10() + '|' + this.ie11();
			},
			ie9over: function() {
				return this.ie9() + '|' + this.ie10() + '|' + this.ie11() + '|' + this.edge();
			},
			ie10over: function() {
				return this.ie10() + '|' + this.ie11() + '|' + this.edge();
			},
			edge: function() {
				return 'edge';
			},
		}
		var _type = (!__type) ? types.ie() + '|' + types.edge() : (typeof types[__type] == 'function') ? types[__type]() : String(__type);

		return new RegExp(_type, 'i').test(navigator.userAgent);

	}

	// private
	(function() {

		/// 디바이스 확인
		var html =  document.getElementsByTagName('html')[0];//mm.find('html')[0];
		var useragent = navigator.userAgent;
		var _className = '';

		// 모바일
		if (isMobile()) {
			_className = ' __mobile';

			if (isMobile('ios')) _className += ' __ios';// ios 확인
			if (isMobile('app')) _className += ' __app';// 앱으로 접속 (앱에 userAgent 코드 추가 필요)
			if (isMobile('app_kitkat')) _className += ' __kitkat';// 안드로이드 4.4.x 킷캣버전
		}
		// pc
		else {
			_className += ' __pc';

			if (isIE('ie6')) _className += ' __ie6';// ie6
			else if (isIE('ie7')) _className += ' __ie7';// ie7
			else if (isIE('ie8')) _className += ' __ie8';// ie8
			else if (isIE('ie9')) _className += ' __ie9';// ie9
			else if (isIE('ie10')) _className += ' __ie10';// ie10
			else if (isIE('ie11')) _className += ' __ie11';// ie10
			else if (isIE('edge')) _className += ' __edge';// edge
		}

		html.className += _className;
		///-- 디바이스 확인

	})();

	// public
	return {
		/// 모바일
		mobile: isMobile,
		/// 익스, 엣지
		ie: isIE,
		/// 홀수
		odd: function(__value) {

			var _value = parseFloat(__value);
			return (_.isNaN(_value)) ? false : (_value & 1) ? true : false;

		},
		/// 짝수
		even: function(__value) {

			var _value = parseFloat(__value);
			return (_.isNaN(_value)) ? false : (_value & 1) ? false : true;

		},
		/// 빈 값
		empty: function(__value, __excepts) {

			// __excepts:array - 예외어를 설정하면 결과가 반대로 적용

			var _is = _.isEmpty(__value);
			var _stringValue = String(__value);

			switch (typeof __value) {
				case 'string':
					if (__value == 'undefined' || __value == 'null' || __value == 'NaN') _is = true;
				break;
				case 'number':
					if (__value == 0) _is = false;
				break;
				case 'boolean':
				case 'function':
					_is = false;
				break;
				case 'object':
					try {
						// input:file object
						if (__value.name) _is = false;
						// jQuery selector
						else if (__value.prevObject && __value.length == 0) _is = true;
					} catch (__error) {
						// null
					}
				break;
			}

			// 예외
			if (_.isArray(__excepts) && _.intersection(__excepts, [__value, _stringValue]).length > 0) _is = !_is;

			return _is;

		},
	};

})();
///-- 확인

/// 짧은 타임아웃 실행(setTimeout 1ms)
mm.instant = function(__function, __options) {

	// _delay: 단위 ms (기본 시간 1ms)
	// args: 콜백 아규먼트
	var options = $.extend(true, { _delay: 1, thisObj: null, args: [] }, __options);
	var callback = __function;// type은 function과 string 사용 가능

	setTimeout(function() {

		mm.apply(__function, options.thisObj, options.args);

	}, options._delay);

}

/// DOM 검색(셀렉터)
mm.find = function(__element) {

	var elements = [];
	if (!__element) return elements;

	var splits = __element.split(/\#|\./g);
	if (splits.length == 1) elements = document.getElementsByTagName(__element);
	else if (splits.length == 2 && splits[0] == '') {
		if (/\./i.test(__element)) elements = document.getElementsByClassName(splits[1]);
		else if (/\#/i.test(__element)) elements.push(document.getElementById(splits[1]));
	}
	else elements = document.querySelectorAll(__element);
	if (!elements[0]) elements = [];

	return elements;

}
///-- DOM 검색(셀렉터)

/// DOM 최상위 검색(iframe 내부에서 사용)
mm.root = function(__target, __funcArgs) {

	// __target이 없거나 window, 'window'일 때 top.window
	// __target이 document, 'document'일 때 top.window.document
	// __target 타입이 string이고, DOM요소일 때 mm.find 결과 리턴
	// __target 타입이 string이고, DOM요소가 아닐 때 function으로 실행('aa.bb.cc'형식으로 사용)
	// function일 때 __funcArgs(배열)로 아규먼트 설정

	var target = null;
	if (!__target || __target == window || __target == 'window') target = top.window;
	else if (__target == document || __target == 'document') target = top.window.document;
	else if (_.isString(__target)) target = top.window.mm.find(__target);

	if (mm.is.empty(target)) return mm.apply(__target, top.window, __funcArgs);// 결과가 빈 값일 때 함수 확인
	else return target;// 결과가 있으면 리턴

}
///-- DOM 최상위 검색

/// 콜백함수 실행
mm.apply = function(__callback, __thisObj, __args) {

	// function, string 타입 함수 실행

	var thisObj = __thisObj || window;

	// 문자열 함수
	if (_.isString(__callback)) {
		var callback = (__thisObj == top.window) ? top.window : window;
		$.each(__callback.split('.'), function(__index, __value) {

			if (__value) callback = callback[__value];

		});
		if (_.isFunction(callback)) return callback.apply(thisObj, __args);
		else return callback;
	}
	// 함수
	else if (_.isFunction(__callback)) {
		if (__thisObj == top.window) return top.__callback.apply(thisObj, __args);
		else return __callback.apply(thisObj, __args);
	}
	// 함수가 아닐 때
	else return __callback;

}
///-- 콜백함수 실행

/// 페이지 스크롤러 검색
mm.getScroller = function(__element, __isClosest) {

	var $el = $(__element);

	if (!$el[0] || $el.is('html, body')) {
		var $html = $('html');
		if ($html.css('overflow') == 'hidden') return $('.mm_page').find('.mm_scroller').eq(0);
		else return $(window);// $html;
	}
	else {
		if (__isClosest) return $el.closest('.mm_scroller');
		else return $el.find('.mm_scroller').eq(0);
	}

}
///- 페이지 스크롤러 검색

/// 포커스
mm.focus = (function() {

	// __options: 추가 옵션 (Object: null)
	// __options - outline: 요소에 아웃라인 스타일 설정

	// public
	return {
		/// 지정
		in: function(__element, __options) {

			var $el = $(__element);
			if (!$el[0]) return;

			var options = $.extend(true, { _outline: ''/* thin dotted */ }, __options);

			$el.attr({ 'tabindex': -1 }).focus().css({ 'outline': options._outline })
			.one('focusout', function() {

				$(this).removeAttr('tabindex').css({ 'outline': '' });

			});

		},
		/// 해제
		out: function(__element) {

			var $el = $(__element);
			if (!$el[0]) return;

			if ($el.is(':focus')) $el.blur();

		}
	};

})();
///-- 포커스

/// 앵커 이동
mm.anchor = function(__target, __options) {

	// __target: 이동할 셀렉터 (#id, .class, tagname) 또는 이동할 스크롤 위치 (Number)
	// __options: 추가 옵션 (Object: null)
	// __options - scroller: 스크롤을 이동할 요소 셀렉터 ('.mm_page', <- 없으면 'html, body')
	// __options - _direction: 스크롤 방향 (vertical/horizontal)
	// __options - _margin: __target의 스크롤 위치에서 조정이 필요할 경우 사용 (Number)
	// __options - _time: 스크롤 시간 (0이면 바로 이동)
	// __options - _isFocus: 이동 후 포커싱 여부

	if (arguments.length == 0) return;
	var options = $.extend(true, { scroller: mm.getScroller(), _direction: 'vertical', _margin: 0, _time: mm.times._fast, _isFocus: true }, __options);
	var _scroll = null;

	if (_.isNumber(__target)) _scroll = __target;
	else {
		var $target = $(__target);
		if (!$target[0]) return;

		_scroll = (options._direction == 'vertical') ? mm.element.position($target).top : mm.element.position($target).left;
		if (options._isFocus) {
			TweenMax.killDelayedCallsTo(mm.focus.in);
			if (options._time > 0) TweenMax.delayedCall(options._time * 1000, mm.focus.in, [$target]);
			else mm.focus.in($target);
		}
	}
	_scroll += options._margin;

	// overlay scrollbar
	if (options.scroller.hasClass('os-host')) {
		var datas = options.scroller.data('mm.scrollbar');
		var osOptions = {};

		if (_.isNumber(__target)) {
			if (options._direction == 'vertical') $.extend(true, osOptions, { y: _scroll });
			else $.extend(true, osOptions, { x: _scroll });
		}
		else $.extend(true, osOptions, { el: $target[0], block: 'center' });

		datas.Scrollbar.scroll(osOptions, options._time * 1000);
	}
	// browser scrollbar
	else {
		var tweenOptions = { ease: Sine.easeOut };
		if (options._direction == 'vertical') $.extend(true, tweenOptions, { scrollTop: _scroll });
		else $.extend(true, tweenOptions, { scrollLeft: _scroll });
		if (options.scroller[0] == window) options.scroller = 'html, body';
		TweenMax.to(options.scroller, options._time, tweenOptions);
	}

}
///-- 앵커 이동

/// 링크
mm.link = function(__url, __options) {

	if (arguments.length == 0 || !_.isString(__url)) return;
	if (!RegExp(location.host, 'i').test(__url)) {
		console.log('도메인이 다릅니다.\nlocation.href 또는 a href 속성으로 연결해주세요.');
		return;
	}

	// __options.states: history.state에 추가로 저장할 값(object)

	var states = (__options) ? __options.states : {};
	mm.history.setDOM(states);
	mm.loading.show();

	// 로딩 모션 적용을 위한 딜레이 필요
	var _delay = (mm.is.mobile()) ? 100 : 1;
	setTimeout(function() {

		if (__url == mm.root('location.href')) location.reload(true);// url이 같으면 리로드
		else location.href = __url;

		if (mm.is.mobile("ios") || /firefox/i.test(navigator.userAgent)) mm.loading.hide();// ios, firefox에서 뒤로가기 시 로딩바가 사라지지 않는 이슈로 hide 적용

	}, _delay);


}
///-- 링크(history + ajax)

/// 클립보드복사
mm.copy = function(__text) {

	var $copy;

	function appendElement() {

		$copy.css({ 'position': 'absolute', 'top': '-100px', 'left': '-100%' }).appendTo('body');

	}

	// ie 적용
	if (mm.is.ie()) {
		$copy = $('<input type="text" />').val(__text);
		appendElement();
		$copy.select();

	}
	// ios 등 모바일 대응
	else {
		$copy = $('<span />').text(__text);
		appendElement();

		window.getSelection().removeAllRanges();
		var range = document.createRange();
		range.selectNode($copy[0]);
		window.getSelection().addRange(range);
	}

	document.execCommand('copy');
	$copy.remove();

}
///-- 클립보드복사

/// escape RegExp
mm.escapeRegExp = function(__text) {

	return __text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

}
///-- escape RegExp

/// 3자리콤마표시
mm.numberComma = function(__number) {

	// return __number.toLocaleString().split('.')[0];
	return __number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

}
///-- 3자리콤마표시

/// 스크롤
mm.scroll = (function() {

	var _classNo = '__noscroll';// :string - 스크롤 차단 클래스

	function noScroll(__is) {

		// overlay scrollbar 적용 부분 작업 필요

		var $container = $('.mm_app');
		var $html = $('html');
		var is = (_.isBoolean(__is)) ? __is : true;

		if (is) {
			if ($html.hasClass(_classNo)) return;
			if (!mm.is.mobile()) $container.css({ 'top': -$(window).scrollTop() });
			$html.addClass(_classNo);
		}
		else {
			if (!$html.hasClass(_classNo)) return;
			$html.removeClass(_classNo);

			if (!mm.is.mobile()) {
				var scrollTop = -$container.position().top;
				$container.css({ 'top': '' });
				mm.anchor(scrollTop, { _time: 0 });
			}
		}

	}

	// public
	return {
		// 스크롤 허용
		on: function() {

			noScroll(false);

		},
		// 스크롤 차단
		off: function() {

			noScroll(true);

		},
		// 스크롤 토글
		toggle: function() {

			noScroll(!$('html').hasClass(_classNo));

		},
		/// overflow scrolling 리셋
		touchReset: function() {

			// -webkit-overflow-scrolling: touch 상태에서 display: none 등 다양한 오류 발생 시 리셋 적용

			var $body = $('body');

			setOverflowScrolling('auto');
			mm.instant(setOverflowScrolling, { args:[''] });

			function setOverflowScrolling(__value) {

				$body.css({ '-webkit-overflow-scrolling': __value });

			}

		}
	}

})();
///-- 스크롤

/// 소셜태그
mm.socialtag = (function() {

	// public
	return {
		// 가져오기
		get: function(__element) {

			var $el = $(__element);
			$el = (!$el[0]) ? $('meta[property^=og]') : ($el.is('meta')) ? $(__element) : $(__element).find('meta[property^=og]');

			return _.map($el, function(_el){

				return _el.outerHTML;

			}).join('\n');

		},
		// 세팅
		set: function(__html) {

			if (mm._isIframe) {// 최상위에서 실행
				mm.root('mm.socialtag.set', arguments);
				return;
			}

			// __html이 object일 때 적용 구현 필요?

			var $meta = $('meta[property^=og]');
			if (!$meta[0]) $meta = $('meta');

			$meta.last().after(__html);

		},
		// 변경
		change: function(__html) {

			if (mm._isIframe) {// 최상위에서 실행
				mm.root('mm.socialtag.change', arguments);
				return;
			}

			var $meta = $('meta[property^=og]');
			if ($meta[0]) {
				$meta.last().after(__html)
				.end().remove();
			}
			else mm.socialtag.set(__html);

		},
	};

})();
///-- 소셜태그

/// ajax
mm.ajax = (function() {

	// jQuery alax가 아닌 axios 사용

	// public
	return {
		// 로드 + html append
		load: function(__url, __options) {

			if (!_.isString(__url)) return;

			var options = $.extend(true, {
				// 플러그인 옵션
				configs: {
					// axios에 적용 할 config object
					url: __url,
					method: 'get',
					// baseURL: '',
					// params: {},
					// data: {},
					responseType: 'html',
					// responseEncoding: 'utf8',
					// timeout: 1000,
					maxContentLength: 2000,// 보안 취약점 발견으로 추가 필요
				},
				_container: null,// responseType이 html일 때 로드한 html을 append 할 대상 ($element, '.target')
				_isAppend: true,// append 여부
				_isClear: true,// append 하기 전 container 내용 삭제
				_isLoading: true,// 로딩 노출
				_loadingHeight: null,// 로딩영역 높이 설정
				// onAppendBefore/onComplete/onError(콜백), ...Args(콜백 아규먼트)
				onAppendBefore: null, onAppendBeforeArgs: [], onComplete: null, onCompleteArgs: [], onError: null, onErrorArgs: []
			}, __options);
			var $container = $(options._container);

			if (options._isClear) $container.children().not('.mm_loading').remove();
			if (options._isLoading) mm.loading.show($container, options._loadingHeight);

			// ajax 로드 추가
			axios(options.configs)
			.then(function(__response) {

				// console.log(__response);
				var _data = __response.data;
				var _returnValue = mm.apply(options.onAppendBefore, options, [_data].concat(options.onAppendBeforeArgs));
				if (_returnValue) _data = _returnValue;// _data 가공이 필요할 경우 onAppendBefore에서 return으로 가공한 값 전달

				if (options._isAppend && $container[0]) {
					$container.append(_data);
					mm.component.update($container);// 로드된 부분만 컨텐츠 바인딩
				}

				mm.apply(options.onComplete, options, [_data].concat(options.onCompleteArgs));
				if (options._isLoading) mm.loading.hide($container, mm.times._base);

			})
			.catch(function(__error) {

				console.log(__url + '\n' + __error);
				mm.apply(options.onError, options, [__error].concat(options.onErrorArgs));
				if (options._isLoading) mm.loading.hide($container, mm.times._base);

			});

		},
	};

})();
///-- ajax

/// 요소 변환
mm.element = (function() {

	// public
	return {
		/// 요소의 data-속성 값이 JSON 타입 일 때 object로 변환
		datas: function(__element, __attribute, __defaults, __isSave) {

			// __defaults: 결과 값과 extend 할 기본 값
			// __isSave: 값이 true면 $el.data('mm.attr')형식으로 값을 저장

			var datas = $.extend(true, {}, __defaults);
			var $el = $(__element);

			if ($el[0]) {
				var _attr = $el.attr(__attribute);
				if (_attr && _attr.indexOf('{') == 0) {
					try {
						$.extend(true, datas, JSON.parse(_attr.replace(/\'/g, '"').replace(/\t/g, ' ')));
					} catch (__error) {
						console.log(__error);
					}
				}
			}

			if (__isSave == true) {
				$el.data('mm.' + __attribute.replace(/data\-/i, ''), datas);

				if (!$el[0]) return undefined;
			}

			return datas;

		},
		/// scroll + offset 위치
		position: function(__target) {

			var rects = $(__target)[0].getBoundingClientRect();
			var $scroller = mm.getScroller(__target, true);
			if (!$scroller[0]) $scroller = $(window);

			return { top: rects.top + $scroller.scrollTop(), left: rects.left + $scroller.scrollLeft() };

		}
		///-- scroll + offset 위치
	}

})();
///-- 요소 변환

/// 문자열 : 오브젝트 변환
mm.query = (function() {

	// public
	return {
		/// 문자열을 object로 변환
		parse: function(__string) {

			// __string: aa=1&bb=2&cc[]=3&cc[]=4 형식의 문자열 변수

			if (!_.isString(__string) || __string.indexOf('=') == -1) return {};

			var _queryString = decodeURIComponent(__string);
			if (_queryString.indexOf('?') == 0) _queryString = _queryString.substring(1);

			// return _.chain(_queryString.split('&'))
			// 	.map(function(__value) {
			//
			// 		if (__value) return __value.split('=');
			//
			// 	})
			// 	// .compact()// false, null, 0, '', undefiined remove
			// 	.object()
			// 	.value();

			var splits = _.partition(_queryString.split('&'), function(__value) {

				return /\[/.test(__value);

			});

			var datas = _.chain(splits[1])
				.map(function(__value) {

					if (__value) return __value.split('=');

				})
				.object()
				.value();

			// 이름에 []이 있을 경우 배열로 변경
			$.each(splits[0], function(__index, __value) {

				var index = __value.indexOf('[');
				var key = __value.substr(0, index);
				var value = __value.split('=')[1];

				if (_.isArray(datas[key])) datas[key].push(value);
				else datas[key] = [value];

			});

			return datas;

		},
		/// object를 문자열로 변환
		stringify: function(__object, __isUrlSearch) {

			// __isUrlSearch: true일 때 return되는 값 앞에 ?를 추가하여 location.search 형식으로 변경

			if (!_.isObject(__object)) return '';

			var _str = (__isUrlSearch == true) ? '?' : '';
			$.each(__object, function(__key, __value) {

				_str += '&' + __key + '=' + __value;

			});

			return _str.replace('&', '');

		}
	};

})();
///-- 문자열 : 오브젝트 변환

/// 쿠키
mm.cookie = (function() {

	// 삭제 시점을 설정 가능
	// 브라우저에서 쿠키설정을 막으면 저장안됨
	// 4kb까지 저장 가능

	// public
	return {
		// 쿠키 저장
		set: function(__key, __value, __day, __isMidnight) {

			// __isMidnight: true면 자정(0시)를 기준으로 설정

			var _day = parseFloat(__day);
			var date = new Date();
			if (__isMidnight == true) date.setHours(0, 0, 0, 0);
			date.setTime(date.getTime() + (_day * 24 * 60 * 60 * 1000));

			var _value = (!__value) ? true : __value;
			var _expireDay = (_day) ? '; expires=' + date.toUTCString() : '';
			document.cookie = __key + '=' + escape(_value) + _expireDay + '; path=/; domain=' + location.hostname;

		},
		// 쿠키 가져오기
		get: function(__key) {

			var _name = __key + '=';
			var _cookies = document.cookie.split(';');
			var _cookiesTotal = _cookies.length;

			for (var i = 0; i < _cookiesTotal; i++) {
				var _cookie = _cookies[i];
				while (_cookie.charAt(0) == ' ') _cookie = _cookie.substring(1);
				if (_cookie.indexOf(_name) == 0) return _cookie.substring(_name.length, _cookie.length);
			}

			return null;

		},
		// 쿠키 삭제
		remove: function(__key) {

			mm.cookie.set(__key, null, -1);

		},
	};

})();
///-- 쿠키

/// 로컬 쿠키(스토리지)
mm.local = (function() {

	// mm.cookie와 사용방법 같음
	// 도메인 기준으로 저장됨
	// 브라우저를 닫아도 다시 접속하면 살아있음
	// 개인정보 등 저장 위험
	// 5mb까지 저장 가능

	// public
	return {
		// 로컬 저장
		set: function(__key, __value, __day, __isMidnight) {

			// __isMidnight: true면 자정(0시)를 기준으로 설정

			var _day = parseFloat(__day);
			var date = new Date();
			if (__isMidnight == true) date.setHours(0, 0, 0, 0);
			date.setTime(date.getTime() + (_day * 24 * 60 * 60 * 1000));

			var _value = (__value == undefined) ? true : __value;
			var _expireDay = (_day) ? date.toUTCString() : null;
			mm.storage.set('local', __key, { values: _value, _expire: _expireDay });

		},
		// 로컬 가져오기
		get: function(__key) {

			var datas = mm.storage.get('local', __key);
			if (!datas) return null;// 저장된 키가 없음

			var date = new Date();
			// 폐기
			if (datas._expire && datas._expire < date.toUTCString()) {
				mm.local.remove(__key);
				return null;
			}
			// 값 리턴
			else {
				return datas.values;
			}

		},
		// 로컬 삭제
		remove: function(__key) {

			mm.storage.remove('local', __key);

		},
	};

})();
///-- 로컬 쿠키(스토리지)

/// 스토리지 관리
mm.storage = (function() {

	// storage는 값 저장 시 string만 지원해서 JSON으로 변환하는 부분 추가
	// 도메인을 기준으로 저장
	// session은 브라우저를 닫으면 사라짐
	// local은 브라우저를 닫아도 다시 접속하면 살아있음(보안이 필요없는 부분에만 사용)
	// 5mb까지 저장 가능
	// __type: 저장소 위치(session, local)

	function getStorage(__type) {

		return (__type == 'session') ? sessionStorage : (__type == 'local') ? localStorage : null;

	}

	// public
	return {
		// 스토리지 저장
		set: function(__type, __key, __value) {

			var _storage = getStorage(__type);
			if (!_storage || arguments.length < 3) return;

			var values = { valueType: typeof __value };
			if (_.isArray(__value)) values.valueType = 'array';
			if (/number|string|boolean/i.test(values.valueType)) values.valueText = __value;
			else $.extend(true, values, __value);

			_storage.setItem(__key, JSON.stringify(values));

		},
		// 스토리지 가져오기
		get: function(__type, __key) {

			var _storage = getStorage(__type);
			if (!_storage || arguments.length < 2) return;

			var values = JSON.parse(_storage.getItem(__key));
			if (!values) return;

			if (/number|string|boolean/i.test(values.valueType)) values = values.valueText;
			else if (/array/i.test(values.valueType)) values = _.values(_.omit(values, ['valueType', 'valueText']));
			else values = _.omit(values, ['valueType', 'valueText']);

			return values;

		},
		// 스토리지 삭제
		remove: function(__type, __key) {

			var _storage = getStorage(__type);
			if (!_storage || arguments.length < 2) return;

			_storage.removeItem(__key);

		},
		// 스토리지 전체삭제
		clear: function(__type) {

			var _storage = getStorage(__type);
			if (!_storage) return;

			_storage.clear();

		}
	};

})();
///-- 스토리지 관리

/// 히스토리
mm.history = (function() {

	// url을 기준으로 저장
	// 브라우저를 닫으면 사라짐(브라우저만 닫지 않으면 url이 바뀌었다 돌아와도 살아있음)
	// 640kb까지 저장 가능

	// private
	(function() {

		var states = history.state;
		if (states) {
			// 스크롤 이동
			if (states._scroll) {
				mm.anchor(states._scroll);
				delete history.state._scroll;// 기존 위치 삭제
			}

			// 내용 교체
			// delete history.state._html;
		}

	})();

	// public
	return {
		/// 뒤로 가기
		back: function(__step) {

			if (mm._isIframe) {// 최상위에서 실행
				mm.root('mm.history.back', arguments);
				return;
			}

			var _index = parseFloat(__step);
			if (!_index) _index = 1;
			history.go(-_index);

		},
		/// 앞으로 가기
		forward: function(__step) {

			if (mm._isIframe) {// 최상위에서 실행
				mm.root('mm.history.forward', arguments);
				return;
			}

			var _index = parseFloat(__step);
			if (!_index) _index = 1;
			history.go(_index);

		},
		/// 히스토리 추가
		push: function(__states, __url, __title) {

			if (!_.isString(__url)) return;

			if (mm._isIframe) {// 최상위에서 실행
				mm.root('mm.history.push', arguments);
				return;
			}

			history.pushState(__states, __title, __url);

		},
		/// 히스토리 변경
		replace: function(__states, __url, __title) {

			// __states만 넣어 사용 가능

			if (mm._isIframe) {// 최상위에서 실행
				mm.root('mm.history.replace', arguments);
				return;
			}

			// __states가 null이면 초기화
			var states = history.state || {};
			$.extend(true, states, __states);
			if (_.isNull(__states) || __states == 'null') states = null;

			var _url = __url || location.href;
			var _title = __title || '';

			history.replaceState(states, _title, _url);

		},
		/// 링크 이동 전 현재 DOM 저장
		setDOM: function(__states) {

			// __states: history.state에 추가로 저장할 값(object)

			var states = $.extend(true, { _scroll: mm.getScroller().scrollTop()/*, _html: mm.getScroller().find('.mm_page-content').html()*/ }, __states);// ie에서 dom 요소가 많으면 html 저장이 안되는 이슈로 _html 주석처리
			mm.history.replace(states);

		},
		/// 히스토리 이동 후 저장된 DOM으로 교체
		getDOM: function(__completeCallback, __defaultCallback) {

			// __completeCallback: 히스토리가 있을 때 html 교체 후 실행(변수 리셋 등)
			// __defaultCallback: 히스토리가 없을 때 일반 실행

			var states = history.state;
			if (states && states._html) {
				var $pageContent = $('.mm_page-content');

				$pageContent.html(states._html);
				delete history.state._html;// 적용 후 이전 내용 삭제

				// 스크롤이 있으면 해당 위치로 이동
				if (states._scroll) {
					mm.getScroller().scrollTop(states._scroll);
					delete history.state._scroll;// 적용 후 이전 스크롤 삭제
				}

				mm.preload.destroy();
				mm.preload.update();
				mm.component.update($pageContent);

				// 교체 완료
				if (_.isFunction(__completeCallback)) __completeCallback(states);
			}
			// 저장된 html 없음(기본 적용)
			else {
				if (_.isFunction(__defaultCallback)) __defaultCallback(states);
			}

		},
	};

})();
///-- 히스토리

/// 이벤트 옵저버
mm.observer = (function() {

	// mm.observer.set(__element, 'CUSTOM_EVENT', callback function, { datas: {}, _isOverwrite: false });// 저장
	// mm.observer.get();// 저장 목록 보기
	// mm.observer.remove(__element);// 타겟의 전체 이벤트 삭제
	// mm.observer.remove(null, 'CUSTOM_EVENT');// 이벤트가 걸린 타겟 전체 삭제
	// mm.observer.remove(__element, 'CUSTOM_EVENT');// 지정 삭제
	// mm.observer.update('CUSTOM_EVENT', { datas: {} });// 이벤트 실행
	// set의 options은 필수 아님
	// set의 options.datas는 callback function의 1번째 아큐먼트 event.datas로 접근 가능(object type)
	// set의 options._isOverwrite가 true면 중복되었을 때 기존 설정을 지우고 새로 덮어씌움
	// update의 options은 필수 아님
	// update의 options.datas는 __callback의 2번째 arguments로 사용 가능

	// 이슈사항
	// 같은 아이프레임 모달을 두 번 띄워 mm.observer.update를 했을 때 top.window.mm 객체를 못참는 이슈로 전역이 아닌 지역에서만 실행되도록 변경
	// mm._isIframe 주석처리

	var events = [];

	// public
	return {
		/// 이벤트 실행
		update: function(__event, __options) {

			// options.datas는 __callback의 2번째 arguments로 사용 가능

			if (!__event) return;

			// if (mm._isIframe) {// 최상위에서 실행
			// 	mm.root('mm.observer.update', arguments);
			// 	return;
			// }

			var options = $.extend({ datas: {} }, __options);

			$.each(events, function(_index, __value) {

				if (__event == __value._event) __value._element.trigger(__event, options.datas);

			});

		},
		/// 이벤트 저장
		set: function(__element, __event, __callback, __options) {

			// options.datas는 __callback의 1번째 arguments event의 datas(object)로 사용 가능
			// options._isOverwrite를 true로 하면 중복 되더라도 덮어 씌움

			if (!__element || !__event || !__callback) return;

			// if (mm._isIframe) {// 최상위에서 실행
			// 	mm.root('mm.observer.set', arguments);
			// 	return;
			// }

			var options = $.extend({ datas: {}, _isOverwrite: false }, __options);
			var $el = $(__element);
			var _isOverlap = false;

			// 중복 체크
			$.each(events, function(_index, __value) {

				if ($el.is(__value._element) && __event == __value._event) {
					_isOverlap = true;
					return false;
				}

			});
			if (_isOverlap) {
				if (options._isOverwrite) mm.observer.remove(__element, __event);// 중복 삭제
				else return;
			}

			$el.on(__event, options.datas, __callback);
			events.push({ _element: $el, _event: __event });

		},
		/// 이벤트 확인
		get: function() {

			// if (mm._isIframe) {// 최상위에서 실행
			// 	return mm.root('mm.observer.get', arguments);
			// }

			return events;

		},
		/// 이벤트 삭제
		remove: function(__element, __event) {

			if (arguments.length == 0) return;
			// if (mm._isIframe) {// 최상위에서 실행
			// 	mm.root('mm.observer.remove', arguments);
			// 	return;
			// }

			var $el = $(__element);
			var targets = [];

			$.each(events, function(__index, __value) {

				// 요소 없음
				if (!__element) {
					// 이벤트가 걸린 타겟 전체 삭제
					if (__event == __value._event) {
						__value._element.off(__event);
						targets.push(__index);
					}
				}
				// 요소 있음
				else {
					// 이벤트 없음
					if (!__event) {
						// 타겟에 걸린 이벤트 전체 삭제
						if ($el.is(__value._element)) {
							$el.off(__value._event);
							targets.push(__index);
						}
					}
					// 이벤트 있음
					else {
						// 타겟의 이벤트만 삭제
						if ($el.is(__value._element) && __event == __value._event) {
							$el.off(__event);
							targets.push(__index);
						}
					}
				}

			});

			// 이벤트 리스트 삭제
			events = _.filter(events, function(__value, __index) {

				return !_.contains(targets, __index);

			});

		},
	};

})();
///-- 이벤트 옵저버

/// 로딩
mm.loading = (function() {

	// public
	return {
		/// 보기
		show: function(__element, __options) {

			// __element: 로딩을 표시할 요소(기본 값 .mm_app)
			// _minHeight: 값이 0이면 __element의 offset.top과 툴바 높이를 제외한 높이를 적용하고, 0보다 크면 해당 값을 적용
			// _size: 로딩 이미지 사이즈
			// _text: 로딩에 텍스트 노출
			// ios에서 링크가 바뀔 때 css keyframes로 적용된 모션 중 :before, :after 요소는 움직이지 않음

			var $el = $(__element);
			var options = $.extend(true, { _minHeight: 0, _size: null, _text: null }, __options);
			var _isApp = false;

			if (!$el[0]) {
				$el = $('.mm_app');
				_isApp = true;
			}
			mm.loading.hide($el);

			var $loading = $(''
			+ '<div class="mm_loading">'
				+ '<div class="mm_loading-inner">'
					+ '<i class="mco_loading __mco-spin"></i>'
					+ '<p class="mm_ir-blind">Loading...</p>'
				+ '</div>'
			+ '</div>'
			+ '').prependTo($el);

			if (!_isApp) $loading.css({ 'position': 'absolute' });
			if (!/relative|absolute/i.test($el.css('position'))) $el.css({ 'position': 'relative' });
			if (options._size) $loading.find('.mco_loading').css({ 'font-size': options._size + 'px' });
			if (options._text) $loading.find('.mm_ir-blind').removeClass('mm_ir-blind').html(options._text);

			if (options._minHeight > 0) {
				// var _height = (options._minHeight == 0) ? window.innerHeight - $el.offset().top - parseFloat($('.mm_page').css('padding-bottom')) : options._minHeight;
				$el.css({ 'min-height': options._minHeight });
				// if ($('.mm_gnb')[0]) $loading.css({ 'top': $('.mm_page').css('padding-top') });
			}

		},
		/// 숨김
		hide: function(__element, __delay) {

			// __element: 삭제할 로딩이 있는 부모 요소(기본 값 .mm_app)
			// __delay: 딜레이 시간(초)

			var $el = $(__element);
			if (!$el[0]) $el = $('.mm_app');

			var $loading = $el.find('.mm_loading');
			if (!$loading[0]) $loading = $el.siblings('.mm_loading');
			if (!$loading[0]) return;

			var tweenOptions = {
				alpha: 0,
				onComplete: function() {

					$loading.remove();
					if (!$el.find('.mm_loading')[0]) {
						$el.css({ 'min-height': '' });
						if (/relative|absolute/i.test($el.attr('style'))) $el.css({ 'position': '' });
					}

				}
			}

			if (__delay >= 0) tweenOptions.delay = __delay;

			TweenMax.to($loading, mm.times._fast, tweenOptions);

		},
	};

})();
///-- 로딩

/// 프로그레스
mm.progress = (function() {

	// public
	return {
		/// 보기
		show: function(__element, __options) {

			//

		},
		/// 숨김
		hide: function(__element) {

			//

		},
		/// 업데이트
		update: function(__element, __options) {

			//

		},
	};

})();
///-- 프로그레스

/// 스크롤바
mm.scrollbar = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		// 플러그인 옵션
		configs: {
			paddingAbsolute: true,
			scrollbars: {
				autoHide: 'never',// never, scroll, leave, move
				autoHideDelay: 1500,
				clickScrolling: true,
			}
		},
		Scrollbar: null,// overlay scrollbar
	};
	var _dataName = 'data-scrollbar';// 데이타 속성 이름

	// 스크롤바 요소
	function getScrollbarElement(__element) {

		var $el = (__element) ? $(__element) : $('.mm_scroller');
		return ($el[0] && !$el.hasClass('mm_scroller')) ? $el.find('.mm_scroller') : $el;

	}

	// public
	return {
		/// 스크롤바 연결
		update: function(__element, __options) {

			// mm.scrollbar.update(); .mm_scroller 요소에 data-scrollbar 속성이 있으면 적용(기본)
			// data-scrollbar에 값이 없으면 기본 옵션으로 적용
			// data-scrollbar에 json으로 옵션 설정 가능

			getScrollbarElement(__element).each(function() {

				var $ui = $(this);
				if ($ui.hasClass('os-host') || _.isUndefined($ui.attr(_dataName))) return;

				var datas = $ui.data('mm.scrollbar') || mm.element.datas($ui, _dataName, defaults, true);
				$.extend(true, datas, __options);
				datas.Scrollbar = OverlayScrollbars($ui[0], datas.configs);

			});

		},
	};

})();
///-- 스크롤바

/// 이미지
mm.image = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		_classNone: 'mco_image',// 없음 아이콘 클래스
	};
	var _dataName = 'data-image';// 데이타 속성 이름

	// public
	return {
		/// 투명 1px gif
		_empty: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
		/// 없음 이미지
		none: function(__element, __options) {

			var $el = $(__element);
			if (!$el[0]) return;

			var datas = $el.data('mm.image') || mm.element.datas($el, _dataName, defaults, true);
			$.extend(true, datas, __options);

			if ($el.is('i')) {
				$el.addClass(['ico_none', datas._classNone])
				.parent().addClass('mm_image-none');
			}
			else {
				$el.after('<i class="ico_none ' + datas._classNone + '" />')
				.parent().addClass('mm_image-none')
				.end().remove();
			}

		},
	};

})();
///-- 이미지

/// 프리로드
mm.preload = (function() {

	// mm.preload.update(); .mm_preload 요소에 적용(기본)
	// mm.preload.update(__element, { _isElement: true }); 특정 요소만 적용할 때 사용

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		_src: null,// 이미지 경로
		_isErrorImage: true,// 오류 이미지 노출
		_isPass: false,// 특정 조건에서 따로 실행이 필요할 경우 true로 적용하면 프리로드 안됨(swiper 등)
		onBefore: null,// 프리로드 전 콜백
		onBeforeArgs: [],
		onComplete: null,// 프리로드 후 콜백
		onCompleteArgs: [],
		onError: null,// 오류 콜백
		onErrorArgs: [],
	};
	var _dataName = 'data-preload';// 데이타 속성 이름

	var _classLoading = '__preload-loading';
	var _classLoaded = '__preload-loaded';
	var _classError = '__preload-error';

	// 프리로드 요소
	function getPreloadElement(__element) {

		var $el = (__element) ? $(__element) : $('.mm_preload');
		return ($el[0] && !$el.hasClass('mm_preload')) ? $el.find('.mm_preload') : $el;

	}

	// public
	return {
		_classLoading: _classLoading,
		_classLoaded: _classLoaded,
		_classError: _classError,
		/// 프리로드 연결
		update: function(__element, __options) {

			getPreloadElement(__element).each(function() {

				var $el = $(this);
				if ($el.hasClass(_classLoading) || $el.hasClass(_classLoaded) || $el.hasClass(_classError)) return;

				var datas = $el.data('mm.preload') || mm.element.datas($el, _dataName, defaults, true);
				if (datas._isPass == true) return;

				var _isIframe = $el.is('iframe');
				var _isImage = $el.is('img');
				var $event = $el;// 이벤트를 연결할 요소
				$.extend(true, datas, __options);

				// iframe
				if (_isIframe && !$el.attr('scrolling')) $el.attr({ 'scrolling': 'no' });

				// 배경
				if (!_isIframe && !_isImage) $event = $('<img />').attr({ _dataName: JSON.stringify(datas).replace(/"/g, '\'') });

				// 프리로드 전
				$el.addClass(_classLoading);
				mm.apply(datas.onBefore, $el, datas.onBeforeArgs);

				$event.on('load error', function(__e) {

					switch (__e.type) {
						// 프리로드 완료
						case 'load':
							$el.removeClass(_classLoading).addClass(_classLoaded);

							// iframe
							if (_isIframe) {
								var _iframeTitle = $el.attr('title') || $el.contents()[0].title || '';
								$el.attr({ 'title': _iframeTitle });

								// 에러 화면 title로 확인
								if (/404 not found|불편을 드려 죄송합니다/i.test(_iframeTitle)) {
									$el.removeClass([_classLoading, _classLoaded]).addClass(_classError);
									console.log('error src : ' + $el.attr('src'));

									mm.apply(datas.onError, $el, datas.onErrorArgs);

									return;
								}
							}

							// 배경
							if (!_isIframe && !_isImage) {
								$el.css({ 'background-image': 'url("' + $event.attr('src') + '")' });
								$event.remove();
							}

							// 모달 리사이징
							if ($el.closest('.mm_modal')[0]) mm.modal.resize();

							$el.removeAttr('data-preload');
							mm.apply(datas.onComplete, $el, datas.onCompleteArgs);
						break;
						// 프리로드 에러
						case 'error':
							$el.removeClass([_classLoading, _classLoaded]).addClass(_classError);
							console.log('error src : ' + $event.attr('src'));

							if (datas._isErrorImage) mm.image.none($el);// 없음 이미지

							mm.apply(datas.onError, $el, datas.onErrorArgs);
						break;
					}

				}).attr({ 'src': datas._src });

			});

		},
		/// 프리로드 해제
		destroy: function(__element) {

			// _classLoading 상태만 적용

			getPreloadElement(__element).each(function() {

				var $el = $(this);
				if ($el.hasClass(_classLoaded) || $el.hasClass(_classError)) return;

				$el.removeAttr('src').removeClass(_classLoading);

			});

		},
	};

})();
///-- 프리로드

/// 스와이퍼
mm.swiper = (function() {

	// .mm_swiper에만 적용됨
	// __element: 적용할 셀렉터 또는 셀렉터들을 포함하는 부모 (없으면 페이지 전체)

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		// 플러그인 옵션
		Swiper: null,// :Swiper
		configs: {
			initialSlide: 0,// 초기 슬라이드,
			// autoHeight: false,// 자동 높이조절
			// loop: false,
			// touchReleaseOnEdges: false,
			// allowTouchMove: true,
			// autoplay: false,
			wrapperClass: 'swiper-wrapper',
			slideClass: 'swiper-slide',
			slideActiveClass: 'swiper-slide-active',
			slideDuplicateClass: 'swiper-slide-duplicate',
			// navigation: {
			// 	nextEl: '.btn_swiper-next',
			// 	prevEl: '.btn_swiper-prev',
			// },
			pagination: {
				el: '.swiper-pagination',
			}
		},
		_type: 'swiper_box',// 고정 값 - swiper_box(일반), swiper_free(메뉴), swiper_page(페이지)
		count: '> .swiper-count',
		controls: {
			_isSwiperInner: true,
			prev: '.btn_swiper-prev',
			next: '.btn_swiper-next',
		},
		syncer: null,// 스와이퍼와 연동되는 다른 스와이퍼 요소 (string, element, $selector)
		// _isSyncerUpdate: true,// :boolean - 싱커 업데이트 이벤트 실행 여부
		_isRemoveClone: false,// 복제요소삭제 (swiper_page와 swiper_box의 slide개수가 3개 이상일 때는 자동 적용)
		onChange: null,// 변경 콜백
		onChangeArgs: [],
		_index: null,// 페이지 내 스와이퍼 번호
		_classInitial: null,// initialSlide index 확인을 위한 클래스
		// 내부사용
		__: {
			preload: null,// 프리로드 적용
			resize: function() {},// 리사이즈 함수
		},
	};
	var _dataName = 'data-swiper';// 데이타 속성 이름
	var _swiperIndex = 0;// 다중 컨트롤 방지 고유번호 부여

	// 스와이퍼 요소
	function getSwiperElement(__element) {

		var $el = (__element) ? $(__element) : $('.mm_swiper');
		return ($el[0] && !$el.hasClass('mm_swiper')) ? $el.find('.mm_swiper') : $el;

	}

	// private
	(function() {

		//

	})();

	// public
	return {
		/// 스와이퍼 연결
		update: function(__element) {

			getSwiperElement(__element).each(function(__i) {

				var $ui = $(this);
				if (!$ui.is(':visible')) return;// 숨겨져 있는 요소는 적용 안됨

				var datas = $ui.data('mm.swiper') || mm.element.datas($ui, _dataName, defaults, true);
				var $slides = $ui.find('.' + datas.configs.wrapperClass);
				var $pagination = $ui.find(datas.configs.pagination.el);
				var $count = $ui.find(datas.count);

				// 슬라이드 요소가 2보다 작으면 적용 안됨
				if ($slides.find('.' + datas.configs.slideClass).length < 2) {
					$slides.find('.' + datas.configs.slideClass).addClass(datas.configs.slideActiveClass);
					$pagination.remove();
					$count.remove();

					return;
				}

				if (datas.Swiper) {
					mm.swiper.reset($ui);// 중복 실행 시 리셋
					// if (datas.Swiper.snapIndex < 0) mm.swiper.reset($ui);// 제대로 적용이 안된 요소는 리셋

					return;// 이미 적용되어 있는 요소는 적용 안됨
				}

				// 다중 컨트롤 방지 고유번호 부여
				datas._index = _swiperIndex++;
				$ui.addClass('__swiper-index' + datas._index);
				var _swiperClass = '.' + $ui.attr('class').replace(' ', '.');

				// 페이지네이션 추가
				$.extend(true, datas.configs, {
					pagination: {
						el: _swiperClass + ' ' + datas.configs.pagination.el,
						clickable: true
					}
				});

				// 카운터 추가
				if ($count[0]) {
					$.extend(true, datas.configs, {
						pagination: {
							el: _swiperClass + ' ' +  datas.count,
							type: 'fraction'
						}
					});
				}

				// $.extend(true, datas.configs, {
					// 	navigation: {
						// 		nextEl: _swiperClass + ' ' + datas.configs.navigation.nextEl,
						// 		prevEl: _swiperClass + ' ' + datas.configs.navigation.prevEl,
						// 	},
						// });

				// 이전, 다음 컨트롤(swiper 자체 navigation 사용 시 다중 swiper가 제어되는 이슈 발생)
				var $controlBtn = (datas.controls._isSwiperInner) ? $ui.find(datas.controls.prev + ',' + datas.controls.next) : $(datas.controls.prev + ',' + datas.controls.next);
				$controlBtn.off('click').on('click', function(__e) {

					__e.preventDefault();

					if ($(this).is(datas.controls.prev)) datas.Swiper.slidePrev();
					else datas.Swiper.slideNext();

				});

				// 초기슬라이드 인덱스
				if (datas._classInitial) datas.configs.initialSlide = $('.'+ datas._classInitial).closest('.swiper-slide').index();

				// 컨텐츠/본문타입
				if (datas._type == 'swiper_box' || datas._type == 'swiper_page') {
					$.extend(true, datas.configs, {
						on: {
							init: function() {

								if (!datas._isRemoveClone) return;

								var swiper = this;
								swiper.slides.each(function(__i) {

									var $this = $(this);
									if ($this.hasClass(datas.configs.slideDuplicateClass)) {
										$this.empty().css({ 'z-index': -1 });
										$.each($this[0].attributes, function() {

											// 복제요소 스와이퍼 속성 외 삭제
											if (!/^class$|^style$|^data\-swiper\-slide/i.test(this.name)) $this.removeAttr(this.name);

										});
									}

								});

								$ui.addClass('swiper-removeclone');

							},
							slideChangeTransitionStart: function() {

								if (datas.Swiper && datas._isRemoveClone && datas.configs.effect != 'fade') datas.__.resize(this);// 복제 제거로 자동높이 직접 적용

								var $menu = $(datas.syncer);

								// 싱크된 메뉴가 있을 때
								if ($menu[0]) {
									if ($menu[0].swiper) $menu[0].swiper.slideTo(swiper.realIndex);

									var menuDatas = $menu.data('mm.swiper');
									mm.apply(menuDatas.onChange, $menu, [swiper.realIndex].concat(menuDatas.onChangeArgs));
								}

							},
							transitionStart: function() {

								var swiper = this;
								if (!swiper.params.loop || !datas._isRemoveClone) return;

								// 스와이퍼 복제 사용 안함으로 인한 위치 이동
								var $slides = $(swiper.slides);
								var $slideFirst = $slides.not('.' + datas.configs.slideDuplicateClass).first();
								var $slideLast = $slides.not('.' + datas.configs.slideDuplicateClass).last();

								if (!$slideFirst[0] || !$slideLast[0]) return;

								// 효과 페이드
								if (datas.configs.effect == 'fade') {

								}
								// 효과 슬라이드
								else {
									$slideFirst.css({ 'visibility': '', 'transform': '' });
									$slideLast.css({ 'visibility': '', 'transform': '' });

									// 처음
									if (swiper.activeIndex == 1) {
										$slideLast.css({ 'visibility': 'inherit', 'transform': 'translateX(-' + $slideLast.position().left + 'px)' });
									}
									// 처음 복제
									else if (swiper.activeIndex == swiper.slides.length - 1) {
										$slideFirst.css({ 'visibility': 'inherit', 'transform': 'translateX(' + $slideLast.position().left + 'px)' });
									}
									// 마지막
									else if (swiper.activeIndex == swiper.slides.length - 2) {
										$slideFirst.css({ 'visibility': 'inherit', 'transform': 'translateX(' + $slideLast.position().left + 'px)' });
									}
									// 마지막 복제
									else if (swiper.activeIndex == 0) {
										$slideLast.css({ 'visibility': 'inherit', 'transform': 'translateX(-' + $slideLast.position().left + 'px)' });
									}
								}

							}
						}
					});

					if (datas._type == 'swiper_page' || $slides.find('.' + datas.configs.slideClass).length > 2) datas._isRemoveClone = true;// 클론요소삭제

					if (mm.is.empty(datas.configs.loop)) datas.configs.loop = (datas._type == 'swiper_page' && $ui.parents('.mm_swiper')[0]) ? false : true;// page 타입 컨텐츠가 mm_swiper 안에 있을 때 loop 안됨
					if (mm.is.empty(datas.configs.touchReleaseOnEdges)) datas.configs.touchReleaseOnEdges = !datas.configs.loop;// loop가 false 일 때 multiple swiper 내부 처음/마지막에서 상위 swiper 이동
					if (mm.is.empty(datas.configs.allowTouchMove)) datas.configs.allowTouchMove = datas.configs.loop;// loop가 false 일 때 본문 스와이퍼 안됨 (lnb로 컨트롤 가능)
					if (mm.is.empty(datas.configs.autoplay)) datas.configs.autoplay = (datas._type == 'swiper_page') ? false : { delay: 3000, disableOnInteraction: false };// 페이지타입과 autoplay가 false가 아니면 자동롤링 적용

					// 컨텐츠 자동 높이
					if (datas.configs.autoHeight) {
						if (!datas._isRemoveClone) datas.configs.autoHeight = true;// 복제 제거로 slideChangeTransitionStart 함수에 직접 적용
						else {
							// 높이 업데이트
							datas.__.resize = function() {

								var $slide = mm.swiper.activeSlide(datas);
								$(datas.Swiper.$wrapperEl).height($slide.children().not('.mm_loading, script').outerHeight());

							}
						}
					}
				}

				// 메뉴타입
				if (datas._type == 'swiper_free') {
					$.extend(true, datas.configs, {
						// freeMode: true,
						slidesPerView: 'auto',
						centeredSlides: true,
						on: {
							init: function(__e) {

								// $ui.css({ 'visibility': 'inherit' });
								mm.instant(datas.__.resize, { _delay: 400 });// 위치 초기화 2중 확인

							},
							tap: function(__e) {

								var $syncer = $(datas.syncer);

								// 싱크된 컨텐츠가 있을 때
								if ($syncer[0]) {
									__e.returnValue = false;

									var syncSwiper = $syncer[0].swiper;
									var _index = (syncSwiper.params.loop) ? this.clickedIndex + 1 : this.clickedIndex;

									if (syncSwiper) syncSwiper.slideTo(_index, 0);
								}

							},
							resize: function(__e) {

								if (datas.__.resize) datas.__.resize();// 안드로이드 키패드업, 카카오톡 스크롤 시 resize로 위치가 바뀌는 이슈로 적용

							}
						}
					});

					// 사이즈, 위치 업데이트
					datas.__.resize = function() {

						var swiper = datas.Swiper;
						swiper.update();

						var _max = swiper.wrapperEl.scrollWidth - swiper.width;
						$.each(swiper.slidesGrid, function(__index, __value) {

							if (__value < 0) {
								swiper.slidesGrid[__index] = 0;
								swiper.snapGrid[__index] = 0;
							}
							else if (__value > _max) {
								swiper.slidesGrid[__index] = _max;
								swiper.snapGrid[__index] = _max;
							}

						});
						if (swiper.translate > 0) swiper.setTranslate(0);
						else if (swiper.translate < -_max) swiper.setTranslate(-_max);

					}
				}

				if (datas.configs.slidesPerView && datas.configs.slidesPerView != 1) datas._isRemoveClone = false;// 클론삭제안함(단일 노출에만 적용)

				// 스와이퍼 적용
				datas.Swiper = new Swiper(_swiperClass + ' .mm_swiper-inner', datas.configs);
				datas.__.resize();

			});

		},
		/// 스와이퍼 재설정
		reset: function(__element) {

			if (!Swiper) return;// swiper js가 없으면 적용 안됨

			getSwiperElement(__element).each(function(__i) {

				var $ui = $(this);
				var datas = $ui.data('mm.swiper') || mm.element.datas($ui, _dataName, defaults, true);

				if (datas.Swiper) {
					$ui.removeClass('__swiper-index' + datas._index + ' swiper-removeclone');
					datas.Swiper.destroy();
					datas.Swiper = null;
					$ui.removeData('mm.swiper');
				}

				mm.swiper.update($ui);

			});

		},
		/// 스와이퍼 현재 슬라이드
		activeSlide: function(__datas) {

			var swiper = __datas.Swiper;
			var $slide = (!swiper.params.loop) ? $(swiper.$wrapperEl).children('.' + __datas.configs.slideActiveClass) : $(swiper.slides).filter(function() { return $(this).attr('data-swiper-slide-index') == swiper.realIndex && !$(this).hasClass(__datas.configs.slideDuplicateClass) });
			if (!$slide[0]) $slide = $(swiper.slides);

			return $slide;

		},
	};

})();
///-- 스와이퍼

/// 토글
mm.toggle = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		_classOn: '__on',// 토글 클래스
		_title: '선택됨',// 토글 활성화 시 적용할 title 속성 값
		syncer: null,// 토글과 연결된 요소 (string, element, $selector)
		_isSyncerUpdate: true,// :boolean - 싱커 업데이트 이벤트 실행 여부
		onOn: null,// open 콜백
		onOnArgs: [],
		onOff: null,// close 콜백
		onOffArgs: [],
	};
	var _dataName = 'data-toggle';// 데이타 속성 이름

	// private
	(function() {

		$(document).on('click', '.mm_toggle', function(__e) {

			__e.preventDefault();

			mm.toggle.update(this);

		});

	})();

	// public
	return {
		/// 활성|비활성 자동
		update: function(__element, __options) {

			var $el = $(__element);
			if (!$el[0]) return;

			var datas = $el.data('mm.toggle') || mm.element.datas($el, _dataName, defaults, true);
			$.extend(true, datas, __options);

			if ($el.hasClass(datas._classOn)) mm.toggle.off($el, datas);
			else mm.toggle.on($el, datas);

		},
		/// 활성
		on: function(__element, __options) {

			var $el = $(__element);
			if (!$el[0]) return;

			var datas = $el.data('mm.toggle') || mm.element.datas($el, _dataName, defaults, true);
			$.extend(true, datas, __options);

			$el.addClass(datas._classOn).attr({ 'title': datas._title });

			var $syncer = $(datas.syncer);
			if ($syncer[0]) {
				$syncer.addClass(datas._classOn);
				if (datas._isSyncerUpdate) mm.component.update($syncer);
			}

			mm.apply(datas.onOn, $el, datas.onOnArgs);

		},
		/// 비활성
		off: function(__element, __options) {

			var $el = $(__element);
			if (!$el[0]) return;

			var datas = $el.data('mm.toggle') || mm.element.datas($el, _dataName, defaults, true);
			$.extend(true, datas, __options);

			$el.removeClass(datas._classOn).removeAttr('title');

			var $syncer = $(datas.syncer);
			if ($syncer[0]) {
				$syncer.removeClass(datas._classOn);
				if (datas._isSyncerUpdate) mm.form.update($syncer);
			}

			mm.apply(datas.onOff, $el, datas.onOffArgs);

		},
	};

})();
///-- 토글

/// 드롭다운(아코디언)
mm.dropdown = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		_classOn: '__dropdown-on',// :string - open 클래스
		_group: null,// :string - 아코디언 그룹
		_isChildren: true,// :boolean - ui의 1뎁스 위치에서 요소 연결, false일 경우 dropdown 안에 2중으로 dropdown 넣을 수 없음
		_isMotion: true,// :boolean - 모션 적용, table 요소일 경우 false 적용됨
		onOpen: null,// :function - open 콜백
		onOpenArgs: [],// :array
		onClose: null,// :function - close 콜백
		onCloseArgs: [],// :array
		onChange: null,// :function - open/closoe 콜백
		onChangeArgs: [],// :function - open/closoe 콜백
	};
	var _dataName = 'data-dropdown';// 데이타 속성 이름

	// 드롭다운 요소
	function getDropdownElement(__element) {

		var $el = (__element) ? $(__element) : $('.mm_dropdown');
		return ($el[0] && !$el.hasClass('mm_dropdown')) ? $el.find('.mm_dropdown') : $el;

	}

	// private
	(function() {

		$(document).on('click', '.mm_dropdown .btn_dropdown', function(__e) {

			__e.preventDefault();

			var $ui = $(this).closest('.mm_dropdown');
			var datas = $ui.data('mm.dropdown') || mm.element.datas($ui, _dataName, defaults, true);

			if ($ui.hasClass(datas._classOn)) mm.dropdown.close($ui);
			else mm.dropdown.open($ui);

		});

	})();

	// public
	return {
		/// 드롭다운 연결
		update: function(__element) {

			getDropdownElement(__element).each(function() {

				var $ui = $(this);
				var datas = $ui.data('mm.dropdown') || mm.element.datas($ui, _dataName, defaults, true);

				// 열기
				if ($ui.hasClass(datas._classOn)) mm.dropdown.open($ui, 0);

			});

		},
		/// 드롭다운 열기
		open: function(__element, __time) {

			$(__element).each(function() {

				var $ui = $(this);
				var datas = $ui.data('mm.dropdown') || mm.element.datas($ui, _dataName, defaults, true);

				var $btn = (datas._isChildren) ? $ui.children('.btn_dropdown') : $ui.find('.btn_dropdown');
				var $item = (datas._isChildren) ? $ui.children('.mm_dropdown-item') : $ui.find('.mm_dropdown-item');
				var _time = (_.isNumber(__time)) ? __time : mm.times._fast;
				var _isTable = $item.is('tbody, tr');

				$ui.addClass(datas._classOn);
				$btn.attr({ 'title': '접어놓기' });

				if (!_isTable) {
					if (datas._isMotion) TweenMax.to($item, _time, { height: $item.children('.mm_dropdown-item-inner').outerHeight(), ease: Cubic.easeOut });
					else $item.css({ 'height': 'auto' });
				}
				else {
					datas._isMotion = false;
					$item.show();
				}

				// 그룹 닫기(아코디언 모션)
				mm.dropdown.close($('[' + _dataName + '*=_group][' + _dataName + '*=' + datas._group + ']').not($ui), _time);

				// 컴포넌트 연결
				mm.component.update($item);

				mm.apply(datas.onOpen, $ui, datas.onOpenArgs);
				mm.apply(datas.onChange, $ui, datas.onChangeArgs);
				if ($ui.closest('.mm_modal')[0]) mm.modal.resize();// 모달팝업 리사이즈

			});

		},
		/// 드롭다운 닫기
		close: function(__element, __time) {

			$(__element).each(function() {

				var $ui = $(this);
				var datas = $ui.data('mm.dropdown') || mm.element.datas($ui, _dataName, defaults, true);

				var $btn = (datas._isChildren) ? $ui.children('.btn_dropdown') : $ui.find('.btn_dropdown');
				var $item = (datas._isChildren) ? $ui.children('.mm_dropdown-item') : $ui.find('.mm_dropdown-item');
				var _time = (_.isNumber(__time)) ? __time : mm.times._fast;
				var _isTable = $item.is('tbody, tr');

				$ui.removeClass(datas._classOn);
				$btn.attr({ 'title': '펼쳐보기' });

				if (!_isTable) {
					if (datas._isMotion) TweenMax.to($item, _time, { height: 0, ease: Cubic.easeOut });
					else $item.css({ 'height': '' });
				}
				else {
					datas._isMotion = false;
					$item.hide();
				}

				mm.apply(datas.onClose, $ui, datas.onCloseArgs);
				mm.apply(datas.onChange, $ui, datas.onChangeArgs);
				if ($ui.closest('.mm_modal')[0]) mm.modal.resize();// 모달팝업 리사이즈

			})

		},
	};

})();
///-- 드롭다운(아코디언)

/// 탭
mm.tab = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		_classOn: '__tab-on',
		_title: '선택됨',
		_isToggle: false,// 활성화 탭 자체 끄기 가능
		onChange: null,
		onChangeArgs: [],
	};
	var _dataName = 'data-tab';// 데이타 속성 이름

	// 탭 요소
	function getTabElement(__element) {

		var $el = (__element) ? $(__element) : $('.mm_tab');
		return ($el[0]) ? ($el.hasClass('btn_tab')) ? $el.closest('.mm_tab') : (!$el.hasClass('mm_tab')) ? $el.find('.mm_tab') : $el : $el;

	}

	// 탭컨텐츠 찾기
	function getTabFind(__element, __$el) {

		return __$el.find(__element).not(function(__index, __element) {

			return !$(__element).closest('.mm_tab').is(__$el);

		});

	}

	// private
	(function() {

		$(document).on('click', '.mm_tab .btn_tab', function(__e) {

			__e.preventDefault();

			mm.tab.change(this);

		});

	})();

	// public
	return {
		/// 탭 연결
		update: function(__element) {

			getTabElement(__element).each(function() {

				var $ui = $(this);
				var datas = $ui.data('mm.tab') || mm.element.datas($ui, _dataName, defaults, true);

				// mm.tab.change($el);

			});

		},
		/// 탭 변경
		change: function(__element, __options) {

			// var $el = $(__element);
			// if ($el.hasClass('btn_tab')) $el = $el.closest('.mm_tab');
			var $el = getTabElement(__element);
			if (!$el[0]) return;

			var $btn = getTabFind('.btn_tab', $el);
			var $item = getTabFind('.mm_tab-item', $el);
			var datas = $el.data('mm.tab') || mm.element.datas($el, _dataName, defaults, true);
			if (_.isObject(__options)) $.extend(true, datas, __options);

			var _index = (_.isNumber(__options)) ? (__options < 0 || __options == NaN) ? 0 : __options : ($(__element).hasClass('btn_tab')) ? mm.tab.index(__element) : mm.tab.index($el);

			if (datas._isToggle) {
				if ($(__element).hasClass(datas._classOn) || __options < 0) _index = $btn.length;
			}

			$btn.removeClass(datas._classOn).removeAttr('title').eq(_index).addClass(datas._classOn).attr({ 'title': datas._title });
			$item.removeClass(datas._classOn).eq(_index).addClass(datas._classOn);

			mm.apply(datas.onChange, $el, [_index].concat(datas.onChangeArgs));// 콜백
			mm.component.update($item.eq(_index));// 컴포넌트 연결

		},
		/// 탭 인덱스 값
		index: function(__element) {

			// var $el = $(__element);
			// if ($el.hasClass('btn_tab')) $el = $el.closest('.mm_tab');
			var $el = getTabElement(__element);
			if (!$el[0]) return;

			var $btn = getTabFind('.btn_tab', $el);
			var datas = $el.data('mm.tab') || mm.element.datas($el, _dataName, defaults, true);
			var _index = ($(__element).hasClass('btn_tab')) ? $btn.index(__element) : $btn.index($btn.filter(datas._classOn));

			return (_index < 0) ? 0 : _index;

		},
	};

})();
///-- 탭

/// 수량변경
mm.stepper = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		_min: 1,
		_max: 99999999,
	};
	var _dataName = 'data-stepper';// 데이타 속성 이름

	// private
	(function() {

		$(document).on('click', '.mm_stepper .btn_stepper-subtract, .mm_stepper .btn_stepper-add', function(__e) {

			__e.preventDefault();

			var $btn = $(this);
			var $ui = $btn.closest('.mm_stepper');
			var $numInput = $ui.find('.textfield');
			var datas = $ui.data('mm.stepper') || mm.element.datas($ui, _dataName, defaults, true);
			var _value = parseFloat($numInput.val());

			if ($btn.hasClass('btn_stepper-subtract') && _value > datas._min) _value--;
			if ($btn.hasClass('btn_stepper-add') && _value < datas._max) _value++;
			$numInput.val(_value);

			mm.form.update($numInput);

		});

	})();

	// public
	return {
		/// 수량확인
		update: function(__input, __event) {

			if (!__input) return;
			if (__event && __event.type == 'keyup' && !/(\d)|\.|\-/.test(__event.key)) return;// 키가 숫자.-가 아닐 때

			var $numInput = $(__input);
			var $ui = $numInput.closest('.mm_stepper');
			var datas = $ui.data('mm.stepper') || mm.element.datas($ui, _dataName, defaults, true);
			var _value = parseFloat($numInput.val());

			if (_value > datas._max) _value = datas._max;
			if (_value < datas._min) _value = datas._min;
			if (!_value) _value = (__event.type == 'keyup') ? '' : datas._min;
			$numInput.val(_value).attr({ 'value': _value });

			$ui.find('.btn_stepper-subtract, .btn_stepper-add').attr({ 'disabled': false });
			if (_value <= datas._min) $ui.find('.btn_stepper-subtract').attr({ 'disabled': true });
			if (_value >= datas._max) $ui.find('.btn_stepper-add').attr({ 'disabled': true });

		},
	};

})();
///-- 수량변경

/// 폼요소
mm.form = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		text: {
			_default: '',// :string - 빈 값일 때 적용하는 기본 값
			_classOn: '__text-on',// :string
			_classOff: '__text-off',// :string
			_format: null,// :string - 날짜, 시간에 사용 (YYYY년 MM월 DD일)
			_isResize: false,// :boolean
			_resizeMin: null,// :number
			_resizeMax: null,// :number
		},
		check: {
			_classOn: '__check-on',
			_type: 'check_box',// :string - check_box(일반), check_all(전체선택), check_count(선택개수)
			_group: null,// :string - 전체, 개별, 카운트를 묶어주는 값으로 check_count를 제외하고 값이 없으면 name 속성 값으로 적용됨(_group 값을 1순위로 적용)
			_min: null,// :number - 전체선택 충족 개수(check_all에만 적용)
			syncer: null,// :string/element/$selector
			_isSyncerUpdate: true,// :boolean - 싱커 업데이트 이벤트 실행 여부
			desyncer: null,// :string/element/$selector - 끌 때 사용(_classOn 클래스 적용은 syncer와 동일)
			_isDesyncerUpdate: true,// :boolean - 싱커 업데이트 이벤트 실행 여부
			onChange: null,// :function/string
			onChangeArgs: [],// :array
		},
		radio: {
			_classOn: '__radio-on',
			// _group: null,// :string - 라디오를 묶어주는 값으로 값이 없으면 name 속성 값으로 적용됨 (라디오는 name으로 묶어주는 것이 효율적일듯 한데...)
			syncer: null,// :string/element/$selector - 켤 때 사용
			_isSyncerUpdate: true,// :boolean - 싱커 업데이트 이벤트 실행 여부
			desyncer: null,// :string/element/$selector - 끌 때 사용(_classOn 클래스 적용은 syncer와 동일)
			_isDesyncerUpdate: true,// :boolean - 싱커 업데이트 이벤트 실행 여부
			// 내부사용
			__: {
				$syncer: null,// jQuery selector
				$desyncer: null,// jQuery selector
			}
		}
		,
		// 셀렉터는 option에 data-select를 연결
		select: {
			_classOn: '__select-on',
			syncer: null,// :string/element/$selector
			_isSyncerUpdate: true,// :boolean - 싱커 업데이트 이벤트 실행 여부
		}
	};
	var _dataNameText = 'data-text';
	var _dataNameCheck = 'data-check';
	var _dataNameRadio = 'data-radio';
	var _dataNameSelect = 'data-select';

	var checkers = ['input.textfield', 'textarea.textfield', '[type=radio]', '[type=checkbox]', 'select', '[type=file]', '.mm_image-list', '.mm_datepicker'];

	// 폼 요소
	function getFormElement(__element) {

		var _checker = checkers.join(',');
		var $el = (__element) ? $(__element) : $(_checker);
		return ($el[0] && !$el.is(_checker)) ? $el.find(_checker) : $el;

	}

	// private
	(function() {

		var $document = $(document);
		var $html = $('html');

		/// 텍스트 입력 (플레이스홀더)
		$document.on('keydown keyup focusout change update', 'input.textfield, textarea.textfield', function(__e) {

			// 입력 요소를 별도 스크립트로 변경할 경우 $(element).trigger('update') 호출하면
			// 변경된 내용 유/무에 따라 placeholder 텍스트가 적용됨
			// input, textarea 요소에 data-text: { _default: 값 } 속성을 설정하면 삭제 또는 내용이 없을 때 해당 값으로 설정됨
			// textarea에 data-text: { _isResize: true } 속성을 설정하여 자동으로 높이가 조절되도록 설정 가능
			// data-text: { _isResize: true, _resizeMin: 2, _resizeMax: 10 } 처럼 최소/최대 라인 설정 가능

			var $text = $(this);
			var $ui = $text.closest('.mm_form-text, .mm_form-textarea');
			var datas = $text.data('mm.text') || mm.element.datas($text, _dataNameText, defaults.text, true);
			var _toggleClass = ($text.is('[readonly], [disabled]')) ? datas._classOff : datas._classOn;
			var _value = $text.val();

			if (!$ui[0]) return;// .mm_form-text이 없을 때

			switch(__e.type) {
				case 'keydown':
					$ui.addClass(_toggleClass);
				break;
				case 'update':
					// input
					if ($text.is('[type=number]') && !$text.attr('inputmode')) $text.attr({ 'pattern': '[0-9]*', 'inputmode': 'numeric' });// 모바일 numberpad 노출 (w3c validation 검사를 위해 스크립트로 처리)
				// break 없음 (계속진행)
				case 'focusout':
					if ($.trim(_value).length == 0) $text.val(datas._default);// 기본 값
					$text.trigger('change');
				break;
				case 'change':
					$text.val($.trim(_value));
					_value = $text.val();
				// break 없음 (계속진행)
				case 'keyup':
					if (_value.length > 0) $ui.addClass(_toggleClass);
					else $ui.removeClass(_toggleClass);

					// textarea 자동 높이
					if ($text.is('textarea')) {
						if (datas._isResize == true) {
							var _padding = parseFloat($text.css('padding-top')) + parseFloat($text.css('padding-bottom'));
							var _lineHeight = parseFloat($text.css('line-height'));

							$text.css({ 'height': _lineHeight + _padding + 2 });// 초기화
							if (!datas._resizeMin) datas._resizeMin = 2;// 초기 값
							if (!datas._resizeMax) datas._resizeMax = 99999;// 초기 값

							var _lineTotal = ($text[0].scrollHeight == $text[0].offsetHeight) ? datas._resizeMin : Math.ceil(($text[0].scrollHeight - _padding) / _lineHeight);// 1줄일 때 min을 1로 적용 (scrollHeight == offsetHeight 같음)
							var _lineNum = (_lineTotal < datas._resizeMin) ? datas._resizeMin : (_lineTotal > datas._resizeMax) ? datas._resizeMax : _lineTotal;

							$text.css({ 'height': _lineNum * _lineHeight + _padding });
						}
					}

					// 날짜확인 (모바일)
					if ($text.is('[type=date]') || $text.is('[type=month]')) {
						if (!datas._format) datas._format = 'YYYY-MM-DD';

						var _txt = (_value.length > 0) ? moment(_value).format(datas._format) : '\u00a0';
						$text.siblings('.text_date').text(_txt);
					}

					// 시간확인 (모바일)
					if ($text.is('[type=time]')) {
						if (!datas._format) datas._format = 'HH:mm';// a hh:mm, A h:mm

						var _txt = (_value.length > 0) ? moment('2000-01-01 ' + _value).format(datas._format) : '\u00a0';
						_txt = _txt.replace(/am/gi, '오전').replace(/pm/gi, '오후');// 한글
						$text.siblings('.text_date').text(_txt);
					}

					// 수량변경
					if ($text.closest('.mm_stepper')[0]) mm.stepper.update($text, __e);
				break;
			}

		});

		/// 텍스트 입력 - 내용 지우기
		$document.on('click', '.btn_text-clear', function(__e) {

			__e.preventDefault();

			var $text = $(this).closest('.mm_form-text, .mm_form-textarea').find('input.textfield, textarea.textfield');
			if ($text.is(':disabled')) return;

			mm.form.update($text.val(''));// $text.val('').trigger('update');

			// datepicker 지우기
			if (Pikaday && $text.hasClass('mm_datepicker')) mm.datepicker.clear($text);

		});

		/// 비밀번호 토글
		$document.on('click', '.btn_text-pw', function(__e) {

			__e.preventDefault();

			var $text = $(this).closest('.mm_form-text').find('input.textfield');
			if ($text.attr('type') == 'password') $text.attr({ 'type': 'text' });
			else $text.attr({ 'type': 'password' });

			$(this).find('.mco_show, .mco_hide').toggleClass(['mco_show', 'mco_hide'])
			.next().text(function(__index, __value) {

				return (__value == '비밀번호 보기') ? '비밀번호 숨기기' : '비밀번호 보기';

			});

		});

		/// 입력, 셀렉트 포커싱
		$document.on('focusin focusout', 'input, textarea, select', function(__e) {

			var $this = $(this);
			var _exp = /text|password|email|number|search|tel|url|date|month|time|week/i;

			if ($this.is('input') && !_exp.test($this.attr('type'))) return;
			if (mm.is.mobile('ios')) {
				if ($this.is('[readonly]') || $this.is('[disabled]')) mm.focus.out($this);// ios에서 date 타입일 때 선택되는 이슈가 있어 포커스아웃 적용(접근성 탭이동 문제가 있을 경우 변경 필요)
			}

			switch(__e.type) {
				case 'focusin':
					if ($this.is('input, textarea')) $html.addClass('__focus');
					if (!$this.attr('autocomplete')) $this.attr({ 'autocomplete': 'off' });

					if (mm.is.mobile('android')) mm.anchor(mm.element.position($this).top, { scroller: $this.closest('.mm_scroller'), _margin: -($('.mm_header').outerHeight() + 50) });// 안드로이드 포커싱 위치 스크롤
					if (mm.is.mobile()) {// 모바일 화면 스크롤 시 포커스 해제
						$this.closest('.mm_scroller').one('scroll', function(__e) {

							var $focus = $(':focus');
							if ($focus[0] && mm._isTouch) mm.focus.out($focus);

						});
					}
				break;
				case 'focusout':
					$html.removeClass('__focus');
				break;
			}

		});

		/// 체크박스 checked 속성
		$document.on('change update', '[type=checkbox]', function(__e) {

			var $check = $(this);
			var datas = $check.data('mm.check') || mm.element.datas($check, _dataNameCheck, defaults.check, true);
			var _isChecked = $check.is(':checked');
			var $syncer = $(datas.syncer);
			var $desyncer = $(datas.desyncer);

			// 연결된 싱커
			if ($syncer[0]) {
				if (_isChecked && $check.is(':visible')) {
					$syncer.addClass(datas._classOn);
					if (datas._isSyncerUpdate) mm.component.update($syncer);
				}
				else {
					$syncer.removeClass(datas._classOn);
					if (datas._isSyncerUpdate) mm.form.update($syncer);
				}
			}

			// 연결된 디싱커
			if ($desyncer[0]) {
				if (_isChecked && $check.is(':visible')) {
					$desyncer.addClass(datas._classOn);
					if (datas._isDesyncerUpdate) mm.form.update($desyncer);
				}
				else {
					$desyncer.removeClass(datas._classOn);
					if (datas._isDesyncerUpdate) mm.component.update($desyncer);
				}
			}

			var $group;
			var $all;
			var allDatas;
			var _name;

			if (datas._group) {
				$group = $('[type=checkbox][' + _dataNameCheck + '*="\'' + datas._group + '\'"]');
			}
			else {
				_name = String($check.attr('name'));
				var _isNameArray = /\[/.test(_name);
				if (_isNameArray) _name = _name.slice(0, _name.indexOf('[') + 1).replace(/\[/g, '\\[');
				if (!_name) return;

				$group = (_isNameArray) ? $('[type=checkbox][name^=' + _name + ']') : $('[type=checkbox][name=' + _name + ']');
			}

			$all = $group.filter('[' + _dataNameCheck + '*="\'check_all\'"]');
			$group = $group.not('[' + _dataNameCheck + '*="\'check_all\'"], [' + _dataNameCheck + '*="\'check_count\'"]');
			if ($group[0]) {
				switch (datas._type) {
					case 'check_all':
						// 전체선택 연결
						allDatas = datas;
						allDatas.onAllChange = function() {

							if ($all.is(':checked')) $group.prop({ 'checked': true });
							else $group.prop({ 'checked': false });

						}

						if ($all.is(':checked')) allDatas.onAllChange();
						else TweenMax.delayedCall(0.001, allDatas.onAllChange);//mm.instant(allDatas.onAllChange);// form update 할 때 전체선택 그룹의 체크 유지를 위해 delay 적용
					break;
					case 'check_box':
						// 체크그룹 연결
						if (!$all[0]) return;

						allDatas = $all.data('mm.check') || mm.element.datas($all, _dataNameCheck, defaults.check, true);
						if (!allDatas._min) allDatas._min = $group.length;
						TweenMax.killDelayedCallsTo(allDatas.onAllChange);

						if ($group.filter(':checked').length < allDatas._min) $all.prop({ 'checked': false });
						else $all.prop({ 'checked': true });
					break;
				}
			}

			TweenMax.delayedCall(0.001, function() {

				mm.apply(datas.onChange, $check, datas.onChangeArgs);

				// 체크된 개수 표시
				var _group = (datas._group) ? datas._group : _name;
				var $counter = $('[' + _dataNameCheck + '*="\'check_count\'"][' + _dataNameCheck + '*="\'' + _group.replace(/\[/i, '') + '\'"]');
				if (!$counter[0]) return;

				var _count = $group.filter(':checked').length;
				if ($counter.is('input, textarea')) mm.form.update($counter.val(_count));
				else $counter.text(_count);

			});

		});

		/// 라디오 checked 속성
		$document.on('change update', '[type=radio]', function(__e) {

			var $radio = $(this);
			var datas = $radio.data('mm.radio') || mm.element.datas($radio, _dataNameRadio, defaults.radio, true);
			var _isChecked = $radio.is(':checked');
			var _isThis = (datas.syncer && (datas.syncer == 'this' || datas.syncer == $radio[0])) ? true : false;// __radio-on + selector 조합으로 css를 적용할 때 사용
			var $syncer = (_isThis) ? $radio.closest('.mm_form-radio') : $(datas.syncer).not('[type=radio]');
			var $desyncer = $(datas.desyncer).not('[type=radio]');

			var _name = String($radio.attr('name'));
			var _isNameArray = /\[/.test(_name);
			if (_isNameArray) _name = _name.slice(0, _name.indexOf('[') + 1).replace(/\[/g, '\\[');
			var $group = (mm.is.empty(_name)) ? $radio : (_isNameArray) ? $('[type=radio][name^=' + _name + ']') : $('[type=radio][name=' + _name + ']');

			// 노출되는 라디오 중 선택된 라디오가 숨겨있으면 첫번째 라디오 선택
			var $checked = $group.filter(':checked');
			if ($group.length > 1 && $checked[0] && !$checked.is(':visible')) {
				$group.filter(':visible').first().prop({ 'checked': true });
				_isChecked = $radio.is(':checked');
			}

			if (__e.type == 'update' && !_isChecked) return;

			// 중복방지
			if (_isChecked) {
				// checked 요소에서만 선택안된 라디오 업데이트 실행
				datas.__.$syncer = $syncer;
				datas.__.$desyncer = $desyncer;
				$group.not(':checked').trigger('change');
			}
			else {
				// checked 요소에 연결된 싱커 제거
				var checkedDatas = $group.filter(':checked').data('mm.radio');
				$syncer = $syncer.not(checkedDatas.__.$syncer);
				$desyncer = $desyncer.not(checkedDatas.__.$desyncer);
			}

			// 연결된 싱커
			if ($syncer[0]) {
				if (_isChecked && $radio.is(':visible')) {
					$syncer.addClass(datas._classOn);
					if (!_isThis && datas._isSyncerUpdate) mm.component.update($syncer);
				}
				else {
					$syncer.removeClass(datas._classOn);
					if (!_isThis && datas._isSyncerUpdate) mm.form.update($syncer);
				}
			}

			// 연결된 디싱커
			if ($desyncer[0]) {
				if (_isChecked && $radio.is(':visible')) {
					$desyncer.addClass(datas._classOn);
					if (datas._isDesyncerUpdate) mm.form.update($desyncer);
				}
				else {
					$desyncer.removeClass(datas._classOn);
					if (datas._isDesyncerUpdate) mm.component.update($desyncer);
				}
			}

		});

		/// 셀렉트 selected 속성
		$document.on('change update click', 'select', function(__e) {

			switch(__e.type) {
				case 'change':
				case 'update':
					var select = this;

					function optionCheck(__element, __isSelected) {

						var $option = $(__element);
						if (!$option[0]) return;

						var datas = $option.data('mm.select') || mm.element.datas($option, _dataNameSelect, defaults.select, true);
						var $syncer = $(datas.syncer);

						if ($syncer[0]) {
							if (__isSelected && $(select).is(':visible')) {
								$syncer.addClass(datas._classOn);
								if (datas._isSyncerUpdate) mm.component.update($syncer);
							}
							else {
								$syncer.removeClass(datas._classOn);
								if (datas._isSyncerUpdate) mm.form.update($syncer);
							}
						}

					}

					// 선택안됨
					var options = _.values(select.options);
					options.splice(select.selectedIndex, 1);

					$.each(options, function(__index, __value) {

						optionCheck(__value, false);

					});

					// 선택됨
					optionCheck(select.options[select.selectedIndex], true);

					// __e.offsetY로 확인은 크롬을 제외한 ie, ff에서 안되어 update, change 이벤트일 때만 적용
					// mm.focus.in($(this).closest('.mm_form-select'));// update 이벤트 발생으로 초기 스크롤이 이동하여 주석
				break;
				case 'click':
					// 선택 시 내용이 많을 경우 화살표를 덮는 이슈로 포커스 상위로 이동 (익스 제외)
					// if (!mm.is.ie() && __e.offsetY < 0) mm.focus.in($(this).closest('.mm_form-select'));
				break;
			}

		});

	})();

	// public
	return {
		/// 폼요소 업데이트
		update: function(__element) {

			// __element가 없으면 페이지 전체 적용
			// __element가 폼요소가 아니면 child에 적용
			// __element가 폼요소면 선택한 요소에 적용

			getFormElement(__element).trigger('update');

		},
		/// 폼요소 오류알림
		alert: function(__element, __message) {

			// 텍스트, 셀렉트, 파일
			// mm.form.alert(폼요소, '오류 메시지');
			// ckeditor 적용? (적용 시 위치 .cke_contents)

			var $el = $(__element);
			if (!$el[0] || !_.isString(__message)) return;

			mm.form.lift($el);

			var $label = $el.closest('label');
			var $alert = $('<span class="text_alert"><i class="mco_form-alert"></i>' + __message.replace(/\n/ig, '<br>') + '</span>')
			.insertBefore($label)
			.on('click', function(__e) {

				$alert.hide().closest('[class*=mm_form-]').css({ 'z-index': '' });
				$el.focus();

			});

			$label.on('focusin focusout', function(__e) {

				switch(__e.type) {
					case 'focusin':
						$alert.hide();
					break;
					case 'focusout':
						// $alert.show();
					break;
				}

			})
			.closest('[class*=mm_form-]').css({ 'z-index': 2 });

			mm.anchor($alert);

		},
		/// 텍스트 폼요소 유효
		valid: function(__element, __message) {

			//

		},
		/// 오류/유효 해제
		lift: function(__element) {

			// mm.form.lift(폼요소);
			// __element을 설정하지 않으면 페이지 내 전체 .text_alert를 해제합니다.

			var $el = $(__element);
			var $label = ($el[0]) ? ($el.hasClass('text_alert')) ? $el.siblings('label') : $el.closest('label') : $('label');

			$label.off('focusin focusout')
			.siblings('.text_alert').off('click').remove();

			$el.closest('[class*=mm_form-]').css({ 'z-index': '' });

		},
		/// 일반파일
		file: {},
		/// 이미지파일
		image: {},
	};

})();
///-- 폼요소

/// 폼요소(일반 파일)
mm.form.file = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		file: {
			_fileName: null,// :string
			_fileSize: null,// :number - 단위 kb
			_item: null,// :string
			_classOn: '__file-on',// :string
			files: {},// :Object - 선택된 파일 객체
			onChange: null,// :function/string
			onChangeArgs: [],// :array
			// 내부사용
			__: {
				_isRemove: false,// :boolean
				clone: null,// :file $clone - 취소로 인한 복구용
			}
		},
		// fileList: {
		// 	_isAdd: true,// :boolean - 빈 파일 자동 추가
		// 	_isRemove: true,// :boolean - 빈 파일 자동 삭제
		// 	_max: 999999,// :number - 최대 노출 개수
		// 	items: [],// :array
		// 	// 내부사용
		// 	__: {
		// 		_isReady: false,// :boolean - 중복방지
		// 		_itemHtml: null,// :string - 내부 복제/생성 소스
		// 	}
		// },
	};
	var _dataNameFile = 'data-file';
	// var _dataNameFileList = 'data-filelist';

	// private
	(function() {

		var $document = $(document);

		/// 파일찾기 (미리보기)
		$document.on('click change update', '.mm_form-file [type=file]', function(__e) {

			var $file = $(this);
			var $ui = $file.closest('.mm_form-file');

			mm.form.lift($file);// 오류 알림이 있을 때 해제

			var datas = $file.data('mm.file') || mm.element.datas($file, _dataNameFile, defaults.file, true);

			switch(__e.type) {
				// 클론
				case 'click':
					datas.__.clone = $file.clone(true);
				break;
				// 초기화
				case 'update':
					datas.files = {};
					datas.__.clone = null;

					// 파일 초기값(url, string)
					if (datas._item) {
						datas.files.name = datas._item;
						datas.files.result = datas._item;
						mm.form.file.set($file);// 파일 값 적용
					}
				break;
				// 파일 선택/변경
				case 'change':
					if ($file[0].files.length > 0) {
						datas.__.clone = null;
						datas.files = $file[0].files[0];
						mm.form.file.update($file);
					}
					// 파일 선택을 취소했을 때
					else {
						$file.replaceWith(datas.__.clone);
						$file = datas.__.clone;
						datas.__.clone = null;
					}
				break;
			}

		});

		/// 파일찾기 - 미리보기 이미지 삭제
		$document.on('click', '.mm_form-file .btn_remove', function(__e) {

			__e.preventDefault();

			var $file = $(this).closest('.mm_form-file').find('[type=file]');
			var datas = $file.data('mm.file') || mm.element.datas($file, _dataNameFile, defaults.file, true);

			datas.__.isRemove = true;// 삭제버튼 클릭 확인
			datas.files = {};
			if (mm.is.ie('ie9over')) $file.attr({ 'type': 'text' }).attr({ 'type': 'file' });// ie9 이상에서 파일 초기화
			else $file.val('');
			mm.form.file.set($file);

		});

	})();

	// public
	return {
		// 확인
		update: function(__$file) {

			var datas = $(__$file).data('mm.file') || mm.element.datas(__$file, _dataNameFile, defaults.file, true);
			datas.__.isRemove = false;// 삭제버튼 클릭 해제

			if (datas._fileName && datas._fileName != datas.files.name) {
				mm.bom.alert(datas._fileName + ' 이름의 파일만<br>등록할 수 있습니다.');
				return;
			}

			if (window.FileReader) {// IE9 이상
				if (datas._fileSize && datas.files.size > datas._fileSize * 1024) {
					var _size = datas._fileSize / 1000;
					_size = (_size < 1) ? datas._fileSize + 'kb' : _size + 'mb';
					mm.bom.alert(_size + '까지 등록할 수 있습니다.');
					return;
				}

				var reader = new FileReader();
				reader.onload = function(__e) {

					datas.files.result = reader.result;

					// 파일 등록
					mm.form.file.set(__$file);

				}
				reader.readAsDataURL(datas.files);
			}

		},
		// 파일 등록 (저장)
		set: function(__$file) {

			var $ui = __$file.closest('.mm_form-file');
			var datas = $(__$file).data('mm.file') || mm.element.datas(__$file, _dataNameFile, defaults.file, true);

			if (mm.is.empty(datas.files)) $ui.removeClass(datas._classOn);// 파일 데이터 없음
			else $ui.addClass(datas._classOn);// 파일 데이터 있음

			mm.apply(datas.onChange, __$file, datas.onChangeArgs);
			__$file.trigger('set', __$file);

			mm.form.file.preview(__$file);

		},
		// 미리보기
		preview: function(__$file) {

			var $ui = __$file.closest('.mm_form-file');
			var $preview = $ui.find(".text_path");
			var datas = $(__$file).data('mm.file') || mm.element.datas(__$file, _dataNameFile, defaults.file, true);

			$preview.empty();
			if (mm.is.empty(datas.files)) return;

			$preview.text(datas.files.name);

		},
	};

})();
///-- 폼요소(일반 파일)

/// 폼요소(이미지 파일, 이미지 파일리스트)
mm.form.image = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		file: {
			_width: null,// :number
			_height: null,// :number
			_fileName: null,// :string
			_fileSize: null,// :number - 단위 kb
			_orientation: null,// :string
			_isBg: false,// :boolean
			_bgSize: 'cover',// :string - contain, cover
			_item: null,// :string
			_classOn: '__image-on',// :string
			files: {},// :Object - 선택된 파일 객체
			onChange: null,// :function/string
			onChangeArgs: [],// :array
			// 내부사용
			__: {
				_ratioHeight: null,// :number
				_isRemove: false,// :boolean
				clone: null,// :file $clone - 취소로 인한 복구용
			}
		},
		fileList: {
			Sortable: null,// :Sortable
			_isAdd: true,// :boolean - 빈 파일 자동 추가
			_isRemove: true,// :boolean - 빈 파일 자동 삭제
			_max: 999999,// :number - 최대 노출 개수
			items: [],// :array
			// 내부사용
			__: {
				_isReady: false,// :boolean - 중복방지
				_itemHtml: null,// :string - 내부 복제/생성 소스
				changes: null,// :object - 바뀌는 요소 카운트
				clone: null,// :file list $clone - 순서변경 취소 복구용
			}
		},
	};
	var _dataNameFile = 'data-file';
	var _dataNameFileList = 'data-filelist';

	// private
	(function() {

		var $document = $(document);

		/// 파일찾기 (미리보기)
		$document.on('click change update', '.mm_form-image [type=file]', function(__e) {

			var $file = $(this);
			var $ui = $file.closest('.mm_form-image');
			var $preview = $ui.find('.mm_form-image-preview');

			mm.form.lift($file);// 오류 알림이 있을 때 해제

			if (!$preview[0]) return;

			var datas = $file.data('mm.file') || mm.element.datas($file, _dataNameFile, defaults.file, true);

			switch(__e.type) {
				// 클론
				case 'click':
					datas.__.clone = $file.clone(true);
				break;
				// 초기화
				case 'update':
					datas.files = {};
					datas.__.clone = null;

					// 파일 사이즈
					var _ratioHeight = datas._height / datas._width * 100;
					if (_ratioHeight > 0) {
						$ui.find('.mm_form-image-box').css({ 'padding-top': _ratioHeight + '%' });
						datas.__._ratioHeight = _ratioHeight;
						datas._orientation = (function() {

							if (_ratioHeight > 100) return 'portrait';
							else if (_ratioHeight < 100) return 'landscape';
							else if (_ratio.Height == 100) return 'square';
							else null;

						})();

					}

					// 파일 초기값(url, string)
					if (datas._item) {
						datas.files.name = datas._item;
						datas.files.result = datas._item;
						mm.form.image.set($file);// 파일 값 적용
					}
				break;
				// 파일 선택/변경
				case 'change':
					if ($file[0].files.length > 0) {
						datas.__.clone = null;
						datas.files = $file[0].files[0];
						mm.form.image.update($file);
					}
					// 파일 선택을 취소했을 때
					else {
						$file.replaceWith(datas.__.clone);
						$file = datas.__.clone;
						datas.__.clone = null;
					}
				break;
			}

		});

		/// 파일찾기 - 미리보기 이미지 삭제
		$document.on('click', '.mm_form-image .btn_remove', function(__e) {

			__e.preventDefault();

			var $file = $(this).closest('.mm_form-image').find('[type=file]');
			var datas = $file.data('mm.file') || mm.element.datas($file, _dataNameFile, defaults.file, true);

			datas.__.isRemove = true;// 삭제버튼 클릭 확인
			datas.files = {};
			if (mm.is.ie('ie9over')) $file.attr({ 'type': 'text' }).attr({ 'type': 'file' });// ie9 이상에서 파일 초기화
			else $file.val('');
			mm.form.image.set($file);

		});

		/// 파일리스트 (추가/삭제)
		$document.on('multiple update', '.mm_image-list', function(__e) {

			// _isAdd + _isRemove true = 추가/삭제 시 빈 파일 1개 자동생성
			// _isAdd false + _isRemove true = 버튼으로 파일추가(수동형)
			// _isAdd true/false + _isRemove false = 최대 노출 개수 생성(고정형)

			var $ui = $(this);
			var $list = $ui.children('ul');
			var $btnAdd = $ui.find('.btn_add');
			var $btnSort = $ui.find('.btn_sort');
			var datas = $ui.data('mm.filelist') || mm.element.datas($ui, _dataNameFileList, defaults.fileList, true);

			if ($list.is(__e.target)) return;// 버블링 타겟이 ul일 경우 리턴(Sortable 순서 변경 시 빈 영역 생성 방지)

			if (!datas._isRemove && datas._max > 10) datas._max = 10;// 고정 개수

			switch (__e.type) {
				case 'update':
					if (!datas.__._itemHtml) datas.__._itemHtml = $list.children('li')[0].outerHTML;// 복제용 html 저장

					// 초기세팅
					if (!datas.__.isReady) {
						datas.__.isReady = true;// 중복방지
						datas.__.changes = { _total: 1, _count: 0 };// 바뀌는 파일 개수

						// 초기이미지
						if (!mm.is.empty(datas.items)) {
							$list.empty();

							datas.__.changes._total = datas.items.length;
							fileListAppend(datas.items);
						}
					}
					fileListCheck();

					$list.off('set').on('set', '[type=file]', function(__e) {

						var fileDatas = $(this).data('mm.file') || mm.element.datas(this, _dataNameFile, defaults.file, true);

						if (fileDatas.__.isRemove) fileListCheck();
						else {
							datas.__.changes._count++;

							if (datas.__.changes._count == datas.__.changes._total) {
								datas.__.changes = { _total: 1, _count: 0 };// 초기화
								fileListCheck();
							}
						}

					});

					$btnAdd.off('click').on('click', function(__e) {

						__e.preventDefault();

						fileListAppend();

					});
				break;
				case 'multiple':
					var $empties = $list.find('[type=file]').filter(function() {

						var fileDatas = $(this).data('mm.file') || mm.element.datas(this, _dataNameFile, defaults.file, true);
						return mm.is.empty(fileDatas.files);

					});

					var files = _.values($ui.find('.mm_image-multiple [type=file]').data('mm.file').files);
					var parts = _.partition(files, function(__value, __index) {

						return __index < $empties.length;// 빈 file과 생성할 항목을 나눔

					});

					datas.__.changes._total = files.length;

					// 현재 빈 영역에 노출
					$.each(parts[0], function(__i, _file) {

						var $empty = $empties.eq(__i);
						$empty.data('mm.file').files = _file;
						mm.form.image.update($empty);

					});

					// 빈 영역 추가
					fileListAppend(parts[1]);
				break;
			}

			function fileListCheck() {

				var $files = $list.find('[type=file]');
				var _count = 0;

				// 빈 영역 삭제
				$files.each(function(__i) {

					var $this = $(this);
					var fileDatas = $this.data('mm.file') || mm.element.datas($this, _dataNameFile, defaults.file, true);
					if (mm.is.empty(fileDatas.files)) $this.closest('li').remove();
					else _count++;

				});

				// 빈 영역 추가
				var _fileTotal = $list.children('li').length;

				if (_count == _fileTotal && _fileTotal < datas._max) {
					// 최대 파일 리스트 개수 생성
					if (!datas._isRemove) {
						var empties = [];
						for (var i = 0; i < datas._max - _fileTotal; i++) empties[i] = null;
						fileListAppend(empties);
					}
					else {
						// 단일 생성
						if (datas._isAdd) fileListAppend();
					}
				}

				fileButtonCheck();

			}

			function fileListAppend(__files) {

				var files = (mm.is.empty(__files)) ? [null] : __files;
				var _appendTotal = datas._max - $list.children('li').length;

				$.each(files, function(__index, __file) {

					if (__index < _appendTotal) {
						var $item = $(datas.__._itemHtml).appendTo($list);

						if (__file) {
							var $file = $item.find('[type=file]');
							var fileDatas = $file.data('mm.file') || mm.element.datas($file, _dataNameFile, defaults.file, true);

							// 초기 경로 세팅
							if (_.isString(__file)) {
								fileDatas._item = __file;
								mm.form.update($file);
							}
							// 파일 변경
							else {
								fileDatas.files = __file;
								mm.form.image.update($file);
							}
						}
					}

				});

				if (files.length > _appendTotal) mm.bom.alert('파일은 최대 ' + datas._max + '개까지 추가할 수 있습니다.');

				fileButtonCheck();

			}

			function fileButtonCheck() {

				if ($list.children('li').length < datas._max) $btnAdd.show();
				else $btnAdd.hide();

				if ($list.find('.' + defaults.file._classOn).length > 1) $btnSort.show();
				else $btnSort.hide();

			}

		});

		/// 파일리스트 - 다중선택
		$document.on('click change', '.mm_image-list .mm_image-multiple [type=file]', function(__e) {

			var $file = $(this);
			var $ui = $file.closest('.mm_image-list');
			var datas = $file.data('mm.file') || mm.element.datas($file, _dataNameFile, defaults.file, true);

			switch (__e.type) {
				case 'click':
					// 같은 파일을 선택할 수 있도록 클릭 시 value 비움
					datas.files = {};
					if (mm.is.ie('ie9over')) $file.attr({ 'type': 'text' }).attr({ 'type': 'file' });// ie9 이상에서 파일 초기화
					else $file.val('');
				break;
				case 'change':
					if ($file[0].files.length == 0) return;// 파일 선택을 취소했을 때

					datas.files = $file[0].files;
					$ui.trigger('multiple');
				break;
			}

		});

		/// 파일리스트 - 드래그앤드롭
		$document.on('dragover dragenter dragleave dregend drop', '.mm_image-list .mm_image-dropzone', function(__e) {

			__e.preventDefault();
			__e.stopPropagation();

			switch (__e.type) {
				case 'dragover':
				case 'dragenter':
					//
				break;
				case 'dragleave':
				case 'dragend':
					//
				break;
				case 'drop':
					var $ui = $(this).closest('.mm_image-list');
					var $file = $ui.find('.mm_image-multiple [type=file]');

					$file.data('mm.file').files = __e.originalEvent.dataTransfer.files;
					$ui.trigger('multiple');
				break;
			}

		});

		/// 파일리스트 - 순서편집
		$document.on('click', '.mm_image-list-sortable [class*=btn_sort]', function(__e) {

			var $this = $(this);
			var $fileList = $this.closest('.mm_image-list');
			var $fileUl = $fileList.children('ul');
			var datas = $fileList.data('mm.filelist') || mm.element.datas($fileList, _dataNameFileList, defaults.fileList, true);

			// 순서편집
			if ($this.hasClass('btn_sort')) {
				$fileList.addClass('__image-list-sortable')
				.find('.mm_form-image').append('<i class="mco_form-image-sortable" />')
				.not('.' + defaults.file._classOn).closest('li').remove();

				datas.Sortable = Sortable.create($fileUl[0], { forceFallback: true });
				datas.__.clone = $fileUl.clone(true);// 취소용 복제
			}
			else {
				// 편집취소
				if ($this.hasClass('btn_sort-cancel')) {
					$fileUl.replaceWith(datas.__.clone);
				}
				// 편집적용
				else if ($this.hasClass('btn_sort-apply')) {
					//
				}

				$fileList.removeClass('__image-list-sortable')
				.find('.mm_form-image .mco_form-image-sortable').remove();

				datas.Sortable.destroy();
				datas.Sortable = {};

				mm.form.update($fileList);
			}

			mm.scroll.touchReset();// -webkit-overflow-scrolling 리셋

		});

	})();

	// public
	return {
		// 확인
		update: function(__$file) {

			var datas = $(__$file).data('mm.file') || mm.element.datas(__$file, _dataNameFile, defaults.file, true);
			datas.__.isRemove = false;// 삭제버튼 클릭 해제

			if (datas._fileName && datas._fileName != datas.files.name) {
				mm.bom.alert(datas._fileName + ' 이름의 파일만<br>등록할 수 있습니다.');
				return;
			}

			if (window.FileReader) {// IE9 이상
				if (datas._fileSize && datas.files.size > datas._fileSize * 1024) {
					mm.bom.alert(datas._fileSize + 'kb까지 등록할 수 있습니다.');
					return;
				}

				var reader = new FileReader();
				reader.onload = function(__e) {

					datas.files.result = reader.result;

					// metadata 정보
					var loadImageConfigs = { canvas: true, orientation: true };
					loadImage(datas.files, function(__element, __meta) {

						// image = <img>, __element = <canvas>
						// __element.toDataURL() base64 원본 데이터
						// __element.toDataURL('image/jpeg', 0.5)) 이미지 타입('image/png', 'image/jpeg'), 퀄리티 변경 가능
						// image.width/height = 원본 사이즈, __element.width/height = oriantation 적용된 사이즈
						// __meta.exif.getAll() = exif 전체 불러오기
						// __element.getContext('2d').getImageData(0, 0, __element.width, __element.height)

						// datas.files.result = __element.toDataURL();// FileReader의 reader.result가 빠름
						// datas.files.image = image;
						datas.files.width = __element.width;
						datas.files.height = __element.height;
						datas.files.orientation = (!__meta.exif) ? 1 : __meta.exif.get('Orientation');

						switch(datas._orientation) {
							case 'landscape':
								if (datas.files.width <= datas.files.height) {
									mm.bom.alert('가로형 이미지만 등록할 수 있습니다.');
									return;
								}
							break;
							case 'portrait':
								if (datas.files.width >= datas.files.height) {
									mm.bom.alert('세로형 이미지만 등록할 수 있습니다.');
									return;
								}
							break;
							case 'square':
								if (file.width != file.height) {
									mm.bom.alert('정방형 이미지만 등록할 수 있습니다.');
									return;
								}
							break;
						}

						// 파일 등록
						mm.form.image.set(__$file);

					}, loadImageConfigs);

				}
				reader.readAsDataURL(datas.files);
			}

		},
		// 파일 등록 (저장)
		set: function(__$file) {

			var $ui = __$file.closest('.mm_form-image');
			var datas = $(__$file).data('mm.file') || mm.element.datas(__$file, _dataNameFile, defaults.file, true);

			if (mm.is.empty(datas.files)) $ui.removeClass(datas._classOn);// 파일 데이터 없음
			else $ui.addClass(datas._classOn);// 파일 데이터 있음

			// android 플러그인에서 data.files 값이 비어있을 경우가 있어 이중 저장
			// if (mm.is.mobile('android')) {
			// 	var $fileList = $ui.closest('.mm_image-list ul');
			// 	var $file = $fileList.find('[type=file]');
			//
			// 	console.log(__$file.data('mm.file').files, datas.files);
			// 	$file.eq($file.index(__$file)).data('mm.file').files = datas.files;
			// }

			mm.apply(datas.onChange, __$file, datas.onChangeArgs);
			__$file.trigger('set', __$file);

			mm.form.image.preview(__$file);

		},
		// 미리보기
		preview: function(__$file) {

			var $ui = __$file.closest('.mm_form-image');
			var $preview = $ui.find(".mm_form-image-preview");
			var datas = $(__$file).data('mm.file') || mm.element.datas(__$file, _dataNameFile, defaults.file, true);

			$preview.empty().removeClass('mm_image-none');
			if (mm.is.empty(datas.files)) return;

			var _preloadAttr = JSON.stringify({ _src: datas.files.result }).replace(/"/g, '\'');
			var _imgHtml = (datas._isBg == true) ? '<i class="mm_preload mm_bg-' + datas._bgSize + ' image_file" data-preload="' + _preloadAttr + '"></i>' : '<img class="mm_preload image_file" src="' + mm.image._empty + '" data-preload="' + _preloadAttr + '" alt="">';
			var $pic = $(_imgHtml).appendTo($preview);
			mm.preload.update($pic);

			if (datas._isBg == true) {
				$preview.addClass('mm_box-fluid');

				if ($pic.outerWidth() == $pic.outerHeight()) {
					$pic.addClass('mm_orientation-' + datas.files.orientation);
					if (datas.__._ratioHeight) $pic.css({ 'padding-top': datas.__._ratioHeight + '%' });
				}
			}

		},
	};

})();
///-- 폼요소(이미지 파일, 이미지 파일리스트)

/// 컴포넌트
mm.component = (function() {

	// public
	return {
		/// 컴포넌트 업데이트
		update: function(__element) {

			mm.scrollbar.update(__element);// 스크롤바
			mm.dropdown.update(__element);// 드롭다운
			mm.tab.update(__element);// 탭
			mm.swiper.update(__element);// 스와이퍼
			mm.preload.update(__element);// 프리로드
			mm.form.update(__element);// 폼요소
			mm.datepicker.update(__element);// 데이트픽커

		},
	};

})();
///-- 컴포넌트

/// 페이지 팝업
mm.popup = (function() {

	var $popup;
	var _classOn = '__popup-on';

	// 팝업영역 생성
	function popupCreate() {

		$popup = $(''
		+ '<!-- 전면 팝업 -->'
		+ '<div class="mm_popup">'
			+ '<div class="mm_popup-dim"></div>'
			+ '<div class="mm_popup-items">'
			+ '</div>'
		+ '</div>'
		+ '<!--// 전면 팝업 -->'
		+ '').appendTo('.mm_app');

	}

	// 팝업영역 삭제
	function popupRemove() {

		if ($popup && $popup[0]) $popup.remove();
		$popup = null;

	}

	// private
	(function() {

		//

	})();

	// public
	return {
		/// 팝업열기
		open: function(__url, __options) {

			if (!__url) return;
			// if (mm._isPopup || mm._isModal) {
			if (mm._isIframe) {
				mm.root('mm.popup.open', arguments);// 최상위에서 실행
				return false;
			}
			// }

			if (!$popup || !$popup[0]) popupCreate();
			TweenMax.killDelayedCallsTo(popupRemove);

			$('html').addClass('__popup');
			mm.scroll.off();

			var options = $.extend(true, { _motion: 'up', openElement: null, focus: null, _frameId: null, _frameName: null, _frameTitle: null }, __options);
			var $item = $(''
			+ '<div class="mm_popup-item">'
				+ '<button type="button" class="btn_popup-close" onclick="mm.popup.close();return false;">'
					+ '<i class="mco_popup-close"></i>'
					+ '<span class="mm_ir-blind">팝업닫기</span>'
				+ '</button>'
				+ '<iframe class="mm_preload" data-preload="' + JSON.stringify({ _src: __url, onComplete: 'mm.popup.on', onError: 'mm.popup.close' }).replace(/"/g, '\'') + '" scrolling="no"></iframe>'
			+ '</div>'
			+ '').css({ 'left': parseFloat($('.mm_view').css('margin-left')) })
			.addClass('__popup-motion-' + options._motion).data('mm.popup', { openElement: options.openElement, focus: options.focus }).appendTo('.mm_popup-items');

			$item.find('iframe').attr({ 'id': options._frameId, 'name': options._frameName, 'title': options._frameTitle });

			mm.component.update($item);// 컴포넌트 연결
			mm.loading.show($item);

		},
		/// 팝업노출(iframe onComplete 적용을 위해 추가)
		on: function() {

			var $item = $popup.find('.mm_popup-item').removeClass(_classOn)
			.last().addClass(_classOn);

			$item.find('.btn_popup-close').remove();// iframe 내부에도 같은 위치에 버튼이 있을 경우 삭제
			mm.loading.hide($item, mm.times._base);

			var $focus = $(this).contents().find($item.data('mm.popup').focus);
			if (!$focus[0]) $focus = $item;
			TweenMax.killDelayedCallsTo(mm.focus.in);
			TweenMax.delayedCall(mm.times._base, mm.focus.in, [$focus]);

		},
		/// 팝업닫기
		close: function(__callback, __args) {

			// if (mm._isPopup || mm._isModal) {
			if (mm._isIframe) {
				mm.root('mm.popup.close', arguments);// 최상위에서 실행
				return false;
			}
			else if (mm._isPopup) {
				window.close();
				return false;
			}
			// }

			if (!$popup || !$popup[0]) return false;

			var $popupItem = $popup.find('.mm_popup-item');
			var $popupLast = $popupItem.last();

			if (!$popupLast[0]) return false;

			// 팝업 삭제
			$popupLast.removeClass(_classOn);
			TweenMax.delayedCall(mm.times._fast, function() {

				$popupLast.remove();

			});

			// 이전에 띄워놓은 팝업이 있을 때
			if ($popupItem.length > 1) {
				$popupLast.prev().addClass(_classOn);
			}
			// 팝업이 1개일 때
			else {
				$('html').removeClass('__popup');
				mm.scroll.on();

				// 팝업영역 삭제
				TweenMax.delayedCall(mm.times._fast, popupRemove);
			}

			// 닫기 콜백(우선순위 __callback)
			if (_.isFunction(__callback)) {
				mm.apply(__callback, null, __args);
			}
			else {
				var datas = $popupLast.data('mm.popup');
				if (datas) mm.apply(datas.onClose, null, datas.onCloseArgs);
			}

		},
		/// 팝업 사이즈 재조정(window 팝업만 적용)
		resize: function() {

			// if (mm._isPopup) {
			if (mm._isIframe) {
				//
			}
			// window 모달
			else if (mm._isPopup) {
				var $frameContent = $('.mm_page-content');
				var outerWidth = window.outerWidth - window.innerWidth;
				var outerHeight = window.outerHeight - window.innerHeight;
				window.resizeTo($frameContent.outerWidth() + outerWidth, $frameContent.outerHeight() + $('.mm_header').outerHeight() + outerHeight);
				return false;
			}
			// }

		},
		/// 오프너(window)
		getOpener: function() {

			// if (mm._isPopup) {
			if (mm._isIframe) return mm.root('mm.popup.getOpener', arguments);// 최상위에서 실행
			else if (mm._isPopup) return window.opener;
			// }

			var openElement = mm.popup.getOpenElement();
			var openDocument = (openElement) ? openElement.ownerDocument : document;
			return openDocument.defaultView || openDocument.parentWindonw;

		},
		/// 오픈엘리먼트(element, 팝업 열때 클릭한 요소)
		getOpenElement: function() {

			// if (mm._isPopup) {
			if (mm._isIframe) return mm.root('mm.popup.getOpenElement', arguments);// 최상위에서 실행
			else if (mm._isPopup) return window.opener;
			// }

			var $item = $popup.find('.mm_popup-item.__popup-on');
			return ($item[0]) ? $item.data('mm.popup').openElement : null;

		}
	};

})();
///-- 페이지 팝업

/// 모달 팝업
mm.modal = (function() {

	// __target: string, script id 또는 iframe url
	// __callback: 닫기 버튼 클릭 시 호출하는 함수 (Function: null)
	// __options: 추가 설정 (Object: null)
	// __options - args: 콜백 아규먼트 (Array: null)
	// 선택한 모달요소를 append하여 노출합니다.
	// 팝업을 닫으면 원래 위치로 이동합니다.

	var $modal;
	var _classOn = '__modal-on';

	// 모달영역 생성
	function modalCreate() {

		$modal = $(''
		+ '<!-- 모달 팝업 -->'
		+ '<div class="mm_modal">'
			+ '<div class="mm_modal-dim"></div>'
			+ '<div class="mm_modal-items">'
			+ '</div>'
		+ '</div>'
		+ '<!--// 모달 팝업 -->'
		+ '').appendTo('.mm_app');

	}

	// 모달영역 삭제
	function modalRemove() {

		if ($modal && $modal[0]) $modal.remove();
		$modal = null;

	}

	// private
	(function() {

		//

	})();

	// public
	return {
		/// 모달열기
		open: function(__target, __options) {

			if (!__target) return;

			// if (mm._isModal || mm._isPopup) {
			if (mm._isIframe) {
				mm.root('mm.modal.open', arguments);// 최상위에서 실행
				return false;
			}
			// }

			if (!$modal || !$modal[0]) modalCreate();
			TweenMax.killDelayedCallsTo(modalRemove);

			$('html').addClass('__modal');
			mm.scroll.off();

			var options = $.extend(true, { args: [], openElement: null, _frameId: null, _frameName: null, _frameTitle: null }, __options);
			var isId = (__target.indexOf('#') == 0) ? true : false;
			var _modalHtml = (isId) ? $(__target).text().replace(/\(\(script\)\)/gi, '<script>').replace(/\(\(\/script\)\)/gi, '</script>') : '<iframe class="mm_preload" data-preload="' + JSON.stringify({ _src: __target, onComplete: 'mm.modal.on', onError: 'mm.modal.close' }).replace(/"/g, '\'') + '" scrolling="no"></iframe>';

			var $item = $(''
				+ '<div class="mm_modal-item">'
					// + '<button type="button" class="btn_modal-area"><span class="mm_ir-blind">모달 닫기</span></button>'// 모달 밖을 클릭해도 닫힘
						+ '<div class="mm_modal-item-inner">'
							+ _modalHtml
							+ '<button type="button" class="btn_modal-close"><i class="mco_modal-close"></i><span class="mm_ir-blind">모달 닫기</span></button>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '').data('mm.modal', { openElement: options.openElement }).appendTo('.mm_modal-items');

			// script id modal
			if (isId) {
				$item.addClass(__target.replace('#', ''));
				setTimeout(mm.modal.on, 50);
			}
			// iframe modal
			else {
				$item.find('.mm_modal-item-inner').css({ 'padding-top': 0 });
				$item.find('iframe').attr({ 'id': options._frameId, 'name': options._frameName, 'title': options._frameTitle });
			}

			mm.component.update($item);// 컴포넌트 연결

		},
		/// 모달노출(iframe onComplete 적용을 위해 추가)
		on: function(__element) {

			var $item = $modal.find('.mm_modal-item').removeClass(_classOn)
			.last().addClass(_classOn).on('click', '.btn_modal-area, .btn_modal-close', function(__e) {

				__e.preventDefault();
				mm.modal.close();

			});

			if ($item.find('iframe').contents().find('.btn_modal-close')[0]) $item.find('.btn_modal-close').remove();// iframe 내부에도 같은 위치에 버튼이 있을 경우 삭제
			mm.modal.resize();

			TweenMax.killDelayedCallsTo(mm.focus.in);
			TweenMax.delayedCall(mm.times._base, mm.focus.in, [$item]);

		},
		/// 모달닫기
		close: function(__callback, __args) {

			// if (mm._isModal || mm._isPopup) {
			if (mm._isIframe) {
				mm.root('mm.modal.close', arguments);// 최상위에서 실행
				return false;
			}
			else if (mm._isModal) {
				window.close();
				return false;
			}
			// }

			if (!$modal || !$modal[0]) return false;

			var $modalItem = $modal.find('.mm_modal-item');
			var $modalLast = $modalItem.last();

			if (!$modalLast[0]) return false;

			// 모달 삭제
			$modalLast.removeClass(_classOn).off('click', '.btn_modal-area, .btn_modal-close');
			TweenMax.delayedCall(mm.times._fast, function() {

				$modalLast.remove();

			});

			// 이전에 띄워놓은 모달이 있을 때
			if ($modalItem.length > 1) {
				$modalLast.prev().addClass(_classOn);
			}
			// 모달이 1개일 때
			else {
				$('html').removeClass('__modal');
				mm.scroll.on();

				// 모달영역 삭제
				TweenMax.delayedCall(mm.times._fast, modalRemove);
			}

			// 닫기 콜백(우선순위 __callback)
			if (_.isFunction(__callback)) {
				mm.apply(__callback, null, __args);
			}
			else {
				var datas = $modalLast.data('mm.modal');
				if (datas) mm.apply(datas.onClose, null, datas.onCloseArgs);
			}

		},
		/// 모달 사이즈, 위치 재조정
		resize: function() {

			// if (mm._isModal) {
			if (mm._isIframe) {
				mm.root('mm.modal.resize', arguments);// 최상위에서 실행
				return false;
			}
			// window 모달
			else if (mm._isModal) {
				var $frameContent = $('.mm_modal-frame');
				var outerWidth = window.outerWidth - window.innerWidth;
				var outerHeight = window.outerHeight - window.innerHeight;
				window.resizeTo($frameContent.outerWidth() + outerWidth, $frameContent.outerHeight() + $('.mm_header').outerHeight() + outerHeight);
				return false;
			}
			// }

			var $inner = $modal.find('.mm_modal-item.__modal-on .mm_modal-item-inner');
			var $frame = $inner.children('iframe');

			// iframe modal
			if ($frame[0]) {
				var $frameDocument = $frame.contents();
				var $frameContent = $frameDocument.find('.mm_modal-frame');
				var _frameHeight = $frameContent.outerHeight() + $frameDocument.find('.mm_header').outerHeight();
				if (mm.is.odd(_frameHeight)) _frameHeight += 1;

				$inner.css({ 'width': $frameContent.outerWidth(), 'height': _frameHeight });
			}
			// script id modal
			else {
				$inner.css({ 'height': '' });
				mm.instant(function(){

					$inner.css({
						'height': function(__i, __value) {

							// var _windowHeight = window.innerHeight;
							var _value = parseFloat(__value);

							// if (mm.is.odd(_value) && mm.is.even(_windowHeight)) _value += 1;
							// if (mm.is.even(_value) && mm.is.odd(_windowHeight)) _value += 1;
							if (mm.is.odd(_value)) _value += 1;
							return _value + 'px';

						},
					});

				});
			}

		},
		/// 오프너(window)
		getOpener: function() {

			// if (mm._isModal) {
			if (mm._isIframe) return mm.root('mm.modal.getOpener', arguments);// 최상위에서 실행
			else if (mm._isModal) return window.opener;
			// }

			var openElement = mm.modal.getOpenElement();
			var openDocument = (openElement) ? openElement.ownerDocument : document;
			return openDocument.defaultView || openDocument.parentWindonw;

		},
		/// 오픈엘리먼트(element, 모달 열때 클릭한 요소)
		getOpenElement: function() {

			// if (mm._isModal) {
			if (mm._isIframe) return mm.root('mm.modal.getOpenElement', arguments);// 최상위에서 실행
			else if (mm._isModal) return window.opener;
			// }

			var $item = $modal.find('.mm_modal-item.__modal-on');
			return ($item[0]) ? $item.data('mm.modal').openElement : null;

		},
	};

})();
///-- 모달 팝업

/// 브라우저 팝업
mm.bom = (function() {

	// __text: 팝업 내용 (String: 필수), 빈 값 ''
	// __callback: 확인/취소 버튼 클릭 시 호출하는 함수 (Function: null)
	// __options: 추가 설정 (Object: null)
	// __options - title: 팝업 제목 (String: ''), 없으면 기본 값으로 표시
	// __options - args: 콜백 아규먼트 (Array: null)
	// 줄바꿈 \n, <br> (__text, options.title 사용)
	// 여러 개를 생성하면 차례로 노출

	var $bom;
	var _classOn = '__bom-on';
	var _classOff = '__bom-off';// close로 삭제될 요소에 적용

	// BOM영역 생성
	function bomCreate() {

		$bom = $(''
		+ '<!-- 브라우저 팝업 -->'
		+ '<div class="mm_bom">'
			+ '<div class="mm_bom-dim"></div>'
			+ '<div class="mm_bom-items">'
			+ '</div>'
		+ '</div>'
		+ '<!--// 브라우저 팝업 -->'
		+ '').appendTo('.mm_app');

	}

	// BOM영역 삭제
	function bomRemove() {

		$bom.remove();
		$bom = null;

	}

	// 팝업생성
	function bomAppend(__text, __title) {

		if (!$bom || !$bom[0]) bomCreate();
		TweenMax.killDelayedCallsTo(bomRemove);

		var $bomItem = $(''
		+ '<div class="mm_bom-item">'
			+ '<div class="mm_bom-item-inner">'
				+ '<i class="mco_bom"></i>'
				+ '<div class="mm_box">'
					+ '<div class="mm_bom-item-text">'
						+ '<h2>' + __title + '</h2>'
						+ '<p>' + __text.replace(/\n/ig, '<br>') + '</p>'
					+ '</div>'
					+ '<div class="mm_bom-item-btngroup">'
						+ '<ul class="mm_box-flex __flex_equal__">'
							+ '<li><button type="button" class="btn_no"><span>취소</span></button></li>'
							+ '<li><button type="button" class="btn_ok"><span>확인</span></button></li>'
						+ '</ul>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		+ '</div>'
		+ '').appendTo('.mm_bom-items');

		if ($.trim(__title.replace(/\<br\>/g, '')).length == 0) $bomItem.find('.mm_bom-item-text h2').remove();
		if ($.trim(__text.replace(/\<br\>/g, '')).length == 0) $bomItem.find('.mm_bom-item-text p').remove();
		if ($bomItem.find('.mm_bom-item-text').children().length == 0) $bomItem.find('.mm_bom-item-text').remove();

		$('html').addClass('__bom');
		mm.scroll.off();

		setTimeout(function() {

			var $item = $bom.find('.mm_bom-item').removeClass(_classOn)
			.not('.' + _classOff).first().addClass(_classOn);

			mm.bom.resize();

			TweenMax.killDelayedCallsTo(mm.focus.in);
			TweenMax.delayedCall(mm.times._base, mm.focus.in, [$item]);

		}, 50);

	}

	// private
	(function() {

		//

	})();

	// public
	return {
		/// 얼럿
		alert: function(__text, __callback, __options) {

			// mm.bom.alert('내용');
			// mm.bom.alert('내용', null, { _title: '변경할 제목', args: null });

			if (arguments.length == 0 || !_.isString(__text)) return;

			if (mm._isModal || mm._isPopup) {
				if (mm._isIframe) {
					mm.root('mm.bom.alert', arguments);// 최상위에서 실행
					return;
				}
			}

			var options = $.extend(true, { _title: '알림', args: [] }, __options);
			bomAppend(__text, options._title);

			$bom.find('.mm_bom-item').last().one('click', '.btn_ok', function(__e) {

				__e.preventDefault();

				mm.bom.close(__callback, options.args);

			}).find('.mco_bom').toggleClass(['mco_bom', 'mco_bom-alert']).end()
			.find('.btn_no').closest('li').remove();

		},
		/// 컨펌
		confirm: function(__text, __callback, __options) {

			// mm.bom.confirm('내용');
			// mm.bom.confirm('내용', null, { _title: '변경할 제목', args: null });
			// 버튼 클릭 시 __callback 첫번째 파라미터에 확인(true)/취소(false)를 전달합니다.

			if (arguments.length == 0 || !_.isString(__text)) return;

			if (mm._isModal || mm._isPopup) {
				if (mm._isIframe) {
					mm.root('mm.bom.confirm', arguments);// 최상위에서 실행
					return;
				}
			}

			var options = $.extend(true, { _title: '확인', args: [] }, __options);
			bomAppend(__text, options._title);

			$bom.find('.mm_bom-item').last().one('click', '.btn_ok, .btn_no', function(__e) {

				__e.preventDefault();

				mm.bom.close(__callback, [$(this).hasClass('btn_ok')].concat(options.args));// 리턴값 추가 확인(true)/취소(false)

			}).find('.mco_bom').toggleClass(['mco_bom', 'mco_bom-confirm']);

		},
		/// 프롬프트
		prompt: function(__text, __callback, __options) {

			// mm.bom.prompt('내용');
			// mm.bom.prompt('내용', null, { _title: '변경할 제목', args: null });
			// 버튼 클릭 시 __callback 마지막 파라미터에 form value(배열)과 확인(true)/취소(false)를 전달합니다.
			// 입력창 기본 값은 input:text 1종 노출입니다.
			// 추가/변경할 때는 { forms: [{ _type: '속성', _placeholder: '내용이 없으면 삭제', value: '내용이 없으면 삭제' }] }의
			// forms 배열에 오브젝트를 추가합니다.
			// type 값은 input 입력요소(text, tel, number, email, search, url, password, date, month, time)와 textarea, select 입니다.
			// select의 options는 options: [{ _text: '텍스트', _value: '값', _selected: true }] 형식으로 배열에 내용을 추가하면 됩니다.
			// date, time의 노출 방식은 format: '값'으로 변경할 수 있습니다.(moment.js format 참고)
			// attrs 값이 빈 값이 아니면 폼요소에 attr을 적용합니다.({ _dataNameText: '{ '_isResize': true }', 'style': 'background:red' } 등)

			if (arguments.length == 0 || !_.isString(__text)) return;

			if (mm._isModal || mm._isPopup) {
				if (mm._isIframe) {
					mm.root('mm.bom.prompt', arguments);// 최상위에서 실행
					return;
				}
			}

			var options = $.extend(true, { _title: '입력', args: [], forms: [{ _type: 'text', _placeholder: '입력', _format: '', attrs: {} }] }, __options);

			bomAppend(__text, options._title);
			var $bomForm = $('<ul class="mm_bom-item-form"></ul>').insertBefore('.mm_bom .mm_bom-item:last .mm_bom-item-btngroup');

			$.each(options.forms, function(__index, __form) {

				var $li = $('<li></li>').appendTo($bomForm);
				switch(__form._type) {
					case 'select':
						if (mm.is.empty(__form.options)) return;

						$(''
							+ '<div class="mm_form-select">'
								+ '<label>'
									+ '<select>'
									+ '</select>'
									+ '<i class="mco_form-select"></i>'
								+ '</label>'
							+ '</div>'
						+ '').appendTo($li);

						var $form = $li.find('select');
						if (!mm.is.empty(__form.attrs)) $form.attr(__form.attrs);

						$.each(__form.options, function(__i, __options) {

							var $options = $(''
							+ '<option value="' + __options._value + '">' + __options._text + '</option>'
							+ '').appendTo($form);

							if (_.isBoolean(__options._selected)) $options.prop({ 'selected': __options._selected });

						});
					break;
					default:
						var _isDate = /date|month|week|time/i.test(__form._type);
						var _placeholder = (mm.is.empty(__form._placeholder)) ? (_isDate) ? (/time/i.test(__form._type)) ? '시간' : '날짜' : '입력' : __form._placeholder;

						if (!mm.is.mobile() && !/textarea|password/i.test(__form._type)) __form._type = 'text';
						var _elementHtml = (/textarea/i.test(__form._type)) ? '<textarea class="textfield"></textarea>' : '<input type="' + __form._type + '" class="textfield">'

						var $item = $(''
							+ '<div class="' + ((/textarea/i.test(__form._type)) ? 'mm_form-textarea' : 'mm_form-text') + '">'
								+ '<button type="button" class="btn_text-clear"><i class="mco_form-clear"></i><span class="mm_ir-blind">지우기</span></button>'
								+ '<label>'
									+ _elementHtml + '<i class="bg_text"></i>'
									+ '<span class="text_placeholder">' + _placeholder + '</span>'
								+ '</label>'
							+ '</div>'
						+ '').appendTo($li);

						if (/password/i.test(__form._type)) $item.find('.btn_text-clear').after('<button type="button" class="btn_text-pw"><i class="mco_hide"></i><span class="mm_ir-blind">비밀번호 보기</span></button>').remove();// 비밀번호 버튼 변경

						var $text = $item.find('.textfield').filter('textarea, input');
						if (!mm.is.empty(__form._format)) $text.attr({ 'data-text': JSON.stringify({ _format: __form._format }).replace(/"/g, '\'') });
						if (_isDate) {
							if (mm.is.mobile()) $text.before('<span class="textfield text_date"></span>');
							else {
								// pc datepicker 연결
								$text.addClass('mm_datepicker');
								if (!mm.is.empty(__form._format)) $text.attr({ 'data-datepicker': JSON.stringify({ configs: { format: __form._format } }).replace(/"/g, '\'') });
								mm.datepicker.update($text);
							}
						}
						if (!mm.is.empty(__form._value)) mm.form.update($text.val(__form._value));
						if (!mm.is.empty(__form.attrs)) {
							$.each(__form.attrs, function(__key, __value) {

								if (__key == 'class') $text.addClass(__value);
								else $text.attr(__key, __value);

							});
						}
					break;
				}

			});

			var $bomItem = $bom.find('.mm_bom-item').last()
			$bomItem.one('click', '.btn_ok, .btn_no', function(__e) {

				__e.preventDefault();

				var values = [];
				$bomForm.find('textarea, select, input').each(function() {

					values.push($(this).val());

				});
				values.concat(options.args);

				mm.bom.close(__callback, [$(this).hasClass('btn_ok')].concat(values, options.args));// 리턴값 추가 확인(true)/취소(false)

			}).find('.mco_bom').toggleClass(['mco_bom', 'mco_bom-prompt']);

			mm.form.update($bomItem);

		},
		/// 닫기
		close: function(__callback, __args) {

			var $bomItem = $bom.find('.mm_bom-item');

			$bomItem.first().on('transitionEnd webkitTransitionEnd', function(__e) {

				$(this).off('transitionEnd webkitTransitionEnd').remove();

			}).removeClass(_classOn).addClass(_classOff).off('click', '.btn_ok, .btn_no');

			if ($bomItem.length > 1) {
				$bomItem.eq(1).addClass(_classOn);
				mm.focus.in($bomItem.eq(1));
			}
			else {
				$('html').removeClass('__bom');
				mm.scroll.on();

				// BOM영역 삭제
				TweenMax.delayedCall(mm.times._fast, bomRemove);

				mm.apply(__callback, null, __args);// 닫기 모션 이후 콜백
				// TweenMax.delayedCall(mm.times._fast, mm.apply, [__callback, null, __args]);// 닫기 모션 이후 콜백
			}

		},
		/// bom 위치 재조정
		resize: function() {

			var $container = $bom.find('.mm_bom-item.__bom-on .mm_bom-item-inner');

			$container.css({ 'height': '' });
			mm.instant(function(){

				$container.css({
					'height': function(__i, __value) {

						// var _windowHeight = window.innerHeight;
						var _value = parseFloat(__value);

						// if (mm.is.odd(_value) && mm.is.even(_windowHeight)) _value += 1;
						// if (mm.is.even(_value) && mm.is.odd(_windowHeight)) _value += 1;
						if (mm.is.odd(_value)) _value += 1;
						return _value + 'px';

					},
				});

			});

		},
	};

})();
///-- 브라우저 팝업

/// 컬러픽커
mm.colorpicker = (function() {

	// private
	(function() {

		$(document).on('click', '.mm_form-color .btn_picker', function(__e) {

			__e.preventDefault();

			var $colorpicker = $(this).siblings('.mm_colorpicker');
			if ($colorpicker[0]) mm.colorpicker.close($colorpicker);
			else mm.colorpicker.open(this);

		});

	})();

	// public
	return {
		// __element: btn_picker 버튼 요소

		/// 열기
		open: function(__element) {

			mm.colorpicker.close('.mm_colorpicker');

			var colors = [
				['#ffebed', '#ffccd2', '#ef9998', '#e27570', '#ee5253', '#f6413a', '#e5383a', '#d32e34', '#c4282c', '#b61c1c'],
				['#fbe4ec', '#f9bbd0', '#f48fb1', '#f06292', '#ec407a', '#ea1e63', '#d81a60', '#c2175b', '#ad1457', '#890e4f'],
				['#f3e5f6', '#e1bee8', '#cf93d9', '#b968c7', '#aa47bc', '#9c28b1', '#8e24aa', '#7a1fa2', '#6a1b9a', '#4a148c'],
				['#eee8f6', '#d0c4e8', '#b39ddb', '#9675ce', '#7e57c2', '#673bb7', '#5d35b0', '#512da7', '#45289f', '#301b92'],
				['#e8eaf6', '#c5cae8', '#9ea8db', '#7986cc', '#5c6bc0', '#3f51b5', '#3949ab', '#303e9f', '#283593', '#1a237e'],
				['#e4f2fd', '#bbdefa', '#90caf8', '#64b5f6', '#42a5f6', '#2196f3', '#1d89e4', '#1976d3', '#1564c0', '#0e47a1'],
				['#e1f5fe', '#b3e5fc', '#81d5fa', '#4fc2f8', '#28b6f6', '#03a9f5', '#039be6', '#0288d1', '#0277bd', '#00579c'],
				['#dff7f9', '#b2ebf2', '#80deea', '#4dd0e2', '#25c6da', '#00bcd5', '#00acc2', '#0098a6', '#00828f', '#016064'],
				['#e0f2f2', '#b2dfdc', '#80cbc4', '#4cb6ac', '#26a59a', '#009788', '#00887a', '#00796a', '#00695b', '#004c3f'],
				['#e8f6e9', '#c8e6ca', '#a5d6a7', '#80c783', '#66bb6a', '#4bb050', '#43a047', '#398e3d', '#2f7d32', '#1c5e20'],
				['#f1f7e9', '#ddedc8', '#c5e1a6', '#aed582', '#9ccc66', '#8bc24c', '#7db343', '#689f39', '#548b2e', '#33691e'],
				['#f9fbe6', '#f0f4c2', '#e6ee9b', '#dde776', '#d4e056', '#cddc39', '#c0ca33', '#b0b42b', '#9e9e24', '#817716'],
				['#fffde8', '#fffac3', '#fff59c', '#fff176', '#ffee58', '#ffeb3c', '#fdd734', '#fac02e', '#f9a825', '#f47f16'],
				['#fef8e0', '#ffecb2', '#ffe083', '#ffd54f', '#ffc928', '#fec107', '#ffb200', '#ff9f00', '#ff8e01', '#ff6f00'],
				['#fff2df', '#ffe0b2', '#ffcc80', '#ffb64d', '#ffa827', '#ff9700', '#fb8c00', '#f67c01', '#ef6c00', '#e65100'],
				['#fbe9e7', '#ffccbb', '#ffab91', '#ff8a66', '#ff7143', '#fe5722', '#f5511e', '#e64a19', '#d64316', '#bf360c'],
				['#efebe8', '#d7ccc8', '#bcaba4', '#a0887e', '#8c6e63', '#795547', '#6d4d42', '#5d4038', '#4d342f', '#3e2622'],
				['#ebeff2', '#cfd8dd', '#b0bfc6', '#90a4ad', '#78909c', '#607d8b', '#546f7a', '#465a65', '#36474f', '#273238']
			];
			var grays = ['#ffffff', '#f6f6f6', '#ebebeb', '#dfdfdf', '#d6d6d6', '#cbcbcb', '#bebebe', '#b4b4b4', '#a7a7a7', '#949494', '#828282', '#737373', '#5e5e5e', '#535353', '#454545', '#2c2c2c', '#191919', '#000000'];

			var $btnColor = $(__element);
			var $colorpicker = $(''
			+ '<div class="mm_colorpicker">'
				+ '<div class="mm_colorpicker-list">'
					+ '<ul></ul>'
					+ '<ul></ul>'
				+ '</div>'
				+ '<div class="mm_colorpicker-foot">'
					+ '<div class="mm_form-text">'
						+ '<button type="button" class="btn_text-clear"><i class="mco_form-clear"></i><span class="mm_ir-blind">지우기</span></button>'
						+ '<label>'
							+ '<input type="text" class="textfield" maxlength="6"><i class="bg_text"></i>'
							+ '<span class="text_placeholder">직접입력(000000)</span>'
						+ '</label>'
					+ '</div>'
					+ '<div class="mm_btngroup">'
						+ '<button type="button" class="btn_color-cancel"><span>취소</span></button>'
						+ '<button type="button" class="btn_color-submit"><span>적용</span></button>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
			+ '').insertAfter($btnColor);
			var $colorList = $colorpicker.find('.mm_colorpicker-list');
			var $text = $colorpicker.find('.textfield');
			var $colorData = $btnColor.siblings('.colorfield');

			mm.form.update($text.val($colorData.val().replace(/#/g, '').toUpperCase()));// $text.val($colorData.val().toUpperCase()).trigger('update');

			function colorAppend(__color, __element) {

				var $item = $(''
				+ '<li>'
					+ '<button type="button" class="btn_color-select" style="background:' + __color + '">'
						+ '<i class="bg_color"></i>'
						+ '<span class="mm_ir-blind">' + __color + '</span>'
					+ '</button>'
				+ '</li>'
				+ '').appendTo(__element);

				if (new RegExp(__color, 'i').test($text.val())) $item.find('.btn_color-select .bg_color').addClass('mco_colorpicker-check');
				return $item;

			}

			for (var _i = 0; _i < 10; _i++) {
				$.each(colors, function(__index, __items) {

					var $item = colorAppend(__items[_i], $colorList.find('ul').eq(0));
					if (_i > 3) $item.find('.btn_color-select').addClass('__check-white');

				});
			}

			$.each(grays, function(__index, __color) {

				var $item = colorAppend(__color, $colorList.find('ul').eq(1));
				if (__index > 5) $item.find('.btn_color-select').addClass('__check-white');

			});

			$colorList.on('click', '.btn_color-select', function(__e) {

				__e.preventDefault();

				if ($(this).find('.mco_colorpicker-check')[0]) {
					$colorpicker.find('.btn_color-submit').trigger('click');
					return;
				}

				$colorList.find('.btn_color-select .bg_color').removeClass('mco_colorpicker-check');
				$(this).find('.bg_color').addClass('mco_colorpicker-check');

				var _color = $(this).text().replace(/#/g, '').toUpperCase();
				mm.form.update($text.val(_color));// $text.val(_color).trigger('update');

			});

			$colorpicker.one('click', '.btn_color-cancel, .btn_color-submit', function(__e) {

				__e.preventDefault();

				if ($(this).hasClass('btn_color-submit')) {
					var _color = $text.val();
					var _decimal = Number('0x' + $text.val());

					if (_.isNaN(_decimal) || _decimal < 0 || _decimal > 16777215) return;

					$btnColor.children('.bg_color').css({ 'background': '#' + _color });
					$colorData.val('#' + _color);
				}

				mm.colorpicker.close($colorpicker);

			});

			function colorOutsideHide() {

				$(document).one('click', function(__e) {

					__e.preventDefault();

					if (!$(__e.target).closest('.mm_form-color')[0]) mm.colorpicker.close('.mm_colorpicker');
					else colorOutsideHide();

				});

			}
			colorOutsideHide();

		},
		/// 닫기
		close: function(__element) {

			$(__element).each(function() {

				if ($(this).hasClass('__colorpicker-inline')) return;

				$(this).off('click', '.btn_color-cancel, .btn_color-submit')
				.find('.mm_colorpicker-list').off('click', '.btn_cancel-color, .btn_color-submit')
				.end().remove();

			});

		},
	};

})();
///-- 컬러픽커

/// 데이트픽커
mm.datepicker = (function() {

	// jQuery .data('mm.name')에 저장할 기본 값
	var defaults = {
		// 플러그인 옵션
		configs: {
			// container: ,
			// trigger: ,
			// position: 'bottom left',
			format: 'YYYY-MM-DD',
			// defaultDate: ,
			// setDefaultDate: ,
			firstDay: 1,// 월요일부터
			// minDate: new Date(),// moment().toDate()
			// maxDate: new Date(),// moment().toDate()
			numberOfMonths: 1,// 노출할 월 수
			// bound: false,
			// pickWholeWeek: true,
			// disableWeekends: ,
			// disableDayFn: ,
			// yearRange: 10,// [1900, 2015]
			// yearSuffix: ,
			i18n: {
				previousMonth: '이전 달',
				nextMonth: '다음 달',
				months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
				weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
				weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
			},
			showMonthAfterYear: true,
			showDaysInNextAndPreviousMonths: true,
			enableSelectionDaysInNextAndPreviousMonths: true,
			keyboardInput: false,
		},
		Datepicker: null,// :Pikaday
		_isSelectMonth: false,// :Boolean - 1달 단위로 선택
		onSelect: null,
		onSelectArgs: [],
		onOpen: null,
		onOpenArgs: [],
		onClose: null,
		onCloseArgs: [],
		onDraw: null,
		onDrawArgs: [],
	};
	var _dataName = 'data-datepicker';// 데이타 속성 이름

	// 데이트픽커 요소
	function getDatepickerElement(__element) {

		var $el = (__element) ? $(__element) : $('.mm_datepicker');
		return ($el[0] && !$el.hasClass('mm_datepicker')) ? $el.find('.mm_datepicker') : $el;

	}

	// 기간
	function dateRangeCheck(__element, __date) {

		var $el = $(__element);
		var $range = $($el).closest('.mm_formbox-period');

		if ($range[0]) {
			var $date = getDatepickerElement($range);
			if ($date.length < 2) return;

			var startPicker = $date.eq(0).data('mm.datepicker').Datepicker;
			var endPicker = $date.eq(1).data('mm.datepicker').Datepicker;

			// 시작일
			if ($el[0] == $date.eq(0)[0]) {
				startPicker.setStartRange(__date);
				endPicker.setStartRange(__date);
				endPicker.setMinDate(__date);
			}
			// 종료일
			else if ($el[0] == $date.eq(1)[0]) {
				startPicker.setEndRange(__date);
				startPicker.setMaxDate(__date);
				endPicker.setEndRange(__date);
			}
		}

	}

	// private
	(function() {

		//

	})();

	// public
	return {
		/// 설정
		update: function(__element, __options) {

			getDatepickerElement(__element).each(function(__i) {

				var $ui = $(this);
				var datas = $ui.data('mm.datepicker') || mm.element.datas($ui, _dataName, defaults, true);

				if ($ui.is('[readonly]')) return;
				$ui.prop({ 'readonly': true }).addClass('__datepicker-on')// 인풋 키입력 안되도록 적용, 배경색상 흰색
				.closest('.mm_form-text').addClass('__text_calendar__');

				// 날짜 선택 시 실행
				datas.configs.onSelect = function(__date) {

					if (!datas._isSelectMonth) {
						dateRangeCheck($ui, __date);// 기간
					}
					else {
						$(this.el).find('.pika-button, .pika-prev, .pika-next').off('mousedown touchstart');
					}

					mm.apply(datas.onSelect, $ui, [__date].concat(datas.onSelectArgs));

				}

				// 달력이 생성/변경될 때
				datas.configs.onDraw = function(__datepicker) {

					// 월 생성
					if (datas._isSelectMonth) {
						var $datepicker = $(__datepicker.el);
						var $dateTable = $datepicker.find('.pika-table');
						var calendars = __datepicker.calendars[0];
						var _monthTotal = 12;
						var _selectedDate = new Date($ui.val());
						var _selecedYear = _selectedDate.getFullYear();
						var _selecedMonth = _selectedDate.getMonth();// + 1;

						$datepicker.find('.pika-select-month').closest('.pika-label').empty().css({ 'font-size': 0 });
						$datepicker.find('thead tr').empty().append('<th scope="col" colspan="4">월을 선택하세요</th>')
						$dateTable.find('tbody').empty();

						for (var i = 0; i < 12; i++) {
							var isThisMonth = (_selecedYear == calendars.year && _selecedMonth == i);
							var $tr;
							if (Math.floor(i % 4) == 0) $tr = $('<tr />').appendTo($dateTable.find('tbody'));

							var $td = $('<td data-day="1" area-selected="' + isThisMonth + '"><button class="pika-button pika-day" type="button" data-pika-year="' + calendars.year + '" data-pika-month="' + i + '" data-pika-day="1">' + (i + 1) +'</button></td>').appendTo($tr);
							if (isThisMonth) $td.addClass('is-selected');
						}

						$(__datepicker.el).find('.pika-button, .pika-prev, .pika-next').on('mousedown touchstart', function(__e) {

							var $this = $(this);
							if (!$this.hasClass('is-disabled')) {
								if ($this.hasClass('pika-button')) {
									__datepicker.calendars[0].month = $this.attr('data-pika-month');
									__datepicker.calendars[0].year = $this.attr('data-pika-year');
								}
								else if ($this.hasClass('pika-prev')) {
									__datepicker.calendars[0].month++;
									__datepicker.calendars[0].year--;
								}
								else if ($this.hasClass('pika-next')) {
									__datepicker.calendars[0].month--;
									__datepicker.calendars[0].year++;
								}
								__datepicker.adjustCalendars();
							}

						});
					}

					mm.apply(datas.onDraw, $ui, datas.onDrawArgs);

				}

				// 열림 후 실행
				datas.configs.onOpen = function() {

					var $datepicker = $(this.el);
					var $pageContent = $('.mm_page-content');

					// 데이트픽커 브라우저 스크립트 스크롤 시 움직임으로 인한 위치 이동
					if ($ui.closest($pageContent)[0]) {
						if ($datepicker.parent().is('body')) $datepicker.appendTo($pageContent);
						if ($datepicker.hasClass('is-bound')) $datepicker.css({ 'margin-top': -$pageContent.offset().top, 'margin-left': -$pageContent.offset().left - 1 });// 마진적용
					}

					mm.apply(datas.onOpen, $ui, datas.onOpenArgs);

				}

				// 닫힘 후 실행
				datas.configs.onClose = function() {

					mm.apply(datas.onClose, $ui, datas.onCloseArgs);

				}

				$.extend(true, datas, __options);
				datas.configs.field = $ui[0];// field는 스크립트에서 적용
				if (datas.configs.container) datas.configs.container = $(datas.configs.container)[0];
				if (datas.configs.trigger) datas.configs.trigger = $(datas.configs.trigger)[0];
				if (datas._isSelectMonth) {
					datas.configs.showDaysInNextAndPreviousMonths = false;
					datas.configs.format = function() {

						var _format = datas.configs.format;
						_format = _format.replace(/d/gi, '');

						return (/\.|\,|\-|\s/.test(_format.slice(-1))) ? _format.slice(0, -1) : _format;

					}();
				}
				datas.Datepicker = new Pikaday(datas.configs);
				// datas.Datepicker.setDate('2015-01-01');
				// datas.Datepicker.gotoToday();

				mm.instant(dateRangeCheck, { args: [$ui, new Date($ui.val())] });

			});

		},
		/// 지우기
		clear: function(__element) {

			getDatepickerElement(__element).each(function(__i) {

				var $ui = $(this);
				var datas = $ui.data('mm.datepicker') || mm.element.datas($ui, _dataName, defaults, true);

				$ui.data('mm.datepicker').Datepicker.setDate(null, false);
				dateRangeCheck($ui, null);// 기간

			});

		},
		/// 재설정
		reset: function() {

			//

		},
		/// 해제
		destroy: function(__element) {

			getDatepickerElement(__element).each(function(__i) {

				var $ui = $(this);
				var datas = $ui.data('mm.datepicker') || mm.element.datas($ui, _dataName, defaults, true);

				datas.Datepicker.destroy();
				datas.Datepicker = null;

			});

		}
	};

})();
///-- 데이트픽커
