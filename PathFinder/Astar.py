import NodeMap as NodeMap
import pygame as pg
from pygame.locals import K_LSHIFT, QUIT, K_SPACE, K_ESCAPE, KEYDOWN, K_s, K_LCTRL
from MapNode import Node
from sortedcontainers import SortedSet
from typing import List
from math import sqrt
from abc import abstractmethod
import time


class PathfindingAlgorithm:
    
    @abstractmethod
    def startPath(self, initial):
        pass
    
    def __init__(self, node_map: NodeMap):
        self.Map = node_map
        self.end = self.Map.end
        # self.Map = NodeMap.NodeMap(rows, cols)

        self.startPath(self.Map.start)

        print("Done")
        # time.sleep(1)
               
        # self.Map.quitMap()

class AStarAlgorithm(PathfindingAlgorithm):
    
    def __init__(self, node_map: NodeMap):
        self.openSet = SortedSet({}, key=lambda node: node.FScore)
        super().__init__(node_map)
        

    def startPath(self, initial):
        print("HELLO")
        self.openSet.add(initial)
        # self.survey(initial)
        running = True
        while running:
            select_node = self.openSet.pop(0)
            
            if select_node.value == "End":
                
                self.drawShortest(select_node)
                print("Shortest has been drawn")
                self.Map.displayAllScores()
                return(True)
            
            self.survey(select_node)
            self.Map.setChecked(select_node)

            
            # while True:
            #     proceed = pg.event.wait()
            #     if proceed.type == KEYDOWN and proceed.key == K_SPACE:
            #         break
            #     if proceed.type == QUIT:
            #         self.Map.quitMap()
            #         return
                    
            
        return True
    
    def survey(self, select_node: Node) -> None:
        x, y = select_node.getPos()
        
        moves = self.getNeighbors(select_node)
        # moves = [self.Map.mat[x][y-1], self.Map.mat[x][y+1], self.Map.mat[x-1][y], self.Map.mat[x+1][y]]
        
        for node in moves:
            node_value = node.getValue()
            if node_value == "Open":
                self.Map.setNext(node.getPos())
            
            if node_value == "Open" or node_value=="End":
                self.evaluateNode(origin_node=select_node, dest_node=node)
                self.openSet.add(node)
                self.Map.displayScore(node)

    def getNeighbors(self, node: Node) -> List[Node]:
        x, y = node.getPos()
        return [self.Map.mat[x][y-1], self.Map.mat[x][y+1], self.Map.mat[x-1][y], self.Map.mat[x+1][y]]
        # return [self.Map.mat[x][y-1], self.Map.mat[x][y+1], self.Map.mat[x-1][y], self.Map.mat[x+1][y], self.Map.mat[x+1][y+1], self.Map.mat[x-1][y+1], self.Map.mat[x+1][y-1], self.Map.mat[x-1][y-1]]
        

    def evaluateNode(self, origin_node: Node, dest_node: Node) -> None:
        """Set scores for node."""
        g_score = origin_node.getGScore() + 1.0
        h_score = sqrt((dest_node.x_cord - self.end.x_cord)**2 + (dest_node.y_cord - self.end.y_cord)**2)
        f_score = g_score + h_score
        
        if f_score < dest_node.FScore:
            dest_node.setGScore(g_score)
            dest_node.setHScore(h_score)
            dest_node.calcFScore()
            # dest_node.setFScore(f_score)
    
    
    def markNodes(self, node_list: List[Node]):
        """Mark neighbording ndoes on map."""
        for node in node_list:
            self.Map.displayScore(node)

    def drawShortest(self, source_node: Node):
        
        nodes = self.getNeighbors(source_node)
        nodes = [n for n in nodes if n.getValue() in {"Checked", "Start"}]
        
        best_node = nodes[0]
        for node in nodes:
            if node.value == "Start":
                return
            elif (node.getGScore() <= best_node.getGScore()) and node.visited:
                if(node.getFScore() < best_node.getFScore()):
                    best_node = node
                
        self.Map.setBest(best_node)
        self.drawShortest(best_node)