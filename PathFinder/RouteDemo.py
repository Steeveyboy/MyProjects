from Astar import AStarAlgorithm
from NodeMap import NodeMap
import time
import pygame as pg

class RouteDemo():
    def __init__(self):
        # self.Map = NodeMap.NodeMap(rows, cols)
        node_map = NodeMap(30, 24)
        
        while True:
            # p = AStarAlgorithm(node_map)
            node_map.updateGraphObjects()
            # time.sleep(0.5)

            if pg.event.get(pg.QUIT):
                node_map.quitMap()
                break

        # node_map.waitOnQuit()

    
    # def go(self):
    #     height = int(self.height.get())
    #     width = int(self.width.get())
    #     #print(height, width)
        
    #     if(self.algorithm=='dijkstras'):
    #         Dijk.pathfinder(height, width)
    #     elif(self.algorithm=='dfs'):
    #         dfs.pathfinder(height, width)
    #     elif(self.algorithm=='aStar'):
    #         aStar.pathfinder(height, width)
    #     else:
    #         print("please select Algo")

    # def selectAlgo(self, choice):
    #     #print(choice)
    #     self.algorithm = choice

if __name__ == '__main__':
    RouteDemo()
