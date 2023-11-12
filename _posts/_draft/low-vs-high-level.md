---
layout: post
title:  "Know thy difference between low- and high-level in programming"
---

I have a pet peeve, I really do have a pet peeve. I've tried many times to let
it go, but to no avail. It really grinds my gears when somebody

* system-level languages

C, C++, Rust &co. are high-level languages often used for low-level programming
(thus they can be also labeled as system- or middle-level)

--------------------------------------------------------------------------------

Well there is no clear boundary which separates high and low level languages, but yeah, you can say that too...


Oh, but there is!
Low-level: machine code, assembly, microcode
High-level: essentially everything else

Then high-level has subcategories like: middle-level languages, VHLL or DSL

Well how do you define it then, based in what traits do you say that these three should belong to LLL category while C or C++ shouldn't

Low-level language provides little to no abstraction over CPU instruction set.
Being system-level languages, we generally can easily match generated assembly with original C/C++ code.
But there are concepts which are completely foreign to low-level, e.g. defining a struct:
struct Foo {
    int x;
    char* str;
};

C, C++ don't force you to use any abstraction, you can write assembly embedded in C and C++. (Haven't tried in C++ but you can definitely do that in C).
And sometimes you do write it that way.

As you yourself said: embedded assembly
Embedding one language into another doesn't transfer the characteristics of former into latter
To give more clear example: <script> tag in HTML doesn't make it a programming language - JavaScript is the programming language embedded into markup language.
And there is nothing stating high-level language cannot be capable of low-level programming, quite the contrary! Low-level programming is common to middle-level subcategory.
Also, if you don't use any abstraction provided by C and only opted for inline assembly, then well... you wrote assembly, not C.
    Haven't tried in C++ but you can definitely do that in C
Definitely not definitely ;)
C standard recognizes inline assembly as common extension (C11 § J.5.10), but doesn't standardize it even as optional.
Funny enough, it's C++ that standardize it as conditionally-supported with implementation-defined meaning (C20 § 9.10).
