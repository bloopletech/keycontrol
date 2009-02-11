#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <termios.h>
#include <sys/time.h>
#include <math.h>

#define OUT(x) fputs((x), stdout)

struct termios saved_attributes;

void reset_term(void)
{
   tcsetattr(STDIN_FILENO, TCSANOW, &saved_attributes);
}


int main(void)
{
   if(!isatty(STDIN_FILENO)) return 1;

   tcgetattr(STDIN_FILENO, &saved_attributes);
   atexit(reset_term);

   struct termios tattr;
   tcgetattr(STDIN_FILENO, &tattr);

   tattr.c_lflag &= ~(ICANON | ECHO | IEXTEN);
   tattr.c_iflag &= ~(ICRNL | ISTRIP | CSIZE | PARENB) | CS8;
   tattr.c_cc[VMIN] = 1;
   tattr.c_cc[VTIME] = 0;

   tcsetattr(STDIN_FILENO, TCSAFLUSH, &tattr);

   setvbuf(stdout, NULL, _IONBF, 1);
   
   OUT("\033[?25l\033[0;37;40m");
   
   int score = 0;

   while(1)
   {
      char out = (rand() % 95) + 32;
      putchar(out);
      
      struct timeval before;
      gettimeofday(&before, NULL);

      char in = getchar();
      
      struct timeval after;
      gettimeofday(&after, NULL);
      
      long long int diff = ((after.tv_sec * 1000000) + after.tv_usec) - ((before.tv_sec * 1000000) + before.tv_usec);

      if(in == '\033')
      {
         printf("\033[1D%i\n", score);
         return 0;
      }
      if((diff > 1500000) || (in != out))
      {
         OUT(" \033[0;37;41mX\033[0;37;40m\033[3D");
         score -= 100;
      }
      else if(in == out)
      {
         score += floor(pow(1.05, 1000 - (diff / 1000.0)));
         OUT("  \033[3D");
      }
   }
}