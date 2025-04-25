from sqlalchemy import Column, Integer, String, Date, ForeignKey, Float, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Recipe(Base):
    __tablename__ = "RECIPES"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    date = Column(Date, index=True)


class Tag(Base):
    __tablename__ = "TAGS"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)


class Unit(Base):
    __tablename__ = "UNITS"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)


class UnitConversion(Base):
    __tablename__ = "UNIT_CONVERSION"
    from_unit_id = Column(Integer, ForeignKey("UNITS.id"), primary_key=True)
    to_unit_id = Column(Integer, ForeignKey("UNITS.id"), primary_key=True)

    multiplier = Column(Float, nullable=False)

    from_unit = relationship("Unit", foreign_keys=[from_unit_id])
    to_unit = relationship("Unit", foreign_keys=[to_unit_id])


class Ingredient(Base):
    __tablename__ = "INGREDIENTS"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)


class Step(Base):
    __tablename__ = "STEPS"
    id = Column(Integer, primary_key=True, index=True)
    step = Column(String, index=True)


class RecipeToTag(Base):
    __tablename__ = "RECIPES_TAGS"

    recipe_id = Column(Integer, ForeignKey("RECIPES.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("TAGS.id"), primary_key=True)

    recipe = relationship("Recipe", backref="recipe_tags")
    tag = relationship("Tag", backref="tag_recipes")


class RecipesToIngredients(Base):
    __tablename__ = "RECIPES_INGREDIENTS"
    quantity = Column(Float, nullable=False)
    unit_id = Column(Integer, ForeignKey("UNITS.id"), nullable=False)

    recipe_id = Column(Integer, ForeignKey("RECIPES.id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("INGREDIENTS.id"), primary_key=True)

    recipe = relationship("Recipe", backref="recipe_ingredients")
    ingredient = relationship("Ingredient", backref="ingredients_recipe")
    unit = relationship("Unit")


class RecipeSteps(Base):
    __tablename__ = "RECIPES_STEPS"

    recipe_id = Column(Integer, ForeignKey("RECIPES.id"), primary_key=True)
    step_id = Column(Integer, ForeignKey("STEPS.id"), primary_key=True)
    step_order = Column(Integer, nullable=False)

    recipe = relationship("Recipe", backref="recipe_steps")
    step = relationship("Step")

    __table_args__ = (
        UniqueConstraint('recipe_id', 'step_order', name='uix_recipe_step_order'),
    )
