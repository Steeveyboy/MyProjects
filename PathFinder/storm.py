# from NodeMap import NodeMap
import pygame as pg

SIZE_OF_BLOCK = 32

class OceanStorm:
    """A class representing an Ocean storm on a Raster Map"""
    
    def __init__(self, x, y, Map, Frame, radius=3):
        self.x = x
        self.y = y
        self.stormStart = (x, y)
        self.stormEnd = None
        self.radius = radius
        
        self.currentStormPoints = []
        self.drawStorm(Map, Frame)

    def setStormEnd(self, pos):
        if not self.stormEnd:
            self.stormEnd = pos
    
    def moveStorm(self, mat, node_map):
        """This function will redraw the storm on the map"""
        print(f"MOVING STORM FROM {self.x}, {self.y}", end=" ")
        self.cleanUPStorm(mat, node_map)
        end_x, end_y = self.stormEnd
        if self.x != end_x:
            if self.x < end_x: self.x += 1
            else: self.x -= 1
        if self.y != end_y:
            if self.y < end_y: self.y += 1
            else: self.y -= 1
        print(f" -> {self.x}, {self.y}")
        self.drawStorm(mat, node_map)

        
    def setupStorm(self, Map, Frame):
        pass

    def getColor(self, place):
        return ((place)/self.radius) * 230
    
    def cleanUPStorm(self, mat, node_map):
        for curr_x, curr_y in self.currentStormPoints:
            mat[curr_x][curr_y].danger_score = 0
            mat[curr_x][curr_y].setValue(mat[curr_x][curr_y].value)
            node_map.drawNodeOnMap(mat[curr_x][curr_y])
        self.currentStormPoints = []

    
    def drawStorm(self, mat, node_map):

        num_rows = len(mat)
        num_cols = len(mat[0])

        top = max(0, self.y - self.radius)
        bottom = min(num_rows, self.y + self.radius)
        left = min(0, self.x - self.radius)
        right = max(num_cols, self.x + self.radius)

        for i in range(top, bottom+1):
            for j in range(left, right+1):
                place = abs(i - self.y) + abs(j - self.x)
                if place <= self.radius:
                    colour = self.getColor(place)
                    self.currentStormPoints.append((j, i))
                    mat[j][i].setHazardPoint(safety_score = (place/self.radius))
                    node_map.drawNodeOnMap(mat[j][i])
                    # pg.draw.rect(Frame, (225, colour, 0), ((SIZE_OF_BLOCK*j), (SIZE_OF_BLOCK*i),SIZE_OF_BLOCK,SIZE_OF_BLOCK))
    