---
layout: post
title:  "Few lesser known tricks, quirks and features of C"
---

There are some tricks, quirks and features (some quite fundamental to the language!)
which seems to throw even experienced developers off the track. Thus I did a sloppy
job of gathering some of them in this post (in no particular order) with even sloppier
short explanations and/or examples (or quote of thereof).

<aside markdown="1">
* [Hidden features of C - Stack Overflow](https://stackoverflow.com/q/132241/10247460)
* [Lesser known C features](https://d3s.mff.cuni.cz/legacy/~holub/c_features.html)
* [Mildly interesting quirks of C \| Hacker News](https://news.ycombinator.com/item?id=33680239)
* [Advanced C: The UB and optimizations that trick good programmers.](https://www.youtube.com/watch?v=w3_e9vZj7D8)
* [Interesting ways to use C? : r/C_Programming](https://www.reddit.com/r/C_Programming/comments/mqk338/interesting_ways_to_use_c/)
* [C99 with Technical corrigenda TC1, TC2, and TC3 included](http://www.open-std.org/JTC1/SC22/WG14/www/docs/n1256.pdf)
* [Rob's Programming Blog: How Well Do You Know C?](http://www.robertgamble.net/2011/05/how-well-do-you-know-c.html)
* [Let's Destroy C](https://gist.github.com/shakna-israel/4fd31ee469274aa49f8f9793c3e71163#lets-destroy-c)
* [The Preprocessor Iceberg Meme](https://jadlevesque.github.io/PPMP-Iceberg/)
</aside>

<aside markdown="1">
**WARNING:** Something being listed here does **_not_** automatically mean encouragement to use it!
</aside>

* Table of Contents
{:toc}

## Array pointers

Decay-to-pointer makes regular pointers to array usually not needed:
```c
int arr[10];

int* ap0 = arr;        // array decay-to-pointer
// ap0[2] = ...

int (*ap1)[10] = &arr; // proper pointer to array
// (*ap1)[2] = ...
```

But ability to allocate a big array on heap is nice:
```c
int (*ap3)[900000] = malloc(sizeof *ap3);
```

With pointers even VLA can find its use ([more here](https://blog.joren.ga/vla-usecases)):
```c
int (*ap4)[n] = malloc(sizeof *ap4);
```

## Comma operator

The comma operator is used to separate two or more expressions that are
included where only one expression is expected. When the set of expressions
has to be evaluated for a value, only the right-most expression is considered.

For example: `b = (a=3, a+2);` -- this code would firstly assign value 3
to `a`, and then `a+2` would be assigned to variable `b`. So, at the end,
`b` would contain value 5 while variable `a` would be 3.

On Wikipedia we can find [few more examples](https://en.wikipedia.org/wiki/Comma_operator#Examples):

## Digraphs, trigraphs and alternative tokens

C code may not be portable, but the language itself is probably more portable
than any other; there are system using e.g. EBCDIC encoding instead of ASCII,
to support them C has digraphs and trigraphs -- multi-character sequences
treated by the compiler as other characters.

| Digraph  |             | | Trigraph |             | |  Macro   |      |
|:--------:|:-----------:|-|:--------:|:-----------:|-|:--------:|:----:|
|   `<:`   |     `[`     | |  `??=`   |     `#`     | | `and`    | `&&` |
|   `:>`   |     `]`     | |  `??(`   |     `[`     | | `and_eq` | `&=` |
|   `<%`   |     `{`     | |  `??/`   |     `\`     | | `bitand` | `&`  |
|   `%>`   |     `}`     | |  `??)`   |     `]`     | | `bitor`  | `|`  |
|   `%:`   |     `#`     | |  `??'`   |     `^`     | | `compl`  | `~`  |
|  `%:%:`  |    `##`     | |  `??<`   |     `{`     | | `not`    | `!`  |
| -------- | ----------- | |  `??!`   |     `|`     | | `not_eq` | `!=` |
| -------- | ----------- | |  `??>`   |     `}`     | | `or`     | `||` |
| -------- | ----------- | |  `??-`   |     `~`     | | `or_eq`  | `|=` |
| -------- | ----------- | | -------- | ----------- | | `xor`    | `^`  |
| -------- | ----------- | | -------- | ----------- | | `xor_eq` | `^=` |

<aside markdown="1">
Despite there being small opposition, the C Standard Committee
decided to remove support for trigraphs from C23.
</aside>

* [Mini-post: Digraphs and Trigraphs \| ENOSUCHBLOG](https://blog.yossarian.net/2015/04/02/Digraphs-And-Trigraphs)
* [C alternative tokens - Wikipedia](https://en.wikipedia.org/wiki/C_alternative_tokens)
* [Why are there digraphs in C and C++? - Stack Overflow](https://stackoverflow.com/q/432443/10247460)
* [Purpose of Trigraph sequences in C++?](https://stackoverflow.com/q/1234582/10247460)

## Designated initializer

These allow you to specify which elements of an object (array, structure, union)
are to be initialized by the values following. The order does not matter!

```c
struct Foo {
    int x, y;
    const char* bar;
};

void f(void)
{
    int arr[] = { 1, 2, [5] = 9, [9] = 5, [8] = 8 };

    struct Foo f = { .y = 23, .bar = "barman", .x = -38 };

    struct Foo arr[] = {
        [10] = {      8,  8,      9 },
         [8] = {      1,  8,   bar3 },
        [12] = { .x = 9,     .z = 8 },
    };
}
```

* [Designated Inits (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Designated-Inits.html)
* [Designated initializers for aggregate types (C only) - IBM Documentation](https://www.ibm.com/docs/en/zos/2.5.0?topic=initializers-designated-aggregate-types-c-only)
* [What is a designated initializer in C? - Stack Overflow](https://stackoverflow.com/q/47202557/10247460)

## Compound literals

A compound literal looks like a cast of a brace-enclosed initializer list.
Its value is an object of the type specified in the cast, containing the
elements specified in the initializer.

```c
#include <stdio.h>

struct Foo { int x, y; };

void bar(struct Foo p)
{
    printf("%d, %d", p.x, p.y);
}

int main(void)
{
    bar((struct Foo){2, 3});
    return 0;
}
```

* [Compound Literals (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Compound-Literals.html)

## Compound literals are lvalues

```c
(struct Foo){};
((struct Foo){}).x = 4;
&(struct Foo){};
```

## Multi-character constants

They are implementation dependent and even the standard itself to usually
best avoid them. That being said, using them as self-documenting `enum`s
can be quite handy when you may need to deal with raw memory dumps later on.

```c
enum state {
    waiting = 'WAIT',
    running = 'RUN!',
    stopped = 'STOP',
};
```

For example, on my machine I could localize `'WAIT'` like here:
<pre><code>00001120: c3 66 66 2e 0f 1f 84 00 00 00 00 00 0f 1f 40 00  .ff...........@.
00001130: f3 0f 1e fa e9 67 ff ff ff 55 48 89 e5 48 83 ec  .....g...UH..H..
00001140: 10 c7 45 fc <mark>54 49 41 57</mark> 8b 45 fc 89 c6 48 8d 05  ..E.<mark>TIAW</mark>.E...H..
00001150: b0 0e 00 00 48 89 c7 b8 00 00 00 00 e8 cf fe ff  ....H...........
00001160: ff b8 00 00 00 00 c9 c3 f3 0f 1e fa 48 83 ec 08  ............H...</code></pre>

## Bit fields

Declares a member with explicit width, in bits. Adjacent bit field members may
be packed to share and straddle the individual bytes.

```c
struct cat {
    unsigned int legs  : 3;  // 3 bits for legs  (0-4 fit in 3 bits)
    unsigned int lives : 4;  // 4 bits for lives (0-9 fit in 4 bits)
};
```

* [Bit fields - cppreference.com](https://en.cppreference.com/w/c/language/bit_field)
* [Bit field - Wikipedia](https://en.wikipedia.org/wiki/Bit_field)
* [When to use bit-fields in C - Stack Overflow](https://stackoverflow.com/q/24933242/10247460)

## 0 bit fields

* [What does an unnamed zero length bit-field mean in C? - Stack Overflow](https://stackoverflow.com/q/45916894/10247460)
* [Practical Use of Zero-Length Bitfields - Stack Overflow](https://stackoverflow.com/q/4297095/10247460)
* [IBM Documentation - IBM Documentation](https://www.ibm.com/docs/en/xcafbg/9.0.0?topic=SS3KZ4_9.0.0/com.ibm.xlcpp9.bg.doc/proguide/calgnbit.html)
* [Bit fields - cppreference.com](https://en.cppreference.com/w/c/language/bit_field)

<span></span>

Description from [Arm Compiler 6 docs](https://developer.arm.com/documentation/ka004594/latest):

> A zero-length bit-field can be used to make the following changes:
>   * Creates a boundary between any bit-fields before the zero-length bit-field
>     and any bit-fields after the zero-length bit-field. Any bit-fields on
>     opposite sides of the boundary are treated as non-overlapping memory
>     locations. This has a consequence for C and C++ programs. The C and C++
>     standards require both load and store accesses to a bit-field on one side
>     of the boundary to not access any bit-fields on the other side of the boundary.
>   * Insert padding to align any bit-fields after the zero-length bit-field to
>     the next available natural boundary based on the type of the zero-length
>     bit-field. For example, `char:0` can be used to align to the next available
>     byte boundary, and `int:0` can be used to align to the next available word boundary.

An example taken from the [SO answer](https://stackoverflow.com/a/26725041/10247460) (with slight changes):

> ```c
> struct bar {
>     unsigned char x : 5;
>     unsigned short  : 0;
>     unsigned char y : 7;
> }
> ```
>
> The above in memory would look like this (assuming 16-bit `short`, ignoring endian):
>
> ```
> char pad pad      short boundary
>  |    |   |        |
>  v    v   v        v
>  xxxxx000 00000000 yyyyyyy0
> ```
>
> The zero-length bit field causes the position to move to next `short` boundary
> (or: be placed on the nearest natural alignment for the target platform).
> We defined `short` to be 16-bit, so 16 minus 5 gives 11 bits of padding.

## `volatile` type qualifier

This qualifier tells the compiler that a variable may be accessed by other means
than the current code (e.g. by code run in another thread or it's MMIO device),
thus to not optimize away reads and writes to this resource.

<span></span>

* [Why is volatile needed in C? - Stack Overflow](https://stackoverflow.com/q/246127/10247460)
* [Advanced C: The UB and optimizations that trick good programmers.](https://www.youtube.com/watch?v=w3_e9vZj7D8)
* [volatile type qualifier - cppreference.com](https://en.cppreference.com/w/c/language/volatile)
* [volatile (computer programming) - Wikipedia](https://en.wikipedia.org/wiki/Volatile_(computer_programming))

## `restrict` type qualifier

By adding this type qualifier, a programmer hints to the compiler that for
the lifetime of the pointer, no other pointer will be used to access the object
to which it points. This allows the compiler to make optimizations (for example,
vectorization) that would not otherwise have been possible.  

<span></span>

* [restrict - Wikipedia](https://en.wikipedia.org/wiki/Restrict)
* [restrict type qualifier - cppreference.com](https://en.cppreference.com/w/c/language/restrict)
* [The restrict type qualifier - IBM Documentation](https://www.ibm.com/docs/en/zos/2.5.0?topic=qualifiers-restrict-type-qualifier)

## `register` type qualifier

It suggests that the compiler stores a declared variable in a CPU register
(or some other faster location) instead of in random-access memory.
The location of a variable declared with this qualifier cannot be accessed
(but the `sizeof` operator can be applied).

Nowadays `register` is usually meaningless as modern compilers place variables
in a register if appropriate regardless of whether the hint is given. Sometimes
may it be useful on embedded systems, but even then compiler will probably
provide better optimizations.

## Flexible array member

From Wikipedia:

```c
struct vectord {
    short len;    // there must be at least one other data member
    double arr[]; // the flexible array member must be last

    // The compiler may reserve extra padding space here,
    //   like it can between struct members.
};

struct vectord *vector = malloc(...);
vector->len = ...;
for (int i = 0; i < vector->len; ++i) {
     vector->arr[i] = ...;  // transparently uses the right type (double)
}
```

* [flexible array member – Jens Gustedt's Blog](https://gustedt.wordpress.com/2011/03/14/flexible-array-member/)
* [Zero Length (Using the GNU Compiler Collection (GCC))](https://gcc.gnu.org/onlinedocs/gcc/Zero-Length.html)
* [The benefits and limitations of flexible array members \| Red Hat Developer](https://developers.redhat.com/articles/2022/09/29/benefits-limitations-flexible-array-members)

## `%n` format specifier

[This StackOverflow answer](https://stackoverflow.com/a/8930383/10247460) presents it reasonably well:

> `%n` returns the current position of the imaginary cursor used when `printf()` formats its output.
>
> ```c
> int pos1, pos2;
> const char* str_of_unknown_len = "we don't care about the length of this";
>
> printf("Write text of unknown %n(%s)%n length\n", &pos1, str_of_unknown_len, &pos2);
> printf("%*s\\%*s/\n", pos1, " ", pos2-pos1-2, " ");
> printf("%*s", pos1+1, " ");
> for (int i = pos1+1; i < pos2-1; ++i) {
>     putc('-', stdout);
> }
> putc('\n', stdout);
> ```
>
> will have following output
>
> ```
> Write text of unknown (we don't care about the length of this) length
>                       \                                      /
>                        --------------------------------------
> ```
>
> Granted a little bit contrived but can have some uses when making pretty reports.

## Interlacing syntactic constructs

The following is syntactically correct C code:
```c
#include <stdio.h>

int main()
{
    int n = 3;
    int i = 0;

    switch (n % 2) {
        case 0:
            do {
                ++i;
        case 1:
                ++i;
            } while (--n > 0);

    }

    printf("%d\n", i); // 5
}
```

I know `goto`phobic programmers using it like this:
```c
    switch (x) {
        case 1:
            // 1 specific code

      if (0) {
        case 2:
            // 2 specific code
      }

            // common for 1 and 2
    }
```

The most famous usage of this quirk/"feature" is [Duff's device](https://en.wikipedia.org/wiki/Duff%27s_device):
```c
send(to, from, count)
    register short *to, *from;
    register count;
{
    register n = (count + 7) / 8;
    switch (count % 8) {
    case 0: do { *to = *from++;
    case 7:      *to = *from++;
    case 6:      *to = *from++;
    case 5:      *to = *from++;
    case 4:      *to = *from++;
    case 3:      *to = *from++;
    case 2:      *to = *from++;
    case 1:      *to = *from++;
            } while (--n > 0);
    }
}
```

## `-->` "operator"

The following is correct C code:

```c
size_t n = 10;
while (n --> 0) {
    printf("%d\n", n);
}
```

You may ask, since when C has such operator and the answer is: since never.
`-->` is not an operator, but two separate operators `--` and `>` written
in a way they look like one. It's possible, because C cares less than more
about whitespace.

`n --> 0` is equivalent of `(n--) > 0`

## `idx[arr]`

Square brace notation of accessing array elements is a syntactic sugar for pointer arithmetics:

<div markdown="1" style="width:100%; text-align:center">
`arr[5]` &equiv; `*(arr + 5)` &equiv; `*(5 + arr)` &equiv; `5[arr]`
</div>

You absolutely must never use this in actual code... but it's hella fun otherwise!

```c
// array[index]
boxes[products[myorder.product].box].weight;

// index[array]
myorder.product[products].box[boxes].weight;
```

## Negative array indexes

For quick and dirty debugging purposes I wanted to check if padding at the end
of an array is filled with correct value, but I didn't know where the padding
starts. Thus I did the following:

```c
int* end = arr + (len - 1);
if (end[0] == VAL && end[-1] == VAL && end[-5] == VAL) {
    puts("Correct padding");
}
```

## Constant string concatenation

You don't need `sprintf()` (nor `strcat()`!) to concatenate strings literals:

```
#define WORLD "World!"
const char* s = "Hello " WORLD "\n"
                "It's a lovely day, "
                "innit?";
```

## Using `&&` and `||` as conditionals

If you write Shell scripts, you know what I mean.

```c
#include <stdio.h>
#include <stdbool.h>

int main(void)
{
    1 && puts("Hello");
    0 && puts("I won't");
    1 && puts("World!");
    0 && puts("be printed");
    1 || puts("I won't be printed either");
    0 || puts("But I will!");

    true && (9 > 2) && puts("9 is bigger than 2");

    isdigit('9') && puts("9 is a digit");
    isdigit('n') && puts("n is a digit") || puts("n is NOT a digit!");

    return 0;
}
```

The compiler will probably scream warnings at you
as it's really uncommon to do this in C code.

## [Compile time assumption checking using `enum`s](https://stackoverflow.com/a/1715239/10247460)

```c
#define D 1
#define DD 2

enum CompileTimeCheck
{
    MAKE_SURE_DD_IS_TWICE_D = 1/(2*(D) == (DD)),
    MAKE_SURE_DD_IS_POW2    = 1/((((DD) - 1) & (DD)) == 0)
};
```

Can be useful for libraries with compile-time configurable constants.

## Ad hoc `struct` declaration in the return type of a function

You can define `struct`s in very (at first glance) random places:

```c
#include <stdio.h>

struct Foo { int a, b, c; } make_foo(void) {
    struct Foo ret = { .c = 3 };
    ret.a = 11 + ret.c;
    ret.b = ret.a * 3;
    return ret;
}

int main()
{
    struct Foo x = make_foo();
    printf("%d\n", x.a + x.b + x.c);
    return 0;
}
```

## "Nested" `struct` definition is not kept nested

```c
#include <stdio.h>

struct Foo {
    int x;
    struct Bar {
        int y;
    };
};

int main()
{
    struct Bar s = { 34 };  // correct
    // struct Foo.Bar s;    // wrong
    printf("%d\n", s.y);
    return 0;
}
```

## Flat initializer lists

```
int arr[3][3] = { 1, 2, 3, 4, 5, 6, 7, 8, 9 };
//            = { {1,2,3}, {4,5,6}, {7,8,9} };


struct Foo {
    const char *name;
    int age;
};

struct Foo records[] = {
    "John",   20,
    "Bertha", 40,
    "Andrew", 30,
};
```

## [Static array indices in function parameter declarations](https://www.ibm.com/docs/en/i/7.5?topic=pd-static-array-indices-in-function-parameter-declarations-c-only)

> Except in certain contexts, an unsubscripted array name (for example, `region`
> instead of `region[4]`) represents a pointer whose value is the address of the
> first element of the array, provided that the array has previously been declared.
> An array type in the parameter list of a function is also converted to the
> corresponding pointer type. Information about the size of the argument array
> is lost when the array is accessed from within the function body.
>
> To preserve this information, which is useful for optimization, C99 allows you
> to declare the index of the argument array using the static keyword. The constant
> expression specifies the minimum pointer size that can be used as an assumption
> for optimizations. This particular usage of the static keyword is highly prescribed.
> The keyword may only appear in the outermost array type derivation and only in
> function parameter declarations. If the caller of the function does not abide
> by these restrictions, the behavior is undefined.
>
> The following examples show how the feature can be used.
>
> ```c
> int n;
> void foo(int arr[static 10]);       // arr points to the first of at least 10 ints
> void foo(int arr[const 10]);        // arr is a const pointer
> void foo(int arr[const]);           // const pointer to int
> void foo(int arr[static const n]);  // arr points to at least n ints (VLA)
> ```

`void foo(int p[static 1]);` is effectively a standard
way to declare that `p` must be non-null pointer.

## Macro Overloading by Argument List Length

* [CMObALL](https://github.com/Jorengarenar/CMObALL)
* [BOOST_PP_OVERLOAD](https://www.boost.org/doc/libs/master/libs/preprocessor/doc/ref/overload.html)
* [Can macros be overloaded by number of arguments? - Stack Overflow](https://stackoverflow.com/q/16683146/10247460)

```c
#include <stdio.h>
#include "cmoball.h"

#define NoA(...) CMOBALL(FOO, __VA_ARGS__)
#define FOO_3(x,y,z) "Three"
#define FOO_2(x,y)   "Two"
#define FOO_1(x)     "One"
#define FOO_0()      "Zero"


int main()
{
    puts(NoA());
    puts(NoA(1));
    puts(NoA(1,1));
    puts(NoA(1,1,1));
    return 0;
}
```

## Function types

Function pointers ought to be well known, but as we know the syntax is bit awkward.
On the other hand, less people know you can (as with most objects in C) create
a `typedef` for function type.

```
#include <stdio.h>

int main()
{
    typedef double fun_t(double);
    fun_t sin, cos, sqrt;
    fun_t* ftpt = &sqrt;

    printf("%lf\n", ftpt(4)); // 2.000000

    return 0;
}
```

## X-Macros

* [X Macro - Wikipedia](https://en.wikipedia.org/wiki/X_Macro)
    * [Wikibooks on X macros](https://en.wikibooks.org/wiki/C_Programming/Preprocessor#X-Macros)
    * [C Programming/Serialization/X-Macros](https://en.wikibooks.org/wiki/C_Programming/Serialization#X-Macros)
* [Real-world use of X-Macros - Stack Overflow](https://stackoverflow.com/q/6635851/10247460)
* [What are X-macros? -- Arthur O'Dwyer](https://quuxplusone.github.io/blog/2021/02/01/x-macros/)
* [X macro: most epic C trick or worst abuse of preprocessor? / Arch Linux Forums](https://bbs.archlinux.org/viewtopic.php?id=272242)
* [The Most Elegant Macro -- Phillip Trudeau](https://philliptrudeau.com/blog/x-macro)

## Named function parameters

```c
struct _foo_args {
    int num;
    const char* text;
};

#define foo(...) _foo((struct _foo_args){ __VA_ARGS__ })
int _foo(struct _foo_args args)
{
    puts(args.text);
    return args.num * 2;
}

int main(void)
{
    int result = foo(.text = "Hello!", .num = 8);
    return 0;
}
```

## [Combining default, named and positional arguments](https://www.reddit.com/r/C_Programming/comments/yjbe62)

> Using compound literals and macros to create named arguments (...):
>
> ```c
> typedef struct { int a,b,c,d; } FooParam;
> #define foo(...) foo((FooParam){ __VA_ARGS__ })
> void (foo)(FooParam p);
> ```
>
> adding default arguments is also quite easy:
>
> ```c
> #define foo(...) foo((FooParam){ .a=1, .b=2, .c=3, .d=4, __VA_ARGS__})
> ```
>
> But now positional arguments don't work anymore, and there may be situations
> where you want to support both options. But I recently realized, that you can
> make them work by adding a dummy parameter:
>
> ```c
> typedef struct { int _; int a,b,c,d; } FooParam;
> #define foo(...) foo((FooParam){ .a=1, .b=2, .c=3, .d=4, ._=0, __VA_ARGS__})
> ```
>
> Now, foo can be called in the following ways:
>
> ```c
> foo();           // a=1, b=2, c=3, d=4
> foo(.a=4, .b=5); // a=4, b=5, c=3, d=5
> foo(4, 5);       // a=4, b=5, c=3, d=5
> foo(4, 5, .d=8); // a=4, b=5, c=3, d=8
> ```
>
> The dummy parameter isn't needed when you have arguments that are required to be passed by name:
>
> ```c
> typedef struct { int alwaysNamed; int a,b,c,d; } FooParam;
> #define foo(...) foo((FooParam){.a=1,.b=2,.c=3,.d=4, .alwaysNamed=5, __VA_ARGS__})
> ```

## [Abusing unions for grouping things into namespaces](https://utcc.utoronto.ca/~cks/space/blog/programming/CUnionsForNamespaces)

> Suppose that you have a `struct` with a bunch of fields, and you want to deal
> with some of them all together at once under a single name; perhaps you want
> to conveniently copy them as a block through `struct` assignment.
>
> By using unions you can access both `a.field2` and `a.sub` (and `a.field2`
> is the same as `a.sub.field2`) without any macros.
>
> ```c
> struct a {
>     int field1;
>     union {
>         struct {
>             int field2;
>             int field3;
>         };
>         struct {
>             int field2;
>             int field3;
>         } sub;
>     };
> };
> ```

## Garbage collector

[Boehm GC](https://www.hboehm.info/gc/) is a library providing garbage collector for C and C++

## [Cosmopolitan Libc](https://justine.lol/cosmopolitan/index.html)

> Cosmopolitan Libc makes C a build-once run-anywhere language, like Java,
> except it doesn't need an interpreter or virtual machine. Instead, it
> reconfigures stock GCC and Clang to output a POSIX-approved polyglot format
> that runs natively on Linux + Mac + Windows + FreeBSD + OpenBSD + NetBSD + BIOS
> with the best possible performance and the tiniest footprint imaginable.

## Inline assembly

For a high-level language C communicates quite well with low-level world. You
can write Assembly code and link it against program written in C quite easily.
In addition to that, many compilers offer as an extension (listed as common
in Annex J of the C Standard) a feature called _inline assembly_, typically
introduced to the code by the `asm` keyword.

* [Inline Assembly - OSDev Wiki](https://wiki.osdev.org/Inline_assembly)
* [Inline assembly - cppreference.com](https://en.cppreference.com/w/c/language/asm)
* [Inline Assembler (C) \| Microsoft Learn](https://learn.microsoft.com/en-us/cpp/c-language/inline-assembler-c)
* [Writing inline assembly code - Arm Compiler for Embedded User Guide](https://developer.arm.com/documentation/100748/0619/Using-Assembly-and-Intrinsics-in-C-or-C---Code/Writing-inline-assembly-code)
* [Inline Assembly in C/C++ - University of Alaska Fairbanks](https://www.cs.uaf.edu/courses/cs301/2014-fall/notes/inline-assembly/)

## Object Oriented Programming

* [Object-Oriented Programming in C - Quantum Leaps](https://www.state-machine.com/oop)
* [Object-orientation in C - Stack Overflow](https://stackoverflow.com/q/415452/10247460)
* [Object-Oriented Programming With ANSI C](https://www.cs.rit.edu/%7Eats/books/ooc.pdf)
* [C Traps and Pitfalls](https://www.cs.tufts.edu/comp/40/docs/CTrapsAndPitfalls.pdf) by Andrew Koenig
* ["you can have something like interfaces and virtual methods by using function pointers"](https://www.reddit.com/r/C_Programming/comments/mqk338/interesting_ways_to_use_c/guhenr5/)

## Metaprogramming

C11 added `_Generic` to language, but turns out metaprogramming
by inhumanely abusing the preporcessor is possible even in pure C99:
meet [Metalang99](https://metalang99.readthedocs.io) library.
