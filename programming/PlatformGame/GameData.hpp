#include <windows.h>
#include <string.h>
#include <iostream>
using namespace std;

class GameData{
    protected:
        char name[20]; 
        int levelNumber; 
        int lifePoints; 
        int score; 
        int difficulty; 
    public:
        GameData(); 

        int getLevelNumber();
        void riseLevelNumber(); 
        void reduceLevelNumber();
        void printLevelNumber();
        
        void printData(); 
        void printName();

        int getLifePoints();
        void riseLifePoints( int ); 
        void reduceLifePoints( int ); 

        void riseScore( int ); 
        void printScore();
     
        void printDifficulty();
        int getDifficulty(); 

        void setName( char [] ); 
} ;