#include "Bullet.hpp"

Bullet::Bullet(){}

void Bullet::printBullet(){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {y,x});
    putch('-');
    Sleep(50);
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {y,x});
    putch(' ');
}

void Bullet::moveBullet( int dir ) {
    if(dir == 1) y++;
    else y--;
}