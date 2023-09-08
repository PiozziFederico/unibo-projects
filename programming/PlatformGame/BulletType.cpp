#include "BulletType.hpp"

//Type Hero
BulletTypeHero::BulletTypeHero( int x, int y ){
    // set position bullet
    this->x = x;
    this->y = y;
}

bool BulletTypeHero::stopBulletHero( char matrix[][30] ) {
    if( matrix[x][y] == '=' || matrix[x][y] == 'H' || matrix[x][y] == '$' || matrix[x][y] == '|' ) return true;
    else return false;
}

bool BulletTypeHero::enemyHit( char matrix[][30] ) {
    if( matrix[x][y] == 'N' || matrix[x][y] == 'O' || matrix[x][y] == 'I' ) return true;
    else return false;
}

int BulletTypeHero::getRange() {
    return range;
}

short BulletTypeHero::getX() {
    return x;
}

short BulletTypeHero::getY() {
    return y;
}

//Type Enemy
BulletTypeEnemy::BulletTypeEnemy(){}

void BulletTypeEnemy::setPosition( short x, short y ){
    this->x = x;
    this->y = y;
}

bool BulletTypeEnemy::stopBulletEnemy( char matrix[][30], bool exist ){
     if( matrix[x][y] == '=' || matrix[x][y] == 'H' || matrix[x][y] == '$' || !exist ) return true;
    else return false;
}

bool BulletTypeEnemy::heroHit( short posX, short posY ){
    if( x == posX && y == posY ) return true;
    else return false;
}