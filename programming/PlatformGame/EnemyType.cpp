#include "EnemyType.hpp"

EnemyTypeO::EnemyTypeO( int diff ){
    skin = 'O';
    damage = 30;
    bulletDamage = diff;
    bulletRange = 1;
}

EnemyTypeN::EnemyTypeN( int diff ){
    skin = 'N';
    damage = 20;
    bulletDamage = 2 * diff;
    bulletRange = 2;
}

EnemyTypeI::EnemyTypeI( int diff ){
    skin = 'I';
    damage = 10;
    bulletDamage = 3 * diff;
    bulletRange = 3;
}

