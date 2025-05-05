from http.client import HTTPException

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import uvicorn
from backend import models, crud, schemas
from backend.database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from typing import List


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


# Recipes
@app.post("/recipes/post/")
def create_new_recipe(recipe: schemas.RecipeCreate,
                      tags: list[schemas.TagCreate],
                      steps: list[schemas.StepCreate],
                      ingredients: list[schemas.IngredientCreate],
                      db: Session = Depends(get_db)):
    try:
        created_recipe = crud.create_recipe(
            db=db,
            id=recipe.id,
            name=recipe.name,
            description=recipe.description,
            date=recipe.date
        )

        tag_results = []
        for tag in tags:
            existing_tag = crud.get_tag_by_name(db, tag.name)
            if not existing_tag:
                existing_tag = crud.create_tag(db, name=tag.name)

            crud.link_recipe_to_tag(db, recipe_id=created_recipe.id, tag_id=existing_tag.id)
            tag_results.append({
                "id": existing_tag.id,
                "name": existing_tag.name
            })

        step_results = []
        for order, step in enumerate(steps, start=1):
            created_step = crud.create_step(db, step_id=step.id, title=step.title, description=step.description)
            crud.link_step_to_recipe(db, recipe_id=created_recipe.id, step_id=created_step.id, step_order=order)
            step_results.append({
                "id": created_step.id,
                "title": created_step.title,
                "description": created_step.description
            })

        ingredient_results = []
        for ingredient in ingredients:
            existing_ingredient = crud.get_ingredient_by_name(db, ingredient.name)
            if not existing_ingredient:
                existing_ingredient = crud.create_ingredient(db, name=ingredient.name)

            unit = crud.get_unit_by_name(db, ingredient.unit)
            crud.link_ingredient_to_recipe(
                db,
                recipe_id=created_recipe.id,
                ingredient_id=existing_ingredient.id,
                quantity=ingredient.quantity,
                unit_id=unit.id
            )
            ingredient_results.append({
                "name": existing_ingredient.name,
                "quantity": ingredient.quantity,
                "unit": unit.name
            })

        return JSONResponse(content={
            "recipe": {
                "id": created_recipe.id,
                "name": created_recipe.name,
                "description": created_recipe.description,
                "date": created_recipe.date.isoformat()
            },
            "tags": tag_results,
            "steps": step_results,
            "ingredients": ingredient_results
        }, status_code=200)

    except ValueError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# Endpointy dla tabeli Units
@app.get("/units/", response_model=List[schemas.UnitCreate])
def read_all_units(db: Session = Depends(get_db)):
    units = crud.get_all_units(db)
    return units


@app.post("/units/", response_model=schemas.UnitCreate)
def create_new_unit(unit: schemas.UnitCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_unit(db=db, id=unit.id, name=unit.name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/units/{id}", response_model=schemas.UnitCreate)
def read_unit(id: int, db: Session = Depends(get_db)):
    unit = crud.get_unit(db, id=id)
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit


@app.put("/units/{id}", response_model=schemas.UnitCreate)
def update_unit(id: int, name: str, db: Session = Depends(get_db)):
    try:
        return crud.update_unit(db=db, id=id, name=name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/units/{id}", response_model=dict)
def delete_unit(id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_unit(db=db, id=id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Endpointy dla tabeli UnitConversion
@app.get("/unit_conversions/", response_model=List[schemas.UnitConversionCreate])
def read_all_unit_conversions(db: Session = Depends(get_db)):
    unit_conversions = crud.get_all_unit_conversions(db)
    return unit_conversions


@app.post("/unit_conversions/", response_model=schemas.UnitConversionCreate)
def create_new_unit_conversion(unit_conversion: schemas.UnitConversionCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_unit_conversion(db=db, from_unit_id=unit_conversion.from_unit_id,
                                           to_unit_id=unit_conversion.to_unit_id, multiplier=unit_conversion.multiplier)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/unit_conversions/{from_unit_id}/{to_unit_id}", response_model=schemas.UnitConversionCreate)
def read_unit_conversion(from_unit_id: int, to_unit_id: int, db: Session = Depends(get_db)):
    unit_conversion = crud.get_unit_conversion(db, from_unit_id=from_unit_id, to_unit_id=to_unit_id)
    if unit_conversion is None:
        raise HTTPException(status_code=404, detail="Unit conversion not found")
    return unit_conversion


@app.put("/unit_conversions/{from_unit_id}/{to_unit_id}", response_model=schemas.UnitConversionCreate)
def update_unit_conversion(from_unit_id: int, to_unit_id: int, multiplier: float, db: Session = Depends(get_db)):
    try:
        return crud.update_unit_conversion(db=db, from_unit_id=from_unit_id, to_unit_id=to_unit_id,
                                           multiplier=multiplier)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/unit_conversions/{from_unit_id}/{to_unit_id}", response_model=dict)
def delete_unit_conversion(from_unit_id: int, to_unit_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_unit_conversion(db=db, from_unit_id=from_unit_id, to_unit_id=to_unit_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Endpointy dla tabeli IngredientUnitConversion
@app.get("/ingredient_unit_conversions/", response_model=List[schemas.IngredientUnitConversionCreate])
def read_all_ingredient_unit_conversions(db: Session = Depends(get_db)):
    ingredient_unit_conversions = crud.get_all_ingredient_unit_conversions(db)
    return ingredient_unit_conversions


@app.post("/ingredient_unit_conversions/", response_model=schemas.IngredientUnitConversionCreate)
def create_new_ingredient_unit_conversion(ingredient_unit_conversion: schemas.IngredientUnitConversionCreate,
                                          db: Session = Depends(get_db)):
    try:
        return crud.create_ingredient_unit_conversion(db=db, ingredient_id=ingredient_unit_conversion.ingredient_id,
                                                      from_unit_id=ingredient_unit_conversion.from_unit_id,
                                                      to_unit_id=ingredient_unit_conversion.to_unit_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/ingredient_unit_conversions/{ingredient_id}/{from_unit_id}/{to_unit_id}",
         response_model=schemas.IngredientUnitConversionCreate)
def read_ingredient_unit_conversion(ingredient_id: int, from_unit_id: int, to_unit_id: int,
                                    db: Session = Depends(get_db)):
    ingredient_unit_conversion = crud.get_ingredient_unit_conversion(db, ingredient_id=ingredient_id,
                                                                     from_unit_id=from_unit_id, to_unit_id=to_unit_id)
    if ingredient_unit_conversion is None:
        raise HTTPException(status_code=404, detail="Ingredient unit conversion not found")
    return ingredient_unit_conversion


@app.delete("/ingredient_unit_conversions/{ingredient_id}/{from_unit_id}/{to_unit_id}", response_model=dict)
def delete_ingredient_unit_conversion(ingredient_id: int, from_unit_id: int, to_unit_id: int,
                                      db: Session = Depends(get_db)):
    try:
        return crud.delete_ingredient_unit_conversion(db=db, ingredient_id=ingredient_id, from_unit_id=from_unit_id,
                                                      to_unit_id=to_unit_id)
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
