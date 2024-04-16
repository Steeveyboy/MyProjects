from Astar import AStarAlgorithm, TemporalAStarAlgorithm
from NodeMap import NodeMap, TemporalNodeMap
import time
import pygame as pg
from pygame.locals import QUIT
import argparse


class RouteDemo():
    def __init__(self):
        # self.Map = NodeMap.NodeMap(rows, cols)
        node_map = NodeMap(30, 24)
        p = AStarAlgorithm(node_map)
        shortest_path = p.startPath(node_map.start)
        
        node_map.waitOnEvent()

        for node in shortest_path[::-1]:
            node_map.updateMapObjects()
            node_map.setBest(node)
            pg.display.update()
            time.sleep(0.08)
        node_map.waitOnQuit()


class RouteDemoDynamic():
    def __init__(self):
        # self.Map = NodeMap.NodeMap(rows, cols)
        pathTaken = []
        print("HERE")
        node_map = NodeMap(30, 24)
        # node_map.update_each_frame = False

        p = AStarAlgorithm(node_map)
        next_best_node = p.startPath(node_map.start)[-1]
        pathTaken.append(next_best_node)
        time.sleep(0.2)
        
        while next_best_node.value != "End":
            node_map.updateMapObjects()
            node_map.SetStart(next_best_node.getPos())
            time.sleep(0.04)

            next_best_node = p.startPath(next_best_node)[-1]
            pathTaken.append(next_best_node)            
            time.sleep(0.15)

        storm_x, storm_y = node_map.storm.stormStart
        node_map.storm.cleanUPStorm(node_map.mat, node_map)

        node_map.storm.x = storm_x
        node_map.storm.y = storm_y

        for node in pathTaken:
            node_map.updateMapObjects()
            node_map.setBest(node)
            # pg.display.update()
            node_map.waitOnEvent()

        for node in pathTaken:
            node_map.setBest(node)
            time.sleep(0.08)

        node_map.waitOnQuit()


class RouteDemoTemporal:
    def __init__(self) -> None:
        print("Starting Temporal")
        node_map = TemporalNodeMap(30, 24)
        node_map.forcastStorm()


        p = TemporalAStarAlgorithm(node_map)
        shortest_path = p.startPath(node_map.start)

        time.sleep(0.5)

        storm_x, storm_y = node_map.storm.stormStart
        node_map.storm.cleanUPStorm(node_map.mat, node_map)

        node_map.storm.x = storm_x
        node_map.storm.y = storm_y

        for node in shortest_path[::-1]:
            node_map.updateMapObjects()
            node_map.setBest(node)
            # pg.display.update()
            node_map.waitOnEvent()
            # time.sleep(0.20)

        for node in shortest_path[::-1]:
            node_map.setBest(node)
            # pg.display.update()
            time.sleep(0.08)


        node_map.waitOnQuit()
        pass


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--demo', help="Specify which demo to run", default='basic')
    return parser.parse_args()

if __name__ == '__main__':
    args = get_args()

    if args.demo == "basic":
        RouteDemo()
        
    elif args.demo == "iterative":
        RouteDemoDynamic()
        
    elif args.demo == "temporal":
        RouteDemoTemporal()
    
