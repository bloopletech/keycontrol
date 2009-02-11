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

   /*tattr.c_lflag &= ~(ICANON | ECHO | IEXTEN);
   tattr.c_iflag &= ~(ICRNL | ISTRIP | CSIZE | PARENB) | CS8;
   tattr.c_cc[VMIN] = 0;
   tattr.c_cc[VTIME] = 100;*/
    //  cfmakeraw(&tattr);

      tattr.c_lflag &= ~(ECHO | ICANON | IEXTEN | ISIG);
      /* OK, why IEXTEN? If IEXTEN is on, the DISCARD character
   is recognized and is not passed to the process. This 
      character causes output to be suspended until another
      DISCARD is received. The DSUSP character for job control,
      the LNEXT character that removes any special meaning of
      the following character, the REPRINT character, and some
      others are also in this category.
      */

      tattr.c_iflag &= ~(BRKINT | ICRNL | INPCK | ISTRIP | IXON);
      /* If an input character arrives with the wrong parity, then INPCK
   is checked. If this flag is set, then IGNPAR is checked
      to see if input bytes with parity errors should be ignored.
      If it shouldn't be ignored, then PARMRK determines what
      character sequence the process will actually see.

      When we turn off IXON, the start and stop characters can be read.
      */

      tattr.c_cflag &= ~(CSIZE | PARENB);
      /* CSIZE is a mask that determines the number of bits per byte.
   PARENB enables parity checking on input and parity generation
      on output.
      */

      tattr.c_cflag |= CS8;
      /* Set 8 bits per character. */

   tattr.c_oflag &= ~(OPOST);
      /* This includes things like expanding tabs to spaces. */

   tattr.c_cc[VMIN] = 1;
   tattr.c_cc[VTIME] = 0;


   tcsetattr(STDIN_FILENO, TCSAFLUSH, &tattr);

   setvbuf(stdout, NULL, _IONBF, 1);

   //OUT("\033[?25l");

   char buffer[] = "\0\0\0\0\0\0\0\0\0\0";

   while(1)
   {
      int count = read(STDIN_FILENO, buffer, 10);

      for(int i = 0; i < count; i++)
      {
         printf("-%c, %i, %x-\r\n", buffer[i], buffer[i], buffer[i]);
      }
   }
}