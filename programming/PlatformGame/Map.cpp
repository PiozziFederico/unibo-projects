#include "Map.hpp"

Map::Map(){
    initPattern();
}

void Map::initPattern(){
    strcpy( pattern0,     "=============================="
                          "|                            |"
                          "|                            |"
                          "|                            |"
                          "|                            |" 
                          "|         X Y                |"
                          "|       X ====      X        |"
                          "|    X ===         === X     |"
                          "|   ===  X    X     X ===  X |"
                          "==============================" );
    strcpy( pattern1,     "=============================="
                          "|                            |"
                          "|                 Y          |"
                          "|               ====== X     |"
                          "|                   Y ===    |" 
                          "|   Y            X ===  X    |"
                          "|  === X        === X ===    |"
                          "|   X ===        X ===       |"
                          "|  ===     X    ===   X      |"
                          "==============================" );
    strcpy( pattern2,     "=============================="
                          "|                            |"
                          "|                            |"
                          "|                            |"
                          "|                    Y       |" 
                          "|          Y      X ===      |"
                          "|       X ===  X === X       |"
                          "|    X ===    === X ===      |"
                          "|   ===  X    X  ===    X  Y |"
                          "==============================" );
    strcpy( pattern3,     "=============================="
                          "|                            |"
                          "|             XY             |"
                          "|          X ==== X          |"
                          "|        X===    === Y       |" 
                          "|    Y ===     == X ==       |"
                          "|   === X        ===         |"
                          "|    X ===                   |"
                          "|   ===       X       X      |"
                          "==============================" );
    strcpy( pattern4,     "=============================="
                          "|                            |"
                          "|                            |"
                          "|             XYX            |"
                          "|         Y ====== X         |" 
                          "|      X === X    ===  Y     |"
                          "|     === X ===      ===     |"
                          "|      X === X               |"
                          "|    ====   ===           X  |"
                          "==============================" );
}

void Map::initLevel( char matrix[][30] ){
    int k = 0;
    int casualNumber;
    srand(time(0));
    casualNumber = rand() % 5;
    switch( casualNumber ){
        case 0:
            for( int i = 0; i < 10; i++ ){
                for( int j = 0; j < 30; j++ ){
                    matrix[i][j] = pattern1[k];
                    k++;
                }
            }
            break;
        case 1:
            for( int i = 0; i < 10; i++ ){
                for( int j = 0; j < 30; j++ ){
                    matrix[i][j] = pattern1[k];
                    k++;
                }
            }
            break;
        case 2:
            for( int i = 0; i < 10; i++ ){
                for( int j = 0; j < 30; j++ ){
                    matrix[i][j] = pattern2[k];
                    k++;
                }
            }
            break;
        case 3:
            for( int i = 0; i < 10; i++ ){
                for( int j = 0; j < 30; j++ ){
                    matrix[i][j] = pattern3[k];
                    k++;
                }
            }
            break;
        case 4:
            for( int i = 0; i < 10; i++ ){
                for( int j = 0; j < 30; j++ ){
                    matrix[i][j] = pattern4[k];
                    k++;
                }
            }
            break;
        default:
            break;
    }
}






