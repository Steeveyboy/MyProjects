from NodeMap import NodeMap
import pygame as pg

SIZE_OF_BLOCK = 32

class OceanStorm:
    """A class representing an Ocean storm on a Raster Map"""
    
    def __init__(self, x, y, Map, Frame, radius=2):
        self.x = x
        self.y = y
        self.radius = radius

        
        
    def setupStorm(self, Map, Frame):
        pass

    def getColor(self, place):
        return ((place)/self.radius) * 230
    
    def drawStorm(self, Map,  Frame):

        top = max(0, self.y - self.radius)
        bottom = min(self.num_rows, self.y + self.radius)
        left = min(0, self.x - self.radius)
        right = max(self.num_cols, self.x + self.radius)

        for i in range(top, bottom+1):
            for j in range(left, right+1):
                place = abs(i - self.y) + abs(j - self.x)
                if place <= self.radius:
                    colour = self.getColor(place)
                    pg.draw.rect(self.Frame, (225, colour, 0), ((SIZE_OF_BLOCK*j), (SIZE_OF_BLOCK*i),SIZE_OF_BLOCK,SIZE_OF_BLOCK))
                    