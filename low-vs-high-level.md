---
layout: post
title:  "Know thy difference between low- and high-level in programming"
---

I have a pet peeve, I really do have a pet peeve. I've tried many times to let
it go, but to no avail. It really grinds my gears when somebody


--------------------------------------------------------------------------------

https://www.quora.com/Is-assembly-language-a-low-level-or-a-high-level-language?share=1  
https://www.reddit.com/r/computerscience/comments/ptc09c/is_c_really_a_not_low_level_programming_language/  
https://softwareengineering.stackexchange.com/questions/267583/why-is-c-still-in-the-category-of-high-level-language  
https://old.reddit.com/r/programming/duplicates/8g8ix6/c_is_not_a_lowlevel_language_acm_queue/
https://old.reddit.com/r/C_Programming/comments/187a7qq/what_exactly_is_the_c_runtime/

--------------------------------------------------------------------------------

> No, K&R says (emphasis mine):
>
> > C is not a **"very** high level**''** language
>
> and
>
> > C is a **relatively "**low level**"** language
>
> ---
>
> We see not only usage of adjectives changing absolute into relative terms, but also [scare quotes](https://en.wikipedia.org/wiki/Scare_quotes).

> * system-level languages
>
> C, C++, Rust &co. are high-level languages often used for low-level programming
> (thus they can be also labeled as system- or middle-level)

> > Well there is no clear boundary which separates high and low level languages, but yeah, you can say that too...
>
>
> Oh, but there is!  
> Low-level: machine code, assembly, microcode  
> High-level: essentially everything else  
>
> Then high-level has subcategories like: middle-level languages, VHLL or DSL

> > Well how do you define it then, based in what traits do you say that these three should belong to LLL category while C or C++ shouldn't
>
> Low-level language provides little to no abstraction over CPU instruction set.  
> Being system-level languages, we generally can easily match generated assembly with original C/C++ code.  
> But there are concepts which are completely foreign to low-level, e.g. defining a struct:  
>
>     struct Foo {
>         int x;
>         char* str;
>     };

> > C, C++ don't force you to use any abstraction, you can write assembly embedded in C and C++. (Haven't tried in C++ but you can definitely do that in C).
> And sometimes you do write it that way.
>
> As you yourself said: embedded assembly  
> Embedding one language into another doesn't transfer the characteristics of former into latter  
> To give more clear example: <script> tag in HTML doesn't make it a programming language - JavaScript is the programming language embedded into markup language.  
> And there is nothing stating high-level language cannot be capable of low-level programming, quite the contrary! Low-level programming is common to middle-level subcategory.  
> Also, if you don't use any abstraction provided by C and only opted for inline assembly, then well... you wrote assembly, not C.  
>
> > Haven't tried in C++ but you can definitely do that in C
>
> Definitely not definitely ;)  
> C standard recognizes inline assembly as common extension (C11 § J.5.10), but doesn't standardize it even as optional.  
> Funny enough, it's C++ that standardize it as conditionally-supported with implementation-defined meaning (C20 § 9.10).  

> > C is a **relatively** **"**low level**"** language.
>
> There's literally a keyword changing meaning of absolute term to, nomen omen, relative one. On top of that, they put it in [scare quotes](https://en.wikipedia.org/wiki/Scare_quotes).
>
> To illustrate by analogy:
> _In a world where skyscrapers reach few hundreds meters, or even approach kilometer like Burj Khalifa or Jeddah Tower (if completed), something like Antwerp Tower (~100 m) is a relatively small building._
> That's true, right? Right.
> But it doesn't change the fact it's still one damn skyscraper! It's still ridiculously tall. The appearance of taller buildings didn't shrink it. We didn't suddenly strip it of previous descriptions, we invented **new** words for **new** heights (like "_megatall_").
>
> ^(PS. C is also not a "high-level assembler", the phrase also was put in scare quotes, it was used to share an idea, not factual description)


----

>honestly not really understanding the difference between high level and low level languages

Well, let me demonstrate!  
20 first elements of Fibonacci sequence in C, Python, JavaScript, Nasm and Mips

#### High-level

**C**

    #include <stdio.h>

    int main()
    {
        int a = 1;
        int b = 1;

        for (int i = 0; i < 20; ++i) {
            { int c = b; b = a; a = c; }

            printf("%d\n", b);
            a += b;
        }
        return 0;
    }


**Python**

    #!/usr/bin/env python
    # -*- coding: UTF-8 -*-

    a = 1
    b = 1

    for i in range(0, 20):
        a,b = b,a

        print(str(b))
        a += b

**JavaScript**

    "use strict";
  
    let a = 1;
    let b = 1;

    for (let i = 0; i < 20; ++i) {
        [ a, b ] = [ b, a ]

        console.log(b);
        a += b;
    }

#### Low-level

**Nasm** (code from [here](https://github.com/luc99a/Assembly-Codes/blob/master/fibonacci.asm); without utilizing "external" routines)

    section .bss
    toprint:	resb	1

    section .data
    lf:	db 0Ah

    section .text
        global _start
    _start:
        mov eax, 1
        mov ebx, 1
        mov ecx, 20
    loop:
        add ebx, eax
        push eax
        push ebx
        push ecx
        call printnum
        pop ecx
        pop eax
        pop ebx
        dec ecx
        test ecx, ecx
        jnz loop
        mov eax, 1
        mov ebx, 0
        int 80h


    printnum:
        xor edi, edi
    divide:
        xor edx, edx
        mov ecx, 10
        div ecx
        push edx
        inc edi
        test eax, eax
        jnz divide
    print:
        pop eax
        add eax, '0'
        mov [toprint], eax
        mov ebx, 1
        mov ecx, toprint
        mov edx, 1
        mov eax, 4
        int 80h
        dec edi
        test edi, edi
        jnz print
        mov eax, 4
        mov ebx, 1
        mov ecx, lf
        mov edx, 1
        int 80h
        ret

**Mips** (code from [here](https://www.reddit.com/r/computerscience/comments/ptc09c/comment/heu7k12/?utm_source=share&utm_medium=web2x&context=3); utilizing "external" routines)

    main:   .text
            li  $t0, 1
            li  $t1, 1
            li  $a0, 1
            jal print

    loop:   jal print
            move    $t0, $t1
            move    $t1, $a0
            add     $a0, $t1, $t0
            blt $a0, 20, loop

    exit:   li  $v0, 10
            syscall

    print:  sw  $a0, 0($sp)
            li  $v0, 1
            syscall
            li  $a0, 10
            li  $v0, 11
            syscall
            lw  $a0, 0($sp)
            jr  $ra
