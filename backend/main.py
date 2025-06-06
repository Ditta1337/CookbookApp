import os
import sys
from http.client import HTTPException

import json
from fastapi import FastAPI, Request, Depends, HTTPException,UploadFile,File
from sqlalchemy.orm import Session
import uvicorn

from backend import models, crud, schemas
from backend.KitchenAppliances import KitchenAppliance
from backend.database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from typing import List

def populate_appliance_tags():
    db = SessionLocal()
    try:
        for appliance in KitchenAppliance:
            existing_tag = crud.get_tag_by_name(db, appliance.value)
            if existing_tag:
                print(f"Already exists: {existing_tag.name} (id={existing_tag.id})")
            else:
                tag_create = schemas.TagCreate(name=appliance.value)
                saved = crud.create_tag(db, tag_create.name)
                print(f"Saved new tag: {saved.name} (id={saved.id})")
    except Exception as e:
        print("Error while populating appliance tags:", str(e))
    finally:
        db.close()


models.Base.metadata.create_all(bind=engine)
populate_appliance_tags()
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


# Recipes
@app.post("/api/recipes", response_model=schemas.RecipeFullOut)
def create_recipe(recipe_data: schemas.RecipeCreate, db: Session = Depends(get_db)):
    try:
        recipe = crud.create_recipe(db, recipe_data)
        return crud.get_recipe_by_id(db, recipe.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.delete("/api/recipes/delete/{id}")
def create_recipe(id: int, db: Session = Depends(get_db)):
    try:
        message = crud.delete_recipe(db,id)
        return message
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")



@app.post("/api/recipes/save_file")
def save_recipes_to_file(filepath: str, db: Session = Depends(get_db)):
    try:

        directory = os.path.dirname(filepath)
        if not os.path.exists(directory):
            raise HTTPException(status_code=400, detail="Folder nie istnieje")

        recipes = crud.get_all_recipes(db)
        if not recipes:
            raise HTTPException(status_code=404, detail="Brak danych do zapisania")

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(recipes, f, ensure_ascii=False, indent=4, default=str)

        return JSONResponse(status_code=200, content={"message": f"Zapisano {len(recipes)} receptur do pliku."})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recipes/load_file")
def load_recipes_from_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        if not file.filename.endswith(".json"):
            raise HTTPException(status_code=400, detail="Tylko pliki JSON są obsługiwane.")

        content = file.file.read().decode("utf-8")
        data = json.loads(content)

        if not isinstance(data, list):
            raise HTTPException(status_code=400, detail="Oczekiwano listy receptur w pliku JSON.")

        for recipe in data:
            if "tags" in recipe:
                recipe["tags"] = [tag["name"] for tag in recipe["tags"] if "name" in tag]

        created = []
        for item in data:
            recipe = schemas.RecipeCreate(**item)
            new_recipe = crud.create_recipe(db,recipe)
            created.append(new_recipe)

        return {"message": f"Zaimportowano {len(created)} receptur z pliku."}

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Niepoprawny format JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/recipes/from_website", response_model=schemas.RecipeFullOut)
def create_recipe_from_website(website_url: str, db: Session = Depends(get_db)):
    try:
        recipe = crud.create_recipe_from_website(db, website_url)
        return crud.get_recipe_by_id(db, recipe.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/recipes/all", response_model=List[schemas.RecipeFullOut])
def get_recipes(db: Session = Depends(get_db)):
    try:
        recipes = crud.get_all_recipes(db)
        if not recipes:
            return []
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/recipes/{id}", response_model=schemas.RecipeFullOut)
def get_recipe_by_id(id: int, db: Session = Depends(get_db)):
    try:
        recipe = crud.get_recipe_by_id(db, id)
        if recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/recipes/update/{id}", response_model=schemas.RecipeFullOut)
def update_recipe(id: int, recipe_data: schemas.RecipeCreate, db: Session = Depends(get_db)):
    try:
        recipe = crud.get_recipe_by_id(db, id)
        if recipe is None:
            raise HTTPException(status_code=404, detail="Recipe not found")
        updated_recipe = crud.update_recipe(db, id, recipe_data)
        return updated_recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/recipes/search/{limit}", response_model=List[schemas.RecipeFullOut])
def search_recipes(name: str = None, tags: list[str] = None, limit: int = 10, db: Session = Depends(get_db)):
    try:
        recipes = crud.get_recipes_by_names_and_tags(db, name, tags, limit)
        if not recipes:
            raise HTTPException(status_code=404, detail="No recipes found matching the query")
        return recipes
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/recipes/by_tags", response_model=List[int])
def get_recipes_by_tags(tag_names: List[str], db: Session = Depends(get_db)):
    try:
        recipe_ids = crud.get_recipes_by_tags(db, tag_names)
        if not recipe_ids:
            raise HTTPException(status_code=404, detail="No recipes found matching the tags")
        return recipe_ids
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/tags/post", response_model=schemas.TagRead)
def create_tag(tag: schemas.TagCreate, db: Session = Depends(get_db)):
    existing_tag = crud.get_tag_by_name(db, tag.name)
    if existing_tag:
        return existing_tag

    new_tag = crud.create_tag(db, tag.name)
    return new_tag


@app.get("/api/tags/get_all", response_model=List[schemas.TagRead])
def read_all_tags(db: Session = Depends(get_db)):
    return crud.get_all_tags(db)


@app.get("/api/tags/search/", response_model=List[schemas.TagRead])
def search_tags(pattern: str, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_tags_by_name_pattern(db, pattern, limit)


@app.get("/api/tags/get_all_appliances", response_model=List[schemas.TagRead])
def read_all_appliances(db: Session = Depends(get_db)):
    appliances = crud.get_all_appliances(db)
    return appliances

# Endpointy dla tabeli Ingredients
@app.get("/api/ingredients/", response_model=List[schemas.IngredientCreate])
def read_all_ingredients(db: Session = Depends(get_db)):
    ingredients = crud.get_all_ingredients(db)
    return ingredients


@app.post("/api/ingredients/", response_model=schemas.IngredientCreate)
def create_new_ingredient(ingredient: schemas.IngredientCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_ingredient(db=db, name=ingredient.name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# @app.get("/api/ingredients/{ingredient_name}/units", response_model=List[schemas.UnitCreate])
# def get_units_for_ingredient(ingredient_name: str, db: Session = Depends(get_db)):
#     ingredient = crud.get_ingredient_by_name(db, ingredient_name)
#     if not ingredient:
#         raise HTTPException(status_code=404, detail="Ingredient not found")
#
#     units = crud.get_units_for_ingredient(db, ingredient_id=ingredient.id)
#     return units

@app.get("/api/ingredients/{ingredient_id}/units/", response_model=List[schemas.UnitCreate])
def get_units_for_ingredient(ingredient_id: int, db: Session = Depends(get_db)):

    units = crud.get_units_for_ingredient(db, ingredient_id=ingredient_id)
    return units


# Endpointy dla tabeli Units
@app.get("/api/units/", response_model=List[schemas.UnitCreate])
def read_all_units(db: Session = Depends(get_db)):
    units = crud.get_all_units(db)
    return units


@app.post("/api/units/", response_model=schemas.UnitCreate)
def create_new_unit(unit: schemas.UnitCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_unit(db=db, name=unit.name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/units/{id}", response_model=schemas.UnitCreate)
def read_unit(id: int, db: Session = Depends(get_db)):
    unit = crud.get_unit(db, id=id)
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit

@app.get("/api/units/name/{unit_name}", response_model=schemas.UnitCreate)
def read_unit_by_name(unit_name: str, db: Session = Depends(get_db)):
    unit = crud.get_unit_by_name(db, name=unit_name)
    if unit is None:
        raise HTTPException(status_code=404, detail="Unit not found")
    return unit


@app.put("/api/units/{id}", response_model=schemas.UnitCreate)
def update_unit(id: int, name: str, db: Session = Depends(get_db)):
    try:
        return crud.update_unit(db=db, id=id, name=name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/units/{id}", response_model=dict)
def delete_unit(id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_unit(db=db, id=id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Endpointy dla tabeli UnitConversion
@app.get("/api/unit_conversions/", response_model=List[schemas.UnitConversionCreate])
def read_all_unit_conversions(db: Session = Depends(get_db)):
    unit_conversions = crud.get_all_unit_conversions(db)
    return unit_conversions


@app.get("/api/convertible_units/{unit_id}", response_model=List[schemas.UnitConversionCreate])
def get_convertible_units_endpoint(unit_id: int, db: Session = Depends(get_db)):
    return crud.get_convertible_units(db, unit_id=unit_id)


@app.post("/api/unit_conversions/", response_model=schemas.UnitConversionCreate)
def create_new_unit_conversion(unit_conversion: schemas.UnitConversionCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_unit_conversion(db=db, from_unit_id=unit_conversion.from_unit_id,
                                           to_unit_id=unit_conversion.to_unit_id, multiplier=unit_conversion.multiplier)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/unit_conversions/{from_unit_id}/{to_unit_id}", response_model=schemas.UnitConversionCreate)
def read_unit_conversion(from_unit_id: int, to_unit_id: int, db: Session = Depends(get_db)):
    unit_conversion = crud.get_unit_conversion(db, from_unit_id=from_unit_id, to_unit_id=to_unit_id)
    if unit_conversion is None:
        raise HTTPException(status_code=404, detail="Unit conversion not found")
    return unit_conversion


@app.put("/api/unit_conversions/{from_unit_id}/{to_unit_id}", response_model=schemas.UnitConversionCreate)
def update_unit_conversion(from_unit_id: int, to_unit_id: int, multiplier: float, db: Session = Depends(get_db)):
    try:
        return crud.update_unit_conversion(db=db, from_unit_id=from_unit_id, to_unit_id=to_unit_id,
                                           multiplier=multiplier)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/unit_conversions/{from_unit_id}/{to_unit_id}", response_model=dict)
def delete_unit_conversion(from_unit_id: int, to_unit_id: int, db: Session = Depends(get_db)):
    try:
        return crud.delete_unit_conversion(db=db, from_unit_id=from_unit_id, to_unit_id=to_unit_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Endpointy dla tabeli IngredientUnitConversion
@app.get("/api/ingredient_unit_conversions/", response_model=List[schemas.IngredientUnitConversionCreate])
def read_all_ingredient_unit_conversions(db: Session = Depends(get_db)):
    ingredient_unit_conversions = crud.get_all_ingredient_unit_conversions(db)
    return ingredient_unit_conversions


@app.get("/api/convertible_ingredient_units/{ingredient_id}/{unit_id}",
         response_model=List[schemas.IngredientUnitConversionCreate])
def get_convertible_ingredient_units_endpoint(ingredient_id: int, unit_id: int, db: Session = Depends(get_db)):
    return crud.get_convertible_ingredient_units(db, ingredient_id=ingredient_id, unit_id=unit_id)


@app.post("/api/ingredient_unit_conversions/", response_model=schemas.IngredientUnitConversionCreate)
def create_new_ingredient_unit_conversion(ingredient_unit_conversion: schemas.IngredientUnitConversionCreate,
                                          db: Session = Depends(get_db)):
    try:
        return crud.create_ingredient_unit_conversion(db=db, ingredient_id=ingredient_unit_conversion.ingredient_id,
                                                      from_unit_id=ingredient_unit_conversion.from_unit_id,
                                                      to_unit_id=ingredient_unit_conversion.to_unit_id,
                                                      multiplier=ingredient_unit_conversion.multiplier)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/ingredient_unit_conversions/{ingredient_id}/{from_unit_id}/{to_unit_id}",
         response_model=schemas.IngredientUnitConversionCreate)
def read_ingredient_unit_conversion(ingredient_id: int, from_unit_id: int, to_unit_id: int,
                                    db: Session = Depends(get_db)):
    ingredient_unit_conversion = crud.get_ingredient_unit_conversion(db, ingredient_id=ingredient_id,
                                                                     from_unit_id=from_unit_id, to_unit_id=to_unit_id)
    if ingredient_unit_conversion is None:
        raise HTTPException(status_code=404, detail="Ingredient unit conversion not found")
    return ingredient_unit_conversion


@app.delete("/api/ingredient_unit_conversions/{ingredient_id}/{from_unit_id}/{to_unit_id}", response_model=dict)
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
index_file = os.path.join(path_to_static, 'index.html')
app.mount("/", StaticFiles(directory=path_to_static, html=True), name="static")
@app.middleware("http")
async def react_router_handler(request: Request, call_next):
    path = request.url.path

    # API, assets – przepuszczamy normalnie
    if path.startswith("/api") or path.startswith("/assets"):
        return await call_next(request)

    # Wszystko inne – frontend
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return JSONResponse(status_code=404, content={"detail": "index.html not found"})
if __name__ == "__main__":

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_config = None
    )
