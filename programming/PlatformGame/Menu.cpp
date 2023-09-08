#include "Menu.hpp"

Menu::Menu(){}

void Menu::startMenu(){
    DisplayMessage1();
}

void Menu::DisplayMessage1(){
    system("cls");
    cout << "PROGETTO PROGRAMMAZIONE: GIOCO PLATFORM IN GRAFICA ASCII" << endl 
    << "===============================================================================" << endl
    << "Benvenuto/a! Segui le indicazioni nelle pagine che seguono prima di iniziare a giocare..." << endl << endl
    << "Premere N per proseguire." << endl;
    DefaultDisplayMessage( 0, 6 );
    DynamicMenu( _getch() );
}

void Menu::DisplayMessage2(){
    system("cls");
    cout << "NOME UTENTE" << endl 
    << "===============================================================================" << endl 
    << "Inserire Nome Utente ( MAX 20 caratteri ): " << endl;
    cin.getline( username, 20 );
    cout << "\nPremere N per proseguire..." << endl;
    DefaultDisplayMessage( 0, 8);
    DynamicMenu( _getch() );
}

void Menu::DisplayMessage3(){
    system("cls");
    cout << "REGOLAMENTO" << endl
    << "===============================================================================" << endl
    << "W := Il personaggio salta sulla piattaforma vicina a lui" << endl
    << "S := Il personaggio scende a terra o sulla piattaforma immediatamente sotto di lui" << endl
    << "A := Il personaggio si muove verso sinistra di una posizione" << endl
    << "D := Il personaggio si muove verso destra di una posizione" << endl
    << "K := Il personaggio spara un colpo" << endl  
    << "X := Finisce la partita" << endl
    << "O := Nemico che spara un proiettile a distanza 1, fa danni elevati se ucciso corpo a corpo" << endl
    << "N := Nemico che spara un proiettile a distanza 2, fa danni medi se ucciso corpo a corpo" << endl
    << "I := Nemico che spara un proiettile a distanza 3, fa danni bassi se ucciso corpo a corpo" << endl
    << "$ := Bonus che aumenta il punteggio" << endl
    << "H := Bonus che aumenta i punti vita" << endl;
    DefaultDisplayMessage( 0, 14 );
    DynamicMenu( _getch() );
}

void Menu::DisplayMessage4(){
    bool doit = false;
    system("cls");
    cout << "SCELTA SKIN PERSONAGGIO" << endl
    << "===============================================================================" << endl
    << "1. @\t" << "2. #\t" << "3. A\t" << endl
    << "4. B\t" << "5. C\t" << "6. F\t" << endl << endl
    << "NOTA: skin di default --> @ " << endl;
    DefaultDisplayMessage( 0, 12 );
    while( !doit ) doit = setSkinNumber();
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {0,8});
    cout << "Carattere impostato con successo! " << endl << "Premere N per continuare..." << endl;
    DynamicMenu( _getch() );
}
bool Menu::setSkinNumber(){
    int key;
    switch( key = _getch() ){
        case '1':
            skin = '@';
            break;
        case '2':
            skin = '#';
            break;
        case '3':
            skin = 'A';
            break;
        case '4':
            skin = 'B';
            break;
        case '5':
            skin = 'C';
            break;
        case '6':
            skin = 'F';
            break;
        default:
            skin = '@';
            break;
    }
    return 1;
}

void Menu::DisplayMessage5(){
    system("cls");
    cout << "AUTORI" << endl
    << "===============================================================================" << endl
    << "Elisabetta Contini    0000991260" << endl
    << "Simone Vitaloni       0000975596" << endl 
    << "Federico Piozzi       0000978589" << endl << endl
    << "Premere N per iniziare la partita!" << endl;
    DefaultDisplayMessage( 0, 9 );
    DynamicMenu( _getch() );
}

void Menu::DefaultDisplayMessage( short x, short y ){
    SetConsoleCursorPosition(GetStdHandle( STD_OUTPUT_HANDLE), {x,y}); 
    cout << "EXIT:X\t" << "BACK:B\t" << "NEXT:N\t" << endl;
}

void Menu::DynamicMenu( int k ){
    switch( k ){
        case 'X':
        case 'x':
            ExitMenu();
            break;
        case 'B':
        case 'b':
            count--;
            DisplayNumber();
            break;
        case 'N':
        case 'n':
            count++;
            DisplayNumber();
            break;
        default:
            DynamicMenu(_getch());
    }
}

void Menu::DisplayNumber(){
    switch( count ){
        case 1:
            DisplayMessage1();
            break;
        case 2:
            DisplayMessage2();
            break;
        case 3:
            DisplayMessage3();
            break;
        case 4:
            DisplayMessage4();
            break;
        case 5:
            DisplayMessage5();
            break;
        default:
            system("cls");
            break;
    }
}

void Menu::ExitMenu(){
    exit(1);
}


void Menu::endGame(){
    system( "cls" );
    cout << "FINE PARTITA" << endl
    << "===============================================================================" << endl
    << "Nome \t" << "Punteggio\t" << "Livello" << endl;
}


char Menu::getPlayerSkin(){
    return skin;
}

char *Menu::getPlayerName(){
    return username;
}
