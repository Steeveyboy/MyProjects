
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

COLOUR_DICT = {"Open":white, 
               "Start":blue, 
               "End":green, 
               "Bloc":black, 
               "Crossed":yellow, 
               "Dead":orange, 
               "Best":purple,
               "Next":lightGreen, 
               "Checked":turquoise, 
               "Edge": black,
               "Hazard": orange}

SIZE_OF_BLOCK = 32

class Node:
    def __init__(self):
        self.value = None
        self.colour = None
        self.FScore = float('inf')
        self.visited = False
        self.GScore = float('inf')
        self.HScore = float('inf')
        self.danger_score = 0

    def resetAnalysis(self):
        """Resets all variables that may be set by an analysis algorithm"""
        self.FScore = float('inf')
        self.visited = False
        self.GScore = float('inf')
        self.HScore = float('inf')
        self.danger_score = 0

        if self.value not in {"Bloc", "End"}:
            self.setValue("Open")
    
    def setValue(self, value):
        self.value = value
        self.colour = COLOUR_DICT[value]
        
    def setPos(self, x, y):
        self.x_cord = x
        self.y_cord = y

    def getValue(self):
        return self.value

    def getPos(self):
        return((self.x_cord,self.y_cord))

    def calcFScore(self):
        f_score = (self.GScore + self.HScore)
        
        if self.danger_score < 1:
            f_score = f_score / (1-self.danger_score)
        else:
            f_score = float('inf')

        self.FScore = round(f_score, 2)


    def setFScore(self, dist):
        self.FScore = round(dist,2)
    
    def getFScore(self):
        return(self.FScore)

    def setGScore(self, G):
        self.GScore = G
    
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
        return hash(str([self.x_cord, self.y_cord]))
    
    def setHazardPoint(self, safety_score):
        hazard_colour = (225, ((safety_score) * 230), 0)
        self.colour = hazard_colour
        # self.value = "Hazard"
        self.danger_score = 1-safety_score

        if safety_score > 0:
            self.FScore = self.FScore / safety_score
        else:
            self.FScore = float('inf')

        
class TemporalNode(Node):
    def __init__(self) -> None:
        super().__init__()
        self.danger_scores = []

    def getDangerScore(self, period: int) -> float:
        if period >= len(self.danger_scores):
            return 0    
        return self.danger_scores[period]
    
    def appendDangerScore(self) -> None:
        self.danger_scores.append(self.danger_score)

    def calcFScore(self) -> None:
        f_score = (self.GScore + self.HScore)
        danger_score = self.getDangerScore(int(self.GScore))

        if danger_score < 1:
            f_score = f_score / (1-danger_score)
        else:
            f_score = float('inf')

        self.FScore = round(f_score, 2)

    def getFScore(self) -> float:        
        self.calcFScore()
        return self.FScore
    