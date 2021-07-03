window.onload = function m() {
    cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        let s = 'cards/' + cards[i].getAttribute('id') + '.png';
        cards[i].setAttribute('src', s);
    }
    eel.expose(start_hands_js);

    function start_hands_js(p1, p2) {
        arr = []
        for (let i = 0; i < p1.length; i++) {
            let c1 = document.querySelector('#' + p1[i]);
            let c2 = document.querySelector('#' + p2[i]);
            c1.setAttribute('style', 'visibility: visible;' + 'top:auto;bottom:180px;left:auto;right:50px;z-index:' + (100 - i));
            // c2.setAttribute('src', 'cards/rev.png');
            c2.setAttribute('style', 'visibility: visible;' + 'top:auto;bottom:180px;right;left:auto;right:50px;z-index:' + (100 - i));
            arr.push(c1);
            arr.push(c2);

        }
        let back = document.querySelector('#back');
        w = back.clientWidth;
        h = back.clientWidth;
        anime({
            targets: arr, duration: 3000 / 12, easing: 'easeInOutQuad', autoplay: true,
            bottom: function (el, i, l) {
                return (i % 2 == 0) ? 5 : 'auto';
            },
            top: function (el, i, l) {
                return (i % 2 == 1) ? 5 : 'auto';
            },

            translateX: function (el, i, l) {
                return -Math.floor(((l + i) / 2) - 2) * 4 / 6 * 60;
            },
            rotate: 720,
            delay: function (el, i, l) {
                return i * 100;
            },
            endDelay: function (el, i, l) {
                return (l - i) * 100;
            }
        });

    }
    var av_card_anime;

    eel.expose(highlight_av_att_cards_js);
    function highlight_av_att_cards_js(att_cards) {
        for (let i = 0; i < att_cards.length; i++) {
           $('#' + att_cards[i]).toggleClass('att_available');
        }
         av_card_anime=anime({
            targets:document.getElementsByClassName('att_available') , duration: 700, easing: 'easeInOutQuad', autoplay: false, loop: true, direction: 'alternate',
            translateY: -10
        });
        av_card_anime.play();
    }

    eel.expose(coloda_js);

    function coloda_js(coloda) {
        for (let i = 0; i < coloda.length; i++) {
            d = document.querySelector('#' + coloda[i]);
            if (i == 0) {
                d.setAttribute('style', 'visibility: visible;' + 'top:auto;bottom:180px;left:auto;right:70px; transform: rotate(-90deg);z-index:' + i);
            } else {
                d.setAttribute('src', 'cards/rev.png');
                d.setAttribute('style', 'visibility: visible;' + 'top:auto;bottom:180px;left:auto;right:50px;z-index:' + i);
            }
        }
    }

    var res = true;
    var c = []
    eel.expose(choose_att_card_js);

    function choose_att_card_js(av_to_attack) {
        let end_move = document.querySelector('#end_move');
        let cancel = document.querySelector('#cancel');
        $(end_move).unbind('click');
        $(end_move).on('click', function () {
            res = false;
            anime({
                targets: document.getElementsByClassName('choosen'),duration:400,autoplay: true,easing: 'easeInOutQuad',
                bottom: '40%',
            });
            $('.choosen').removeClass('choosen');
            av_card_anime.pause();

            att_avv=document.getElementsByClassName('att_available');
            for (let i = 0; i < att_avv.length; i++) {
                att_avv[i].classList.removeClass("att_available");
            }
        });
        // для каждого доступной карты по клику добавляем класс css choosen и  добавляем в с
        for (let i = 0; i < av_to_attack.length; i++) {
            $("#" + av_to_attack[i]).unbind('click');
            $("#" + av_to_attack[i]).on("click", function () {
                // Do stuff, get id of image perhaps?
                if ($(this).hasClass('choosen')) {
                    $(this).removeClass('choosen');
                    delete c[c.indexOf($(this).attr('id'))];
                } else {
                    $(this).toggleClass('choosen');
                    c.push($(this).attr('id'));
                }
            });
        }
        let c_f = []

        for (let i = 0; i < c.length; i++) {
            if (c[i] != undefined) {
                c_f.push(c[i]);
            }
        }
        return [res, c_f]

    }

    var def_end=false;
    var c_d
    eel.expose(choose_def_card_js);
    function choose_def_card_js(card_to_beat,av_cards) {
            if( ! $('#'+card_to_beat).hasClass('must_beat')){
            $('#'+card_to_beat).toggleClass('must_beat');
            }
        for (let val of av_cards) {
            if( ! $('#'+val).hasClass('beat')){
            $('#'+val).toggleClass('beat');
            }
            $('#'+val).unbind('click');
            $("#" +val).on("click", function () {
                     $('#'+card_to_beat).removeClass('must_beat');
                     $('#'+val).removeClass('beat');
                     def_end=true;
                     c_d=val;
                     alert(document.querySelector('#'+val).offsetLeft)
                     dx=document.querySelector('#'+card_to_beat).getBoundingClientRect().left-document.querySelector('#'+val).getBoundingClientRect().left;
                     dy=document.querySelector('#'+card_to_beat).getBoundingClientRect().top-document.querySelector('#'+val).getBoundingClientRect().top;;
                     alert(dx+' '+dy);
                     anime({
                        targets:document.querySelector('#'+val),duration:1000,easing: 'easeInOutQuad',
                         translateY: dy,
                         translateX: dx
                     });
                 });
            }
        return [def_end,c_d];
        }


}



