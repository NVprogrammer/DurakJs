import constants
import random


class Player():
    def __init__(self, name, sheet, coz):
        self.cards = []
        self.name = name
        self.who_move = 0
        self.decisions = {0: 'attack', 1: 'defence', 2: 'take', 3: 'wait', 4: 'end_move'}
        self.end_move = False
        self.awaiting = False
        self.first_attack_move = False
        self.sheet = sheet
        self.coz = coz
        self.take_card=False
        self.plant=[]

    def get_card(self, card: list):
        while (self.cards.__len__() < 6):
            self.cards.append(card.pop())

    def wait_an(self):
        pass

    def add_after_take(self,board):
        av_to_attack = []
        values = []
        at = board['attack'].copy()
        de = board['defence'].copy()
        all = at + de
        for i in all:
            values.append(i)
        values = set(values)
        for i in values:
            for j in self.cards:
                if (j.__contains__(i[1:])):
                    av_to_attack.append(j)
        av_to_attack = list(set(av_to_attack))
        if(len(av_to_attack)==0):return
        print(self.name, ' attack', av_to_attack,self.cards)
        def two_more_cards(att):  # проверка на законность атаковать 2+ картами одновременно
            b = True
            f = att[0][1:]
            for i in att:
                if (not i[1:] == f):
                    b = False
                    break
            return b
        c=input('Добавить карты сопернику ').split(' ')

        if (c.__len__() > 1):
            if (two_more_cards(c)):
                self.plant+=c
            else:
                print('Разные значения карт')
        elif (c.__len__() == 1):
            self.plant+= c
        else:
            print('Вы не ввели карты')

    def make_move(self, board: dict, move_style):
        if (move_style == 0):
            self.attack(board)
        if (move_style == 1):
            self.defence(board, self.sheet, self.coz)

    def take(self, board):
        for i in board['attack'] + board['defence']:
            self.cards.append(i)
        # board['attack'].clear()
        # board['defence'].clear()
        self.end_move = True
        self.take_card=True

    def defence(self, board, sheet, coz):
        av_defence = {}
        CAN_BEAT = True

        def can_beat(a, b) -> bool:
            if ((a[0] == b[0] or a[0] == coz) and (sheet[a] > sheet[b])):
                # print(a, b, sheet[a], sheet[b])
                return True
            else:
                return False

        already_beat = board['defence'].__len__()
        num = 1
        for i in board['attack']:
            # print('here',num,already_beat)
            if (num <= already_beat):
                num += 1
                continue
            av_defence[i] = []
            num += 1
            for j in self.cards:
                if (can_beat(j, i)):
                    av_defence[i].append(j)
            if (av_defence[i].__len__() == 0):
                CAN_BEAT = False
                break
        print(self.name,'defence')
        print(av_defence)

        if (CAN_BEAT):
            t=input('Взять или бить?(t or d) ')
            if(t=='d'):
                for i in av_defence.keys():
                    de = input("Выберите какой картой бить %s " % i)
                    if (de in av_defence[i]):
                        board['defence'].append(de)
                        self.cards.pop(self.cards.index(de))
                self.end_move = True
            else:
                self.take(board)
        else:
            self.take(board)
        print(board)

    def attack(self, board):
        av_to_attack = []

        def two_more_cards(att):  # проверка на законность атаковать 2+ картами одновременно
            b = True
            f = att[0][1:]
            for i in att:
                if (not i[1:] == f):
                    b = False
                    break
            return b

        if (board['attack'].__len__() == 0 and board['defence'].__len__() == 0):
            av_to_attack.clear()
            av_to_attack = [i for i in self.cards]
        else:
            av_to_attack.clear()
            values = []
            at = board['attack'].copy()
            de = board['defence'].copy()
            all = at + de
            # print('all', all)
            for i in all:
                values.append(i)
            values = set(values)
            for i in values:
                for j in self.cards:
                    if (j.__contains__(i[1:])):
                        av_to_attack.append(j)
            av_to_attack = list(set(av_to_attack))
        print(self.name, ' attack', av_to_attack)

        if(not self.first_attack_move and len(board['attack'])==0 and len(board['defence'])==0):# подбрасывать карты когда соперник взял
            c = input("Выберите какие карты подбросить").split(' ')
            self.plant=c
            self.end_move = True
            self.awaiting = False
            return

        if (not self.first_attack_move):
            dec = input('Закончить ход? ')
            if (dec == 'y'):
                self.end_move = True
                self.awaiting=False
                return
            if (dec == 'n'):
                self.awaiting = True
        else:
            self.awaiting = True
        if (self.first_attack_move): self.first_attack_move = False
        c = input("Выберите карты для атаки ").split(' ')
        print('c', c)
        if (c.__len__() > 1):
            if (two_more_cards(c)):
                board['attack'] = board['attack'] + c
                for i in c:
                    self.cards.pop(self.cards.index(i))
            else:
                print('Разные значения карт')
        elif (c.__len__() == 1):
            board['attack'] = board['attack'] + c
            for i in c:
                self.cards.pop(self.cards.index(i))
        else:
            print('Вы не ввели карты')


