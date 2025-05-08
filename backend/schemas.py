from pydantic import BaseModel
from datetime import date
from typing import List, Optional

#Ten plik jest po to żeby fast api wiedzalo co ma dostac z http

class RecipeCreate(BaseModel):
    title: str
    description: str
    date: date
    tags: List[str]
    steps: List["StepCreate"]
    ingredients: List["RecipeIngredientCreate"]

class RecipeSearchQuery(BaseModel):
    name: str
    limit: Optional[int] = 10  # Domyślnie 10

class TagCreate(BaseModel):
    name: str

class TagRead(TagCreate):
    id: int

    class Config:
        from_attributes = True  # a to jest podobno jakby na odwrot

class StepCreate(BaseModel):
    title:str
    description:str

    class Config:
        orm_mode = True

class RecipeIngredientCreate(BaseModel):
    name:str
    quantity:int
    unit:str

class IngredientCreate(BaseModel):
    name:str

    class Config:
        orm_mode = True

class UnitCreate(BaseModel):
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


class IngredientOut(BaseModel):
    name: str
    quantity: float
    unit: str

class StepOut(BaseModel):
    title: str
    description: str

class RecipeFullOut(BaseModel):
    id:int
    title: str
    description: str
    tags: List[str]
    steps: List[StepOut]
    ingredients: List[IngredientOut]

    class Config:
        orm_mode = True