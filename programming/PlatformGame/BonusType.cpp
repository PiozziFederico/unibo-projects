#include "BonusType.hpp"

BonusType$::BonusType$( int diff ){
    skin = '$';
    pointsEarned = 10 * diff;
}

int BonusType$::getPointsEarned(){
    return pointsEarned;
}

BonusTypeH::BonusTypeH( int diff ){
    skin = 'H';
    lifeEarned = 10 * diff;
}

int BonusTypeH::getLifeEarned(){
    return lifeEarned;
}

