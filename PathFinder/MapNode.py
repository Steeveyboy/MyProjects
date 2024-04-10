
red = (255,0,0)
blue = (0,0,255)
yellow = (0,255,0)
black = (0,0,0)
white = (255,255,255)
orange = (255, 150, 0)
purple = (200, 0, 160)
turquoise = (64,224,208)
lightGreen = (0, 200, 0)
green = (46,147,60)
brown = (44,20,3)

COLOUR_DICT = {"Open":white, "Start":blue, "End":green, "Bloc":black, "Crossed":yellow, "Dead":orange, "Best":purple,"Next":lightGreen, "Checked":turquoise, "Edge": black}

SIZE_OF_BLOCK = 32

class Node:
    def __init__(self):
        self.value = None
        self.cord = [None, None]
        self.colour = None
        self.FScore = float('inf')
        self.visited = False
        self.GScore = float('inf')
        self.HScore = float('inf')

    
    def setValue(self, value):
        self.value = value
        self.colour = COLOUR_DICT[value]
        
    def setPos(self, x, y):
        self.x_cord = x
        self.y_cord = y

    def getValue(self):
        return self.value

    def getPos(self):
        x = self.cord[0]//SIZE_OF_BLOCK
        y = self.cord[1]//SIZE_OF_BLOCK
        return((x,y))
    
    def setCord(self, cord):
        self.cord = cord

    def setFScore(self, dist):
        self.FScore = round(dist,2)
    
    def getFScore(self):
        return(self.FScore)

    def setGScore(self, F):
        self.GScore = F
    
    def getGScore(self):
        return(self.GScore)

    def setHScore(self, h):
        """Sets the nodes heuristic score."""
        self.HScore = h

    def getHScore(self) -> float:
        """Returns heuristic score. 
        In this case the heuristic being returned is the euclidean distance between this node and the end node."""
        return(round(self.HScore, 2))
    
    def setVisited(self):
        self.visited = True

    def getVisited(self):
        return(self.visited)
    
    def __hash__(self):
        return hash(str(self.cord))
