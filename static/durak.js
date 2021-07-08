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
        av_card_anime = anime({
            targets: document.getElementsByClassName('att_available'),
            duration: 700,
            easing: 'easeInOutQuad',
            autoplay: false,
            loop: true,
            direction: 'alternate',
            translateY: -10
        });
        av_card_anime.play();
    }

    eel.expose(remove_css_at_av);

    function remove_css_at_av() {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].classList.contains('att_available')) {
                cards[i].classList.remove('att_available');
            }
            if (cards[i].classList.contains('choosen')) {
                cards[i].classList.remove('choosen');
            }
        }
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

    var res = {v: true};
    var c_a = {v: []}
    eel.expose(set_res_true);//обнуляем res b c
    function set_res_true() {
        res.v = true;
        c_a.v = []
    }

    eel.expose(choose_att_card_js);

    function choose_att_card_js(av_to_attack) {
        let end_move = document.querySelector('#end_move');
        let cancel = document.querySelector('#cancel');
        $(end_move).unbind('click');
        $(end_move).on('click', function () {
            res.v = false;
            anime({
                targets: document.getElementsByClassName('choosen'),
                duration: 400,
                autoplay: true,
                easing: 'easeInOutQuad',
                bottom: '40%',
            });
            $(this).removeClass('choosen');
            av_card_anime.pause();
            remove_css_at_av();
        });
        // для каждого доступной карты по клику добавляем класс css choosen и  добавляем в с
        for (let i = 0; i < av_to_attack.length; i++) {
            $("#" + av_to_attack[i]).unbind('click');
            $("#" + av_to_attack[i]).on("click", function () {
                // Do stuff, get id of image perhaps?
                if ($(this).hasClass('choosen')) {
                    $(this).removeClass('choosen');
                    delete c_a.v[c_a.v.indexOf($(this).attr('id'))];
                } else {
                    $(this).toggleClass('choosen');
                    c_a.v.push($(this).attr('id'));
                }
            });
        }
        return [res.v, c_a.v];
    }


    var def_end = {v: false};
    var c_d = {v: ''};

    eel.expose(set_def_false);//обнуляем def  c
    function set_def_false() {
        def_end.v = false;
        c_d.v = []
    }

    eel.expose(choose_def_card_js);

    function choose_def_card_js(card_to_beat, av_cards) {
        if (!$('#' + card_to_beat).hasClass('must_beat')) {
            $('#' + card_to_beat).toggleClass('must_beat');
        }
        for (let val of av_cards) {
            if (!$('#' + val).hasClass('beat')) {
                $('#' + val).toggleClass('beat');
            }
            $('#' + val).unbind('click');
            $("#" + val).on("click", function () {
                c_d.v = val;
                dx = document.querySelector('#' + card_to_beat).getBoundingClientRect().left - document.querySelector('#' + val).getBoundingClientRect().left;
                dy = document.querySelector('#' + card_to_beat).getBoundingClientRect().top - document.querySelector('#' + val).getBoundingClientRect().top;
                ;
                anime({
                    targets: this, duration: 1000, easing: 'linear',
                    translateY: dy,
                    translateX: -100
                });
                def_end.v = true;
            });
        }
        return [def_end.v, c_d.v];
    }

    eel.expose(remove_css_def);

    function remove_css_def() {
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].classList.contains('beat')) {
                cards[i].classList.remove('beat');
            }
            if (cards[i].classList.contains('must_beat')) {
                cards[i].classList.remove('must_beat');
            }
        }

    }
    eel.expose(add_out);//Убираем побитые карты
    function add_out(arr){
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < cards.length; j++) {
                if(cards[j].id==arr[i]){
                    cards[j].setAttribute('style', 'visibility:hidden;');
                    cards[j].classList.add('out');
                }
            }
        }
    }

    eel.expose(take_coloda_cards);
    function take_coloda_cards(p1,p2,take_p1,take_p2){
        p1_arr=[];
        p2_arr=[];
        p1_take=[];
        p2_take=[];
        for (let i = 0; i < p1.length; i++) {
            let c1 = document.querySelector('#' + p1[i]);
            p1_arr.push(c1);
        }
        for (let i = 0; i < p2.length; i++) {
            let c2 = document.querySelector('#' + p2[i]);
            p2_arr.push(c2);
        }
        for (let i = 0; i < take_p1.length; i++) {
            let c1 = document.querySelector('#' + take_p1[i]);
            p1_take.push(c2);
        }
        for (let i = 0; i < take_p2.length; i++) {
            let c2 = document.querySelector('#' + take_p2[i]);
            p2_take.push(c2);
        }

    }


}



