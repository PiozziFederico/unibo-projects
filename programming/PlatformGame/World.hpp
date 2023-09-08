#include "Hero.hpp"
#include "BonusType.hpp"
#include "EnemyType.hpp"
#include "BulletType.hpp"
#include "Menu.hpp"
#include "GameData.hpp"
#include "Map.hpp"

#define X 10 
#define Y 30 
#define MAXBONUS 3
#define MAXENEMY 9


class World {
     protected:
        struct Pointers {
            char matrix[X][Y];
            Bonus bonusArray[MAXBONUS];
            Enemy enemyArray[MAXENEMY];
            BulletTypeEnemy bulletE[MAXENEMY];
            int counterEnemy;
            Pointers *prec;
            Pointers *next;
        };
        typedef Pointers* ptr;
        struct List{
            ptr head;
            ptr tail;
            ptr ptr;
        };
        ptr p = 0;
        ptr q = 0;
        ptr tmp;
        List L;
        GameData D;
        Menu menu;
        Hero H;
        int counterNode = 0;
        int bulletDirection;
        bool exit;
    public:
        World();
        void startGame();
        void heroKeys();
        void userPressA();
        void userPressD();
        void userPressW();
        void userPressS();
        void createAndPrintFirstLevel(); 
        void addNode(); 
        void changeNode( bool ); 
        void uploadBonus();
        void uploadEnemy();
        void uploadEnemyBullet();
        void uploadHeroBullet( BulletTypeHero );
        void printMap(char [][30]); 
        void gameover(); 
};