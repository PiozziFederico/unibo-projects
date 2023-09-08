#include "World.hpp"

World::World(){
    exit = false;
    bulletDirection = 1;
    menu.startMenu();
    H.setSkin( menu.getPlayerSkin() );
    D.setName( menu.getPlayerName() );
}


void World::startGame() {
    system("cls");
    createAndPrintFirstLevel();
    while( D.getLifePoints() > 0 && !exit ){
        uploadEnemyBullet();
        heroKeys();
        for( int j = 0; j < L.ptr -> counterEnemy; j++ ){
            for( int i = 0; i < L.ptr -> enemyArray[j].getRange() && (!(L.ptr -> bulletE[j].stopBulletEnemy( L.ptr -> matrix, L.ptr->enemyArray[j].getExistence() ))); i++ ){
                    if( L.ptr -> bulletE[j].heroHit( H.getRowPosition(), H.getColumnPosition() ) )
                        D.reduceLifePoints( L.ptr -> enemyArray[j].getBulletDamage() );
                    else{
                        L.ptr -> bulletE[j].printBullet();
                        L.ptr -> bulletE[j].moveBullet( -1 );
                    }
                    D.printData();
                    heroKeys();
            }
        }
    }
    gameover();
}

void World::heroKeys(){
    if( _kbhit() ){
        char keyPressed = _getch();
        SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {0,0});
        switch( keyPressed ){
            case 'A':
            case 'a':
                bulletDirection = -1;
                if( H.getColumnPosition() != 1 ){
                printMap( L.ptr -> matrix );
                userPressA();
                } else if( D.getLevelNumber() > 1) changeNode(0);
                break;
            case 'D':
            case 'd': 
                bulletDirection = 1;
                if( H.getColumnPosition() != 28 ){
                    printMap( L.ptr -> matrix );
                    userPressD();
                }else{ 
                    if(D.getLevelNumber() == counterNode ) addNode();
                    else changeNode(1);
                }
                break;
            case 'W':
            case 'w':
                printMap( L.ptr -> matrix );
                userPressW();
                break;
            case 'S':
            case 's':
                printMap( L.ptr -> matrix );
                userPressS();
                break;
            case 'K':
            case 'k':
                if(bulletDirection == 1) {
                    BulletTypeHero bullet(H.getRowPosition(), H.getColumnPosition()+1);
                    uploadHeroBullet( bullet );
                }
                else { 
                    BulletTypeHero bullet(H.getRowPosition(), H.getColumnPosition()-1);
                    uploadHeroBullet( bullet );
                }
                break;
            case 'X':
            case 'x':
                exit = true;
                break;
            default: 
                break;
        }
    }
}

void World::userPressA(){
    if( L.ptr -> matrix[H.getRowPosition()+1][H.getColumnPosition()-1] == '=' ){
        if( L.ptr -> matrix[H.getRowPosition()][H.getColumnPosition() - 1] != '=' ){
            // interaction Hero-Bonus
            for( int i = 0; i < MAXBONUS; i++ ){
                if( H.getRowPosition() == L.ptr -> bonusArray[i].getX() && ( H.getColumnPosition()-1 ) == L.ptr -> bonusArray[i].getY()){
                    if( L.ptr -> bonusArray[i].getExistence() ){
                        L.ptr -> bonusArray[i].cancelBonus( L.ptr -> matrix );
                        if( L.ptr -> bonusArray[i].getSkin() == '$' ){
                            BonusType$ $( D.getDifficulty() );
                            D.riseScore( $.getPointsEarned() );
                        } else {
                            BonusTypeH H( D.getDifficulty() );
                            D.riseLifePoints( H.getLifeEarned() );
                        }
                    }
                }
            }
            for( int i = 0; i < L.ptr->counterEnemy; i++ ){
                // Interaction Hero-Enemy
                if( H.getRowPosition() == L.ptr -> enemyArray[i].getX() && ( H.getColumnPosition()-1 ) == L.ptr -> enemyArray[i].getY()){
                    if( L.ptr -> enemyArray[i].getExistence() ){
                        L.ptr -> enemyArray[i].cancelEnemy( L.ptr -> matrix );
                        D.reduceLifePoints( L.ptr->enemyArray[i].getDamage() );
                    }  
                }
            }
            H.isMovingLeft();
            D.printData();
        }
    }
}

