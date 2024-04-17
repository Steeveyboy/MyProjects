from Astar import AStarAlgorithm, TemporalAStarAlgorithm
from GridMap import NodeMap, TemporalNodeMap, NodeMapTest, TemporalNodeMapTest
import time
import pygame as pg
from pygame.locals import QUIT
import argparse
import numpy as np

def descriptiveStats(ls):
    
    mean = np.mean(ls)
    median = np.median(ls)
    # mode = np.mode(ls)
    ls_min = min(ls)
    ls_max = max(ls)
    ls_count = len(ls)
    
    print(f"Mean {mean} \t Median {median} \t min {ls_min} \t max {ls_max} \t count {ls_count}")
    print(mean, median, ls_min, ls_max, ls_count)

class RouteDemo():
    
    @staticmethod
    def run_tests():
        print("Running test")
        
        test_start_x = 6
        test_start_y = 4
        test_end_x = 6
        test_end_y = 20
        
        test_start_time = time.time()
        
        path_dangers = []
        path_lengths = []
        algo_times = []
        
        for i in range(10):
            for j in range(10):
                node_map = NodeMapTest(30, 24, test_start_x+(i*2), test_start_y, test_end_x+(j*2), test_end_y)
                # node_map.waitOnEvent()
                algo_start = time.time()
                
                p = AStarAlgorithm(node_map)
                shortest_path = p.startPath(node_map.start)
                
                algo_times.append(time.time() - algo_start)
                
                danger_encountered = 0
                total_path_len = 0

                for node in shortest_path[::-1]:
                    node_map.updateMapObjects(testing=True)
                    danger_encountered += node.danger_score
                    total_path_len += 1
                    # node_map.setBest(node)
                # pg.display.update()
                path_dangers.append(danger_encountered)
                path_lengths.append(total_path_len)
                # print(f"Total Danger Encountered {danger_encountered}")
                # print(f"Total Path Length {total_path_len}")
                
                
        print("Path Length Stats: ", end="")
        descriptiveStats(path_lengths)
        
        print("Path Danger Stats: ", end="")
        descriptiveStats(path_dangers)
        
        print("Path Time   Stats: ", end="")
        descriptiveStats(algo_times)
        
        print(f"Tests took {time.time() - test_start_time}")
        node_map.waitOnQuit()
    
    @staticmethod
    def run_demo():
        print("Running demo")
        # self.Map = NodeMap.NodeMap(rows, cols)
        node_map = NodeMap(30, 24)
        p = AStarAlgorithm(node_map)
        shortest_path = p.startPath(node_map.start)
        
        node_map.waitOnEvent()
        
        danger_encountered = 0
        total_path_len = 0

        for node in shortest_path[::-1]:
            node_map.updateMapObjects()
            danger_encountered += node.danger_score
            total_path_len += 1
            node_map.setBest(node)
            pg.display.update()
            time.sleep(0.06)
        
        for node in shortest_path[::-1]:
            node_map.setBest(node)
            pg.display.update()
            time.sleep(0.05)
            
        print(f"Total Danger Encountered {danger_encountered}")
        print(f"Total Path Length {total_path_len}")
        node_map.waitOnQuit()


class RouteDemoDynamic():
    
    @staticmethod
    def run_test():
        print("Running test")
        
        test_start_x = 6
        test_start_y = 4
        test_end_x = 6
        test_end_y = 20
        
        path_dangers = []
        path_lengths = []
        algo_times = []
        
        test_start_time = time.time()
        
        for i in range(10):
            for j in range(10):
                node_map = NodeMapTest(30, 24, test_start_x+(i*2), test_start_y, test_end_x+(j*2), test_end_y)
                
                pathTaken = []
                danger_encountered = 0
                total_path_len = 0
                algo_start = time.time()


                p = AStarAlgorithm(node_map)
                next_best_node = p.startPath(node_map.start)[-1]
                pathTaken.append(next_best_node)
                
                while next_best_node.value != "End":
                    node_map.updateMapObjects(testing=True)
                    node_map.SetStart(next_best_node.getPos())
                    # time.sleep(0.04)

                    next_best_node = p.startPath(next_best_node)[-1]
                    pathTaken.append(next_best_node)            
                    # time.sleep(0.15)
                algo_times.append(time.time() - algo_start)

                storm_x, storm_y = node_map.storm.stormStart
                node_map.storm.cleanUPStorm(node_map.mat, node_map)

                node_map.storm.x = storm_x
                node_map.storm.y = storm_y
 
                for node in pathTaken:
                    node_map.updateMapObjects(testing=True)
                    danger_encountered += node.danger_score
                    total_path_len += 1
                    # node_map.setBest(node)

                # for node in pathTaken:
                #     node_map.setBest(node)
                    # time.sleep(0.01)
                
                path_dangers.append(danger_encountered)
                path_lengths.append(total_path_len)
                # print(f"Total Danger Encountered {danger_encountered}")
                # print(f"Total Path Length {total_path_len}")
        print("Path Length Stats: ", end="")
        descriptiveStats(path_lengths)
        
        print("Path Danger Stats: ", end="")
        descriptiveStats(path_dangers)
        
        print("Path Time   Stats: ", end="")
        descriptiveStats(algo_times)
        
        print(f"Test took {time.time() - test_start_time}")
        node_map.waitOnQuit()
    
    @staticmethod
    def run_demo():

        pathTaken = []

        node_map = NodeMap(30, 24)

        danger_encountered = 0
        total_path_len = 0

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
            danger_encountered += node.danger_score
            total_path_len += 1
            node_map.setBest(node)
            # pg.display.update()
            node_map.waitOnEvent()

        for node in pathTaken:
            node_map.setBest(node)
            time.sleep(0.05)

        print(f"Total Danger Encountered {danger_encountered}")
        print(f"Total Path Length {total_path_len}")
        node_map.waitOnQuit()


