from http.client import HTTPException

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import uvicorn
from backend import models, crud, schemas
from backend.database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os, sys

# Tworzymy tabele jeśli nie istnieją
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency: sesja do bazy
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()


@app.post("/recipes/", response_model=schemas.RecipeCreate)
def create_new_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_recipe(db=db, id=recipe.id, name=recipe.name, date=recipe.date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Static files (na końcu!)
bundle_dir = getattr(sys, '_MEIPASS', os.path.abspath(os.path.dirname(__file__)))
path_to_static = os.path.abspath(os.path.join(bundle_dir, './static'))
app.mount("/", StaticFiles(directory=path_to_static, html=True), name="static")
if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000
    )
