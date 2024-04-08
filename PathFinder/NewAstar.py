import NodeMap as NodeMap
import pygame as pg
from pygame.locals import K_LSHIFT, QUIT, K_SPACE
from MapNode import Node

from abc import abstractmethod


class PathfindingAlgorithm:
    
    @abstractmethod
    def startPath(self, initial):
        pass
    
    def __init__(self, rows, cols):
        self.Map = NodeMap.NodeMap(rows, cols)
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
                    x, y = self.start
                    self.startPath(self.Map.mat[x][y])
                    break
                    

        self.Map.quitMap()

class AStartAlgorithm(PathfindingAlgorithm):
    
    def __init__(self, rows: int, cols: int):
        super().__init__(rows, cols)

    def startPath(self, initial):
        pass
    
    
    def survey(self, select_node: Node):
        x, y = select_node.getPos()
        
        