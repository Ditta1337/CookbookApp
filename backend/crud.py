from sqlite3 import IntegrityError
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from .models import *
from . import schemas


# Metody dla tabeli Ingredients
def get_ingredient_by_name(db: Session, name: str):
    return db.query(Ingredient).filter(Ingredient.name == name).first()

def create_ingredient(db: Session, name: str):
    try:
        ingredient = Ingredient(name=name)
        db.add(ingredient)
        db.commit()
        db.refresh(ingredient)
        return ingredient
    except IntegrityError:
        db.rollback()
        raise ValueError("Ingredient already exists.")

# Metody dla tabeli Units
def get_unit_by_name(db: Session, name: str):
    return db.query(Unit).filter(Unit.name == name).first()

def get_all_units(db: Session):
    return db.query(Unit).all()

def create_unit(db: Session, name: str):
    try:
        unit = Unit(name=name)
        db.add(unit)
        db.commit()
        db.refresh(unit)
        return unit
    except IntegrityError:
        db.rollback()
        raise ValueError("Unit already exists.")


def get_unit(db: Session, id: int):
    return db.query(Unit).filter(Unit.id == id).first()


def get_unit_by_name(db: Session, name: str):
    return db.query(Unit).filter(Unit.name == name).first()


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
def get_convertible_units(db: Session, unit_id: int):
    return db.query(UnitConversion).filter(UnitConversion.from_unit_id == unit_id).all()

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
    return db.query(UnitConversion).filter(UnitConversion.from_unit_id == from_unit_id,
                                           UnitConversion.to_unit_id == to_unit_id).first()


def update_unit_conversion(db: Session, from_unit_id: int, to_unit_id: int, multiplier: float):
    unit_conversion = db.query(UnitConversion).filter(UnitConversion.from_unit_id == from_unit_id,
                                                      UnitConversion.to_unit_id == to_unit_id).first()
    if unit_conversion:
        unit_conversion.multiplier = multiplier
        db.commit()
        db.refresh(unit_conversion)
        return unit_conversion
    else:
        raise ValueError(f"Unit conversion from unit ID {from_unit_id} to unit ID {to_unit_id} not found.")


def delete_unit_conversion(db: Session, from_unit_id: int, to_unit_id: int):
    unit_conversion = db.query(UnitConversion).filter(UnitConversion.from_unit_id == from_unit_id,
                                                      UnitConversion.to_unit_id == to_unit_id).first()
    if unit_conversion:
        db.delete(unit_conversion)
        db.commit()
        return {"message": f"Unit conversion from unit ID {from_unit_id} to unit ID {to_unit_id} deleted successfully."}
    else:
        raise ValueError(f"Unit conversion from unit ID {from_unit_id} to unit ID {to_unit_id} not found.")


# Metody dla tabeli IngredientUnitConversion
def get_convertible_ingredient_units(db: Session, ingredient_id: int, unit_id: int):
    return db.query(IngredientUnitConversion).filter(IngredientUnitConversion.ingredient_id == ingredient_id, IngredientUnitConversion.from_unit_id == unit_id).all()

def get_all_ingredient_unit_conversions(db: Session):
    return db.query(IngredientUnitConversion).all()


def create_ingredient_unit_conversion(db: Session, ingredient_id: int, from_unit_id: int, to_unit_id: int, multiplier: float):
    try:
        ingredient_unit_conversion = IngredientUnitConversion(ingredient_id=ingredient_id, from_unit_id=from_unit_id,
                                                              to_unit_id=to_unit_id, multiplier=multiplier)
        db.add(ingredient_unit_conversion)
        db.commit()
        db.refresh(ingredient_unit_conversion)
        return ingredient_unit_conversion
    except IntegrityError:
        db.rollback()
        raise ValueError("Ingredient unit conversion with these units already exists.")


def get_ingredient_unit_conversion(db: Session, ingredient_id: int, from_unit_id: int, to_unit_id: int):
    return db.query(IngredientUnitConversion).filter(IngredientUnitConversion.ingredient_id == ingredient_id,
                                                     IngredientUnitConversion.from_unit_id == from_unit_id,
                                                     IngredientUnitConversion.to_unit_id == to_unit_id).first()


