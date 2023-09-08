#include "World.hpp"

int main(){
    // HideCursor
    CONSOLE_CURSOR_INFO info;
    info.dwSize = 100;
    info.bVisible = 0;
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &info);
    World W;
    W.startGame();
    return 0;
}