#DIJKSTRA_V3
#For V3, to reduce runtime the unvisited set has been eliminated,
#the node will now hold a boolean value indicating if it has been visited.
#Other minor adjustments will be made

"""
This Dijkstra pathfinder will use a breadth first search of the nodes until
the END point is found, where the optimal path will be revealed. 
This will use TheMapV4 as a visualization tool.
"""

import TheNode
import time
import TheMapV4 as tMap
import pygame as pg
from pygame.locals import *


#theMap = aMap.TheMap()


class pathfinder():

    def startPath(self, initial):
        currentSet = [initial]
        running = 1
        while running == 1:
            nodes = []
            for current in currentSet:
                if current.value == "End":
                    self.drawShortest(current)
                    return()
                
                if current.getVisited() == False:
                    #print(current.getVisited(), "form hererer")
                    nodes.extend(self.step(current))
                    
            
                self.Map.setChecked(current.getPos())
                
            currentSet = nodes
        
        
    def step(self, current):
        #find evaluates the nodes neighbours, disignates the unvisited ones and next, and returns a list
        nodeSet = []
        neighbours = self.survey(current)
        
        for node in neighbours:
            
            if node.distance < current.distance:
                current.setDist(node.getDist()+1)
        
            if node.getVisited() == False:
                f = node.getPos()
                if self.check(node):
                    self.Map.setNext(f)
                    nodeSet.append(node)

        current.setVisited()
        
        return(nodeSet)


    def drawShortest(self, end):
        nodes = self.survey(end)
        for i in nodes:
            if i.distance == 0:
                return

            if i.getDist() < end.getDist():
                self.Map.setBest(i.getPos())
                #time.sleep(0.2)
                self.drawShortest(i)
                break

        return


    def check(self, b):
        if b.value == "Bloc":
            return(False)    
        return(True)

    def survey(self, a):
        #Up Down Left Right
        x, y = a.getPos()
        mat = self.Map.getMat()
        moves = [mat[x][y-1], mat[x][y+1], mat[x-1][y], mat[x+1][y]]

        return(moves)    

    

    def __init__(self, rows, cols):
        """This sets up the field which the pathfinder will navigate, you may pick a starting node, an ending node, and set blocked nodes."""
        
        self.Map = tMap.TheMap(rows, cols)

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
                    end = [x, y]

                if pg.key.get_pressed()[K_SPACE]:
                    self.startPath(self.Map.mat[start[0]][start[1]])

        self.Map.quitMap()

#pathfinderSetUp()
