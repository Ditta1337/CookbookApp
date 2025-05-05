from pydantic import BaseModel
from datetime import date
from typing import List, Optional

#Ten plik jest po to żeby fast api wiedzalo co ma dostac z http

class RecipeCreate(BaseModel):
    id: int
    name:str
    description:str
    date: date

    class Config:
        orm_mode = True  # a to jest po to zeby SQLAlchemy wiedzalo jak skonwetrowac na model

class TagCreate(BaseModel):
    id: int
    name:str

    class Config:
        orm_mode = True

class StepCreate(BaseModel):
    id: int
    title:str
    description:str

    class Config:
        orm_mode = True

class IngredientCreate(BaseModel):
    name:str
    quantity: int
    unit:str

    class Config:
        orm_mode = True

class UnitCreate(BaseModel):
    id: Optional[int]
    name: str

    class Config:
        orm_mode = True

class UnitConversionCreate(BaseModel):
    from_unit_id: int
    to_unit_id: int
    multiplier: float

    class Config:
        orm_mode = True

class IngredientUnitConversionCreate(BaseModel):
    ingredient_id: int
    from_unit_id: int
    to_unit_id: int

    class Config:
        orm_mode = True