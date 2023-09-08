#include "Bullet.hpp"

class BulletTypeHero: public Bullet {
    protected:
        const int range = 3;
    public:
        BulletTypeHero( int, int );
        bool stopBulletHero( char[][30]);
        bool enemyHit( char[][30] );
        int getRange();
        short getX();
        short getY();
};

class BulletTypeEnemy: public Bullet {
    public:
        BulletTypeEnemy();
        bool stopBulletEnemy( char[][30], bool );
        bool heroHit( short, short );
        void setPosition( short, short );
};