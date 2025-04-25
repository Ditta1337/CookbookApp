from pydantic import BaseModel
from datetime import date

#Ten plik jest po to żeby fast api wiedzalo co ma dostac z http

class RecipeCreate(BaseModel):
    id: int
    name:str
    date: date

    class Config:
        orm_mode = True  # a to jest po to zeby SQLAlchemy wiedzalo jak skonwetrowac na model
