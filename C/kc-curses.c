#include <stdio.h>
#include <curses.h>

int main()
{
   initscr();
   keypad(stdscr, TRUE);
   nonl();
   cbreak();
   noecho();
   
   addch('X');
   refresh();
   sleep(5000);
   
   endwin();
}