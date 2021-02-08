import TheMapV4 as Map
import TheNode
import time
import math
import pygame as pg
from pygame.locals import *

class pathfinder():

    def startPath(self, initial):
        openSet=[initial]
        #I will make a function called get best node
        #I could implement a sorted linked list or sorted set.
        #best = self.findBest(openSet)
        best = initial
        
        running = True

        while running:
            currentSet = self.step(best)
            openSet.extend(currentSet)
            #print(best.getPos(), best.getFScore(), best.getDist())
            self.Map.setChecked(best.getPos())
            #best = self.findBest(openSet)
            print(best.getPos(), "from here")
            openSet.remove(best)
            #cBest = self.findBest(currentSet)
            best = self.findBest(currentSet)

            if(best.value=="End"):
                print("end")
                self.drawShortest(best)
                return()

        #self.step(best)
        #print(best.getPos(), best.getDist(), best.getFScore())
        return(False)

    def findBest(self, ls, currBest=None):
        if(currBest == None):
            best = ls[0]
        else:
            best = currBest
        
        for i in ls:
            if(best.getDist() >= i.getDist()): #and self.getHScore(best)>self.getHScore(i)):
                #print(best.getPos(), "This is the best .getPst")
                if(self.getHScore(best)>self.getHScore(i)):
                    best = i
        print(best.getPos(), best.getDist(), best.getFScore())
        return(best)

    def step(self, current):
        nodeLs = []
        neighbours = self.survey(current)
        
        for node in neighbours:
            time.sleep(0.05)

            if(node.getVisited() == False):
                spot = node.getPos()
                if(self.check(node)):
                    self.Map.setNext(spot)
                    node.setFScore(current.getFScore()+1.00)
                    node.setDist(current.getFScore()+1.00 + self.getHScore(node))
                    #print(node.getDist(), "full dist")
                    nodeLs.append(node)

        #current.setVisited()
        return(nodeLs)

    def getHScore(self,node):
        x,y = node.getPos()
        ex,ey = self.end
        hScore = math.sqrt(pow((x-ex),2)+pow((y-ey),2))
        #print(hScore, "HScore")
        return(hScore)

    def drawShortest(self, end):
        #print(self.start, end.getPos(), end.getFScore())
        nodes = self.survey(end)
        for i in nodes:
            #print(i.getDist())
            if i.getFScore() == 0:
                #print("returning")
                return(True)
            elif i.getFScore() < end.getFScore() and i.value=="Checked":
                time.sleep(0.05)
                self.Map.setBest(i.getPos())
                return(self.drawShortest(i))
                

        return

    def survey(self, a):
        #Up Down Left Right
        x, y = a.getPos()
        mat = self.Map.getMat()
        moves = [mat[x][y-1], mat[x][y+1], mat[x-1][y], mat[x+1][y]]
        for i in moves:
            if(self.check(i)!="Bloc" or i.getValue()!="Start" or i.getValue()!="End"):
                continue
            else:
                moves.remove(i)
        
        return(moves)  

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
                    self.startPath(self.Map.mat[start[0]][start[1]])

        self.Map.quitMap()

pathfinder(16, 16)