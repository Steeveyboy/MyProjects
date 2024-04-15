#this is a try at pygame
import pygame as pg
from pygame.locals import K_LSHIFT, QUIT, K_SPACE, K_ESCAPE, KEYDOWN, K_s, K_LCTRL, K_l, MOUSEMOTION
import time
from storm import OceanStorm
# from NewAstar import PathfindingAlgorithm

import MapNode as Node

red = (255,0,0)
blue = (0,0,255)
yellow = (0,255,0)
black = (0,0,0)
white = (255,255,255)
orange = (255, 150, 0)
turquoise = (64,224,208)

SIZE_OF_BLOCK = 32

class NodeMap:
    
    def __init__(self, cols, rows):
        self.num_rows = rows
        self.num_cols = cols
        self.start = None
        self.end = None

        self.storm = None

        self.update_each_frame = True
        
        self.root = pg.init()

        Frame = pg.display.set_mode((SIZE_OF_BLOCK*cols,SIZE_OF_BLOCK*rows))

        self.Frame = Frame
        pg.display.set_caption("Pathfinding")
        white = (255,255,255)
        self.Frame.fill(white)
        pg.display.update()
        
        #Setting up the Frame
        self.setupBaseMap(cols, rows)
        self.runMainLoop()
    
    def runMainLoop(self):

        running = True
        while running:
            for event in pg.event.get(pump=True):
                if event.type == QUIT:
                    running = False
                    
                if pg.mouse.get_pressed()[0]:
                    pos = pg.mouse.get_pos()
                    pos = self.getPos(pos)
                    
                    if pg.key.get_pressed()[K_LSHIFT]:
                        self.SetBloc(pos)

                    elif pg.key.get_pressed()[K_s]:
                        self.setStorm(pos)
                    #     # self.storm.cleanUPStorm(self.mat, self)
                        pg.display.update()
                        
                    elif pg.key.get_pressed()[K_LCTRL]:
                        self.unsetBlock(pos)
                        
                    else:
                        self.SetStart(pos)

                if pg.mouse.get_pressed()[2]:
                    pos = pg.mouse.get_pos()
                    pos = self.getPos(pos)

                    if pg.key.get_pressed()[K_s]:
                        self.storm.setStormEnd(pos)

                    else:
                        self.SetEnd(pos)
                        # self.end = self.Map.end
                    

                if pg.key.get_pressed()[K_SPACE]:
                    running = False
                    break

                # if pg.key.get_pressed()[K_l]:
                #     print("Next Turn for storm")
                #     # self.storm.moveStorm(self.mat, self)
                #     # pg.display.update()
                # print(event)

    def waitOnQuit(self):
        print("Waiting for user Exit")
        running = True
        while running:
            if pg.event.get(QUIT):
                running = False
                self.quitMap()

    def resetNodes(self):
        for row in self.mat:
            for node in row:
                node.resetAnalysis()
                self.drawNodeOnMap(node)

    def updateMapObjects(self):
        self.resetNodes()
        if self.storm:
            self.storm.move(self.mat, self)
        pg.display.update()

    
    def setupBaseMap(self, cols, rows):
        """Draw border along map edge, and open grid nodes."""
        self.mat = []
        for c in range(cols):
            x = []
            for r in range(rows):
                
                node = Node.Node()
                node.setValue("Open")
                node.setPos(c, r)
                node.setCord([SIZE_OF_BLOCK*c, SIZE_OF_BLOCK*r])
                x.append(node)
                self.drawNodeOnMap(node, width=0)
            self.mat.append(x)

        for r in range(rows):
                self.mat[0][r].setValue("Bloc")
                self.drawNodeOnMap(self.mat[0][r], width=0)

                self.mat[cols-1][r].setValue("Bloc")
                self.drawNodeOnMap(self.mat[cols-1][r], width=0)

        for c in range(cols):
                self.mat[c][0].setValue("Bloc")
                self.drawNodeOnMap(self.mat[c][0], width=0)
                
                self.mat[c][rows-1].setValue("Bloc")
                self.drawNodeOnMap(self.mat[c][rows-1], width=0)

        pg.display.update()

    
    def drawNodeOnMap(self, node: Node, width: int = 0):
        pg.draw.rect(
            self.Frame,
            node.colour, 
            ((SIZE_OF_BLOCK*node.x_cord), SIZE_OF_BLOCK*node.y_cord, SIZE_OF_BLOCK, SIZE_OF_BLOCK),
            width
            )
        pg.draw.rect(
            self.Frame,
            (0,0,0), 
            ((SIZE_OF_BLOCK*node.x_cord), SIZE_OF_BLOCK*node.y_cord, SIZE_OF_BLOCK, SIZE_OF_BLOCK),
            width=1
            )
        
    
    def quitMap(self):
        pg.quit()


    def SetStart(self, pos):
        x, y = pos

        if self.start:
            self.start.resetAnalysis()
            self.drawNodeOnMap(self.start)

        self.start = self.mat[x][y]
        self.start.setValue("Start")
        self.start.setFScore(0)
        self.start.setGScore(0)
        self.drawNodeOnMap(self.start)
        pg.display.update()
        
        return True

    def SetBloc(self, pos):
        x, y = pos
        self.mat[x][y].setValue("Bloc")
        self.drawNodeOnMap(self.mat[x][y])

        pg.display.update()
    
    def unsetBlock(self, pos):
        x, y = pos
        self.mat[x][y].setValue("Open")
        self.drawNodeOnMap(self.mat[x][y])
        pg.display.update()
        
    def setBest(self, node: Node):
        # x, y = node.getPos()
        node.setValue("Best")
        self.drawNodeOnMap(node)

        # if self.update_each_frame:

        pg.display.update()
 

    def setChecked(self, node: Node):
        
        if node.value == "Start":
            return
        
        node.setValue("Checked")
        node.setVisited()
        pg.draw.rect(self.Frame, node.colour, ((SIZE_OF_BLOCK*node.x_cord),(SIZE_OF_BLOCK*node.y_cord),SIZE_OF_BLOCK,SIZE_OF_BLOCK))
        if self.update_each_frame:
            pg.display.update()

    def SetEnd(self, pos):
        x, y = pos
        if self.mat[x][y].value != "End" and self.end == None:
            self.mat[x][y].setValue("End")
            pg.draw.rect(self.Frame, self.mat[x][y].colour, ((SIZE_OF_BLOCK*x), (SIZE_OF_BLOCK*y),SIZE_OF_BLOCK,SIZE_OF_BLOCK))
            self.end = self.mat[x][y]

        elif self.mat[x][y].value == "End":
            self.mat[x][y].setValue("Open")
            pg.draw.rect(self.Frame, self.mat[x][y].colour, ((SIZE_OF_BLOCK*x), (SIZE_OF_BLOCK*y),SIZE_OF_BLOCK,SIZE_OF_BLOCK))
            pg.draw.rect(self.Frame, (0,0,0), ((SIZE_OF_BLOCK*x), (SIZE_OF_BLOCK*y),SIZE_OF_BLOCK,SIZE_OF_BLOCK), 1)
            self.end = None
        
        pg.display.update()

    def setNext(self, pos):
        x, y = pos
        self.mat[x][y].setValue("Next")
        self.drawNodeOnMap(self.mat[x][y], width=0)
        #pg.draw.circle(self.Frame, (0,0,0), ((SIZE_OF_BLOCK*x + 16), (SIZE_OF_BLOCK*y + 16)), 10, 4)
        # pg.draw.rect(self.Frame, (0, 200, 0), ((SIZE_OF_BLOCK*x), (SIZE_OF_BLOCK*y),SIZE_OF_BLOCK,SIZE_OF_BLOCK))
        if self.update_each_frame:
            pg.display.update()
    
    def setStorm(self, pos):
        x, y = pos
        self.storm = OceanStorm(x, y, self.mat, self)

        pg.display.update()

    def displayScore(self, node):
        x, y = node.getPos()
        myfont = pg.font.Font('freesansbold.ttf', 12)
        myffont = pg.font.Font('freesansbold.ttf', 8)
        text = myfont.render(str(node.getFScore()), True, (0,0,0))
        textf = myffont.render(str(node.getGScore()), True, (0,0,0))
        texth = myffont.render(str(node.getHScore()), True, (0,0,0))

        textfRect = text.get_rect()
        textfRect.center = (SIZE_OF_BLOCK*x+16, SIZE_OF_BLOCK*y+8)

        textRect = text.get_rect()
        textRect.center = (SIZE_OF_BLOCK*x+16, SIZE_OF_BLOCK*y+16)

        textHRect = text.get_rect()
        textHRect.center = (SIZE_OF_BLOCK*x+16, SIZE_OF_BLOCK*y+26)

        self.Frame.blit(text, textRect)
        self.Frame.blit(textf, textfRect)
        self.Frame.blit(texth, textHRect)

        if self.update_each_frame:
            pg.display.update()

    def displayNodeScore(self, node):
        x, y = node.getPos()
        myfont = pg.font.Font('freesansbold.ttf', 12)
        myffont = pg.font.Font('freesansbold.ttf', 8)
        text = myfont.render(str(node.getFScore()), True, (0,0,0))
        textf = myffont.render(str(node.getGScore()), True, (0,0,0))
        texth = myffont.render(str(node.getHScore()), True, (0,0,0))

        textfRect = text.get_rect()
        textfRect.center = (SIZE_OF_BLOCK*x+16, SIZE_OF_BLOCK*y+8)

        textRect = text.get_rect()
        textRect.center = (SIZE_OF_BLOCK*x+16, SIZE_OF_BLOCK*y+16)

        textHRect = text.get_rect()
        textHRect.center = (SIZE_OF_BLOCK*x+16, SIZE_OF_BLOCK*y+26)

        self.Frame.blit(text, textRect)
        self.Frame.blit(textf, textfRect)
        self.Frame.blit(texth, textHRect)

    def displayAllScores(self):
        
        for row in self.mat:
            for node in row:
                if node.getValue() not in {"Open", "Bloc"}:
                    self.displayNodeScore(node)
        
        pg.display.update()
        

    def getPos(self, pos):
        """Coordinates to position on Map"""
        x, y = pos
        
        xVal = x // SIZE_OF_BLOCK
        yVal = y // SIZE_OF_BLOCK

        pos = (xVal, yVal)
        
        return(pos)


    def getMat(self):
        return(self.mat)


