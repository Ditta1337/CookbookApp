import requests
from bs4 import BeautifulSoup


def import_recipe_from_website(recipe_url: str):
    """
    Imports a recipe from a given URL.

    Returns:
        dict: A dictionary containing the recipe with the following keys:
            - name (str): The name of the recipe.
            - ingredients (List[str]): A list of ingredient descriptions.
            - steps (List[tuple[str, str]]): A list of preparation steps.
    """
    if recipe_url.startswith(
        ("https://www.kwestiasmaku.com/", "https://kwestiasmaku.com/")
    ):
        return _import_recipe_from_website_kwestiasmaku(recipe_url)
    elif recipe_url.startswith(
        ("https://www.mojewypieki.com/", "https://mojewypieki.com/")
    ):
        return _import_recipe_from_website_mojewypieki(recipe_url)
    elif recipe_url.startswith(
        ("https://www.aniagotuje.pl/", "https://aniagotuje.pl/")
    ):
        return _import_recipe_from_website_aniagotuje(recipe_url)
    else:
        raise NotImplementedError("This website is not supported yet.")


def _import_recipe_from_website_kwestiasmaku(recipe_url: str):
    response = requests.get(recipe_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    recipe_name_tag = soup.select_one("h1.przepis")
    recipe_name = recipe_name_tag.get_text(strip=True) if recipe_name_tag else None

    ingredients_tags = soup.select(".group-skladniki ul li")
    ingredients = []
    for tag in ingredients_tags:
        ingredient = tag.get_text(strip=True)
        ingredient = ingredient.strip("ok.").strip("około").strip()
        if ingredient[0].isdigit():
            try:
                quantity, name = ingredient.split(" ", 1)
                quantity = int(quantity)
                ingredients.append((quantity, name))
            except ValueError:
                # todo: fix this (when quantity is not an integer)
                ingredients.append((1, ingredient))
        else:
            ingredients.append((1, ingredient))

    steps_tags = soup.select(".group-przepis ul li")
    steps = [tag.get_text(strip=True) for tag in steps_tags]

    return {"name": recipe_name, "ingredients": ingredients, "steps": steps}


def _import_recipe_from_website_mojewypieki(recipe_url: str):
    raise NotImplementedError("This function is not implemented yet.")


def _import_recipe_from_website_aniagotuje(recipe_url: str):
    response = requests.get(recipe_url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")

    recipe_name_tag = soup.select_one("h1")
    recipe_name = recipe_name_tag.get_text(strip=True) if recipe_name_tag else None

    ingredients_name_tags = soup.select("#recipeIngredients ul li span.ingredient")
    ingredients_quantity_tags = soup.select("#recipeIngredients ul li span.qty")
    ingredients = []
    for name_tag, quantity_tag in zip(ingredients_name_tags, ingredients_quantity_tags):
        name = name_tag.get_text(strip=True)
        quantity = quantity_tag.get_text(strip=True)
        ingredients.append((1, f"{quantity} {name}"))

    steps_tags = soup.select("div.step-text p")
    steps = [tag.get_text(strip=True) for tag in steps_tags]

    return {"name": recipe_name, "ingredients": ingredients, "steps": steps}


if __name__ == "__main__":
    from pprint import pprint

    pprint(
        import_recipe_from_website(
            "https://www.kwestiasmaku.com/przepis/ciasto-truskawkowa-chmurka"
        )
    )
    pprint(
        import_recipe_from_website(
            "https://www.aniagotuje.pl/przepis/ciastka-owsiane-pistacjowe"
        )
    )
