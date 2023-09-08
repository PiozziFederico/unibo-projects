#include "Bonus.hpp"

class BonusType$: public Bonus{
    protected:
        int pointsEarned;
    public:
        BonusType$( int );
        int getPointsEarned();
};


class BonusTypeH: public Bonus{
    protected:
        int lifeEarned;
    public:
        BonusTypeH( int );
        int getLifeEarned();
};