class TemporalNodeMap(NodeMap):
    def __init__(self, cols, rows) -> None:
        super().__init__(cols, rows)
        

    def setupBaseMap(self, cols, rows):
        """Draw border along map edge, and open grid nodes."""
        self.mat = []
        for c in range(cols):
            x = []
            for r in range(rows):
                
                node = Node.TemporalNode()
                node.setValue("Open")
                node.setPos(c, r)
                node.setCord([SIZE_OF_BLOCK*c, SIZE_OF_BLOCK*r])
                x.append(node)
                self.drawNodeOnMap(node, width=0)
            self.mat.append(x)

        for r in range(rows):
                self.mat[0][r].setValue("Bloc")
                self.drawNodeOnMap(self.mat[0][r], width=0)

                self.mat[cols-1][r].setValue("Bloc")
                self.drawNodeOnMap(self.mat[cols-1][r], width=0)

        for c in range(cols):
                self.mat[c][0].setValue("Bloc")
                self.drawNodeOnMap(self.mat[c][0], width=0)
                
                self.mat[c][rows-1].setValue("Bloc")
                self.drawNodeOnMap(self.mat[c][rows-1], width=0)
        pg.display.update()

    def updateAllPointsDanger(self):
        for row in self.mat:
            for node in row:
                node.appendDangerScore()

    def forcastStorm(self) -> None:
        print("starting forcast")
        if self.storm.stormEnd:
            self.updateAllPointsDanger()
            while self.storm.getCurrPos() != self.storm.stormEnd:
                self.storm.move(self.mat, self)
                self.updateAllPointsDanger()
                pg.display.update()
                time.sleep(0.1)
        # print(self.mat[10][7].danger_scores)
        pass