class Game():
    def create_sheet(self, cards, coz):
        sheet = {}
        for i in cards:
            point = 0
            if (i[1:] == 'T'):
                point = 14
            elif (i[1:] == 'J'):
                point = 11
            elif (i[1:] == 'Q'):
                point = 12
            elif (i[1:] == 'K'):
                point = 13
            else:
                point = int(i[1:])
            if (i[0] == coz):
                point += 100
            sheet[i] = point
        return sheet

    def get_sheet(self):
        return self.sheet

    def __init__(self):
        random.seed(3)
        self.start_cards = constants.cards
        random.shuffle(self.start_cards)
        self.coz = self.start_cards[0][0]
        self.who_first = 0
        self.who_move = 0
        self.move_number = 1
        self.game_over = False
        self.move_style = 0
        self.board = {'attack': [], 'defence': []}
        self.sheet = self.create_sheet(self.start_cards, self.coz)
        self.plant_board=[]

    def give_start_cards(self, p1: Player, p2: Player):
        while (len(p1.cards) < 6 and len(p2.cards) < 6):
            p1.cards.append(self.start_cards.pop())
            p2.cards.append(self.start_cards.pop())
            p1.who_move = 1
            p2.who_move = 2

    def board_clear(self):
        for i in self.board.keys():
            self.board[i].clear()

    def reset(self,p1:Player,p2:Player):
        p1.end_move = False
        p1.awaiting = False
        p1.first_attack_move = False
        p1.take_card=False
        p2.end_move = False
        p2.awaiting = False
        p2.first_attack_move = False
        p2.take_card=False
        p1.plant.clear()
        p2.plant.clear()
        self.board_clear()

    def move(self, p1: Player, p2: Player):
        self.reset(p1,p2)

        if (self.move_number % 2 == 1):
            self.who_move = 1
        else:
            self.who_move = 2
        if (self.who_move == 1):
            p1.first_attack_move = True
            while (not p1.end_move):
                if(p2.take_card==True):
                    print('p2 take card')
                    p1.add_after_take(self.board)
                    p1.end_move=True
                    continue
                p1.make_move(self.board, 0)  # attack
                print('board:', self.board['attack'], self.board['defence'])
                if (p1.awaiting):
                    print('wait')
                    p2.end_move = False
                    while (not p2.end_move):
                        p2.make_move(self.board, 1)  # defence
        else:
            p2.first_attack_move = True
            while (not p2.end_move):
                if (p1.take_card == True):
                    print('p1 take card')
                    p2.add_after_take(self.board)
                    p2.end_move = True
                    continue
                p2.make_move(self.board, 0)  # attack
                print('board:', self.board['attack'], self.board['defence'])
                if (p2.awaiting):
                    p1.end_move = False
                    while (not p1.end_move):
                        p1.make_move(self.board, 1)  # defence
        print('plant',p1.plant,p2.plant)
        if(len(p1.plant)>0):#подкидывание  карт когда противник взял
            for i in p1.plant:
                p2.cards.append(p1.cards.pop(p1.cards.index(i)))
        elif(len(p2.plant)>0):
            for i in p2.plant:
                p1.cards.append(p2.cards.pop(p2.cards.index(i)))

        if ((p1.cards.__len__() == 0 or p2.cards.__len__() == 0) and self.start_cards.__len__() == 0):
            game.game_over = True
        else:
            if(self.who_move==1 and not p1.take_card):
                p1.get_card(self.start_cards)
                p2.get_card(self.start_cards)
            else:
                p2.get_card(self.start_cards)
                p1.get_card(self.start_cards)
        print(p1.take_card,p2.take_card)
        if(p1.take_card or p2.take_card):
            self.move_number += 2
        else:
            self.move_number+=1


    def move_is_available(self) -> bool:
        pass


game = Game()
p1 = Player('Nick', game.sheet, game.coz)
p2 = Player('Anna', game.sheet, game.coz)
print(game.start_cards)
game.give_start_cards(p1, p2)
print('coz', game.coz, '\np1', p1.cards, 'p2\n', p2.cards, '\n', '#' * 30)
while (not game.game_over):
    print('Ход № ',game.move_number)
    print('p1 ', p1.cards, '\n','p2', p2.cards, '\n',game.start_cards,game.start_cards.__len__(),'\n', '#' * 30)
    game.move(p1, p2)
    print('#'*50)
