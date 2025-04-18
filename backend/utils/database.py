import sqlite3


def get_connection():
    return sqlite3.connect("CookBook.db")


def setup_database():
    with get_connection() as database:
        res = database.execute("SELECT name FROM sqlite_master WHERE name='animals'")
        if res.fetchone() is None:
            print("setting up the database...")
            database.execute("CREATE TABLE animals(name, size)")


def add_animal(name, size):
    print("having", name, size)
    with get_connection() as database:
        database.execute(f"INSERT INTO animals(name, size) VALUES('{name}', '{size}')")


def get_animals():
    with get_connection() as database:
        res = database.execute(f"SELECT * FROM animals")
        return res.fetchall()