void World::userPressD(){
    if( L.ptr -> matrix[H.getRowPosition()+1][H.getColumnPosition()+1] == '=' ){
        if( L.ptr -> matrix[H.getRowPosition()][H.getColumnPosition() + 1] != '=' ){
            // Interaction Hero-Bonus
            for( int i = 0; i < MAXBONUS; i++ ){
                if( H.getRowPosition() == L.ptr -> bonusArray[i].getX() && ( H.getColumnPosition()+1 ) ==L.ptr -> bonusArray[i].getY() ){
                    if( L.ptr -> bonusArray[i].getExistence() ){
                        L.ptr -> bonusArray[i].cancelBonus( L.ptr -> matrix );
                        if( L.ptr -> bonusArray[i].getSkin() == '$' ){
                            BonusType$ $( D.getDifficulty() );
                            D.riseScore( $.getPointsEarned() );
                        } else {
                            BonusTypeH H( D.getDifficulty() );
                            D.riseLifePoints( H.getLifeEarned() );
                        }
                    }
                }
            }
            for( int i = 0; i < L.ptr->counterEnemy; i++ ){
                // Interaction Hero-Enemy
                if( H.getRowPosition() == L.ptr -> enemyArray[i].getX() && ( H.getColumnPosition()+1 ) == L.ptr -> enemyArray[i].getY()){
                    if( L.ptr -> enemyArray[i].getExistence() ){
                        L.ptr -> enemyArray[i].cancelEnemy( L.ptr -> matrix );
                        D.reduceLifePoints( L.ptr->enemyArray[i].getDamage() );
                    }  
                }
            }
            H.isMovingRight();
            D.printData();
        }
    }
}

void World::userPressW(){ 
    if(  H.getColumnPosition() != 28 && L.ptr -> matrix[H.getRowPosition()][H.getColumnPosition() + 1] == '='){
        H.isMovingUp(1);
        D.printData();
    }
    else if( H.getColumnPosition() != 1 &&  L.ptr -> matrix[H.getRowPosition()][H.getColumnPosition() - 1] == '='){
        H.isMovingUp(0);
        D.printData();
    }
}

void World::userPressS(){
        if(  H.getRowPosition() != 8 && L.ptr -> matrix[H.getRowPosition()+1][H.getColumnPosition()+1] != '='){
            if( L.ptr -> matrix[H.getRowPosition()+2][H.getColumnPosition()+1] != '=' ){
                short tmp = H.getColumnPosition() + 1;
                SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {H.getColumnPosition(),H.getRowPosition()});
                putch(' ');
                H.setHeroPosition(7, tmp );
                H.isMovingDown(1);
            } else H.isMovingDown(1);
        }
        else if( H.getRowPosition() != 8 &&  L.ptr -> matrix[H.getRowPosition()+1][H.getColumnPosition()-1] != '='){
            if( L.ptr -> matrix[H.getRowPosition()+2][H.getColumnPosition()-1] != '=' ){
                short newColumnPosition = H.getColumnPosition() - 1;
                SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {H.getColumnPosition(),H.getRowPosition()});
                putch(' ');
                H.setHeroPosition(7, newColumnPosition );
                H.isMovingDown(0);
            } else H.isMovingDown(0);
        }
}

void World::createAndPrintFirstLevel(){
    counterNode = 1;
    D.riseLevelNumber();
    tmp = new Pointers;
    tmp -> prec = p;
    q = tmp;
    p = tmp;	
    p->next = NULL;
    L.tail = p;
    L.ptr = L.tail;
    L.head = q;  
    Map M;
    M.initLevel( L.ptr -> matrix );
    uploadBonus();
    uploadEnemy();
    uploadEnemyBullet();
    H.setHeroPosition( 8,1 );
    printMap( L.ptr ->matrix );
    D.printData();
}

void World::addNode() {
    counterNode++;
    D.riseLevelNumber();
    tmp = new Pointers;
    tmp -> prec = p;
    p->next = tmp;
    p = tmp;
    p->next = NULL;
    L.tail = p;
    L.ptr = L.tail;
    L.head = q;
    Map M;
    M.initLevel( L.ptr -> matrix );
    uploadBonus();
    uploadEnemy();
    uploadEnemyBullet();
    H.setHeroPosition( 8,1 );
    printMap( L.ptr ->matrix );
    D.printData();
}

