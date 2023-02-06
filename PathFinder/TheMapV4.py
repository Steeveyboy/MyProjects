#this is a try at pygame
import pygame as pg
from pygame.locals import *
import time

import TheNode as Node

red = (255,0,0)
blue = (0,0,255)
yellow = (0,255,0)
black = (0,0,0)
white = (255,255,255)
orange = (255, 150, 0)
turquoise = (64,224,208)


class TheMap:
    def quitMap(self):
        pg.quit()

    def SetStart(self, pos):
        x, y = pos
        if self.mat[x][y].value != "Start" and self.start == None:
            self.mat[x][y].setValue("Start")
            pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x), (32*y),32,32))
            self.start = self.mat[x][y]
            self.mat[x][y].setDist(0)
            self.mat[x][y].setGScore(0)
            pg.display.update()
            return(True)

        elif self.mat[x][y].value == "Start":
            self.mat[x][y].setValue("Open")
            self.mat[x][y].setDist(float('inf'))
            pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x), (32*y),32,32))
            pg.draw.rect(self.Frame, (0,0,0), ((32*x), (32*y),32,32), 1)
            self.start = None
            pg.display.update()
            return(True)
        
        return(False)

    def SetBloc(self, pos):
        x, y = pos
        self.mat[x][y].setValue("Bloc")
        pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x),(32*y),32,32))
        pg.display.update()

    def setBest(self, pos):
        x, y = pos
        self.mat[x][y].setValue("Best")
        pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x),(32*y),32,32))
        pg.display.update()
 
    def setCrossed(self, pos):
        x, y = pos
        self.mat[x][y].setValue("Crossed")
        pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x),(32*y),32,32))
        pg.display.update()

    def setChecked(self, pos):
        x, y = pos
        if self.mat[x][y].value is "Start":
            #print("nope")
            return
        self.mat[x][y].setValue("Checked")
        pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x),(32*y),32,32))
        pg.display.update()

    def SetEnd(self, pos):
        x, y = pos
        
        if self.mat[x][y].value != "End" and self.end == None:
            self.mat[x][y].setValue("End")
            pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x), (32*y),32,32))
            self.end = self.mat[x][y]

        elif self.mat[x][y].value == "End":
            self.mat[x][y].setValue("Open")
            pg.draw.rect(self.Frame, self.mat[x][y].colour, ((32*x), (32*y),32,32))
            pg.draw.rect(self.Frame, (0,0,0), ((32*x), (32*y),32,32), 1)
            self.end = None
        
        pg.display.update()

    def setNext(self, pos):
        x, y = pos
        #pg.draw.circle(self.Frame, (0,0,0), ((32*x + 16), (32*y + 16)), 10, 4)
        pg.draw.rect(self.Frame, (0, 200, 0), ((32*x), (32*y),32,32))
        pg.display.update()

    def displayScore(self, node):
        x, y = node.getPos()
        myfont = pg.font.Font('freesansbold.ttf', 12)
        myffont = pg.font.Font('freesansbold.ttf', 8)
        text = myfont.render(str(node.getDist()), True, (0,0,0))
        textf = myffont.render(str(node.getGScore()), True, (0,0,0))
        texth = myffont.render(str(node.getHScore()), True, (0,0,0))

        textfRect = text.get_rect()
        textfRect.center = (32*x+16, 32*y+8)

        textRect = text.get_rect()
        textRect.center = (32*x+16, 32*y+16)

        textHRect = text.get_rect()
        textHRect.center = (32*x+16, 32*y+26)

        self.Frame.blit(text, textRect)
        self.Frame.blit(textf, textfRect)
        self.Frame.blit(texth, textHRect)

        pg.display.update()


    def getPos(self, pos):
        x, y = pos
        
        xVal = x // 32
        yVal = y // 32

        pos = (xVal, yVal)
        
        return(pos)


    def getMat(self):
        return(self.mat)
        

    def __init__(self, rows, cols):
        self.start = None
        self.end = None

        #cols = 16
        #rows = 16
        self.root = pg.init()
        Frame = pg.display.set_mode((32*cols,32*rows))
        self.Frame = Frame
        pg.display.set_caption("Pathfinding")
        white = (255,255,255)
        Frame.fill(white)
        pg.display.update()
        
        #Setting up the Frame
        self.mat = []
        for c in range(cols):
            self.x = []
            for r in range(rows):
                pg.draw.rect(Frame, (0,0,0), ((32*c),32*r,32,32), 1)
                node = Node.Node()
                node.setValue("Open")
                node.setCord([32*c, 32*r])
                self.x.append(node)
                #pg.display.update()
            self.mat.append(self.x)

        for r in range(rows):
                self.mat[0][r].setValue("Bloc")
                pg.draw.rect(self.Frame, self.mat[0][r].colour, ((0),(32*r),32,32))
                self.mat[cols-1][r].setValue("Bloc")
                pg.draw.rect(self.Frame, self.mat[cols-1][r].colour, ((32*(cols-1)),(32*r),32,32))

        for c in range(cols):
                self.mat[c][0].setValue("Bloc")
                pg.draw.rect(self.Frame, self.mat[c][0].colour, ((32*c),(0),32,32))
                self.mat[c][rows-1].setValue("Bloc")
                pg.draw.rect(self.Frame, self.mat[c][rows-1].colour, ((32*c),32*(rows-1),32,32))


        pg.display.update()
                    
