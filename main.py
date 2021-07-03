import os
import random
import eel
import game_loop

@eel.expose
def get_card_names():
    cards= os.listdir('static/cards')
    cards_dict = {}
    for i in cards:
        cards_dict[i.split('.')[0]]=i
    res={'val':list(cards_dict.values()),'cards':cards_dict}
    print(res)
    return res

@eel.expose
def start_game():
    cards=os.listdir('static/cards')
    cards.remove('rev.PNG')
    # for i in range(len(cards)):
    #     cards[i]=cards[i].split('.')[0]
    random.shuffle(cards)
    last_card=cards[0]
    cozyr=last_card[0][0]
    print('start_game',cards)
    return {'cards':cards,'cozyr':cozyr,'last_card':last_card}
@eel.expose
def get_ind_from_val(mas:list,val):
    return mas.index(val)

def  my_other_thread():
       game_loop.game_start()


if __name__ == '__main__':
    start_game()
    eel.init('static')
    eel.spawn(my_other_thread)
    eel.start('index.html',size=(640,480))

