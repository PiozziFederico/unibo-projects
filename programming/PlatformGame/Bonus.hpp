class Bonus{
    protected:
        char skin;
        int x;
        int y;
        bool exist;
    public:
        Bonus();
        void initPosition( int, int );
        void cancelBonus( char [][30] );
        char getSkin();
        int getX();
        int getY();
        bool getExistence();
};