PREFIX=/usr
BINDIR=$(PREFIX)/local/bin
MANDIR=$(PREFIX)/share/man

all:
	gcc -Wall -pedantic -std=c99 -o kc kc.c

install:
	cp ./kc $(BINDIR)/
	cp ./kc.6 $(MANDIR)/man6/

clean:
	rm ./kc

uninstall:
	rm $(BINDIR)/kc
	rm $(MANDIR)/man6/kc.6
