from typing import Union
import sys
import os

import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from utils.database import setup_database, add_animal, get_animals

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_database()


@app.get("/api/")
def hello_world():
    return {"hello": "world"}


@app.get("/api/animals/")
def read_root():
    return get_animals()


@app.post("/api/animals/{name}")
def read_item(name: str, size: Union[str, None] = "not defined"):
    add_animal(name, size) # name is url path parameter, size is url query parameter
    return {"success": True}


bundle_dir = getattr(sys, '_MEIPASS', os.path.abspath(os.path.dirname(__file__)))
path_to_static = os.path.abspath(os.path.join(bundle_dir, './static'))

# watch out as endpoint creation order matters!
# this has to be last otherwise it would overwrite any other path
app.mount("/", StaticFiles(directory=path_to_static, html=True), name="static")


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000
    )