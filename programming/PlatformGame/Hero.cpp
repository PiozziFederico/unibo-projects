#include "Hero.hpp"

Hero::Hero(){
    setHeroPosition( 8, 1 );
}

void Hero::setHeroPosition( short row, short column ){
    this -> row = row;
    this -> column = column;
}


void Hero::isMovingRight(){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {column,row});
    putch( ' ' );
    if( column != 28 )
        column = column + 1 ;
    else 
        setHeroPosition( 8,1 );
    heroOnScreen();
}

void Hero::isMovingLeft(){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {column,row});
    putch( ' ' );
    column--;
    heroOnScreen();
}

void Hero::isMovingUp( bool risingSide ){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {column,row});
    putch( ' ' );
    if( risingSide )
        column++;
    else
        column--;
    row--;
    heroOnScreen();
}

void Hero::isMovingDown( bool descentSide ){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {column,row});
    putch( ' ' );
    if( descentSide ) 
        column++;
    else
        column--;
    row++;
    heroOnScreen();
}

void Hero::heroOnScreen(){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {column,row});
    putch( skin );
}


void Hero::setSkin( char skin ){
    this -> skin = skin;
}

short Hero::getRowPosition(){
    return row;
}

short Hero::getColumnPosition(){
    return column;
}

