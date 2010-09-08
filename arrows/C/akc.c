#include <stdio.h>
#if !defined(BSD) && !defined(__APPLE__)
  #include <stdio_ext.h>
  #include <stat.h>
#endif
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include <math.h>
#include <unistd.h>
#include <termios.h>
#include <time.h>
#include <sys/time.h>
#include <sys/stat.h>


#define OUT(x) fputs((x), stdout)

struct termios saved_attributes;

void reset_term(void)
{
   tcsetattr(STDIN_FILENO, TCSANOW, &saved_attributes);
}


int main(int argc, char** argv)
{
   if(!isatty(STDIN_FILENO)) return 1;
   
   struct stat finfo;
   stat(argv[0], &finfo);

   tcgetattr(STDIN_FILENO, &saved_attributes);
   atexit(reset_term);

   struct termios tattr;
   tcgetattr(STDIN_FILENO, &tattr);

   tattr.c_lflag &= ~(ICANON | ECHO | IEXTEN);
   tattr.c_iflag &= ~(CSIZE | PARENB) | CS8;
   tattr.c_cc[VMIN] = 0;
   tattr.c_cc[VTIME] = 100;

   tcsetattr(STDIN_FILENO, TCSAFLUSH, &tattr);

   setvbuf(stdout, NULL, _IONBF, 1);

   srand(time(NULL));

   OUT("\033[?25l");

   int score = 0;
   int character = rand() % 4;
   int allowedTime = 1000;
   double percentChange = 0.01;
   int allowedTimeChange = 0;
   //left up right down
   char* allowedChars[] = { "\xe2\x97\x80 ", "\xe2\x96\xb2 ", "\xe2\x96\xb6 ", "\xe2\x96\xbc " };
   int allowedCodes[] = { 68, 65, 67, 66 };
   char buffer[] = "\0\0\0\0\0";
   int firstTime = 0;
   
   sleep(1);

   while(1)
   {
      OUT(allowedChars[character]);

      if(firstTime == 0)
      {
         OUT(" ");
         firstTime = 1;
      }
      else
      {
         OUT("\033[1C");
      }

      printf("%i", score);
      
      struct timeval before;
      gettimeofday(&before, NULL);

      int count = read(STDIN_FILENO, buffer, 4);
      #ifdef _STDIO_EXT_H
        __fpurge(stdin);
      #else
        fpurge(stdin);
      #endif
      
      struct timeval after;
      gettimeofday(&after, NULL);
      
      long long int diff = round((((after.tv_sec * 1000000) + after.tv_usec) - ((before.tv_sec * 1000000) + before.tv_usec)) / 1000.0);
      int valid = buffer[2] == allowedCodes[character];

      if(diff < 50 || diff > allowedTime || !valid || (count > 3))
      {
         OUT("\n\033[?25h");
         return 0;
      }
      else
      {
         score += 1000 - diff;
         OUT(" \033[100D");
      }

      //scoring version 3
      character = rand() % 4;
      if(allowedTime > 300)
      {
         allowedTimeChange = round((allowedTime - diff) * percentChange);
         allowedTime -= allowedTimeChange > 10 ? allowedTimeChange : 10;
      }
   }
}