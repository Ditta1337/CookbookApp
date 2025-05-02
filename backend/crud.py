from sqlite3 import IntegrityError
from datetime import date
from sqlalchemy.orm import Session
from .models import Recipe, Unit, UnitConversion, IngredientUnitConversion

# Metody dla tabeli Units
def get_all_units(db: Session):
    return db.query(Unit).all()

def create_unit(db: Session, id: int, name: str):
    try:
        unit = Unit(id=id, name=name)
        db.add(unit)
        db.commit()
        db.refresh(unit)
        return unit
    except IntegrityError:
        db.rollback()
        raise ValueError("Unit with this ID already exists.")

def get_unit(db: Session, id: int):
    return db.query(Unit).filter(Unit.id == id).first()

def update_unit(db: Session, id: int, name: str):
    unit = db.query(Unit).filter(Unit.id == id).first()
    if unit:
        unit.name = name
        db.commit()
        db.refresh(unit)
        return unit
    else:
        raise ValueError(f"Unit with ID {id} not found.")

def delete_unit(db: Session, id: int):
    unit = db.query(Unit).filter(Unit.id == id).first()
    if unit:
        db.delete(unit)
        db.commit()
        return {"message": f"Unit with ID {id} deleted successfully."}
    else:
        raise ValueError(f"Unit with ID {id} not found.")

# Metody dla tabeli UnitConversion
def get_all_unit_conversions(db: Session):
    return db.query(UnitConversion).all()

def create_unit_conversion(db: Session, from_unit_id: int, to_unit_id: int, multiplier: float):
    try:
        unit_conversion = UnitConversion(from_unit_id=from_unit_id, to_unit_id=to_unit_id, multiplier=multiplier)
        db.add(unit_conversion)
        db.commit()
        db.refresh(unit_conversion)
        return unit_conversion
    except IntegrityError:
        db.rollback()
        raise ValueError("Unit conversion with these units already exists.")

def get_unit_conversion(db: Session, from_unit_id: int, to_unit_id: int):
    return db.query(UnitConversion).filter(UnitConversion.from_unit_id == from_unit_id, UnitConversion.to_unit_id == to_unit_id).first()

def update_unit_conversion(db: Session, from_unit_id: int, to_unit_id: int, multiplier: float):
    unit_conversion = db.query(UnitConversion).filter(UnitConversion.from_unit_id == from_unit_id, UnitConversion.to_unit_id == to_unit_id).first()
    if unit_conversion:
        unit_conversion.multiplier = multiplier
        db.commit()
        db.refresh(unit_conversion)
        return unit_conversion
    else:
        raise ValueError(f"Unit conversion from unit ID {from_unit_id} to unit ID {to_unit_id} not found.")

def delete_unit_conversion(db: Session, from_unit_id: int, to_unit_id: int):
    unit_conversion = db.query(UnitConversion).filter(UnitConversion.from_unit_id == from_unit_id, UnitConversion.to_unit_id == to_unit_id).first()
    if unit_conversion:
        db.delete(unit_conversion)
        db.commit()
        return {"message": f"Unit conversion from unit ID {from_unit_id} to unit ID {to_unit_id} deleted successfully."}
    else:
        raise ValueError(f"Unit conversion from unit ID {from_unit_id} to unit ID {to_unit_id} not found.")

# Metody dla tabeli IngredientUnitConversion
def get_all_ingredient_unit_conversions(db: Session):
    return db.query(IngredientUnitConversion).all()

def create_ingredient_unit_conversion(db: Session, ingredient_id: int, from_unit_id: int, to_unit_id: int):
    try:
        ingredient_unit_conversion = IngredientUnitConversion(ingredient_id=ingredient_id, from_unit_id=from_unit_id, to_unit_id=to_unit_id)
        db.add(ingredient_unit_conversion)
        db.commit()
        db.refresh(ingredient_unit_conversion)
        return ingredient_unit_conversion
    except IntegrityError:
        db.rollback()
        raise ValueError("Ingredient unit conversion with these units already exists.")

def get_ingredient_unit_conversion(db: Session, ingredient_id: int, from_unit_id: int, to_unit_id: int):
    return db.query(IngredientUnitConversion).filter(IngredientUnitConversion.ingredient_id == ingredient_id, IngredientUnitConversion.from_unit_id == from_unit_id, IngredientUnitConversion.to_unit_id == to_unit_id).first()

def delete_ingredient_unit_conversion(db: Session, ingredient_id: int, from_unit_id: int, to_unit_id: int):
    ingredient_unit_conversion = db.query(IngredientUnitConversion).filter(IngredientUnitConversion.ingredient_id == ingredient_id, IngredientUnitConversion.from_unit_id == from_unit_id, IngredientUnitConversion.to_unit_id == to_unit_id).first()
    if ingredient_unit_conversion:
        db.delete(ingredient_unit_conversion)
        db.commit()
        return {"message": f"Ingredient unit conversion for ingredient ID {ingredient_id} from unit ID {from_unit_id} to unit ID {to_unit_id} deleted successfully."}
    else:
        raise ValueError(f"Ingredient unit conversion for ingredient ID {ingredient_id} from unit ID {from_unit_id} to unit ID {to_unit_id} not found.")




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