def delete_ingredient_unit_conversion(db: Session, ingredient_id: int, from_unit_id: int, to_unit_id: int):
    ingredient_unit_conversion = db.query(IngredientUnitConversion).filter(
        IngredientUnitConversion.ingredient_id == ingredient_id, IngredientUnitConversion.from_unit_id == from_unit_id,
        IngredientUnitConversion.to_unit_id == to_unit_id).first()
    if ingredient_unit_conversion:
        db.delete(ingredient_unit_conversion)
        db.commit()
        return {
            "message": f"Ingredient unit conversion for ingredient ID {ingredient_id} from unit ID {from_unit_id} to unit ID {to_unit_id} deleted successfully."}
    else:
        raise ValueError(
            f"Ingredient unit conversion for ingredient ID {ingredient_id} from unit ID {from_unit_id} to unit ID {to_unit_id} not found.")


def create_recipe(db: Session, recipe_data: schemas.RecipeCreate):
    # recipe
    recipe = Recipe(
        name=recipe_data.title,
        description=recipe_data.description,
        date=recipe_data.date,
        img=recipe_data.img
    )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)

    # tags
    for tag_name in recipe_data.tags:
        tag = db.query(Tag).filter(Tag.name == tag_name).first()
        if not tag:
            tag = Tag(name=tag_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)

        recipe_tag = RecipeToTag(recipe_id=recipe.id, tag_id=tag.id)
        db.add(recipe_tag)

    # ingredients
    for ingredient_data in recipe_data.ingredients:
        ingredient = db.query(Ingredient).filter(Ingredient.name == ingredient_data.name).first()
        if not ingredient:
            ingredient = Ingredient(name=ingredient_data.name)
            db.add(ingredient)
            db.commit()
            db.refresh(ingredient)

        unit = db.query(Unit).filter(Unit.name == ingredient_data.unit).first()
        if not unit:
            unit = Unit(name=ingredient_data.unit)
            db.add(unit)
            db.commit()
            db.refresh(unit)

        recipe_ingredient = RecipesToIngredients(
            recipe_id=recipe.id,
            ingredient_id=ingredient.id,
            quantity=ingredient_data.quantity,
            unit_id=unit.id
        )
        db.add(recipe_ingredient)

    for step_order, step_data in enumerate(recipe_data.steps, start=1):
        step = db.query(Step).filter(Step.title == step_data.title).first()
        if not step:
            step = Step(
                title=step_data.title,
                description=step_data.description
            )
            db.add(step)
            db.commit()
            db.refresh(step)

        recipe_step = RecipeSteps(
            recipe_id=recipe.id,
            step_id=step.id,
            step_order=step_order
        )
        db.add(recipe_step)

    db.commit()

    return recipe


def get_recipe_by_id(db: Session, id: int):
    recipe=db.query(Recipe).filter(Recipe.id == id).first()
    #tags
    tag_ids = (
        db.query(RecipeToTag.tag_id)
        .filter(RecipeToTag.recipe_id == id)
        .subquery()
    )
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()
    #steps
    step_ids = (
        db.query(RecipeSteps.step_id)
        .filter(RecipeSteps.recipe_id == id)
        .subquery()
    )
    steps = db.query(Step).filter(Step.id.in_(step_ids)).all()
    #ingredients
    ingredients = (
        db.query(RecipesToIngredients.quantity, Ingredient, Unit)
        .join(Ingredient, Ingredient.id == RecipesToIngredients.ingredient_id)
        .join(Unit, Unit.id == RecipesToIngredients.unit_id)
        .filter(RecipesToIngredients.recipe_id == id)
        .all()
    )

    recipeData = {
        "id":recipe.id,
        "title":recipe.name,
        "img":recipe.img,
        "description":recipe.description,
        "tags":[tag.name for tag in tags],
        "steps" : [ {"title":step.title,
                   "description":step.description
                   } for step in steps],
        "ingredients":[{
                "name": ingredient[1].name,
                "quantity": ingredient[0],
                "unit": ingredient[2].name,
        } for ingredient in ingredients]
    }

    return recipeData


def get_all_recipes(db: Session):
    recipes = db.query(Recipe).all()

    recipe_data = []
    for recipe in recipes:
        tag_ids = (
            db.query(RecipeToTag.tag_id)
            .filter(RecipeToTag.recipe_id == recipe.id)
            .subquery()
        )
        tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

        step_ids = (
            db.query(RecipeSteps.step_id)
            .filter(RecipeSteps.recipe_id == recipe.id)
            .subquery()
        )
        steps = db.query(Step).filter(Step.id.in_(step_ids)).all()

        ingredients = (
            db.query(RecipesToIngredients.quantity, Ingredient, Unit)
            .join(Ingredient, Ingredient.id == RecipesToIngredients.ingredient_id)
            .join(Unit, Unit.id == RecipesToIngredients.unit_id)
            .filter(RecipesToIngredients.recipe_id == recipe.id)
            .all()
        )

        recipe_data.append({
            "id": recipe.id,
            "title": recipe.name,
            "img":recipe.img,
            "description": recipe.description,
            "tags": [tag.name for tag in tags],
            "steps": [{"title": step.title, "description": step.description} for step in steps],
            "ingredients": [{
                "name": ingredient[1].name,
                "quantity": ingredient[0],
                "unit": ingredient[2].name,
            } for ingredient in ingredients]
        })
        # print(recipe_data)

    return recipe_data



