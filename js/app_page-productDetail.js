/**
** 상품상세페이지
**/

$(function() {

	var $doc = $(document);

	// 옵션, 합계
	(function() {

		$('.m-prodetail-head-option, .m-prodetail-tab-option').each(function(__index) {

			var $el = $(this);
			var $option = $el.find('.m--option-item');
			var $selected = $el.find('.m--option-selected');

			var PROD_OPTION_NEXT = 'PROD_OPTION_NEXT';// 옵션선택(단계)
			var PROD_OPTION_SELECT = 'PROD_OPTION_SELECT';// 옵션선택(최종)
			var PROD_OPTION_QTY = 'PROD_OPTION_QTY';// 옵션수량변경
			var PROD_FRAME_OPTION_SELECT = 'PROD_FRAME_OPTION_SELECT';// 딜상품 아이프레임에서 옵션선택

			// 옵션선택
			$option.each(function(__i) {

				var $ui = $(this);
				var $list = $ui.find('.m--option-item-list');
				var $listItem = $list.find('li > a');
				var $formCheckSoldout = $ui.find('.form_check_soldout');
				var $formCheckWord = $ui.find('.form_check_word');
				var $formTextWord = $ui.find('.form_text_word');
				var $btnDropdown = $ui.find('.btn_dropdown');

				if (__i > 0) $btnDropdown.attr({ 'disabled': true });

				// 옵션열림
				$ui.children('.mm_dropdown').data('mm.dropdown').onOpen = function() {

					mm.anchor(0, { scroller: mm.getScroller($ui), _time: 0 });

					// 닫기
					$doc.on('click', optionClose);

					// 초기화
					mm.form.update($formCheckWord.prop({ 'checked': false }));
					mm.form.update($formCheckSoldout.prop({ 'checked': false }));

				};

				// 옵션닫힘
				function optionClose(__e) {

					var $dropdown = $ui.children('.mm_dropdown');

					if (!__e || !$(__e.target).closest($dropdown)[0]) {
						mm.dropdown.close($dropdown);
						$doc.off('click', optionClose);
					}

				}

				// 옵션리스트확인
				function optionCheckVisible() {

					var $listUl = $list.find('ul');
					$listUl.show();

					if ($listItem.filter(':visible')[0]) {
						$listUl.next('.mm_text-none').remove();
					}
					else {
						$listUl.hide()
						.after(function() {

							return ($list.find('.mm_text-none')[0]) ? null : '<p class="mm_text-none">조건에 해당하는 옵션이 없습니다.</p>';

						});
					}

				}

				// 검색어찾기
				$formCheckWord.data('mm.check').onChange = function() {

					if (!$(this).is(':checked')) mm.form.update($formTextWord.val(''));

				};

				$formTextWord.on('keyup change', function() {

					var _word = $.trim($(this).val());
					var classNone = '__none-word';

					$listItem.each(function() {

						var $item = $(this);
						var $textOption = $item.find('.text_option');
						var datas = JSON.parse($item.attr('data-option').replace(/\'/g, '"').replace(/\t/g, ' '));

						if (_word.length == 0) $textOption.text(datas._name);
						else {
							$textOption.html(function() {

								return datas._name.replace(new RegExp(mm.escapeRegExp(_word), 'gi'), function(__text) {

									return '<em class="mm_text-primary">' + __text + '</em>';

								});

							});
						}

						if ($textOption.find('.mm_text-primary')[0] || _word.length == 0) $item.parent().removeClass(classNone);
						else $item.parent().addClass(classNone);

					});

					optionCheckVisible();

				});

				// 품절제외
				$formCheckSoldout.data('mm.check').onChange = function() {

					var $soldout = $listItem.filter('.__soldout');
					var classNone = '__none-soldout';

					if ($(this).is(':checked')) $soldout.parent().addClass(classNone);
					else $soldout.parent().removeClass(classNone);

					optionCheckVisible();

				};

				// 리스트세팅, 선택
				$listItem.each(function() {

					var $item = $(this);
					var datas = JSON.parse($item.attr('data-option').replace(/\'/g, '"').replace(/\t/g, ' '));

					if (datas._isSoldout == true) $item.addClass('__soldout');

					$item.not('.__soldout').on('click', function(__e) {

						// 옵션단계
						if (__i < $option.length - 1) {
							$('.m--option-item').each(function(__k) {

								if (__k % $option.length == 0) $('<span class="text_option" />').text(datas._name).prependTo($(this).find('.btn_dropdown')).siblings('.text_option').remove();

							});
							mm.observer.update(PROD_OPTION_NEXT, { datas: $.extend(true, datas, { _index: __i }) });
						}
						// 최종옵션
						else mm.observer.update(PROD_OPTION_SELECT, { datas: $.extend(true, datas, { item: $item }) });
						optionClose();

					});

				});

				// 다음옵션세팅
				mm.observer.set($ui, PROD_OPTION_NEXT, function(__e, __datas) {

					if (__i != __datas._index + 1) return;

					var classNone = '__none-group';

					$btnDropdown.attr({ 'disabled': false });
					$listItem.each(function() {

						var $item = $(this);
						var _groups = JSON.parse($item.attr('data-option').replace(/\'/g, '"').replace(/\t/g, ' ')).groups.join('/');

						if (_groups.match(new RegExp(mm.escapeRegExp(__datas.groups.join('/')), 'i'))) $item.parent().removeClass(classNone);
						else $item.parent().addClass(classNone);

					});
					mm.instant(mm.dropdown.open, { args: [$ui.children('.mm_dropdown')] });

				});

				// 옵션초기화
				mm.observer.set($ui, PROD_OPTION_SELECT, function(__e, __datas) {

					if (__i > 0) $btnDropdown.attr({ 'disabled': true });
					$btnDropdown.find('.text_option').remove();

				});

			});

			// 선택한옵션 삭제
			$selected.on('click', '.btn_remove', function(__e) {

				var $li = $(this).closest('li');
				var _removeIndex = $li.index();

				mm.observer.update(PROD_OPTION_QTY, { datas: { _elIndex: __index, element: null, _removeIndex: _removeIndex } });

			});

			// 선택한옵션 생성
			mm.observer.set($selected, PROD_OPTION_SELECT, function(__e, __datas) {

				// 이미 있음
				if ($selected.find('li').is(function() {

					return $(this).find('.text_selected').text() == __datas.groups.join('/');

				})) {
					if ($('.__bom')[0]) return;
					else return mm.bom.alert('이미 선택된 옵션입니다.');
				}

				var $selectedList = ($selected.find('ul')[0]) ? $selected.find('ul') : (__index == 0) ? $('<ul />').appendTo($selected) : $('<ul />').appendTo($selected.find('.os-content'));
				var $selectedItem = $(''
				+ '<li data-price="' + __datas._price + '" data-results="' + JSON.stringify(__datas.results).replace(/"/g, '\'') + '">'
					+ '<p class="text_selected">' + __datas.groups.join('/') + '</p>'
					+ '<strong class="text_price">' + mm.numberComma(__datas._price) + '</strong>'
					+ '<div class="mm_stepper" data-stepper="' + JSON.stringify({ _max: __datas._max }).replace(/"/g, '\'') + '">'
						+ '<div class="mm_form-text">'
							+ '<label>'
								+ '<input type="text" class="textfield product_cnt"><i class="bg_text"></i>'
								+ '<span class="text_placeholder mm_ir-blind">수량</span>'
							+ '</label>'
						+ '</div>'
						+ '<button type="button" class="btn_stepper-subtract"><i class="mco_subtract"></i><span class="mm_ir-blind">수량 빼기</span></button>'
						+ '<button type="button" class="btn_stepper-add"><i class="mco_add"></i><span class="mm_ir-blind">수량 더하기</span></button>'
					+ '</div>'
					+ '<button type="button" class="btn_remove"><i class="mco_remove"></i><span class="mm_ir-blind">선택 삭제</span></button>'
				+ '</li>'
				+ '').prependTo($selectedList);

				$selectedItem.on('change', '.textfield', function() {

					var $this = $(this);
					mm.observer.update(PROD_OPTION_QTY, { datas: { _elIndex: __index, element: $this } });

				});

				mm.form.update($selectedItem);

			});

			// 수량, 합계
			mm.observer.set($el, PROD_OPTION_QTY, function(__e, __datas) {

				mm.instant(function() {

					var _totalPrice = 0;
					var _totalQty = 0;

					$selected.find('li').each(function(__i) {

						var $this = $(this);

						if (__index != __datas._elIndex && __datas.element && __i == __datas.element.closest('li').index()) mm.stepper.update($this.find('.textfield').val(__datas.element.val()));
						if (__datas._removeIndex != null && __i == __datas._removeIndex) {
							$this.off().remove();
							if ($selected.find('li').length == 0) $selected.find('ul').remove();
							return;
						}

						var _qty = parseFloat($this.find('.mm_stepper .textfield').val());
						var _price = parseFloat($this.data('price')) * _qty;
						_totalQty += _qty;
						_totalPrice += _price;

						$this.find('.text_price').text(mm.numberComma(_price));

					});

					$('.text_sumprice').eq(__index).text(mm.numberComma(_totalPrice));
					$('.text_sumqty').eq(__index).text(_totalQty);

				})

			});

			// 딜상품 옵션선택
			mm.observer.set($el, PROD_FRAME_OPTION_SELECT, function(__e, __datas) {

				if (__index == 0) $('[data-optid="' + __datas._id + '"]').eq(__index).trigger('click');

			});

		});

	})();

	// 하단옵션영역
	(function() {

		var $option = $('.m-prodetail-tab-option');
		var $selected = $option.find('.m--option-selected');
		var $sum = $option.find('.m--option-sum');

		function selectedResize() {

			$selected.css({ 'height': window.innerHeight - 50 - $selected[0].offsetTop - $sum.outerHeight() - parseFloat($sum.css('margin-bottom')) - $sum.next().outerHeight() - 29 });
			$option.parent('.mm_container').css({ 'min-height': $option.children().outerHeight() });

		}

		$(window).on('load resize', selectedResize);
		selectedResize();

		// 합계열림/닫힘
		var sumDatas = $sum.data('mm.dropdown');
		sumDatas.onOpen = selectedResize;
		sumDatas.onClose = selectedResize;

	})();

	// 탭메뉴
	(function() {

		var $tab = $('.m-prodetail-tab');
		var $tabmenu = $tab.find('.mm_tabmenu');
		var $option = $('.m-prodetail-tab-option');

		var _classSticky = '__tab-sticky';
		var _classStickyEnd = '__tab-sticky-end';

		function tabReposition() {

			var scrollTop = $(window).scrollTop();

			if (scrollTop >= $tab.offset().top) {
				$tab.addClass(_classSticky);

				if (scrollTop >= $tab.offset().top + $tab.outerHeight() - $option.outerHeight() - 50) {
					$tab.addClass(_classStickyEnd);
					$tabmenu.css({ 'margin-bottom': $option.children().outerHeight() });
				}
				else {
					$tab.removeClass(_classStickyEnd);
					$tabmenu.css({ 'margin-bottom': '' });
				}
			}
			else $tab.removeClass(_classSticky);

		}

		// 스크롤
		$(window).on('load scroll', tabReposition);
		tabReposition();

		// 탭변경
		$tab.data('mm.tab').onChange = function() {

			var $frameDocument = $tab.find('.mm_tab-item.__tab-on iframe').contents()[0];
			if ($frameDocument) {
				var frameWindow = $frameDocument.defaultView || $frameDocument.parentWindonw;
				frameWindow.productFrameResize();
			}

			tabReposition();

			if ($tab.hasClass(_classSticky)) mm.anchor($tab, { _time: 0 });

		};

		// 게시판 아코디언 변경 시 리포지션
		mm.observer.set($tab, 'PROD_TAB_REPOSITION', tabReposition);

	})();

});
