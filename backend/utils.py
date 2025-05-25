import requests
from bs4 import BeautifulSoup


def import_recipe_from_website(recipe_url: str):
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
    ingredients = [tag.get_text(strip=True) for tag in ingredients_tags]

    steps_tags = soup.select(".group-przepis ul li")
    steps = [tag.get_text(strip=True) for tag in steps_tags]
    return {"name": recipe_name, "ingredients": ingredients, "steps": steps}


def _import_recipe_from_website_mojewypieki(recipe_url: str):
    raise NotImplementedError("This function is not implemented yet.")


def _import_recipe_from_website_aniagotuje(recipe_url: str):
    raise NotImplementedError("This function is not implemented yet.")


if __name__ == "__main__":
    print(
        import_recipe_from_website(
            "https://www.kwestiasmaku.com/przepis/ciasto-truskawkowa-chmurka"
        )
    )
