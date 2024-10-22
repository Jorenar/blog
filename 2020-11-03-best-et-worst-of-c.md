---
layout: post
title:  "Best and worst aspects of C language"
redirect_from:
  - /programming/best-of-c
  - /programming/worst-of-c
  - /best-of-c
  - /worst-of-c
published: false
---

How comes that, after over half a century, C is still a relatively popular and
widely used language when others have withered into obscurity? Why, over all this
time, was nothing able to fully replace it? Why is it still taught in schools?

Let's have a look at some of the best, in my opinion, aspects of the language
(although not all) that contributed to such a state of affairs.


# Spirit of C

Let's start with a quote from document [C99RationaleV5.10](http://www.open-std.org/jtc1/sc22/wg14/www/C99RationaleV5.10.pdf):

> The C89 Committee kept as a major goal to preserve the traditional spirit of C.
> There are many facets of the spirit of C, but the essence is a community
> sentiment of the underlying principles upon which the C language is based.
> Some of the facets of the spirit of C can be summarized in phrases like:
>   * _Trust the programmer._
>   * _Don’t prevent the programmer from doing what needs to be done._
>   * _Keep the language small and simple._
>   * _Provide only one way to do an operation._
>   * _Make it fast, even if it is not guaranteed to be portable._

# "Mid-level"

In regards of level, there are two types of languages: low and high.

Low-level languages are close to the hardware, the only closer thing to CPU
would be electricity itself. Those languages are divided into machine code and
Assembly. The former is a stream of raw, usually binary, data. If somebody is
required to work with it, usually does it using more "readable" hexadecimal form.

Second-generation languages - Assembly - provide one abstraction level on top
of the machine code. Those languages are mostly only a mapping of human-readable
symbols, including symbolic addresses, to opcodes, addresses, numeric constants,
strings and so on. Also are different for each processor.

How do high-level languages, providing more abstraction, compare? Quoting Wikipedia:

> In contrast to low-level programming languages, it may use natural language
> elements, be easier to use, or may automate (or even hide entirely) significant
> areas of computing systems (e.g. memory management), making the process of
> developing a program simpler and more understandable than when using a
> lower-level language. The amount of abstraction provided defines how
> "high-level" a programming language is.

In big oversimplification: low = more machine friendly, high = more human friendly.

C is high-level, but back when it was created, most of the work was still being
done in low-level Assembly. As a result, C has lower level of abstraction than
other (still) widely used languages and is often utilized for low-level
programming, hence I like to call it "mid-level".

You can also easily (with less language bloat) compile C code to Assembly and
examine what instructions processor will execute.

And if it there is a need, many popular C compilers offers you the option
to level down and use inline Assembly to squeeze everything out of CPU.
It's a feature not really implemented with many other languages.

# Fairly simple

Low-level languages are harder to program in. Not because they are more
complicated, but because they are more error-prone and thus require way
more commitment, memorizing and fiddling.

C is mid-level, so "by definition" it's easier. But there comes the surprise,
learning it is easier compared to higher level languages! Why? Because of not
extensive syntax it doesn't take so much to learn the basics.
Loops, functions, structures, pointers, variables, types - the core of language.
Intense week to get the general idea. The rest is "just" maths and CS theorem.

But, but, but, but! Don't get me wrong! \
Language is simple, programming not necessarily! \
To master anything you will need a lot more practice! \
**A lot!** And it's truth for anything out there!

# Fast, lightweight and flexible

Standard C library is small compared to other languages (e.g. Java). It's small
enough for you to try to memorize all functions successfully (not that it would
be a huge benefit). Yeah, many things should be deprecated long ago, there
obviously is some bloat (try to maintain something without bloat for few years,
let alone few decades), but there is not much enough of it to hinder the performance.

And what if libc is still too much? Nothing stands in the way of not using it
at all! Just don't include any of its headers - not even simple `printf()` will
be present. Replace it with any other library of your choice.

Maturity, emphasis on proper memory management, inline Assembly, small abstraction
and little bloat gives programmer really good control over the program.

This makes C an ideal choice for OS kernels (Linux, Windows NT or macOS's XNU to
name a few) or other languages (e.g. Python). That's also why C is so popular
on embedded systems, where you cannot afford to waste resources.

# Standard, no blessed implementation

