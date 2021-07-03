window.onload = async function m(){
    var images_names = await eel.get_card_names()();
    var can = document.getElementById("can");
    var ctx = can.getContext('2d');
    ctx.save();
    can.width = 480, can.height = 320;
    var card_im = []
    var rev_card=new Image();
    rev_card.src='cards/rev.PNG';
    images_names.val.forEach(name=>{
        let im=new Image();
        im.src='cards/'+name;
        card_im.push(im);
    })
    var back = new Image();
    var  param;
    var player={'cards':[]};
    var opponent={'cards':[]};
    var last_card=new Image();
    back.src = 'table.png';
    back.onload =async function () {
        param=await eel.start_game()();
        let ind=await eel.get_ind_from_val(images_names.val,param.last_card)();
        last_card=card_im[ind];
        game();
    }

    async function update(param) {
       while (player.cards.length<12){
            val = param.cards[param.cards.length-1]
            let ind=await eel.get_ind_from_val(images_names.val,val)();
            param.cards.pop();
            player.cards.push(card_im[ind]);
        }
        while (opponent.cards.length<6){
            val=param.cards[param.cards.length-1]
            let ind=await eel.get_ind_from_val(images_names.val,val)();
            param.cards.pop()
            opponent.cards.push(card_im[ind]);
        }
     }

    function render() {
        ctx.drawImage(back, 0, 0, can.width, can.height);
        draw_cards(ctx,player.cards,opponent.cards);

    }

    async function game() {
        await update(param);
        render();
        requestAnimationFrame(game);
    }
    var dr=1;
    function draw_cards(ctx,p_cards,o_cards){
        width=can.width/2;
        heigth=can.height/7;
        heigth_card=can.height/5;
        width_card=width/5;
        start_width=width/3;
        p_num_cards=p_cards.length;
        o_num_cards=o_cards.length;
        kp=p_num_cards/6;
        ko=o_num_cards/6;
        for (let i = 0; i < p_cards.length; i++) {
            ctx.drawImage(p_cards[i],start_width+width_card*i/(kp*1.03),can.height-heigth*2,width_card,heigth_card)
        }
        for (let i = 0; i < o_cards.length; i++) {
            ctx.drawImage(rev_card,start_width+width_card*i/(ko*1.03),heigth-0.6*heigth,width_card,heigth_card)
        }
        ctx.save();
        ctx.translate(width, heigth);
        ctx.rotate(Math.PI/2); // rotate
        ctx.drawImage(last_card,width/2-30,-150,width_card,heigth_card); // draws a chain link or dagger
        ctx.restore();
        for (let i = 0; i < param.cards.length; i++) {
            ctx.drawImage(rev_card,1.5*width-width_card*(i/param.cards.length)/10,can.height*0.4,width_card,heigth_card)
        }


    }

}




