#include "GameData.hpp"

GameData::GameData(){
    strcpy( name, "PlayerUnknown" );
    levelNumber = 0;
    lifePoints = 100;
    score = 0;
    difficulty = 1;
}

int GameData::getLevelNumber(){
    return levelNumber;
}

void GameData::riseLevelNumber(){
    levelNumber++;
    if( levelNumber % 10 == 0 )
        difficulty++;
}

void GameData::reduceLevelNumber(){
    levelNumber--;
}

void GameData::printLevelNumber(){
    cout << levelNumber;
}

void GameData::printData(){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {45,4});
    cout << "Name: ";
    printName();
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {45,5});
    if( lifePoints < 100 ) cout << "Life:  " << lifePoints; 
    else cout << "Life: " << lifePoints;
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {45,6});
    cout << "Points: " << score;
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {45,7});
    cout << "Level: " << levelNumber;
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {45,8});
    cout << "Difficulty: ";
    printDifficulty();
}

void GameData::printName(){
    for(int i=0; name[i]!='\0'; i++) {
        cout << name[i];
    }
}

int GameData::getLifePoints(){
    return lifePoints;
}
void GameData::riseLifePoints( int lp ){
    lifePoints = lifePoints + lp;
}
void GameData::reduceLifePoints( int lp ){
    lifePoints = lifePoints - lp;
}

void GameData::riseScore( int s ){
    score = score + s;
}


void GameData::printScore(){
    cout << score;
}

void GameData::printDifficulty(){
    if( difficulty == 1 ) cout << "Easy";
    else if( difficulty == 2 ) cout << "Medium";
    else cout << "Extreme";
}
int  GameData::getDifficulty(){
    return difficulty;
}

void GameData::setName( char n[] ){
    strcpy( name, n );
}

