from NewAstar import AStarAlgorithm
from NodeMap import NodeMap

class ui():
    def __init__(self):
        # self.Map = NodeMap.NodeMap(rows, cols)
        node_map = NodeMap(30, 24)
        
        # p = AStarAlgorithm(node_map)
    
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
    ui()
