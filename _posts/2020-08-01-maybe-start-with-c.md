---
layout: post
title:  "Maybe start with C?"
categories: programming
tags: [ advice, C ]
---

> "Can I learn C as a beginner?" "Is C good as first language?"
> "Is&nbsp;there still future with C?" "Is learning C worth it?"

Such questions I've heard already countless of times, be it in direct conversation
or on a forum. Every time my answer is basically the same: **yes**.

Of course, hardly anyone would be content with such brief response, so in this
short article I will share my thoughts on this topic.

Without dwelling into needless [descriptions of C](https://en.wikipedia.org/wiki/C_%28programming_language%29),
which are easily obtainable with simple Internet search, let's get to it!

### The influencer

C has both directly and indirectly influenced innumerous amount of languages.
C++, Java, Go, D, Rust, Perl, even Python - those are but few examples.
Obviously, knowledge of C isn't necessary to learn any of them and sometimes
may even push you to use not the best practices. Nevertheless, if you are
cautious, familiarity with C might give you some foothold. It's especially
the case with C++, what brings us to the next point...

<!-- Uncomment after list will be corrected
[List of C-family programming languages](https://en.wikipedia.org/wiki/List_of_C-family_programming_languages)
-->

### C++ is highly backward compatible

Why do I even mention C++ here? Because it's one of most widely used languages
today and you needing to encounter it has even more probability. Particularly
if you are interested in GameDev, as there C++ is **the** language.

Actually, C++ isn't alone in this matter. When implementing
[FFI](https://en.wikipedia.org/wiki/Foreign_function_interface), most languages
choose C.

C++ was created as direct descendant of C and committee goes to great lengths
to keep the compatibility with it. Don't get me wrong, C++ isn't by any means
a superset of C - the code isn't always going to work with C++ and a good C
code isn't necessary good C++ code. Consider example:
```c
int* x = malloc(10 * sizeof(*x));
```
Perfectly good in C, but in C++ there ought to be `(int*)` before `malloc()`,
for it to work, not to mention you should use `new int[10]` instead.

Although in most cases you can use C library safely in your C++ project.
All examples in the following paragraph not only **can be**, but **often are**
used in such way.

### Rich collection of libraries

C is mature language. Name a thing and believe me, somebody somewhere already
created library for it. It may be so obscure, you won't find it for all the world,
but it does exists. You want garbage collector? [Boehm GC](https://www.hboehm.info/gc/)
has you covered. TUI? Nothing like timeless [ncurses](https://invisible-island.net/ncurses/).
Examples can be listed almost infinitely:
[GTK](https://gtk.org/),
[PDCurses](https://pdcurses.org/),
[libcurl](https://curl.haxx.se/libcurl/),
[ALSA](https://www.alsa-project.org/),
[Genann](https://codeplea.com/genann),
[libsoundio](http://libsound.io/),
[SDL](https://libsdl.org),
[SQLite](https://www.sqlite.org/index.html),
[getopt](https://www.gnu.org/software/libc/manual/html_node/Getopt.html),
[OpenGL](https://www.opengl.org/),
[inih](https://github.com/benhoyt/inih),
[GMP](https://gmplib.org/),
[cJSON](https://github.com/DaveGamble/cJSON),
[MuPDF](https://mupdf.com/),
[OpenSSL](https://www.openssl.org/)...

It's very universal language - you can program basically anything: web server,
video game (e.g. [classics from _id Software_](https://github.com/id-Software)),
operating system or other programming language!

### Fast, minimal, "mid-level"

C is high-level, but back when it was created, most of the work was still being
done in low-level Assembly. As a result, C is closer to low-level Assembly,
than other languages (still in widely use), hence I like to call it "mid-level".

You can also easily compile code to Assembly (usually `-S` flag) instead to
binary and examine what instructions CPU will execute.

There is little of needless code in standard library and what is, is fast. There is
less abstraction, so programmer has more control over the program&nbsp;- it makes C
an ideal choice for OS kernels (Linux, Windows NT or MacOS's Darwin are most
popular examples) or languages (e.g. Python).

### Ubiquitous

Does there exist any significant platform with no C compiler available?
I've never heard of one. C programs are present on your high-end gaming PC,
on NASA spacecrafts and in ticket machine. Literally everywhere. C software runs
the world. In accordance to previous paragraph, C is peculiarly strong choice
for microcontrollers and other forms of embedded systems, which surround us every day.

### In all it's greatness, C is fairly simple

Really, no joke. It's simple. It doesn't take so much to learn the basics.
Loops, functions, structures, pointers, variables, types - the core of language.
Week to get the general idea. But, but, but, but! Don't get me wrong! To master
anything you will need a lot more practice! **A lot!** And it's truth for anything
out there!

### Learn damn pointers, it's important!

This part is the most anecdotal so far and will be the longest. But I must say
it, I just must. Sorry for the rant.

Out of almost everybody I know, those who started with higher languages (especially
Python), they always seem to struggle even more with pointers, memory management, etc.
than complete newbies. Assembly would be clear black magic. I even had one argue
that Python would be **better** for embedded systems, even for Arduino Nano with
2kB of RAM [sic!].

It may be just what C community does to mentality, we may be more "dinosaurs",
it may be some kind of superiority felling, but I'm honest: newcomers to C, who
I've been helping, generally are more willing to learn pointers semantics and co.

I suspect it's because they don't know anything else; nothing they would consider
better solution, but still, one will most probably have to learn it sooner or later.

Yes, you will do a lot of mistakes, which in other language you would not.
You will see SEGFAULT after SEGFAULT. Yet, in my opinion, sooner is better,
when you are dealing with simpler concepts. Let's not kid ourselves,
assuming everybody who has already some kind of experience, will really bother
with basics is vain hope and you won't be eager too - that much about human
nature I do know well.

### "Program in C" song

_Listen, just listen_

<div class="yt-container">
  <iframe class="yt-video" src="https://www.youtube.com/embed/tas0O586t80" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

---

### A blot on the landscape...

C was created in year 1972 on the foundation of B language, so over the years
it acquired some quirks (`memcpy()` is defined in string header!), some things
became obsolete, some useless and are kept only for compatibility with old code.

As a beginner likely burn a lot of time chasing down strange behavior caused
by memory corruption you have no idea how to reason about, you may actually
become discouraged.

[Undefined behavior](https://en.wikipedia.org/wiki/Undefined_behavior) (UB)
is the term you need to learn early on.

It's also important to take into account that C is not the introduction to
Computer Science. Learning none of languages is. You need to study it properly
to get a true understanding of this vast field. If not formal education in
university, then online one will be good too. The Internet is full of resources,
some can be found on my [list of URLs](https://joren.ga/urlsList/).

---

## Conclusion

Learning C is valuable experience and it's worth it. If not as your first
language, then as second, third, fourth or whatever. There are a lot of advantages,
but also some disadvantages. At least trying won't hurt. Give it a chance, who
knows, you may truly get to like it, just like me. The end choice is always
yours; I'm just a guy from the Internet.

---

## Useful resources

* [The GNU C Library](ihttps://www.gnu.org/software/libc/manual/html_node/index.html)
* [C reference - cppreference.com](https://en.cppreference.com/w/c)
* [C99 with Technical corrigenda TC1, TC2, and TC3 included](http://www.open-std.org/JTC1/SC22/WG14/www/docs/n1256.pdf)
* [The C Book](https://publications.gbdirect.co.uk/c_book/)
* [Using the GNU Compiler Collection (GCC)](https://gcc.gnu.org/onlinedocs/gcc/)
* [A beginners' guide away from `scanf()`](http://sekrit.de/webdocs/c/beginners-guide-away-from-scanf.html)
* [Compiler Explorer](https://godbolt.org/)
* [OOP in C](https://www.state-machine.com/doc/AN_OOP_in_C.pdf)
* [comp.lang.c FAQ](http://c-faq.com/)
* [POSIX.1-2008](https://pubs.opengroup.org/onlinepubs/9699919799/)
