---
layout: post
title:  "Start with C!"
categories: programming
tags: [ advice, C ]
---

> "Is C good for beginners?" "Is C good as first language?"

Such questions I've heard already countless of times, be it in direct conversation
or on a forum. Every time my answer is basically the same: **yes**.
Of course, hardly anyone would be content with such short response, so in this
short article I will share my thoughts on this topic.

### C is base for many modern languages

C influences innumerous amount of languages, which in turn influenced anothers.
C++, Java, Go, D, Rust, Perl, even Python and JavaScript - those are but few examples.
Obviously, knowledge of C isn't necessary to learn any of them, but if you have
some, you will feel kind of familiarity right away. It's especially the case
with C++, what brings us to the next point...

### C++ is highly backward compatible

C++ was created as direct descendant of C and committee goes to great lengths
to keep the compatibility with it. Don't get me wrong, C++ isn't by any means
a superset of C - the code isn't always going to work with C++ and a good C
code isn't necessary good C++ code. Consider example:
```c
int* x = malloc(10 * sizeof(*x));
```
Perfectly good in C, but in C++ there ought to be `(int*)` before `malloc()`,
for it to work.

Although in most cases you can use C library safely in your C++ project.
And that takes us to...

### Rich collection of libraries

Name a thing and believe me, somebody somewhere already created library for it.
It may be so obscure, you won't find it for all the world, but it does exists.
You want garbage collector? `gc.h` has you covered. TUI? `ncurses.h`.
It's very universal language - you can program basically anything: web server,
video game (e.g. [classics from _id Software_](https://github.com/id-Software)),
operating system or other programming language!

### Fast, minimal, "mid-level"

C is high-level, but the goal when it was designed was to create language
close to low-level Assembly, hence I like to call it "mid-level". There is little
of needless code in standard library and what is, is fast. There is less
abstraction, so programmer has more control over the program&nbsp;- it makes it
an ideal choice for OS kernels (Linux, Windows NT or MacOS's Darwin are most
popular examples) or language (e.g. Python is written in C). You can also compile
code to Assembly instead to binary and examine what instructions CPU will execute.

### Ubiquitous

Does there exist any significant platform with no C compiler available?
I've never heard of one. C programs are present on your high-end gaming PC,
on NASA spacecrafts and in ticket machine. Literally everywhere. C software runs
the world.

### In all it's greatness, C is fairly simple

Really, no joke. It's simple. It doesn't take so much to learn the basics.
Loops, functions, structures, pointers, variables, types - the core of language.
Week to get the general idea. But, but, but, but! Don't get the wrong idea! To
master anything you will need a lot more practice! **A lot!**

Pointers are usually what scares beginners. Don't be afraid, it's just a type
of variable. You will need to deal with sooner or letter. However, from my
observations, people who started with C are often more happy to use them.

### You actually needs to learn how things work

Although there are languages appearing simpler than C, they achieve it with
higher level of abstraction, meaning you actually understand less of what is
going under the hood. Of course, you can learn the principles in any language,
but in Java, for example, to copy array you will be
tempted to call method `arraycopy()`. But how does it work?

Remember part about no needless code, but the existing one being fast?
In C, there is no such function (no such obvious one), because in various
situations, different ways of making copy are more optimal than others.
You need to actually learn what's going on there.

### "Program in C" song

_Just listen, just listen_

<iframe width="560" height="315" src="https://www.youtube.com/embed/tas0O586t80" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br>It's really language loved by many.
