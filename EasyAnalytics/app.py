from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import uvicorn

app = FastAPI()

templates = Jinja2Templates(directory="tmp")

@app.get("/")
async def landing(request: Request):
    context = {"request": request}
    return templates.TemplateResponse("index.html", context)

if __name__ == "__main__":
    
    uvicorn.run("app:app", host="localhost", port=5151, log_level="info", reload=True)
