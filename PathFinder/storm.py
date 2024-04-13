# from NodeMap import NodeMap
import pygame as pg

SIZE_OF_BLOCK = 32

class OceanStorm:
    """A class representing an Ocean storm on a Raster Map"""
    
    def __init__(self, x, y, Map, Frame, radius=3):
        self.x = x
        self.y = y
        self.radius = radius
        self.currentStormPoints = []
        self.drawStorm(Map, Frame)
        
    def setupStorm(self, Map, Frame):
        pass

    def getColor(self, place):
        return ((place)/self.radius) * 230
    
    def drawStorm(self, Map,  Frame):

        num_rows = len(Map)
        num_cols = len(Map[0])

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
                    Map[j][i].setHazardPoint(safety_score = (place/self.radius))
                    pg.draw.rect(Frame, (225, colour, 0), ((SIZE_OF_BLOCK*j), (SIZE_OF_BLOCK*i),SIZE_OF_BLOCK,SIZE_OF_BLOCK))
                    