This one relates to previous and next point. The C programming language is
defined basically only by a document published by International Organization
for Standardization every few years. Contrary to languages like Python, Rust
or Java, there is no particular implementation that is **the** C language.

Combine it with flexibility, and you have a language which can easily target any platform.

# Ubiquity = portability

Does there exist any (still) significant platform with no C compiler available?
Yes, those work exclusively on Assembly only; for all others, C is available.
C programs are present on your high-end gaming PC, on NASA spacecrafts and
in ticket machines. Literally everywhere. C software runs the world.

In accordance to previous paragraphs, C is peculiarly strong choice for
microcontrollers and other forms of embedded systems, which surround us every day.

And have you heard about [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface)?
Turns out many other languages like to have some kind of compatibility with C.

You don't need to worry if you will be able to use this language somewhere as
for 99% you can! (Although it doesn't mean you should...) It means, that while
code may not be 100% portable, you will be a portable programmer.

# The influencer

C has both directly and indirectly influenced innumerous amount of languages.
C++, Java, Go, D, Rust, Perl, even PHP and Python - those are but few examples.

Obviously, knowledge of C isn't needed to learn any of them and sometimes
may even push you to use not the best practices.

Nevertheless, I think it's beneficial to remember the roots. And if you are
cautious, familiarity with C might give you some foothold. It's especially the
case with C++.

# Rich collection of libraries

I suspect all this talk about fastness, lightness, mid-level, Assembly etc. might
have given you an idea, you will need to implement everything yourself. There may
indeed not be any [`LinkedHashMap`](https://docs.oracle.com/javase/8/docs/api/java/util/LinkedHashMap.html)
or other functionalities like garbage collection available for C... except... not entirely.

C is mature and popular language, so while those features aren't build-in,
believe me, name a thing and somebody somewhere already created library for
it (although some things are too obscure to find, despite existing).

You want garbage collector? [Boehm GC](https://www.hboehm.info/gc/) has you covered.
TUI? Nothing like timeless [ncurses](https://invisible-island.net/ncurses/).
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
[libXDGdirs](https://github.com/Jorengarenar/libXDGdirs),
[OpenSSL](https://www.openssl.org/)...

It's very universal language - you can program basically anything: web server,
video game (e.g. [classics from _id Software_](https://github.com/id-Software)),
operating system, other programming language or wrapper forcing Firefox to obey
[XDG Base Directory specification](https://wiki.archlinux.org/index.php/XDG_Base_Directory),
because when I'm an administrator, the programs will do exactly what I told them to!
There were madlads doing WebDev in C via CGI Scripts (and nowadays with WebAssembly).

However, please, remember - the fact you can, doesn't mean you should. For example,
if you want to create a video game, you really ought to turn your eyes to C++.
And you should know, that...

# C++ is highly backward compatible

Why do I even make the whole point out of C++ here? Because it's one of most
widely used languages today and you encountering it is more than certain.

In contrary to other languages embracing C compatibility, C++ was created as its
direct descendant and committee goes to great lengths to keep the "copy-paste"
compatibility with it - in most cases you can compile C code as C++ just fine.

<aside markdown="1">
Don't be mistaken,
[C++ isn't by any means a superset of C](https://mcla.ug/blog/cpp-is-not-a-superset-of-c.html) - the code
isn't always going to work with C++ and a good C code isn't necessary good C++ code. Consider example:
```c
int* x = malloc(10 * sizeof (*x));
```
Proper way in C, but in C++ there ought to be `(int*)` before `malloc()`,
for it to work, not to mention you should use `new int[10]` instead.

Although in most cases you can use C library safely in your C++ project.
</aside>

All examples from the previous point not only **can be**, but **often are**
used in such way.

Even libraries already compiled with C compiler can be made somewhat compatible with C++,
thanks to [`extern "C"`](https://en.cppreference.com/w/cpp/language/language_linkage)
linkage specifier.

# Safety

In my opinion, [this comment](https://www.reddit.com/r/C_Programming/comments/llwg2e/what_are_common_uses_of_c_in_the_real_world/gns54z3)
by Reddit user [u/tim36272](https://www.reddit.com/user/tim36272) catches this point perfectly:

>You're thinking of things like type safety, garbage collection etc.
>
>I'm talking about safety in terms of people dying. Things like garbage
collection are the opposite of life safety. What if your airplane decided it
needed to free up memory ten seconds from touchdown so it ran the garbage
collector? What if running the garbage collector caused a valve to respond
0.1 seconds late to a command, which caused a chain reaction resulting in
a hydraulic line bursting and losing control of the rudder?
>
>C can be safe because it does exactly what the programmer tells it to do,
nothing more and nothing less. There's no magic going on behind the scenes
which could have complex interactions with other behind the scenes magic.
>
>A common example is `std::vector` from C++. This container expands as needed
to accommodate as many elements as you need. But you have a limited amount of
memory on the system, so you need to do static analysis to determine the
maximum size of that vector. And you need to be sure that you have enough
memory for that plus everything else in your system.
>
>Well, now you've eliminated a lot of the convenience of using `std::vector`.
You might as well just allocate that max size to it and avoid all the overhead
`std::vector` imposes by growing in size.
>
>The other main advantage of `std::vector` are templates. If you were to use a
template in safety critical code you'd need to prove that the code generated by
the compiler is correct for every template. Now that you're diving down into
all this auto-generated machine code, it would be easier to just write the
code yourself and avoid the complexity introduced by the compiler's template
generator.
>
>So, if we eliminate all the usefulness of `std::vector`, why use it at all?
>
>Repeat that process for most features in most languages and voilà! You're back at C

**Important note**: if you want such safety, you throw portability out of the window!

# Preprocessor

C (and its direct derivatives like C++ or Object-C) is the only language
I know of, which includes a lexical preprocessor in its specification.

Understandable, considering the fact that many newer languages contain mechanisms
which make preprocessing partially obsolete.\
And in the need there are always fallbacks:
  * using other language (or even itself) as preprocessor (e.g. Python as preprocessor to Java)
  * using external preprocessor (e.g. [m4](https://www.gnu.org/software/m4/m4.html))
    * ...or C preprocessor (yes, there is nothing stopping you from [preprocessing JavaScript with C compiler](https://www.nongnu.org/espresso/js-cpp.html)!)

I will repeat the link with proper title:
[The C Preprocessor in Javascript?](https://www.nongnu.org/espresso/js-cpp.html) -
I really recommend reading this short text, as I think it's enough to understand
why having a standardized, portable preprocessor is a good thing in C.

# _Program in C_ song

<div class="yt-container">
  <iframe class="yt-video" src="https://www.youtube.com/embed/tas0O586t80" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<details>
  <summary>Lyrics</summary>
  <em style="white-space: pre-line;">
    Ariel, listen to me
    OO languages?
    It's a mess.
    Programming in C is better than anything they got over there.

    The syntax might seem much sweeter
    Where objects and subtypes play
    But frills like inheritance
    Will only get in the way!
    Admire C's simple landscape
    Efficiently dangerous!
    No templates or fancy pitfalls
    ... like Java and C++!

    Program in C
    Program in C

    Pointers, assembly,
    Manage your memory
    With malloc() and free()!
    Don't sink your app with runtime bloat
    Software in C will stay afloat
    Do what you want there
    Close to the hardware!

    Program in C!
  </em>
</details>

---

# Conclusion

Learning C is a valuable experience and may be really worth it. If not as your
first language, then as second, third, fourth or whatever. There are
advantages, but (as always) also some disadvantages; at least trying won't hurt.
Give it a chance, who knows, you may truly get to like it.

And don't believe people saying "C is dead". Love it or hate, C is still kicking
and the amount of crucial projects will keep it relevant for few next decades too.

&nbsp;

<aside markdown="1">
**... a blot on the landscape**

C was created in year 1972 on the foundation of B language, so over the years
it acquired some quirks (`memcpy()` is defined in string header!), some things
became obsolete, some useless and are kept only for compatibility with old code.

A beginner is likely to burn a lot of time chasing down strange behavior caused
by memory corruption with no idea how to reason about, what may lead actually
big discouraged to programming in general. There is little to none mechanism
to prevent programmer from shooting themselves in the foot.

It's also important to take into account that C is not the introduction to
Computer Science. Learning none of languages is. You need to study it properly
to get a true understanding of this vast field. If not formal education in
university, then online one will suffice too, the Internet is full of resources.
</aside>