void World::changeNode( bool direction ) { 
    if( !direction ){ 
        L.ptr = L.ptr -> prec;
        D.reduceLevelNumber();
        H.setHeroPosition( 8,28 );
        printMap(L.ptr ->matrix);
        D.printData();
    } else{
        L.ptr = L.ptr -> next;
        D.riseLevelNumber();
        H.setHeroPosition( 8,1 );
        printMap(L.ptr ->matrix);
        D.printData();
    }
}

void World::uploadBonus(){
    srand(time(0));
    int k = 0; // actual bonus number
    for( int i = 0; i < 10; i++ ){
        for( int j = 0; j < 30; j++ ){
            if( L.ptr -> matrix[i][j] == 'Y' ){
                int casualBonus = rand() % 2;
                if( casualBonus == 0 ){
                    BonusType$ $( D.getDifficulty() );
                    L.ptr -> matrix[i][j] = $.getSkin();
                    $.initPosition( i, j );
                    L.ptr -> bonusArray[k] = $;
                } else{
                    BonusTypeH H( D.getDifficulty() );
                    L.ptr -> matrix[i][j] = H.getSkin();
                    H.initPosition( i, j );
                    L.ptr -> bonusArray[k] = H;
                }
                k++;
            }
        }
    }
}

void World::uploadEnemy(){
    srand(time(0));
    int k = 0; 
    // Initialize counterEnemy
    if( D.getDifficulty() == 1 ) L.ptr->counterEnemy = 3;
    else if( D.getDifficulty() == 2 ) L.ptr->counterEnemy = 6;
    else L.ptr->counterEnemy = MAXENEMY;
    for( int i = 0; i < 10; i++ ){
        for( int j = 0; j < 30; j++ ){
            if( L.ptr -> matrix[i][j] == 'X' ){
                if( k < L.ptr->counterEnemy ){
                    int casualEnemy = rand() % 3;
                    if( casualEnemy == 0 ){
                        EnemyTypeO O( D.getDifficulty() );
                        L.ptr -> matrix[i][j] = O.getSkin();
                        O.initPosition( i, j );
                        L.ptr -> enemyArray[k] = O;
                    } else if( casualEnemy == 1 ){
                        EnemyTypeN N( D.getDifficulty() );
                        L.ptr -> matrix[i][j] = N.getSkin();
                        N.initPosition( i, j );
                        L.ptr -> enemyArray[k] = N;
                    } else {
                        EnemyTypeI I( D.getDifficulty() );
                        L.ptr -> matrix[i][j] = I.getSkin();
                        I.initPosition( i, j );
                        L.ptr -> enemyArray[k] = I;
                    }
                    k++;
                } else L.ptr->matrix[i][j] = ' ';
            }
        }
    }
}

void World::uploadEnemyBullet(){
    for( int i = 0; i < L.ptr -> counterEnemy; i++ )
        L.ptr -> bulletE[i].setPosition( L.ptr -> enemyArray[i].getX(),  L.ptr -> enemyArray[i].getY()-1 );
}

void World::uploadHeroBullet( BulletTypeHero bullet ){
    for(int i = 0; i<bullet.getRange() && (!bullet.stopBulletHero(L.ptr->matrix)); i++) {
        if(bullet.enemyHit(L.ptr->matrix)) {
            for(int k=0; k<L.ptr->counterEnemy; k++) {
                if(bullet.getX() == L.ptr->enemyArray[k].getX() && bullet.getY() == L.ptr->enemyArray[k].getY()) {
                    L.ptr->enemyArray[k].cancelEnemy(L.ptr->matrix);
                }
            }
        } else {
            bullet.printBullet();
            bullet.moveBullet(bulletDirection);
        }
    }
}

void World::printMap(char m[][30]) {
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {0,0});
    for( int i = 0; i < 10; i++ ){
        for( int j = 0; j < 30; j++ ){
            cout << m[i][j];
        }
        cout<<endl;
    }
    H.heroOnScreen();
}

void World::gameover() {
    menu.endGame();
    D.printName();
    cout << "\t";
    D.printScore();
    cout << "\t\t";
    D.printLevelNumber();
    cout << endl << endl << "Premere X per uscire." << endl;
    while( getch() != 'x' ){}
    menu.ExitMenu();
}


