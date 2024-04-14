from Astar import AStarAlgorithm
from NodeMap import NodeMap
import time
import pygame as pg
from pygame.locals import QUIT


class RouteDemo():
    def __init__(self):
        # self.Map = NodeMap.NodeMap(rows, cols)
        node_map = NodeMap(30, 24)
        p = AStarAlgorithm(node_map)
        shortest_path = p.startPath(node_map.start)
        print(shortest_path)
        sample_node = shortest_path[-1]
        sample_node.colour = (50,50,50)
        node_map.drawNodeOnMap(sample_node)
        pg.display.update()
        node_map.waitOnQuit()
        # while True:
        #     node_map.updateMapObjects()
        #     shortest_path = p.startPath(shortest_path[0])
        #     time.sleep(0.5)
            # if pg.event.get(pg.QUIT):
            #     node_map.quitMap()
            #     break


class RouteDemoDynamic():
    def __init__(self):
        # self.Map = NodeMap.NodeMap(rows, cols)
        bestPath = []
        print("HERE")
        node_map = NodeMap(30, 24)
        node_map.update_each_frame = False

        p = AStarAlgorithm(node_map)
        next_best_node = p.startPath(node_map.start)[-1]
        bestPath.append(next_best_node)
        time.sleep(0.2)
        
        while True:
            node_map.updateMapObjects()
            node_map.SetStart(next_best_node.getPos())
            time.sleep(0.04)

            next_best_node = p.startPath(next_best_node)[-1]
            if next_best_node.value == "End":
                for node in bestPath:
                    node_map.setBest(node)
                break

            bestPath.append(next_best_node)
            time.sleep(0.2)
            if pg.event.get(QUIT):
                # node_map.quitMap()
                break

        node_map.waitOnQuit()


if __name__ == '__main__':
    # RouteDemo()
    RouteDemoDynamic()
