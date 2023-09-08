# ASCII Project
## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
### General Info
***
This project consists in a game with ASCII graphics developed on several levels with increasing difficulty.
It features a two-dimensional matrix in which structures, enemies and bonuses are randomly chosen.
The aim of the game is to obtain as many points as possible, the game will end if the player loses all lives.
### Screenshot
![Image of the game](./img.PNG)
## Technologies
***
A list of library used within the project:
* windows.h
* conio.h
* string.h
* cstring
* iostream
* stdlib.h
* time.h
## Installation
***
To run the project you need to go to the folder that contains the source files. In this example we used the GNU c++ compiler.
Using the command g++ followed by all the names of the files with the extension ".cpp" it will be possible to obtain the executable.
You can start the game directly from the folder or using the command ".\myprogram" in the terminal.
```
$ cd ../path/to/the/file
$ g++ Main.cpp Menu.cpp World.cpp GameData.cpp Hero.cpp BonusType.cpp Bonus.cpp Map.cpp Enemy.cpp EnemyType.cpp Bullet.cpp BulletType.cpp -o myprogram
```