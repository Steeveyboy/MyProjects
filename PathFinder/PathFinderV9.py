
#ThePathFinder
import TheNode
import time
import TheMapV4 as Map
import pygame as pg
from pygame.locals import *
#Note These are all in real numbers
#as in you must do -1 when passing arguments so that is in the index


#this is a Depth First search not great for run time, also not great for O(n) run time
"""We did it, as it can be seen the Depth First search algorythm is inefficient."""

class pathfinder:
    #global end
    #end = []
    #start = []

    def __init__(self, rows, cols):
        #This simply starts the pathfinder
        self.end = []
        global start
        
        self.Map = Map.TheMap(rows, cols)
        
        running = True
        while running == True:
            
            for event in pg.event.get():
                if event.type == QUIT:
                    running = False
                    
                if pg.mouse.get_pressed()[0] and not pg.key.get_pressed()[K_LSHIFT]:
                    pos = pg.mouse.get_pos()
                    pos = self.Map.getPos(pos)
                    #print(pos)
                    self.Map.SetStart(pos)
                    x, y = pos
                    start = [x, y]

                if pg.mouse.get_pressed()[1] or (pg.key.get_pressed()[K_LSHIFT] and pg.mouse.get_pressed()[0]):
                    pos = pg.mouse.get_pos()
                    pos = self.Map.getPos(pos)
                    #print(pos)
                    self.Map.SetBloc(pos)

                if pg.mouse.get_pressed()[2]:
                    pos = pg.mouse.get_pos()
                    pos = self.Map.getPos(pos)
                    #print(pos)
                    self.Map.SetEnd(pos)
                    x, y = pos
                    self.end = [x, y]

                if pg.key.get_pressed()[K_SPACE]:
                    #print(start, Map.mat[start[0]][start[1]].getPos())
                    self.step(self.Map.mat[start[0]][start[1]], start)
                    break
                
        self.Map.quitMap()

        
        
        
    def step(self, node, place):
        time.sleep(0.03)
        #print(place, end, "from STEP", node.getValue(), node.getPos())

        if node.getValue() == "End":
            #print("you made it !!!!!!!!!!")
            return(True)
        
        if node.value != "Start":
            self.Map.setCrossed((node.getPos()))
        
        
        moves = self.Rank(place)
        #print(place)
        
        i = 0       
        t = False
        for i in range(len(moves)):
            if self.check(moves[i]):
                #print("go")
                t = self.step(moves[i], moves[i].getPos())
                if t == True:
                
                    if node.value != "Start":
                        #print(node.getPos())
                        self.Map.setBest((node.getPos()))
                        #print('hi')
                    return(True)

        return(False)


    def check(self, b):
        #if b.value = "Bloc" or b.value == "Crossed":
        if b.value != "Open" and b.value != "End":
            return(False)
        return(True)


    def Rank(self, a):
        #This ranks the moves from most favorable to least.
        #global end
        ort = self.orient(a)
        rnk = self.Ornk(a, ort)
        
        inter = [None, None, None, None]
        
        if abs(ort[0]) >= abs(ort[1]):
            inter[0] = rnk[0][0]
            inter[1] = rnk[1][0]
            inter[2] = rnk[1][1]
            inter[3] = rnk[0][1]

        elif abs(ort[0]) < abs(ort[1]):
            inter[0] = rnk[1][0]
            inter[1] = rnk[0][0]
            inter[2] = rnk[0][1]
            inter[3] = rnk[1][1]

        return(inter)

    def Ornk(self, a, ort):
        #This Ranks the moves by Axis, and returns 2 lists
        #print(a, ort, "From Me")
        x = [None, None]
        y = [None, None]
        if ort[0]>=0:
            x[0] = self.Map.mat[a[0]+1][a[1]]
            x[1] = self.Map.mat[a[0]-1][a[1]]

        if ort[0]<0:
            x[1] = self.Map.mat[a[0]+1][a[1]]
            x[0] = self.Map.mat[a[0]-1][a[1]]
            
        if ort[1]>=0:
            y[0] = self.Map.mat[a[0]][a[1]+1]
            y[1] = self.Map.mat[a[0]][a[1]-1]
        if ort[1]<0:
            y[0] = self.Map.mat[a[0]][a[1]-1]
            y[1] = self.Map.mat[a[0]][a[1]+1]
            
        #rint(x, y)
        return([x, y])
        

    def survey(self, a):
        #Up Down Left Right
        moves = [self.Map.mat[a[0]][a[1]-1].value, self.Map.mat[a[0]][a[1]+1].value, self.Map.mat[a[0]-1][a[1]].value, self.Map.mat[a[0]+1][a[1]].value]
        #print(moves)
        return(moves)    

        
    def orient(self, a):
        #This gives the program orientation
        #print(a, b, "from orient")
        x = self.end[0] - a[0] # if positive go right, negative go left
        y = self.end[1] - a[1] # if positive go down, up
        return([x, y])

#pathfinder()