def get_recipes_by_name(db: Session, name: str, limit_: int):
    recipes = db.query(Recipe).filter(Recipe.name.ilike(f"%{name}%")).limit(limit_).all()

    recipe_data = []
    for recipe in recipes:
        tag_ids = (
            db.query(RecipeToTag.tag_id)
            .filter(RecipeToTag.recipe_id == recipe.id)
            .subquery()
        )
        tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

        step_ids = (
            db.query(RecipeSteps.step_id)
            .filter(RecipeSteps.recipe_id == recipe.id)
            .subquery()
        )
        steps = db.query(Step).filter(Step.id.in_(step_ids)).all()

        ingredients = (
            db.query(RecipesToIngredients.quantity, Ingredient, Unit)
            .join(Ingredient, Ingredient.id == RecipesToIngredients.ingredient_id)
            .join(Unit, Unit.id == RecipesToIngredients.unit_id)
            .filter(RecipesToIngredients.recipe_id == recipe.id)
            .all()
        )

        recipe_data.append({
            "id": recipe.id,
            "title": recipe.name,
            "img":recipe.img,
            "description": recipe.description,
            "tags": [tag.name for tag in tags],
            "steps": [{"title": step.title, "description": step.description} for step in steps],
            "ingredients": [{
                "name": ingredient[1].name,
                "quantity": ingredient[0],
                "unit": ingredient[2].name,
            } for ingredient in ingredients]
        })

    return recipe_data


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


def get_tag_by_name(db: Session, name: str):
    return db.query(Tag).filter(Tag.name == name).first()

def get_recipes_by_tags(db: Session, tag_names: List[str]):
    tags = db.query(Tag).filter(Tag.name.in_(tag_names)).all()

    if len(tags) != len(tag_names):
        raise ValueError("One or more tags not found")

    tag_ids = [tag.id for tag in tags]

    recipes = (
        db.query(Recipe.id)
        .join(RecipeToTag, RecipeToTag.recipe_id == Recipe.id)
        .filter(RecipeToTag.tag_id.in_(tag_ids))
        .group_by(Recipe.id)
        .having(func.count(RecipeToTag.tag_id) == len(tag_ids))
        .all()
    )

    return [recipe.id for recipe in recipes]

def create_tag(db: Session, name: str):
    tag = Tag(name=name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def link_recipe_to_tag(db: Session, recipe_id: int, tag_id: int):
    link = RecipeToTag(recipe_id=recipe_id, tag_id=tag_id)
    db.add(link)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()


def create_step(db: Session, step_id: int,title:str,description:str):
    step = Step(id=step_id,title=title,description=description)
    db.add(step)
    db.commit()
    db.refresh(step)
    return step


def link_step_to_recipe(db: Session, recipe_id: int, step_id: int, step_order: int):
    step_link = RecipeSteps(recipe_id=recipe_id, step_id=step_id, step_order=step_order)
    db.add(step_link)
    db.commit()


def get_ingredient_by_name(db: Session, name: str):
    return db.query(Ingredient).filter(Ingredient.name == name).first()

def get_units_for_ingredient(db: Session, ingredient_id: int):
    return db.query(Unit).join(IngredientUnitConversion).filter(IngredientUnitConversion.ingredient_id == ingredient_id).all()


from sqlalchemy.exc import IntegrityError


def create_ingredient(db: Session, name: str):
    ingredient = Ingredient(name=name)
    db.add(ingredient)

    try:
        db.commit()
        db.refresh(ingredient)
        return ingredient
    except IntegrityError:
        db.rollback()
        raise ValueError("Ingredient creation failed due to integrity constraint.")


def link_ingredient_to_recipe(db: Session, recipe_id: int, ingredient_id: int, quantity: float, unit_id: int):
    link = RecipesToIngredients(
        recipe_id=recipe_id,
        ingredient_id=ingredient_id,
        quantity=quantity,
        unit_id=unit_id
    )
    db.add(link)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()

def get_all_tags(db: Session):
    return db.query(Tag).all()

def get_tags_by_name_pattern(db: Session, pattern: str, limit: int):
    return db.query(Tag).filter(Tag.name.contains(pattern)).limit(limit).all()