class RouteDemoTemporal:
    
    @staticmethod
    def run_test() -> None:
        print("Running test")
        
        test_start_x = 6
        test_start_y = 4
        test_end_x = 6
        test_end_y = 20
        
        total_start_time = time.time()
        
        path_dangers = []
        path_lengths = []
        algo_times = []
        
        for i in range(10):
            for j in range(10):

                
                node_map = TemporalNodeMapTest(30, 24, test_start_x+(i*2), test_start_y, test_end_x+(j*2), test_end_y)
                node_map.forcastStorm(testing=True)

                danger_encountered = 0
                total_path_len = 0

                algo_start = time.time()
                
                p = TemporalAStarAlgorithm(node_map)
                shortest_path = p.startPath(node_map.start)

                algo_times.append(time.time() - algo_start)
                # print(f"This test took {time.time() - starttime}")

                # storm_x, storm_y = node_map.storm.stormStart
                # node_map.storm.cleanUPStorm(node_map.mat, node_map)

                # node_map.storm.x = storm_x
                # node_map.storm.y = storm_y

                for node in shortest_path[::-1]:
                    # node_map.updateMapObjects(testing=True)
                    # print(node.x_cord, node.y_cord, node.danger_scores, node.GScore)
                    danger_encountered += node.getDangerScore(total_path_len)
                    total_path_len += 1
                    # node_map.setBest(node)
                    # pg.display.update()
                    # node_map.waitOnEvent()
                    # time.sleep(0.05)

                # for node in shortest_path[::-1]:
                #     node_map.setBest(node)
                    # pg.display.update()
                # time.sleep(0.2)
                path_dangers.append(danger_encountered)
                path_lengths.append(total_path_len)
                # print(f"Total Danger Encountered {danger_encountered}")
                # print(f"Total Path Length {total_path_len}")
        
        print("Path Length Stats: ", end="")
        descriptiveStats(path_lengths)
        
        print("Path Danger Stats: ", end="")
        descriptiveStats(path_dangers)
        
        print("Path Time   Stats: ", end="")
        descriptiveStats(algo_times)
        
        
        print(f"All Tests Took {time.time() - total_start_time}")
        node_map.waitOnQuit()
    
    
    @staticmethod
    def run_demo() -> None:
        print("Starting Temporal")
        node_map = TemporalNodeMap(30, 24)
        node_map.forcastStorm()

        danger_encountered = 0
        total_path_len = 0

        p = TemporalAStarAlgorithm(node_map)
        shortest_path = p.startPath(node_map.start)

        node_map.waitOnEvent()
        # time.sleep(0.5)

        storm_x, storm_y = node_map.storm.stormStart
        node_map.storm.cleanUPStorm(node_map.mat, node_map)

        node_map.storm.x = storm_x
        node_map.storm.y = storm_y

        for node in shortest_path[::-1]:
            node_map.updateMapObjects()
            # print(node.x_cord, node.y_cord, node.danger_scores, node.GScore)
            danger_encountered += node.getDangerScore(total_path_len)
            total_path_len += 1
            node_map.setBest(node)
            # pg.display.update()
            node_map.waitOnEvent()
            # time.sleep(0.20)

        for node in shortest_path[::-1]:
            node_map.setBest(node)
            # pg.display.update()
            time.sleep(0.06)

        print(f"Total Danger Encountered {danger_encountered}")
        print(f"Total Path Length {total_path_len}")
        node_map.waitOnQuit()
        


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--demo', help="Specify which demo to run", default=None)
    parser.add_argument('--test', help="Specify which test to run", default=None)
    return parser.parse_args()

if __name__ == '__main__':
    args = get_args()

    if args.demo:
        if args.demo == "basic":
            RouteDemo.run_demo()
            
        elif args.demo == "iterative":
            RouteDemoDynamic.run_demo()
            
        elif args.demo == "temporal":
            RouteDemoTemporal.run_demo()
    
    if args.test:
        if args.test == "basic":
            RouteDemo.run_tests()
        elif args.test == "iterative":
            RouteDemoDynamic.run_test()
            
        elif args.test == 'temporal':
            RouteDemoTemporal.run_test()
