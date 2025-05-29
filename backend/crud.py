from sqlite3 import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import date
from .models import *
from .utils import import_recipe_from_website
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
    return db.query(IngredientUnitConversion).filter(IngredientUnitConversion.ingredient_id == ingredient_id,
                                                     IngredientUnitConversion.from_unit_id == unit_id).all()


def get_all_ingredient_unit_conversions(db: Session):
    return db.query(IngredientUnitConversion).all()


def create_ingredient_unit_conversion(db: Session, ingredient_id: int, from_unit_id: int, to_unit_id: int,
                                      multiplier: float):
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
        step = db.query(Step).first()
        if not step:
            step = Step(
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


def create_recipe_from_website(db: Session, website_url: str):
    parsed_data = import_recipe_from_website(website_url)

    recipe_schema = schemas.RecipeCreate(
        title=parsed_data["name"],
        description="",
        date=date.today(),
        img="",
        tags=[],
        steps=[schemas.StepCreate(title="Przygotowanie", description="\n".join(parsed_data["steps"]))],
        ingredients=[
            schemas.RecipeIngredientCreate(name=name, quantity=quantity, unit=unit)
            for quantity, unit, name in parsed_data["ingredients"]
        ],
    )

    return create_recipe(db, recipe_schema)


def get_recipe_by_id(db: Session, id: int):
    recipe = db.query(Recipe).filter(Recipe.id == id).first()

    tag_ids = (
        db.query(RecipeToTag.tag_id)
        .filter(RecipeToTag.recipe_id == id)
        .subquery()
    )
    tags = db.query(Tag).filter(Tag.id.in_(tag_ids)).all()

    step_ids = (
        db.query(RecipeSteps.step_id)
        .filter(RecipeSteps.recipe_id == id)
        .subquery()
    )
    steps = db.query(Step).filter(Step.id.in_(step_ids)).all()

    ingredients = (
        db.query(RecipesToIngredients.quantity, Ingredient, Unit)
        .join(Ingredient, Ingredient.id == RecipesToIngredients.ingredient_id)
        .join(Unit, Unit.id == RecipesToIngredients.unit_id)
        .filter(RecipesToIngredients.recipe_id == id)
        .all()
    )

    recipe_data = {
        "id": recipe.id,
        "title": recipe.name,
        "img": recipe.img,
        "date":recipe.date,
        "description": recipe.description,
        "tags": [{"id": tag.id, "name": tag.name} for tag in tags],
        "steps": [{"id": step.id, "description": step.description} for step in steps],
        "ingredients": []
    }

    for ingredient in ingredients:
        quantity, ingredient_obj, unit_obj = ingredient
        ingredient_id = ingredient_obj.id
        unit_id = unit_obj.id

        unit_conversions = db.query(UnitConversion).filter(UnitConversion.from_unit_id == unit_id).all()
        unit_conversion_list = [
            (quantity * uc.multiplier, db.query(Unit).filter(Unit.id == uc.to_unit_id).first().name)
            for uc in unit_conversions
        ]

        ingredient_unit_conversions = (
            db.query(IngredientUnitConversion)
            .filter(
                IngredientUnitConversion.ingredient_id == ingredient_id,
                IngredientUnitConversion.from_unit_id == unit_id
            )
            .all()
        )
        ingredient_unit_conversion_list = [
            (quantity * iuc.multiplier, db.query(Unit).filter(Unit.id == iuc.to_unit_id).first().name)
            for iuc in ingredient_unit_conversions
        ]

        conversions = unit_conversion_list + ingredient_unit_conversion_list

        recipe_data["ingredients"].append({
            "id": ingredient_obj.id,
            "name": ingredient_obj.name,
            "quantity": quantity,
            "unit": unit_obj.name,
            "conversions": conversions
        })

    return recipe_data


def get_all_recipes(db: Session):
    recipe_ids = [row.id for row in db.query(Recipe.id).all()]
    return [get_recipe_by_id(db, rid) for rid in recipe_ids]


def get_recipes_by_names_and_tags(db: Session, name: str = None, tags: list[str] = None, limit_: int = 10):
    query = db.query(Recipe)

    if name:
        query = query.filter(Recipe.name.ilike(f"%{name}%"))

    if tags:
        query = query.join(RecipeToTag).join(Tag).filter(Tag.name.in_(tags)).distinct()

    recipes = query.limit(limit_).all()

    return [get_recipe_by_id(db, recipe.id) for recipe in recipes]


def update_recipe(db: Session, id: int, recipe_data: schemas.RecipeCreate):
    recipe = db.query(Recipe).filter(Recipe.id == id).first()
    if recipe:
        delete_recipe(db, id)
        recipe = create_recipe(db, recipe_data)
        return get_recipe_by_id(db, recipe.id)
    else:
        raise ValueError(f"Recipe with ID {id} not found.")


def delete_recipe(db: Session, recipe_id: int):
    recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if not recipe:
        raise ValueError(f"Recipe with ID {recipe_id} not found.")

    tag_ids = [rt.tag_id for rt in db.query(RecipeToTag).filter(RecipeToTag.recipe_id == recipe_id).all()]
    ingredient_ids = [ri.ingredient_id for ri in
                      db.query(RecipesToIngredients).filter(RecipesToIngredients.recipe_id == recipe_id).all()]
    unit_ids = [ri.unit_id for ri in
                db.query(RecipesToIngredients).filter(RecipesToIngredients.recipe_id == recipe_id).all()]
    step_ids = [rs.step_id for rs in db.query(RecipeSteps).filter(RecipeSteps.recipe_id == recipe_id).all()]

    db.query(RecipeToTag).filter(RecipeToTag.recipe_id == recipe_id).delete()
    db.query(RecipesToIngredients).filter(RecipesToIngredients.recipe_id == recipe_id).delete()
    db.query(RecipeSteps).filter(RecipeSteps.recipe_id == recipe_id).delete()

    db.delete(recipe)
    db.commit()

    # usuwanie danych w pozostalych tabelach ktore nie sa uzywane
    for tag_id in tag_ids:
        exists = db.query(RecipeToTag).filter(RecipeToTag.tag_id == tag_id).first()
        if not exists:
            db.query(Tag).filter(Tag.id == tag_id).delete()

    for ingredient_id in ingredient_ids:
        exists = db.query(RecipesToIngredients).filter(RecipesToIngredients.ingredient_id == ingredient_id).first()
        if not exists:
            db.query(Ingredient).filter(Ingredient.id == ingredient_id).delete()

    for unit_id in unit_ids:
        exists = db.query(RecipesToIngredients).filter(RecipesToIngredients.unit_id == unit_id).first()
        if not exists:
            db.query(Unit).filter(Unit.id == unit_id).delete()

    for step_id in step_ids:
        exists = db.query(RecipeSteps).filter(RecipeSteps.step_id == step_id).first()
        if not exists:
            db.query(Step).filter(Step.id == step_id).delete()

    db.commit()

    return {"message": "Recipe and unused related data deleted successfully"}


def get_tag_by_name(db: Session, name: str):
    return db.query(Tag).filter(Tag.name == name).first()


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


def create_step(db: Session, step_id: int, description: str):
    step = Step(id=step_id, description=description)
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
    return db.query(Unit).join(IngredientUnitConversion).filter(
        IngredientUnitConversion.ingredient_id == ingredient_id).all()


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
