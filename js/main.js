$(document).ready(function () {
	var play_background_sounds_after_click = () => {
		let start_autoplay = () => {
			let playPromise = document.getElementsByClassName('background_sounds')[0].play();
			if (playPromise !== undefined) {
				playPromise.then(_ => {
						document.getElementsByClassName('background_sounds')[0].play();
						console.log('sdfs');
					})
					.catch(error => {
						console.dir(error);
						console.log('uuuu');
					});
			}
			document.removeEventListener("click", start_autoplay);
		};
		document.addEventListener('click', start_autoplay);
	}
	if (isTouchDevice() === true) {
		$(".oponent_field .tile").addClass("mobile");
		$(window).bind("mousedown", trig);
		if (!window.chrome) {
			alert("This game will work correctly in Google Chrome browser.")
		}
	} else play_background_sounds_after_click();
	var info = {
		countOver: [],
		massvKorableiVField: [],
		countOvership: 0,
		killedShips: 0,
		arrActive: (function () {
			var arrAct = [];
			for (var itr = 101; --itr;) {
				arrAct.unshift(itr);
			}
			return arrAct;
		})(),
		shootdirection: []
	};
	var languageObj = {
		instructions: {
			eng: "To begin the round, drag ships on the field, and click Next.",
			ru: "Чтобы начать раунд перетащите корабли на поле и нажмите Далее."
		},
		auto: {
			eng: "Auto Positioning",
			ru: "Авторасстановка"
		},
		clear: {
			eng: "Clear",
			ru: "Очистить"
		},
		next: {
			eng: "Next",
			ru: "Далее"
		},
		giveup: {
			eng: "Give up",
			ru: "Сдаться"
		},
		win: {
			eng: "VICTORY!!! <br/> <br/> Long live the Captain!!!",
			ru: "ПОБЕДА !!! <br/> <br/> Да здравствует капитан !!!"
		},
		loose: {
			eng: "Defeat. <br/> <br/> <br/> Next time you should prepare better...",
			ru: "Поражение. <br/> <br/> <br/> В следующий раз, подготовтесь лучше..."
		},
		para: {
			eng: "Parallax",
			ru: "Параллакс"
		},




	}

	function EngRu(eng) {
		if (eng) {
			$(".instructions").html(languageObj.instructions.eng).removeClass("ru_text");
			$(".auto").val(languageObj.auto.eng).removeClass("ru_text");
			$(".clear_my_field").val(languageObj.clear.eng).removeClass("ru_text");
			$(".next").val(languageObj.next.eng).removeClass("ru_text");
			$(".give_up").val(languageObj.giveup.eng).removeClass("ru_text");
			$(".win_alert").html(languageObj.win.eng).removeClass("ru_text");
			$(".loose_alert").html(languageObj.loose.eng).removeClass("ru_text");
			$(".para_switch").html(languageObj.para.eng).removeClass("ru_text");

		} else {
			$(".instructions").html(languageObj.instructions.ru).addClass("ru_text");
			$(".auto").val(languageObj.auto.ru).addClass("ru_text");
			$(".clear_my_field").val(languageObj.clear.ru).addClass("ru_text");
			$(".next").val(languageObj.next.ru).addClass("ru_text");
			$(".give_up").val(languageObj.giveup.ru).addClass("ru_text");
			$(".win_alert").html(languageObj.win.ru).addClass("ru_text");
			$(".loose_alert").html(languageObj.loose.ru).addClass("ru_text");
			$($(".para_switch")[0]).html(languageObj.para.ru).addClass("ru_text");

		}
	}

	function definestashFieldShips() {
		return $(".stash_field .ship").draggable({
			containment: 'main',
			cursor: 'move',
			snap: '.tile,.field',
			snapMode: "inner",
			helper: function () {
				info.cl = $(this).clone();
				return info.cl;
			},
			snapTolerance: 23,
			stop: function (event, ui) {
				info.countOvership = 0;
			},
		});
	}
	definestashFieldShips();
	$('.del_border').droppable({
		tolerance: "touch",
		over: function (event, ui) {
			$(".in_paluba").css({
				"background-color": "transparent"
			});
		},
		drop: function (event, ui) {
			if (ui.draggable.hasClass("in_my_field")) {
				$("[data-shiptype^=\"" + info.massvKorableiVField[info.indexOfDel].zanyatie.length + "\"]").show().removeClass("empty");
				info.massvKorableiVField.splice(info.indexOfDel, 1);
				info.countOver = [];
				$(ui.draggable).remove();
			}
		}
	});

	function defineMyField() {
		$(".my_field").droppable({
			tolerance: "fit",
			over: handleMyFieldOver,
			drop: handleMyFieldDrop
		});
	}
	defineMyField();

	function handleMyFieldOver(event, ui) {
		$(info.cl).find(".in_paluba").css({
			"background-color": "rgba(255, 63, 63, 0.2)",
			"visibility": "visible"
		});
		$('.in_my_field').find(".in_paluba").css({
			"background-color": "rgba(255, 63, 63, 0.2)",
			"visibility": "visible"
		});
		ui.draggable.draggable("option", "revert", false);
	}

	function handleMyFieldDrop(event, ui) {
		$('.in_my_field').find(".in_paluba").css({
			"background-color": "transparent"
		});
		if (info.countOvership !== 0) {
			ui.draggable.draggable("option", "revert", true);
		} else {
			if (!$(ui.draggable).hasClass("in_my_field")) {
				var cloneObject = ui.draggable.clone();
				cloneObject.css({
					"position": "absolute",
					"top": ui.position.top,
					"left": ui.position.left,
					"z-index": "1000"
				});
				cloneObject.addClass("in_my_field");
				$(cloneObject).droppable({
					tolerance: "touch",
					over: function () {
						++info.countOvership
					},
					out: function () {
						--info.countOvership
					}
				});
				cloneObject.draggable({
					helper: "original",
					containment: 'main',
					cursor: 'move',
					snap: '.tile,.field',
					snapMode: "inner",
					snapTolerance: 23,
					start: function () {
						$(this).data("draggingIndexIdentifier", true);
						var ind, _i, _len;
						for (ind = _i = 0, _len = info.massvKorableiVField.length; _i < _len; ind = ++_i) {
							if ($(info.massvKorableiVField[ind].samKorabl).data("draggingIndexIdentifier") === true) {
								return info.indexOfDel = ind;
							}
						};
					},
					stop: function (event, ui) {
						info.countOvership = 0;
						$(this).data("draggingIndexIdentifier", false);
					},
				});
				cloneObjectWrap = {
					zanyatie: [],
					samKorabl: cloneObject,
					marg: [],
					podbitie: []
				};
				cloneObjectWrap.zanyatie = info.countOver;
				cloneObjectWrap.marg = shipMargin(cloneObjectWrap.zanyatie);
				info.massvKorableiVField.push(cloneObjectWrap);
				var newIndex = info.massvKorableiVField.length - 1;
				$(this).append(cloneObject);
				var korebleiNPalubnogoTipa = info.massvKorableiVField.filter(function (element, index, array) {
					if (element.zanyatie.length === array[newIndex].zanyatie.length) {
						return true;
					} else {
						return false;
					}
				});
				if (5 - info.massvKorableiVField[newIndex].zanyatie.length === korebleiNPalubnogoTipa.length) {
					$(".stash_field .ship[data-shiptype^=\"" + info.massvKorableiVField[newIndex].zanyatie.length + "\"]").hide().addClass("empty");
				}
			} else {
				info.massvKorableiVField[info.indexOfDel].zanyatie = info.countOver;
				info.massvKorableiVField[info.indexOfDel].marg = shipMargin(info.massvKorableiVField[info.indexOfDel].zanyatie);
			}
		}
		info.countOver = [];
	}

	function defineInTile() {
		$(".my_field .in_tile").droppable({
			tolerance: "touch",
			over: function (event, ui) {
				info.countOver.push($(this).parents('.tile').attr("data-tilenum"));
			},
			out: function (event, ui) {
				var tilenum = $(this).parents('.tile').attr("data-tilenum");
				var ind = jQuery.inArray(tilenum, info.countOver);
				info.countOver.splice(ind, 1);
			},
		});
	};
	defineInTile();

	function clearMyField() {
		$(".stash_field .ship").show().removeClass("empty");
		info.massvKorableiVField = [];
		$(".in_my_field").remove();
	}
	$(".clear_my_field").click(clearMyField);

	function auto() {
		clearMyField();
		setTenShips();
		info.massvKorableiVField = infoEnemy.massvKorableiVField;
		infoEnemy.massvKorableiVField = [];
		info.massvKorableiVField.forEach(function (elem, ind, arr) {
			var zanyatieArr = [];
			elem.zanyatie.forEach(function (elem1, ind1, arr) {
				zanyatieArr.push(parseInt(elem1));
			});
			elem.zanyatie = zanyatieArr.sort(function (a, b) {
				return a - b;
			});
		});
		info.massvKorableiVField.forEach(function (elem, ind, arr) {
			var goriz;
			if ((elem.zanyatie[1] - elem.zanyatie[0]) > 7) {
				goriz = 1;
			} else {
				goriz = 0;
			}
			var cloneShip = $(".stash_field .ship[data-shiptype=\"" + elem.zanyatie.length + "" + goriz + "\"]").clone();
			$(".my_field").append(cloneShip);
			var tileToPlaceInMyField = $(".tile[data-tilenum=\"" + elem.zanyatie[0] + "\"]");
			var position = tileToPlaceInMyField.position();
			var width = tileToPlaceInMyField.width();
			var height = tileToPlaceInMyField.height();
			cloneShip.css({
				"position": "absolute",
				"top": position.top - height - 1,
				"left": position.left - width - 1,
				"z-index": "1000"
			});
			cloneShip.addClass("in_my_field");
			$(cloneShip).droppable({
				tolerance: "touch",
				over: function () {
					++info.countOvership
				},
				out: function () {
					--info.countOvership
				}
			});
			cloneShip.draggable({
				helper: "original",
				containment: 'main',
				cursor: 'move',
				snap: '.tile,.field',
				snapMode: "inner",
				snapTolerance: 23,
				start: function () {
					$(this).data("draggingIndexIdentifier", true);
					var ind, _i, _len;
					for (ind = _i = 0, _len = info.massvKorableiVField.length; _i < _len; ind = ++_i) {
						if ($(info.massvKorableiVField[ind].samKorabl).data("draggingIndexIdentifier") === true) {
							return info.indexOfDel = ind;
						}
					};
				},
				stop: function (event, ui) {
					info.countOvership = 0;
					$(this).data("draggingIndexIdentifier", false);
				},
			});
			elem.samKorabl = cloneShip;
		});
		$(".stash_field .ship").addClass("empty").hide();
	}

	function next() {
		function validateKor() {
			if (info.massvKorableiVField.length == 10) {
				for (var indKor = 0; indKor < info.massvKorableiVField.length; indKor++) {
					var korebleiNPalubnogoTipa = info.massvKorableiVField.filter(function (element, index, array) {
						if (element.zanyatie.length === array[indKor].zanyatie.length) {
							return true;
						} else {
							return false;
						}
					})
					if (5 - info.massvKorableiVField[indKor].zanyatie.length === korebleiNPalubnogoTipa.length) {} else {
						return false;
					}
				}
				return true;
			}
		}
		if (validateKor()) {
			$(".stash_field").hide();
			$(".del_border").hide();
			$(".oponent_field").css({
				"display": "inline-block"
			});
			$(".in_my_field").draggable("disable");
			setTenShips();
			$(".oponent_field").addClass("my_turn");
			for (var iterParseInt = 0; iterParseInt < info.massvKorableiVField.length; iterParseInt++) {
				for (var iterParseInt1 = 0; iterParseInt1 < info.massvKorableiVField[iterParseInt].zanyatie.length; iterParseInt1++) {
					info.massvKorableiVField[iterParseInt].zanyatie[iterParseInt1] = parseInt(info.massvKorableiVField[iterParseInt].zanyatie[iterParseInt1]);
				}
			}
			$(".give_up").show();
			counterWinLoose.loose++;
			localStorage.counterWinLoose = JSON.stringify(counterWinLoose);
		} else {
			var notEmpty = $(".ship:not(.empty):not(.in_my_field)");
			notEmpty.css({
				"background-color": "rgba(255, 63, 63, 0.2)"
			});

			function returnPreCololor() {
				notEmpty.css({
					"background-color": "rgba(0, 0, 0, 0.29)"
				})
			}
			setTimeout(returnPreCololor, 400);
		}
		if (isTouchDevice() === true) {
			var fistVolume = seaBattleSettings.sound;
			seaBattleSettings.sound = 0;
			trig();
			seaBattleSettings.sound = fistVolume;
		}
	}

	function giveup() {
		$(".loose_alert").show();
		soundEffect("defeat", 0, true);
		$(".counter .loose").html(counterWinLoose.loose);
		$(".give_up").hide();
	}

	$(".auto").click(auto);
	$(".next").click(next);
	$(".oponent_field .tile").bind("click", clickOnTile);
	$(".give_up").click(giveup);

	function parallax(e) {
		var offset = $(this).offset();
		var xPos = e.pageX - offset.left;
		var yPos = e.pageY - offset.top;
		var mouseXPercent = Math.round(xPos / $(this).width() * 100);
		var mouseYPercent = Math.round(yPos / $(this).height() * 100);
		var bgImage = $('.para');
		var diffX = $(this).width() - bgImage.width();
		var diffY = $(this).height() - bgImage.height();
		var myX = diffX * (mouseXPercent / 100);
		var myY = diffY * (mouseYPercent / 100);
		bgImage.animate({
			left: myX,
			top: myY
		}, {
			duration: 50,
			queue: false,
			easing: 'linear'
		});
	}
	$("html").bind("mousemove", parallax);
	$(".settings_off").click(function (event) {
		$(this).addClass("settings_on");
		$(".settings_overlay").css({
			"display": "block"
		});
	});
	$(".settings_off_switch").click(function (event) {
		var settingsObj = $(".settings_on")
		$(".settings_off").toggleClass("settings_on");
		$(".settings_overlay").css({
			"display": "none"
		});
		event.stopPropagation();
	});
	$(".settings_overlay").click(function (event) {
		$(this).css({
			"display": "none"
		});
		$(".settings_off").toggleClass("settings_on");
	});
	$(".sound_switch").click(function (event) {
		if ($(this).text() === "C") {
			$(this).html("D");
			seaBattleSettings.sound = 0;
		} else {
			$(this).html("C");
			seaBattleSettings.sound = 1;
		}
		event.stopPropagation();
		localStorage.seaBattleSettings = JSON.stringify(seaBattleSettings);
		$(".background_sounds")[0].volume = seaBattleSettings.sound;
	});
	$(".language_switch").click(function (event) {
		if ($(this).text() === "Eng") {
			$(this).html("Ru");
			EngRu(false);
			seaBattleSettings.language = false;
		} else {
			$(this).html("Eng");
			EngRu(true);
			seaBattleSettings.language = true;
		}
		localStorage.seaBattleSettings = JSON.stringify(seaBattleSettings);
		event.stopPropagation();
	});
	$(".para_switch").click(function (event) {
		if ($(this).hasClass("crossed")) {
			$(this).removeClass("crossed");
			$("html").bind("mousemove", parallax);
			seaBattleSettings.para = true;
		} else {
			$("html").unbind("mousemove", parallax);
			$(this).addClass("crossed");
			seaBattleSettings.para = false;
		}
		localStorage.seaBattleSettings = JSON.stringify(seaBattleSettings);
		event.stopPropagation();
	});
	var counterWinLoose, seaBattleSettings;
	if (localStorage.counterWinLoose) {
		counterWinLoose = JSON.parse(localStorage.counterWinLoose);
		$(".counter .win").html(counterWinLoose.win);
		$(".counter .loose").html(counterWinLoose.loose);
	} else {
		counterWinLoose = {
			win: 0,
			loose: 0
		};
		localStorage.counterWinLoose = JSON.stringify(counterWinLoose);
	}
	if (localStorage.seaBattleSettings) {
		seaBattleSettings = JSON.parse(localStorage.seaBattleSettings);
		if (!seaBattleSettings.sound) {
			$(".sound_switch").html("D");
		} else {
			$(".sound_switch").html("C");
		}
		if (!seaBattleSettings.language) {
			$(".language_switch").html("Ru");
		} else {
			$(".language_switch").html("Eng");
		}
		if (seaBattleSettings.para) {
			$(".para_switch").removeClass("crossed");
			$("html").bind("mousemove", parallax);
		} else {
			$("html").unbind("mousemove", parallax);
			$(".para_switch").addClass("crossed");
		}
		$(".background_sounds")[0].volume = seaBattleSettings.sound;
		EngRu(seaBattleSettings.language);
	} else {
		seaBattleSettings = {
			sound: 1,
			language: true,
			para: true
		};
		localStorage.seaBattleSettings = JSON.stringify(seaBattleSettings);
		if (isTouchDevice() === true) {
			$(".para_switch").trigger("click");
		}
	}
	$(window).resize(function () {
		info.massvKorableiVField.forEach(function (elem, ind, arr) {
			var tileToPlaceInMyField = $(".tile[data-tilenum=\"" + Math.min.apply(null, elem.zanyatie) + "\"]");
			var position = tileToPlaceInMyField.position();
			var width = tileToPlaceInMyField.width();
			var height = tileToPlaceInMyField.height();
			elem.samKorabl.css({
				"top": position.top - height - 1,
				"left": position.left - width - 1,
			});
		});
	});

	function isTouchDevice() {

		return true == ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
	}

	function trig() {
		soundEffect("splash");
		soundEffect("hit");
		soundEffect("kill");
		play_background_sounds_after_click();
		$(window).unbind("mousedown", trig);
	}
	var setShipsOnTiles = [];
	var infoEnemy = {
		killedShips: 0,
		massvKorableiVField: [],
		arrActive: (function () {
			var arrAct = [];
			for (var itr = 101; --itr;) {
				arrAct.unshift(itr);
			}
			return arrAct;
		})(),
		shootdirection: []
	};

	function createMatrix() {
		for (var lastElem = 10; lastElem--;) {
			var tempRow = [];
			for (var lastElem1 = 10; lastElem1--;) {
				tempRow.push(true);
			}
			setShipsOnTiles.push(tempRow);
		}
	}

	function setTenShips() {
		createMatrix();
		for (var korableiRaznixTipov = 4; korableiRaznixTipov > 0; korableiRaznixTipov--) {
			for (var korableiOdnogoTipa = 5 - korableiRaznixTipov; korableiOdnogoTipa--;) {
				if (placeShip(korableiRaznixTipov) === false) {
					return setTenShips();
				};
			}
		}
	}

	function placeShip(shipLength) {
		var posTiles = 10 - (shipLength - 1);

		function randomG() {
			var rand = Math.floor((Math.random() * posTiles * 10) + 1);
			var ryadov = (rand - (rand % posTiles)) / posTiles;
			return (ryadov * 10) + (rand % posTiles ? rand % posTiles : (-(shipLength - 1)));
		}

		function randomV() {
			return Math.floor((Math.random() * posTiles * 10) + 1);
		}
		if (Math.floor(Math.random() * 2)) {
			if (!checkGoriz(randomG(), posTiles, shipLength)) {
				if (!checkVert(randomV(), posTiles, shipLength)) {
					setShipsOnTiles = [];
					infoEnemy.massvKorableiVField = [];
					return false;
				}
			}
		} else {
			if (!checkVert(randomV(), posTiles, shipLength)) {
				if (!checkGoriz(randomG(), posTiles, shipLength)) {
					setShipsOnTiles = [];
					infoEnemy.massvKorableiVField = [];
					return false;
				}
			}
		}
	}

	function ifTempArrLengthIsLeng(tempArr, leng) {
		for (var itr2 = 0; itr2 < leng; itr2++) {
			setShipsOnTiles[tempArr[itr2][0]][tempArr[itr2][1]] = false;
		}
		for (var itr3 = 0; itr3 < leng; itr3++) {
			tempArr[itr3] = parseInt(tempArr[itr3][0] + "" + tempArr[itr3][1]) + 1;
		}
		var warpShipElement = {
			zanyatie: tempArr,
			marg: shipMargin(tempArr),
			podbitie: []
		}
		warpShipElement.marg.forEach(function (elem, ind, arr) {
			var marginCord = (elem - 1) + "";
			if (marginCord[1] !== undefined) {
				setShipsOnTiles[marginCord[0]][marginCord[1]] = false;
			} else {
				setShipsOnTiles[0][marginCord[0]] = false;
			}
		});
		infoEnemy.massvKorableiVField.push(warpShipElement);
	}

	function checkGoriz(nachalnayaTochka, posTiles, leng) {
		var tempArr = [];
		var x, y;
		var nachalnayaTochkaXY = nachalnayaTochka - 1;
		if (nachalnayaTochka - 1 >= 10 && nachalnayaTochka !== 100) {
			x = parseInt((nachalnayaTochkaXY + "")[0]);
			y = parseInt((nachalnayaTochkaXY + "")[1]);
		} else if (nachalnayaTochka === 100) {
			x = 9;
			y = 9;
		} else {
			x = 0;
			y = nachalnayaTochkaXY;
		}
		var i = x;
		var j = y;
		for (var itr = parseInt(x + "" + y); itr <= posTiles * 10; itr++) {
			if (j === posTiles + 1) {
				j = 0;
				i++;
			}
			if (i === 10) {
				break;
			}
			for (var itr1 = 0; itr1 < leng; itr1++) {
				if (setShipsOnTiles[i][j + itr1] === true) {
					tempArr.push([i, j + itr1]);
				}
				if (setShipsOnTiles[i][j + itr1] === false) {
					tempArr = [];
					break;
				}
			}
			if (tempArr.length === leng) {
				ifTempArrLengthIsLeng(tempArr, leng);
				return true;
			}
			j++;
		}
		i = x;
		j = y;
		for (var itr = parseInt(x + "" + y) - 1; itr >= 0; itr--) {
			if (j === -1) {
				j = posTiles - 1;
				i--;
			}
			if (i === -1) {
				break;
			}
			for (var itr1 = 0; itr1 < leng; itr1++) {
				if (setShipsOnTiles[i][j + itr1] === true) {
					tempArr.push([i, j + itr1]);
				}
				if (setShipsOnTiles[i][j + itr1] === false) {
					tempArr = [];
					break;
				}
			}
			if (tempArr.length === leng) {
				ifTempArrLengthIsLeng(tempArr, leng);
				return true;
			}
			j--;
		}
		return false;
	}

	function checkVert(nachalnayaTochka, posTiles, leng) {
		var tempArr = [];
		var x, y;
		var nachalnayaTochkaXY = nachalnayaTochka - 1;
		if (nachalnayaTochka - 1 >= 10 && nachalnayaTochka !== 100) {
			x = parseInt((nachalnayaTochkaXY + "")[0]);
			y = parseInt((nachalnayaTochkaXY + "")[1]);
		} else if (nachalnayaTochka === 100) {
			x = 9;
			y = 9;
		} else {
			x = 0;
			y = nachalnayaTochkaXY;
		}
		var i = x;
		var j = y;
		for (var itr = parseInt(x + "" + y); itr <= posTiles * 10; itr++) {
			if (i === posTiles) {
				i = 1;
				j++;
			}
			if (j === 10) {
				break;
			}
			for (var itr1 = 0; itr1 < leng; itr1++) {
				if (setShipsOnTiles[i + itr1][j] === true) {
					tempArr.push([i + itr1, j]);
				}
				if (setShipsOnTiles[i + itr1][j] === false) {
					tempArr = [];
					break;
				}
			}
			if (tempArr.length === leng) {
				ifTempArrLengthIsLeng(tempArr, leng);
				return true;
			}
			i++;
		}
		i = x;
		j = y;
		for (var itr = parseInt(x + "" + y) - 1; itr >= 0; itr--) {
			if (i === -1) {
				i = posTiles - 1;
				j--;
			}
			if (j === -1) {
				break;
			}
			for (var itr1 = 0; itr1 < leng; itr1++) {
				if (setShipsOnTiles[i + itr1][j] === true) {
					tempArr.push([i + itr1, j]);
				}
				if (setShipsOnTiles[i + itr1][j] === false) {
					tempArr = [];
					break;
				}
			}
			if (tempArr.length === leng) {
				ifTempArrLengthIsLeng(tempArr, leng);
				return true;
			}
			i--;
		}
		return false;
	}

	function shipMargin(zanM) {
		var zan = zanM.map(function (elem, index, arr) {
			return parseInt(elem);
		});
		zan = zan.sort(function (a, b) {
			return a - b
		});
		if (zan[1] - zan[0] > 7) {
			return zanVert(zan);
		} else {
			return zanGoriz(zan);
		}

		function zanGoriz(arrZan) {
			var marginArr = [];
			switch (true) {
				case (arrZan[0] === 1):
					arrZan.forEach(function (e, ind, arr) {
						marginArr.push(e + 10);
						if (ind === arr.length - 1) {
							marginArr.push(e + 1);
							marginArr.push(e + 11);
						}
					});
					break;
				case (arrZan[0] > 1 && arrZan[arrZan.length - 1] < 10):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 1);
							marginArr.push(e + 9);
						}
						marginArr.push(e + 10);
						if (ind === arr.length - 1) {
							marginArr.push(e + 1);
							marginArr.push(e + 11);
						}
					});
					break;
				case ((arrZan[0] - 1) % 10 === 0 && arrZan[0] !== 91):
					arrZan.forEach(function (e, ind, arr) {
						marginArr.push(e - 10);
						marginArr.push(e + 10);
						if (ind === arr.length - 1) {
							marginArr.push(e + 1);
							marginArr.push(e + 11);
							marginArr.push(e - 9);
						}
					});
					break;
				case (arrZan[arrZan.length - 1] === 10):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 1);
							marginArr.push(e + 9);
						}
						marginArr.push(e + 10);
					});
					break;
				case (arrZan[arrZan.length - 1] % 10 === 0 && arrZan[arrZan.length - 1] !== 100 && arrZan[arrZan.length - 1] !== 10):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 1);
							marginArr.push(e - 11);
							marginArr.push(e + 9);
						}
						marginArr.push(e - 10);
						marginArr.push(e + 10);
					});
					break;
				case (arrZan[arrZan.length - 1] === 100):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 1);
							marginArr.push(e - 11);
						}
						marginArr.push(e - 10);
					});
					break;
				case (arrZan[0] > 91 && arrZan[arrZan.length - 1] < 100):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 1);
							marginArr.push(e - 11);
						}
						marginArr.push(e - 10);
						if (ind === arr.length - 1) {
							marginArr.push(e + 1);
							marginArr.push(e - 9);
						}
					});
					break;
				case (arrZan[0] === 91):
					arrZan.forEach(function (e, ind, arr) {
						marginArr.push(e - 10);
						if (ind === arr.length - 1) {
							marginArr.push(e + 1);
							marginArr.push(e - 9);
						}
					});
					break;
				default:
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 1);
							marginArr.push(e - 11);
							marginArr.push(e + 9);
						}
						marginArr.push(e - 10);
						marginArr.push(e + 10);
						if (ind === arr.length - 1) {
							marginArr.push(e + 1);
							marginArr.push(e + 11);
							marginArr.push(e - 9);
						}
					});
			}
			return marginArr;
		}

		function zanVert(arrZan) {
			var marginArr = [];
			switch (true) {
				case (arrZan[0] === 1):
					arrZan.forEach(function (e, ind, arr) {
						marginArr.push(e + 1);
						if (ind === arr.length - 1) {
							marginArr.push(e + 10);
							marginArr.push(e + 11);
						}
					});
					break;
				case (arrZan[0] > 1 && arrZan[0] < 10):
					arrZan.forEach(function (e, ind, arr) {
						marginArr.push(e - 1);
						marginArr.push(e + 1);
						if (ind === arr.length - 1) {
							marginArr.push(e + 10);
							marginArr.push(e + 11);
							marginArr.push(e + 9);
						}
					});
					break;
				case ((arrZan[0] - 1) % 10 === 0 && arrZan[arrZan.length - 1] !== 91):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 10);
							marginArr.push(e - 9);
						}
						marginArr.push(e + 1);
						if (ind === arr.length - 1) {
							marginArr.push(e + 10);
							marginArr.push(e + 11);
						}
					});
					break;
				case (arrZan[0] === 10):
					arrZan.forEach(function (e, ind, arr) {
						marginArr.push(e - 1);
						if (ind === arr.length - 1) {
							marginArr.push(e + 10);
							marginArr.push(e + 9);
						}
					});
					break;
				case (arrZan[0] % 10 === 0 && arrZan[arrZan.length - 1] !== 100 && arrZan[0] !== 10):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 10);
							marginArr.push(e - 11);
						}
						marginArr.push(e - 1);
						if (ind === arr.length - 1) {
							marginArr.push(e + 10);
							marginArr.push(e + 9);
						}
					});
					break;
				case (arrZan[arrZan.length - 1] === 100):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 10);
							marginArr.push(e - 11);
						}
						marginArr.push(e - 1);
					});
					break;
				case (arrZan[arrZan.length - 1] > 91 && arrZan[arrZan.length - 1] < 100):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 10);
							marginArr.push(e - 11);
							marginArr.push(e - 9);
						}
						marginArr.push(e - 1);
						marginArr.push(e + 1);
					});
					break;
				case (arrZan[arrZan.length - 1] === 91):
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 10);
							marginArr.push(e - 9);
						}
						marginArr.push(e + 1);
					});
					break;
				default:
					arrZan.forEach(function (e, ind, arr) {
						if (ind === 0) {
							marginArr.push(e - 10);
							marginArr.push(e - 11);
							marginArr.push(e - 9);
						}
						marginArr.push(e - 1);
						marginArr.push(e + 1);
						if (ind === arr.length - 1) {
							marginArr.push(e + 10);
							marginArr.push(e + 11);
							marginArr.push(e + 9);
						}
					});
			}
			return marginArr;
		}
	}
	var sounds = {
		splash: $(".splash")[0],
		hit: $(".hit")[0],
		kill: $(".kill")[0],
		victory: $(".victory")[0],
		defeat: $(".defeat")[0]
	}

	function newRound() {
		info = {
			countOver: [],
			massvKorableiVField: [],
			countOvership: 0,
			killedShips: 0,
			arrActive: (function () {
				var arrAct = [];
				for (var itr = 101; --itr;) {
					arrAct.unshift(itr);
				}
				return arrAct;
			})(),
			shootdirection: []
		};
		infoEnemy = {
			killedShips: 0,
			massvKorableiVField: [],
			arrActive: (function () {
				var arrAct = [];
				for (var itr = 101; --itr;) {
					arrAct.unshift(itr);
				}
				return arrAct;
			})(),
			shootdirection: []
		};
		$(".oponent_field .tile").bind("click", clickOnTile);
		clearMyField();
		$(".stash_field").show();
		$(".stash_field .ship").show();
		$(".del_border").show();
		$(".tile").removeClass("missed_shoot");
		$(".tile").removeClass("hit_shoot");
		$(".oponent_field").hide();
		$(".oponent_field .ship").remove();
		$(".oponent_field").removeClass("my_turn");
		$(".my_field").removeClass("enemy_turn");
		clearMyField();
		$(".win_alert,.loose_alert").hide();
		$(".give_up").hide();
	}

	function newRoundImg() {
		setTimeout(newRound, 1700);
	}

	$(".win_alert,.loose_alert").click(newRoundImg);

	function soundEffect(soundsProperty, startTime, fulltrek) {
		$(sounds[soundsProperty]).stop();
		sounds[soundsProperty].pause();
		sounds[soundsProperty].currentTime = startTime ? startTime : 0;
		sounds[soundsProperty].volume = seaBattleSettings.sound;
		sounds[soundsProperty].play();
		if (!fulltrek) {
			$(sounds[soundsProperty]).animate({
				volume: 0
			}, 1000);
		}
	}

	function clickOnTile() {
		var clickedTileNumber = parseInt($(this).attr("data-tilenum"));
		var isActive = infoEnemy.arrActive.some(function (e, i, arr) {
			return e === clickedTileNumber;
		});
		$(this).unbind("click", clickOnTile);
		if (isActive) {
			infoEnemy.arrActive.splice(infoEnemy.arrActive.indexOf(clickedTileNumber), 1);
			var hitShipInd;
			var isInZanyatie = infoEnemy.massvKorableiVField.some(function (e, i) {
				if (e.zanyatie.some(function (elem, ind) {
						return elem === clickedTileNumber;
					})) {
					hitShipInd = i;
					return true;
				}
			});
			if (isInZanyatie) {
				infoEnemy.massvKorableiVField[hitShipInd].podbitie.push(clickedTileNumber);
				if (infoEnemy.massvKorableiVField[hitShipInd].podbitie.length === infoEnemy.massvKorableiVField[hitShipInd].zanyatie.length) {
					soundEffect("kill");
					infoEnemy.massvKorableiVField[hitShipInd].zanyatie.forEach(function (e) {});
					for (var iter = 0; iter < infoEnemy.massvKorableiVField[hitShipInd].marg.length; iter++) {
						var indOfMarg = infoEnemy.arrActive.indexOf(infoEnemy.massvKorableiVField[hitShipInd].marg[iter]);
						if (~indOfMarg) {
							$(".oponent_field .tile[data-tilenum=\"" + infoEnemy.massvKorableiVField[hitShipInd].marg[iter] + "\"]").addClass("missed_shoot");
							infoEnemy.arrActive.splice(indOfMarg, 1);
						}
					}
					var goriz;
					if (Math.max.apply(null, infoEnemy.massvKorableiVField[hitShipInd].zanyatie) - Math.min.apply(null, infoEnemy.massvKorableiVField[hitShipInd].zanyatie) > 7) {
						goriz = 1;
					} else {
						goriz = 0;
					}
					var cloneKilledShip = $(".stash_field .ship[data-shiptype=\"" + infoEnemy.massvKorableiVField[hitShipInd].zanyatie.length + "" + goriz + "\"]").clone();
					$(".oponent_field").append(cloneKilledShip);
					var tileToPlace = $(".oponent_field .tile[data-tilenum=\"" + infoEnemy.massvKorableiVField[hitShipInd].zanyatie[0] + "\"]")
					var position = tileToPlace.position();
					var width = tileToPlace.width();
					var height = tileToPlace.height();
					cloneKilledShip.css({
						"position": "absolute",
						"top": position.top - height - 1,
						"left": position.left - width - 1,
						"z-index": "1000"
					});
					cloneKilledShip.addClass("killed_ship" + goriz).show();
					if (++infoEnemy.killedShips === 10) {
						$(".win_alert").show();
						counterWinLoose.loose--;
						counterWinLoose.win++;
						localStorage.counterWinLoose = JSON.stringify(counterWinLoose);
						$(".counter .win").html(counterWinLoose.win);
						soundEffect("victory", 0, true);
					}
				} else {
					soundEffect("hit");
					$(this).addClass("hit_shoot");
				}
			} else {
				$(".oponent_field .tile").unbind("click", clickOnTile);
				soundEffect("splash");
				$(this).addClass("missed_shoot");
				setTimeout(function () {
					$(".oponent_field").removeClass("my_turn");
					$(".my_field").addClass("enemy_turn");
					engineShoot();
				}, 1000);
			}
		}
	}


	function engineShoot() {
		var shootTheTile;
		if (info.shootdirection.length === 0) {
			shootTheTile = info.arrActive.splice(Math.floor(Math.random() * info.arrActive.length), 1)[0];
		} else {
			var directionNum = Math.floor(Math.random() * info.shootdirection.length);
			shootTheTile = info.shootdirection[directionNum].splice(Math.floor(Math.random() * info.shootdirection[directionNum].length), 1)[0];
			info.arrActive.splice(info.arrActive.indexOf(shootTheTile), 1);
		}
		var hitShipInd1;
		if (info.massvKorableiVField.some(function (e, i) {
				if (e.zanyatie.some(function (elem, ind) {
						return elem === shootTheTile;
					})) {
					hitShipInd1 = i;
					return true;
				}
			})) {
			info.massvKorableiVField[hitShipInd1].podbitie.push(shootTheTile);
			if (info.massvKorableiVField[hitShipInd1].podbitie.length === info.massvKorableiVField[hitShipInd1].zanyatie.length) {

				if (Math.max.apply(null, info.massvKorableiVField[hitShipInd1].zanyatie) - Math.min.apply(null, info.massvKorableiVField[hitShipInd1].zanyatie) > 7) {
					goriz = 1;
				} else {
					goriz = 0;
				}
				info.massvKorableiVField[hitShipInd1].samKorabl.addClass("killed_ship" + goriz);
				info.massvKorableiVField[hitShipInd1].zanyatie.forEach(function (e) {});
				soundEffect("kill");
				for (var iter = 0; iter < info.massvKorableiVField[hitShipInd1].marg.length; iter++) {
					var indOfMarg = info.arrActive.indexOf(info.massvKorableiVField[hitShipInd1].marg[iter]);
					if (~indOfMarg) {
						$(".my_field .tile[data-tilenum=\"" + info.massvKorableiVField[hitShipInd1].marg[iter] + "\"]").addClass("missed_shoot");
						info.arrActive.splice(indOfMarg, 1);
					}
				}
				info.shootdirection = [];
				setTimeout(function () {
					if (++info.killedShips === 10) {
						$(".loose_alert").show();
						soundEffect("defeat", 0, true);
						$(".counter .loose").html(counterWinLoose.loose);
					} else {
						setTimeout(engineShoot, 1000);
					}
				}, 1000);
			} else {
				soundEffect("hit");
				$(".my_field .tile[data-tilenum=\"" + shootTheTile + "\"]").addClass("hit_shoot");
				var arrdirection = [];
				if (info.shootdirection.length === 0) {
					var checkVertShoot = [shootTheTile + 10, shootTheTile - 10].filter(function (e, i) {
						return !!~info.arrActive.indexOf(e);
					}).filter(function (e, i) {
						return !!~info.massvKorableiVField[hitShipInd1].marg.indexOf(e) || !!~info.massvKorableiVField[hitShipInd1].zanyatie.indexOf(e);
					});
					if (checkVertShoot.length !== 0) {
						arrdirection.push(checkVertShoot);
					}
					var checkGorigShoot = [shootTheTile + 1, shootTheTile - 1].filter(function (e, i) {
						return !!~info.arrActive.indexOf(e);
					}).filter(function (e, i) {
						return !!~info.massvKorableiVField[hitShipInd1].marg.indexOf(e) || !!~info.massvKorableiVField[hitShipInd1].zanyatie.indexOf(e);
					});
					if (checkGorigShoot.length !== 0) {
						arrdirection.push(checkGorigShoot);
					}
					info.shootdirection = arrdirection;
				} else {
					if (Math.max.apply(null, info.massvKorableiVField[hitShipInd1].podbitie) - Math.min.apply(null, info.massvKorableiVField[hitShipInd1].podbitie) > 7) {
						arrdirection = [Math.min.apply(null, info.massvKorableiVField[hitShipInd1].podbitie) - 10, Math.max.apply(null, info.massvKorableiVField[hitShipInd1].podbitie) + 10].filter(function (e, i) {
							return !!~info.arrActive.indexOf(e);
						}).filter(function (e, i) {
							return !!~info.massvKorableiVField[hitShipInd1].marg.indexOf(e) || !!~info.massvKorableiVField[hitShipInd1].zanyatie.indexOf(e);
						});
						if (arrdirection.length !== 0) {
							info.shootdirection = [arrdirection];
						}
					} else {
						arrdirection = [Math.min.apply(null, info.massvKorableiVField[hitShipInd1].podbitie) - 1, Math.max.apply(null, info.massvKorableiVField[hitShipInd1].podbitie) + 1].filter(function (e, i) {
							return !!~info.arrActive.indexOf(e);
						}).filter(function (e, i) {
							return !!~info.massvKorableiVField[hitShipInd1].marg.indexOf(e) || !!~info.massvKorableiVField[hitShipInd1].zanyatie.indexOf(e);
						});
						if (arrdirection.length !== 0) {
							info.shootdirection = [arrdirection];
						}
					}
				}
				setTimeout(engineShoot, 1000);
			}
		} else {
			$(".my_field .tile[data-tilenum=\"" + shootTheTile + "\"]").addClass("missed_shoot");
			soundEffect("splash");
			if (info.shootdirection.length !== 0) {
				if (info.shootdirection[0].length === 0) {
					info.shootdirection.splice(0, 1);
				} else if (info.shootdirection.length > 1 && info.shootdirection[1].length === 0) {
					info.shootdirection.splice(1, 1);
				}
			}
			setTimeout(function () {
				$(".oponent_field").addClass("my_turn");
				$(".my_field").removeClass("enemy_turn");
				$(".oponent_field .tile").bind("click", clickOnTile);
			}, 1000);
		}
		return;
	}
});