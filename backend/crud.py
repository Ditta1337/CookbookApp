from sqlite3 import IntegrityError
from datetime import date
from sqlalchemy.orm import Session
from .models import Recipe


def create_recipe(db: Session, id: int, name: str, date: date):
    try:
        recipe = Recipe(id=id, name=name, date=date)
        db.add(recipe)
        db.commit()
        db.refresh(recipe)
        return recipe
    except IntegrityError:
        db.rollback()
        raise ValueError("Recipe with this ID already exists.")


def get_recipe(db: Session, id: int):
    return db.query(Recipe).filter(Recipe.id == id).first()


def update_recipe(db: Session, id: int, name: str, date: date):
    recipe = db.query(Recipe).filter(Recipe.id == id).first()
    if recipe:
        recipe.name = name
        recipe.date = date
        db.commit()
        db.refresh(recipe)
        return recipe
    else:
        raise ValueError(f"Recipe with ID {id} not found.")


def delete_recipe(db: Session, id: int):
    recipe = db.query(Recipe).filter(Recipe.id == id).first()
    if recipe:
        db.delete(recipe)
        db.commit()
        return {"message": f"Recipe with ID {id} deleted successfully."}
    else:
        raise ValueError(f"Recipe with ID {id} not found.")
