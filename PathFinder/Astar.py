import GridMap as GridMap
from MapNode import Node
from sortedcontainers import SortedSet
from typing import List
from math import sqrt
from abc import abstractmethod



class PathfindingAlgorithm:
    @abstractmethod
    def startPath(self, initial):
        pass
    
    def __init__(self, node_map: GridMap):
        self.Map = node_map
        self.end = self.Map.end
        self.testing = False

class AStarAlgorithm(PathfindingAlgorithm):
    
    def __init__(self, node_map: GridMap):
        self.openSet = SortedSet({}, key=lambda node: node.FScore)
        super().__init__(node_map)

    def flushSet(self):
        self.openSet = SortedSet({}, key=lambda node: node.FScore)

    def startPath(self, initial):
        
        self.flushSet()
        self.openSet.add(initial)
        running = True
        while running:
            select_node = self.openSet.pop(0)
            
            if select_node.value == "End":  
                shortest_path = self.drawShortest(select_node)
                if shortest_path:
                    return shortest_path
                else:
                    return [self.end]
            
            self.survey(select_node)
            self.Map.setChecked(select_node)
        return True
    
    def survey(self, select_node: Node) -> None:        
        moves = self.getNeighbors(select_node)

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
  

    def evaluateNode(self, origin_node: Node, dest_node: Node) -> None:
        """Set scores for node."""
        g_score = origin_node.getGScore() + 1.0
        h_score = sqrt((dest_node.x_cord - self.end.x_cord)**2 + (dest_node.y_cord - self.end.y_cord)**2)
        f_score = g_score + h_score
        
        if f_score < dest_node.FScore:
            dest_node.setGScore(g_score)
            dest_node.setHScore(h_score)
            dest_node.calcFScore()

    def drawShortest(self, source_node: Node):
        
        nodes = self.getNeighbors(source_node)
        nodes = [n for n in nodes if n.getValue() in {"Checked", "Start"}]
        try:
            best_node = nodes[0]
        except:
            print(n.value for n in nodes)
            return
        for node in nodes:
            if node.value == "Start":
                return []
            # elif (node.getGScore() <= best_node.getGScore()) and node.visited:
            if(node.getFScore() < best_node.getFScore()) and node.visited:
                best_node = node
                
        self.Map.setBest(best_node)
        return [best_node] + self.drawShortest(best_node)
    


class TemporalAStarAlgorithm(AStarAlgorithm):
    def __init__(self, node_map: GridMap) -> None:
        super().__init__(node_map)
    
    def evaluateNode(self, origin_node: Node, dest_node: Node) -> None:
        g_score = origin_node.getGScore() + 1.0
        h_score = sqrt((dest_node.x_cord - self.end.x_cord)**2 + (dest_node.y_cord - self.end.y_cord)**2)
        f_score = g_score + h_score
        
        if f_score < dest_node.FScore:
            dest_node.setGScore(g_score)
            dest_node.setHScore(h_score)
            dest_node.calcFScore()
