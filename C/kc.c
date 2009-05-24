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
   tattr.c_iflag &= ~(ICRNL | ISTRIP | CSIZE | PARENB) | CS8;
   tattr.c_cc[VMIN] = 0;
   tattr.c_cc[VTIME] = 100;

   tcsetattr(STDIN_FILENO, TCSAFLUSH, &tattr);

   setvbuf(stdout, NULL, _IONBF, 1);

   srand(time(NULL));

   OUT("\033[?25l");

   int score = 0;
   int correctTime = 1500000;
   char buffer[] = "\0\0\0\0\0";
   char lastOut = 0;
   char out = 0;
   
   char* mapping = "`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}\\|;:'\",<.>/?";

   while(1)
   {
      out = (rand() % 95) + 32;
      while(out == lastOut) out = (rand() % 95) + 32;
      lastOut = out;
      putchar(out);
      
      struct timeval before;
      gettimeofday(&before, NULL);

      int count = read(STDIN_FILENO, buffer, 4);
      
      struct timeval after;
      gettimeofday(&after, NULL);
      
      long long int diff = ((after.tv_sec * 1000000) + after.tv_usec) - ((before.tv_sec * 1000000) + before.tv_usec);

      int valid = (buffer[0] == out) || (tolower(buffer[0]) == tolower(out));

      if(!valid)
      {
         for(int i = 1; i < strlen(mapping); i += 2)
         {
            if((buffer[0] == mapping[i]) && (mapping[i - 1] == out))
            {
               valid = 1;
               break;
            }
         }
      }

      if(!valid)
      {
         for(int i = 0; i < (strlen(mapping) - 1); i += 2)
         {
            if((buffer[0] == mapping[i]) && (mapping[i + 1] == out))
            {
               valid = 1;
               break;
            }
         }
      }

      if(diff > correctTime)
      {
         int submitScore = score ^ finfo.st_size;

         printf("\033[1D%i %i\n\033[?25h", score, submitScore);
         return 0;
      }
      if((count > 1) || !valid)
      {
         OUT(" X\033[3D");
         score -= 100;
      }
      else
      {
         score += floor(pow(1.05, 1000 - (diff / 1000.0)));
         OUT("  \033[3D");
      }
      
      if(correctTime > 252) correctTime = floor(correctTime * 0.99);
   }
}