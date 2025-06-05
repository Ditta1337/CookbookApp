from enum import Enum

class KitchenAppliance(str, Enum):
    OVEN = "Piekarnik"
    MICROWAVE = "Mikrofalówka"
    BLENDER = "Blender"
    TOASTER = "Toster"
    STOVE = "Kuchenka"
    AIR_FRYER = "Frytkownica beztłuszczowa"
    SLOW_COOKER = "Wolnowar"
    INSTANT_POT = "Szybkowar"
    COFFEE_MAKER = "Ekspres do kawy"
    FOOD_PROCESSOR = "Robot kuchenny"
    GRILL = "Grill"
    MIXER = "Mikser"
