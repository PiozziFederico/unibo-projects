#include <windows.h>
#include <conio.h>
#include <iostream>
using namespace std;

class Menu{
    protected:
        char username[20]; 
        char skin; 
        int count = 1; 
    public:
        Menu();

        void startMenu();
        void DisplayMessage1(); 
        void DisplayMessage2(); 
        void DisplayMessage3(); 
        void DisplayMessage4();
        bool setSkinNumber(); 
        void DisplayMessage5(); 

        void DefaultDisplayMessage( short, short );
        void DynamicMenu( int ) ;
        void DisplayNumber(); 
        void ExitMenu();

        void endGame();
        
        char getPlayerSkin(); 
        char *getPlayerName() ; 
};