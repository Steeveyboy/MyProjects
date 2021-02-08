import TheMapV4 as Map
import TheNode
import time
import math
import pygame as pg
from pygame.locals import *

class pathfinder():

    def startPath(self, initial):
        
        
        self.openSet = [initial]
        #I will make a function called get best node
        #I could implement a sorted linked list or sorted set.
        best = initial
        
        #self.currentSet = self.survey(best)
        #self.evaluate(initial)

        running = True
        while running:
            time.sleep(0.05)
            self.currentSet = self.survey(best)
            self.evaluate(best)
            self.openSet.extend(self.currentSet)
            #print(best.getPos(), best.getFScore(), best.getDist())
            self.Map.setChecked(best.getPos())
            
            self.openSet.remove(best)
            #cBest = self.findBest(currentSet)
            best = self.findBest(self.openSet)
            if(best.value=="End"):
               #print("end")
                self.drawShortest(best)
                return()

        return(False)

    def findBest(self, ls, currBest=None):
        print(len(ls), "This is the length")
        if(currBest == None):
            best = ls[0]
        else:
            best = currBest
        
        for i in ls:
            if(best.getDist() >= i.getDist()):
                if(self.getHScore(best)>self.getHScore(i)):
                    best = i
        
        #print(best.getPos(), best.getDist(), best.getGScore())
        return(best)

    def getHScore(self,node):
        x,y = node.getPos()
        ex,ey = self.end
        hScore = math.sqrt(pow((x-ex),2)+pow((y-ey),2))
        return(hScore)

    def drawShortest(self, end):
        #print(self.start, end.getPos(), end.getFScore())
        
        x, y = end.getPos()
        nodes = moves = [self.Map.mat[x][y-1], self.Map.mat[x][y+1], self.Map.mat[x-1][y], self.Map.mat[x+1][y]]
        
        for i in nodes:    
            #print(i.getPos(), i.getGScore())
            if i.getGScore() == 0:
                #print("returning")
                return(True)
            elif i.getGScore() < end.getGScore():# and i.getValue()=="Checked":
                time.sleep(0.05)
                self.Map.setBest(i.getPos())
                return(self.drawShortest(i))
                

        return()

    def evaluate(self, center):
        for i in self.currentSet:
            if(i.value=="End"):
                i.setDist(0)
                return()
            FScore = (center.getGScore()+1.0 + self.getHScore(i))
            if(i.getDist()>FScore):
                i.setDist(FScore)
                i.setGScore(center.getGScore()+1.0)
            
        

    def survey(self, a):
        
        x, y = a.getPos()
        
        moves = [self.Map.mat[x][y-1], self.Map.mat[x][y+1], self.Map.mat[x-1][y], self.Map.mat[x+1][y]]
        openMoves = []
        for i in moves:
            
            if(i.getValue()!="Checked" and i.getValue()!="End" and i.getValue()!="Start" and self.check(i)==True):
                self.Map.setNext(i.getPos())
                    

            if(self.check(i)==True and i.getValue()!="Start" and i.getValue()!="Checked"):
                openMoves.append(i)
                
            else:
                pass
                
        return(openMoves)  

    def check(self, b):
        if b.value == "Bloc":
            return(False)    
        return(True)

    def __init__(self, rows, cols):
        self.Map = Map.TheMap(rows, cols)
        running = True
        while running == True:
            for event in pg.event.get():
                if event.type == QUIT:
                    running = False
                    
                if pg.mouse.get_pressed()[0]:
                    pos = pg.mouse.get_pos()
                    pos = self.Map.getPos(pos)
                    if(self.Map.SetStart(pos)):  #bug this modules start is different than the start on the map module
                        x, y = pos
                        self.start = (x,y)
                        start = [x, y]

                if pg.mouse.get_pressed()[1]:
                    pos = pg.mouse.get_pos()
                    pos = self.Map.getPos(pos)
                    
                    self.Map.SetBloc(pos)

                if pg.mouse.get_pressed()[2]:
                    pos = pg.mouse.get_pos()
                    pos = self.Map.getPos(pos)
                    self.Map.SetEnd(pos)
                    x, y = pos
                    self.end = (x, y)
                    

                if pg.key.get_pressed()[K_SPACE]:
                    print("starting")
                    self.startPath(self.Map.mat[start[0]][start[1]])

        self.Map.quitMap()

#pathfinder(16, 16)