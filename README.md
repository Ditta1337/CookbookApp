# CookbookApp
Team 5ALGO1WO, software engineering course project at AGH University.

## How to start developing fast

For frontend, you need to install `npm` from [here](https://nodejs.org/en/download).

1. Open terminal in this repository's root directory

2. `cd frontend && npm i`

3. `npm run dev` will start web application at localhost:3000

4. You can edit source code and the changes will be applied immediately


For backend, you need to install Python

1. Open terminal in this repository's root directory

2. Remember to create and activate a virtual environment

3. `cd backend && pip install -r requirements.txt`

4. `fastapi dev main.py` will start web server at localhost:8000

5. You can edit source code and the changes will be applied immediately

## How to build for production

1. `cd frontend && npm run build`

2. `cd ../backend && pyinstaller main.py --onefile --name CookBook --noconsole --add-data ../frontend/dist:./static`

3. You can move `CookBook` file from newly created `./dist` directory anywhere and it will work when you run it

4. You can add the file itself or a shortcut to it to your `C:\Users\<USERNAME>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

5. Your web application should be accessible from `localhost:8000` after every system startup
