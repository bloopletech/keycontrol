#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include <math.h>
#include <unistd.h>
#include <termios.h>
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
   int chars[] = { 0, 0, 0, 0 };
   //left up right down
   char* allowedChars[] = { "\xe2\x97\x80 ", "\xe2\x96\xb2 ", "\xe2\x96\xb6 ", "\xe2\x96\xbc " };
   int allowedCodes[] = { 68, 65, 67, 66 };
   char buffer[] = "\0\0\0\0\0";
   
   for(int i = 0; i < 3; i++) chars[i] = rand() % 4;

   while(1)
   {      
      for(int i = 0; i < 4; i++) OUT(allowedChars[chars[i]]);
      
      struct timeval before;
      gettimeofday(&before, NULL);

      int count = read(STDIN_FILENO, buffer, 4);
      
      struct timeval after;
      gettimeofday(&after, NULL);
      
      long long int diff = ((after.tv_sec * 1000000) + after.tv_usec) - ((before.tv_sec * 1000000) + before.tv_usec);

      int valid = buffer[2] == allowedCodes[chars[0]];

      if(diff > 1000000)
      {
         printf("  \033[10D%i          \n\033[?25h", score);
         return 0;
      }
      if((count > 3) || !valid)
      {
         OUT(" X\033[10D");
         score -= 100;
      }
      else
      {
         score += 1000 - round(diff / 1000.0);
         OUT("  \033[10D");
      }

      chars[0] = chars[1];
      chars[1] = chars[2];
      chars[2] = chars[3];
      chars[3] = rand() % 4;
   }
}