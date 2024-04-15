from Astar import AStarAlgorithm, TemporalAStarAlgorithm
from NodeMap import NodeMap, TemporalNodeMap
import time
import pygame as pg
from pygame.locals import QUIT


class RouteDemo():
    def __init__(self):
        # self.Map = NodeMap.NodeMap(rows, cols)
        node_map = NodeMap(30, 24)
        p = AStarAlgorithm(node_map)
        shortest_path = p.startPath(node_map.start)

        
        # pg.display.update()
        for node in shortest_path[::-1]:
            node_map.updateMapObjects()
            node_map.setBest(node)
            pg.display.update()
            time.sleep(0.2)

        node_map.waitOnQuit()



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


class RouteDemoTemporal:
    def __init__(self) -> None:
        print("Starting Temporal")
        node_map = TemporalNodeMap(30, 24)
        node_map.forcastStorm()


        p = TemporalAStarAlgorithm(node_map)
        shortest_path = p.startPath(node_map.start)

        time.sleep(1)

        storm_x, storm_y = node_map.storm.stormStart
        node_map.storm.cleanUPStorm(node_map.mat, node_map)

        node_map.storm.x = storm_x
        node_map.storm.y = storm_y

        for node in shortest_path[::-1]:
            node_map.updateMapObjects()
            node_map.setBest(node)
            # pg.display.update()
            time.sleep(0.25)

        for node in shortest_path[::-1]:
            node_map.setBest(node)
            # pg.display.update()
            time.sleep(0.15)


        node_map.waitOnQuit()
        pass


if __name__ == '__main__':
    # RouteDemo()
    # RouteDemoDynamic()
    RouteDemoTemporal()
