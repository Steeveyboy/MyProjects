import pygame as pg

class SLL:
    def printLs(self):
        print("This is the list prin            ting")
        currNode = self.head
        #print(currNode)
        i = 0
        while(currNode != None):
            print(i)
            i += 1
            print("Dist ", currNode.data.getDist(), "Hscore ", currNode.data.getHScore())
            currNode = currNode.next

    def pop(self):
        #print("HI")
        currNode = self.head
        self.head = currNode.next
        return(currNode.data)      
    
    def add(self, data):
        #print("HI")
        currNode = self.head
        prevNode = None
        newNode = node(data)
        

        while(currNode != None):
            
            if(currNode.data.getPos() == data.getPos()):
                if(newNode.data.getDist() <= currNode.data.getDist()):
                    currNode.data.setDist(newNode.data.getDist())
                print("returning false on point", data.getPos(), data.getDist, data.getHScore)
                return(False)
            
            if(newNode.data.getDist() <= currNode.data.getDist()): 
                if(newNode.data.getHScore() < currNode.data.getHScore()):
                    if(currNode == self.head):
                        
                        self.head = newNode
                        newNode.next = currNode
                        return(True)
                    else:
                        
                        prevNode.next = newNode
                        newNode.next = currNode
                        return(True)



            prevNode = currNode
            currNode = currNode.next

        if(currNode == None):
            self.head = newNode
            return(True)

        prevNode.next = newNode
        #print("currDist ", currNode.data.getDist(), "Hscore ", currNode.data.getHScore())


    def __init__(self):
        self.head = None


class node:
    def __init__(self, data):
        self.next = None
        self.data = data

"""class data():

    def getDist(self):
        return(self.dist)

    def getHScore(self):
        return(self.HScore)

    def __init__(self, dist, h):
        self.dist = dist
        self.HScore = h"""


"""ls = SLL()

ls.add(data(10, 10))
ls.add(data(10, 6))
ls.add(data(12, 10))
#print("epic")
ls.add(data(15, 15))
#print("epic")

ls.printLs()"""