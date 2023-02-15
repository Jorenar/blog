---
layout: post
title:  "Pitfalls of VLA in C"
redirect_from:
  - /programming/vla-bad
  - /vla-bad
---

> It generates much more code, and much _slower_ code (and more fragile code),
  than just using a fixed key size would have done ~ [Linus Torvalds](https://lkml.org/lkml/2018/3/7/621)

VLA (**variable-length array**, an array -- *array*, not just block of memory
acting like one -- that has size determined during runtime instead of at compile
time) is a feature introduced to C with the revision C99 of the standard.
A very useful feature one may think, and indeed... in some cases...
But since the world we live in is less than ideal, one needs to know well what
are the pitfalls of using VLA in their code before doing so.

If you want to know when VLA may be useful, you can check [my other blogpost](/vla-usecases).

A fair share of the text here will focus on problems caused by automatic VLA,
thus to further reflect on that an abbreviation _aVLA_ will be used when
refferng to those cases.

# Allocation on stack

Let's address the elephant in the room: aVLA usually are allocated on stack.
This is the source of the most of the problems, the source of discontent among
programmers, the reason why even allowing any VLA into the codebase is usually
a code smell.

Let's consider a painfully simple, very favourable to aVLA, example:
```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);
    char arr[n];
    printf("%d", arr[0]);
    return 0;
}
```

As we can see, it takes a number from user then makes array of that size. Compile
and try it. Check how big values you can input before getting segfault caused
by stack overflow. [In my case, it was around 8 MiB](https://godbolt.org/z/45arWxWo7).
How much is that? One raw image? a MP3 or two? few seconds of video? And the program
wasn't doing anything meaningful - what if it wasn't just `main()`? Maybe a recursive
function? The limit shrinks tremendously.

And you don't have any (portable, standard) way to react after a stack
overflow - the program already *crashed, you lost control*. So you either need
to make elaborate checks before declaring an array or betting that user won't
input too large values (the outcome of such gamble ought to be obvious).

So the programmer **must** ensure that aVLA size doesn't exceed some safe maximum,
but in reality, if you know safe maximum, there is rarely any reason for not using
it always.

## Worst of it is...

... that segfault is actually one of the best outcomes of improperly handled aVLA.
The worst case is an exploitable vulnerability, where attacker may choose a value
that causes an array to overlap with other allocations, giving them control over
those values as well. A security nightmare.

<aside class="notice" markdown="1">
At the cost of further drop of efficiency, in GCC you can enable
`-fstack-clash-protection` option. It adds _extra_ instructions around
variable length stack memory allocations to probe each page of memory at
allocation time. This mitigates stack-clash attacks by ensuring all stack
memory allocations are valid or by throwing a segfault if they are not, thus
turning a possible code-execution attack into a denial of service.
</aside>

## So how to fix this example?

What if I need to let user define size and creating ridiculously large fixed
array would be too wasteful? It's&nbsp;simple:&nbsp;use&nbsp;`malloc()`!
```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    scanf("%d", &n);
    char* arr = malloc(n * (sizeof *arr));
    printf("%d", arr[0]);
    free(arr);
    return 0;
}
```

In this case I was able to request over 4.5 GB before segfault. Almost few orders
of magnitude more! But I still got the segfault, right? Well, the difference
is in getting at least some\* chance of checking the value returned by `malloc()`
and thus being able to, for example, inform the user about the error:
```c
    char* arr = malloc(n * (sizeof *arr));
    if (arr == NULL) {
        perror("malloc()"); // output: "malloc(): Cannot allocate memory"
    }
```
<aside class="notice" markdown="1">
\* Only "some" chance because while it usually doesn't cause problems,
operating systems may (and do) use something called [memory overcommitment](https://en.wikipedia.org/wiki/Memory_overcommitment)
which rarely, but still, may be a little... [broken sometimes](https://www.win.tue.nl/~aeb/linux/lk/lk-9.html#ss9.6).
</aside>

### "but I cannot use `malloc()`!"

I've encountered a counterargument, that as C is often used as a systems/embedded
language, there are situations where using `malloc()` may not even be possible.

I'm basically going to repeat myself here, but it is really important:

1. Such device rather is not going to have a lot of stack either. So instead of
   allocating dynamically, you (probably) should determine how much you need and
   just always use that fixed amount.

2. When using aVLA on system with small amounts of stack, it's really easy to make
   something which seems to work, but which blows your stack if your function gets
   called from a deep call stack combined with the large amount of data.

3. If you always allocate fixed amounts of stack space everywhere, and you test
   it, you know you're good. If you dynamically allocate on stack, you have to
   test all your code paths with all the largest sizes of allocated space, which
   is much harder and much easier to make a mistake. Don't make it even easier to
   shoot yourself in the foot for no real advantage.

# Creation by accident

Unlike most other dangerous C functionality, aVLA doesn't have the barrier
of being not known. Many newbies learn to use them via trial and error, but
don't learn about the pitfalls. \\
The following is a simple mistake I observed even experienced developers making
(especially those with C++ background); it will silently create an aVLA when
it's clearly not necessary:
```c
const int n = 10;
int A[n];
```
Thankfully, any half-decent compiler would notice and optimize aVLA away, but...
what if it doesn't notice? Or what if, for some reason (safety?), the optimizations
were not turned on? But it surely isn't so much worse, right? Well...

# Way slower than fixed size

Without compiler optimizations a function with [aVLA from previous
example](https://godbolt.org/z/Pe6sqEqv1) will result in **7 times** more Assembly
instructions than its [fixed size counterpart](https://godbolt.org/z/7h9zevrPq)
before moving past the array definition (look at the body before `jmp .L2`).
But it's without optimizations, with them the produced Assembly is exactly the same.

So [an example where aVLA is not used by mistake](https://godbolt.org/z/4qeYhzTbn):
```c
#include <stdio.h>
void bar(int*, int);

void foo(int n) {

#if VLA
    int A[n];
#else
    int A[1000];  // Let's make it bigger than 10! (or there won't be what to examine)
#endif

    for (int i = n; i--;) {
        scanf("%d", &A[i]);
    }
    bar(A, n);
}

int main(void) {
    foo(10);
    return 0;
}
```
For our educational purposes in this example, `-O1` level of optimisation will
work best (as Assembly will be clearer and `-O2` won't help aVLA's case here
really much).

When we compile aVLA version, before instructions corresponding to `for` loop, we get:
```nasm
push    rbp
mov     rbp, rsp
push    r14
push    r13
push    r12
push    rbx
mov     r13d, edi
movsx   r12, edi       ; here aVLA "starts"...
sal     r12, 2         ;
lea     rax, [r12+15]  ;
and     rax, -16       ;
sub     rsp, rax       ;
mov     r14, rsp       ; ... and there "ends"
```

The aVLA-free version on the other hand generates:
```nasm
push    r12
push    rbp
push    rbx
sub     rsp, 4000      ; this is caused by array definition
mov     r12d, edi
```

So not only fixed array spawns less code, but also way simpler code.
Why, aVLA even causes more overhead at the beginning of the function.
It's not so much more in the grand scheme of things, but it still isn't
just a pointer bump.

But are those differences significant enough to care?
[Yes, they are](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=02361bc77888).

# No initialization

To add more to the issue with inadvertent aVLA, the following isn't allowed:
```c
int n = 10;
int A[n] = { 0 };
```
Even with optimizations, initialisation isn't allowed for aVLA. So despite
wanting fixed size array and compiler being technically able to provide one,
it's won't work (and if it does... it's breaking the specification...).

# Mess for compiler writers

Few months ago I saved a [comment](https://www.reddit.com/r/C_Programming/comments/jz2213/are_vlas_bad_even_if_theyre_not_allocated_on_the/gdc3hz6)
on Reddit listing problems encountered with VLA from compiler writer perspective.
I'll allow myself to cite the listed issues:

> * A VLA applies to a type, not an actual array. So you can create a `typedef`
>   of a VLA type, which "freezes" the value of the expression used, even if
>   elements of that expression change at the time the VLA type is applied
> * VLAs can occur inside blocks, and inside loops. This means allocating and
>   deallocating variable-sized data on the stack, and either screwing up all
>   the offsets, or needing to do things indirectly via pointers.
> * You can use `goto` into and out of blocks with active VLAs, with some things
>   restricted and some not, but the compiler needs to keep track of the mess.
> * VLAs can be used with multi-dimensional arrays.
> * VLAs can be used as pointer targets (so no allocation is done, but it still
>   needs to keep track of the variable size).
> * Some compilers allow VLAs inside structure definitions (I really have no idea
>   how that works, or at what point the VLA size is frozen, so that all instances
>   have the same VLA(s) sizes.)
> * A function can have dozens of VLAs active at any one time, with some being
>   created or destroyed at different times, or conditionally, or in loops.
> * `sizeof` needs to be specially implemented for VLAs, and all the necessary
>   info (for actual VLAs, VLA-types, and hybrid VLA/fixed-size types and
>   arrays and pointed-to VLAs).
> * 'VLA' is also the term used for multi-dimensional array parameters, where
>   the dimensions are passed by other parameters.
> * On Windows, with some compilers (GCC at least), declaring local arrays which
>   make the stack frame size over 4 KiB, mean calling a special allocator
>   (`__chkstk()`), as the stack can only grow a page at a time. When a VLA is
>   declared, since the compiler doesn't know the size, it needs to call
>   `__chkstk` for every such function, even if the size turns out to be small.

And believe me, if you take a stroll around some C forums (or the meeting of
standard committee [sic!]) you will see even more different complaints.

# Reduced portability

Due to all previously presented problems, some compiler providers decided to
not fully support C99. The primary example is Microsoft with its MSVC.
The C Standard Committee also noticed the problem and with C11 revision
all instances of VLAs were made optional; C2x is partially reverts that decision
mandating VM types (aVLA are still optional; there is even a slight sentiment
towards deprecating them entirely, but removing something from the, nomen omen,
standard is way harder than putting it in).

That means code using a VLA won't necessarily be compiled by a C11 compiler,
so you need, assuming you target for portability, to check whether it is
supported with `__STDC_NO_VLA__` macro and make version without (a)VLA as
fallback. Wait... if you need to implement VLA-free version either way then
what's the point of doubling the code and creating VLA in the first place?!

<aside class="notice" markdown="1">
As a side note: C++ doesn't have VLA and nothing suggests
it ever will (other than as implementation extension).<br>
Not a dealbreaker, but still point against VLA in C.
</aside>

# (nitpick) Breaking conventions

This one is more of a nitpick, but still another reason to dislike VLA. There
is a widely used convention of first passing object then its parameters, what
in terms of arrays means:
```c
void foo(int** arr, int n, int m) { /* arr[i][j] = ... */ }
```

C99 specified that array sizes need to be parsed immediately when encountered
within a function definition's parameter list, what means that when using VLA
you cannot do an equivalent of the above:
```c
void foo(int arr[n][m], int n, int m) { /* arr[i][j] = ... */ } // INVALID!
```

You need to break up with the convention and write:
```c
void foo(int n, int m, int arr[n][m]) { /* arr[i][j] = ... */ }
```

Alternatively, you could use the obsolete syntax (obsolescent even in
ANSI&nbsp;C; finally removed in C2x), but that would be pointless, as
compilers don't make parameters checks in such case, so any benefits
from using VLA would be lost.
```c
void foo(int[*][*], int, int);
void foo(arr, n, n)
    int n;
    int m;
    int arr[n][m]
{
    // arr[i][j] = ...
}
```

<aside class="notice" markdown="1">
There is a chance a GCC extension - _forward declaration of parameters_ - will
be standardized in C2x (assuming we reach consensus on the revision
of [N2780](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n2780.pdf)).
</aside>

# Conclusion

In short, refrain from using VLA and **avoid automatic VLA like devil avoids
holy water**; if your compiler has it, rather compile with `-Wvla` flag
or similar (and definitely with `-Wvla-larger-than=0` - this allows VM&nbsp;types,
while warning about aVLA).

If you find yourself in one of the situations where VLA (or VM type) is a valid/good
solution, of course, do use them, but keep in mind the limits I've outlined here.

<aside class="notice" markdown="1">
It's probably also worth mentioning that VLAs were partially supposed to be
a solution to non-standard `alloca()` function, which even more problematic
when it comes to stack.
</aside>

<aside class="notice" markdown="1">
As you could have guessed by the quote at the beginning, project which used to
rely on VLA quite extensively (209 unique locations reported in 60 directories!)
is nothing else than Linux kernel. Maintainers spent a lot of effort to get rid
of all VLA and as of version 4.20 (year 2018) it's completely VLA-free.
</aside>
