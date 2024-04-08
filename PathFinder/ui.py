import tkinter as tk
import PathFinderDijkstraV4 as Dijk
import PathFinderV9 as dfs
import Astar as aStar

class ui():
    def __init__(self):
        window = tk.Tk()
        window.title = "PathFinder Portal"
        self.algorithm = None

        canvas = tk.Canvas(window, bg='white', height = 250, width=400)

        goButton = tk.Button(canvas, text="go", fg='white', bg='grey', command=lambda: self.go(), height=7, width=16)
        goButton.place(x=20,y=125)


        var = tk.StringVar(window)
        var.set('dijk')


        dijk = tk.Button(canvas, text="Dijkstras", fg='white', bg='grey', command=lambda: self.selectAlgo("dijkstras"), height=2, width = 16)
        dijk.place(x=250, y=80)

        dfs = tk.Button(canvas, text="Debt First Search", fg='white', bg='grey', command=lambda: self.selectAlgo("dfs"), height=2, width=16)
        dfs.place(x = 250, y=140)

        aStar = tk.Button(canvas, text="A*", fg = 'white', bg='grey', command=lambda: self.selectAlgo("aStar"), height=2, width=16)
        aStar.place(x=250, y=200)

        label1 = tk.Label(text = "height", font='Sans')
        label1.place(x=20, y=50)
        self.height = tk.Entry(canvas, fg='black', bg='white', width=8, bd=4)
        self.height.insert(0, '20')
        self.height.place(x=80, y=50)

        label2 = tk.Label(text = "width", font='Sans')
        label2.place(x=20, y=85)
        self.width = tk.Entry(canvas, fg='black', bg='white', width=8, bd=4)
        self.width.insert(0,'20')
        self.width.place(x=80, y=85)

        canvas.pack()
        window.mainloop()
    
    def go(self):
        height = int(self.height.get())
        width = int(self.width.get())
        #print(height, width)
        
        if(self.algorithm=='dijkstras'):
            Dijk.pathfinder(height, width)
        elif(self.algorithm=='dfs'):
            dfs.pathfinder(height, width)
        elif(self.algorithm=='aStar'):
            aStar.pathfinder(height, width)
        else:
            print("please select Algo")

    def selectAlgo(self, choice):
        #print(choice)
        self.algorithm = choice

if __name__ == '__main__':
    ui()
