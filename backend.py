import os
import cv2
import constants as con
if not os.path.isdir('static/cards'):
    os.mkdir('static/cards')

im= cv2.imread('static/card_sheet.png')
os.chdir('static/cards')
h,w,c=im.shape
for i,i_n in zip(range(4),'hbcp'):
    for j,j_n in zip(range(13),con.card_val):
        c_w=int(w/13)
        c_h=int(h/4)
        card=im[i*c_h :(i+1)*(c_h),j*c_w:(j+1)*(c_w)]
        cv2.imwrite(f'{i_n}{j_n}.png',card)
