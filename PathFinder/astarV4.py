import TheMapV4 as Map
import TheNode
import time
import math
# import LinkedList
#from LinkedList import linkedNode
import pygame as pg
from pygame.locals import *

class pathfinder():

    def startPath(self, initial):
        self.addNodes([initial])
        #I will make a function called get best node
        #I could implement a sorted linked list or sorted set.
        best = self.openList.pop(0)
        
        #self.currentSet = self.survey(best)
        #self.evaluate(initial)

        running = True
        num = 0
        while running:
            num += 1
            starttime = time.time()
            # time.sleep(0.1)
            # ri = input("enter a value to continue")
            self.currentSet = self.survey(best)
            self.evaluate(best)

            #self.openSet.extend(self.currentSet)
            self.addNodes(self.currentSet)
            #print(best.getPos(), best.getFScore(), best.getDist())
            self.Map.setChecked(best.getPos())
            # print("Here", self.openList)
            #self.openSet.remove(best)
            #cBest = self.findBest(currentSet)
            # print([nod.value for nod in self.openList])
            best = self.findBest()
            print(f"iter time {time.time() - starttime}  num nodes {len(self.openList)}")
            # print(best)
            # if num >=3:
            #     break
            # best = self.openList.pop()
            if(best.value=="End"):
               #print("end")
                self.drawShortest(best)
                print("Shortest has been drawn")
                print(num)
                return(True)
            

        return(False)

    def addNodes(self, ls):
        for i in ls:
            if i not in self.openList:
                self.openList.append(i)
            self.Map.displayScore(i)

    def findBest(self, currBest=None):
        # print(len(ls), "This is the length")
        if(currBest == None):
            best = self.openList[0]
        else:
            best = currBest
        
        for i in self.openList:
            if(best.getDist() >= i.getDist()):
                if(best.getHScore() > i.getHScore()):
                    best = i

            # if(best.getHScore() >= i.getHScore()):
            #     if(best.getDist() > i.getDist()):
            #         best = i

        self.openList.remove(best)
        #print(best.getPos(), best.getDist(), best.getGScore())
        return(best)

    def getHScore(self,node):
        x,y = node.getPos()
        ex,ey = self.end
        hScore = math.sqrt(pow((x-ex),2)+pow((y-ey),2))
        node.setHScore(hScore)
        return(hScore)

    def drawShortest(self, end):
        #print(self.start, end.getPos(), end.getFScore())
        
        x, y = end.getPos()
        nodes = [self.Map.mat[x][y-1], self.Map.mat[x][y+1], self.Map.mat[x-1][y], self.Map.mat[x+1][y]]
        
        for i in nodes:    
            #print(i.getPos(), i.getGScore())
            if i.getGScore() == 0:
                #print("returning")
                return(True)
            elif (i.getGScore() < end.getGScore()) and i.getValue()=="Checked":
                time.sleep(0.04)
                self.Map.setBest(i.getPos())
                return(self.drawShortest(i))
                

        return()


    def evaluate(self, center):
        # Evaluates and updates the currentSet of nodes distance scores in relation to input node.
        for i in self.currentSet:
            if(i.value=="End"):
                i.setDist(0)
            FScore = (center.getGScore()+1.0 + self.getHScore(i))
            if(i.getDist()>FScore):
                i.setDist(FScore)
                i.setGScore(center.getGScore()+1.0)
            
        

    def survey(self, a):
        # returns a list of neighboring nodes that can be moved to, from input node.
        x, y = a.getPos()
        
        moves = [self.Map.mat[x][y-1], self.Map.mat[x][y+1], self.Map.mat[x-1][y], self.Map.mat[x+1][y]]
        openMoves = []
        for i in moves:
            i_value = i.getValue()
            if(i_value!="Checked" and i_value!="End" and i_value!="Start" and self.check(i)==True):
                self.Map.setNext(i.getPos())
                    
            if(self.check(i)==True and i.getValue()!="Start" and i.getValue()!="Checked"):
            # if(self.check(i)==True and i.getValue()!="Start"):
                openMoves.append(i)

        return(openMoves)  

    def check(self, b):
        if b.value == "Bloc":
            return(False)    
        return(True)

    def __init__(self, rows, cols):
        self.Map = Map.TheMap(rows, cols)
        self.openList = []
        # self.openList = LinkedList.SLL()
        running = True
        while running == True:
            for event in pg.event.get():
                if event.type == QUIT:
                    running = False
                    
                if pg.mouse.get_pressed()[0] and not pg.key.get_pressed()[K_LSHIFT]:
                    pos = pg.mouse.get_pos()
                    pos = self.Map.getPos(pos)
                    if(self.Map.SetStart(pos)):  #bug this modules start is different than the start on the map module
                        x, y = pos
                        self.start = (x,y)
                        start = [x, y]

                if pg.mouse.get_pressed()[1] or (pg.key.get_pressed()[K_LSHIFT] and pg.mouse.get_pressed()[0]):
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
                    break
                    

        self.Map.quitMap()