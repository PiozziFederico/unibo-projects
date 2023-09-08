#include "Bonus.hpp"

Bonus::Bonus(){
    exist = true;
}

void Bonus::initPosition( int x, int y ){
    this->x = x;
    this->y = y;
}

void Bonus::cancelBonus( char matrix[][30] ){
    matrix[x][y] = ' ';
    exist = false;
}

char Bonus::getSkin(){
    return skin;
}

int Bonus::getX(){
    return x;
}

int Bonus::getY(){
    return y;
}

bool Bonus::getExistence(){
    return exist;
}