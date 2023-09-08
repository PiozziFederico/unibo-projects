#include <windows.h>
#include <conio.h>

class Bullet{
    protected:
        short x;
        short y;
    public:
        Bullet();
        void printBullet();
        void moveBullet( int );
};