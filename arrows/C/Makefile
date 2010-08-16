PREFIX=/usr
BINDIR=$(PREFIX)/local/bin
MANDIR=$(PREFIX)/share/man

all:
	gcc -Wall -pedantic -std=c99 -lm -o akc akc.c

install:
	cp ./akc $(BINDIR)/
	cp ./akc.6 $(MANDIR)/man6/

clean:
	rm ./akc

uninstall:
	rm $(BINDIR)/akc
	rm $(MANDIR)/man6/akc.6
