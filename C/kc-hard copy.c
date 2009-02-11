#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include <termios.h>
#include <sys/time.h>

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

   /*tattr.c_lflag &= ~(ICANON | ECHO);
   tattr.c_cc[VMIN] = 1;
   tattr.c_cc[VTIME] = 0;*/
   cfmakeraw(&tattr);
   tcsetattr(STDIN_FILENO, TCSAFLUSH, &tattr);
   
   

   setvbuf(stdout, NULL, _IONBF, 1);
   /*printf("\033[?25lX X\033[3D");
   sleep(5);
   printf("Y Y");*/
   while(1)
   {
      /*char out = (rand() % 95) + 32;
      putchar(out);
      
      struct timeval before;
      gettimeofday(&before);

      char in = getchar();
      
      struct timeval after;
      gettimeofday(&after);

      if(in == out)
      {
         puts(" X");
      }
      }*/
      char c = getchar();
      printf("%c:::%i:::%x\r\n", c, c, c);
      /*
      if (c == '\004')
         break;
      else 
         putchar (c);*/
   }

   
}