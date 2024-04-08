from NewAstar import PathfindingAlgorithm

class ui():
    def __init__(self):
        p = PathfindingAlgorithm(20, 20)
    
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
