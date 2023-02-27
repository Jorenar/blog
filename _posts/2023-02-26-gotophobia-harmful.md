---
layout: post
title:  "GOTOphobia considered harmful (in C)"
---

<aside markdown="1">
**gotophobia** -- fear of `goto` statement, usually caused by misunderstanding
and lack of context of stories from dark ages of programming. Programmers with
gotophobia tend to make their code less readable just to avoid using `goto`.
</aside>

Everybody and their grandpa knows (the meme title of) Dijkstra's
[_Letters to the editor: go to statement considered harmful_](https://dl.acm.org/doi/epdf/10.1145/362929.362947)
(submitted under the title: _A case against the goto statement_),
but most forget the context of the 60s in which it was written,
things we take for granted were a novelty back then.

A lot programmers learnt the craft in a world where `goto` was the main method
of flow control; even in structured languages it was easy for them to fall back
on the learned bad habits and techniques.
On the other hand, today we have the very opposite situation: programmers not
using `goto` when it's appropriate and abusing other constructs, what ironically
makes code only less readable. They overfocus on the _WHAT_ ("remove `goto`")
rather than the _WHY_ ("because it improves readability and maintainability").

Academic teachers parroting "`goto` evil" while not really understanding the
language they teach only worsens the matter [speaking from experience]. Because
who needs to learn good practices and discipline, right? It's obviously better
to just ignore the topic entirely and let the students later wonder why they get
[attacked by velociraptors](https://www.explainxkcd.com/wiki/index.php/292:_goto).

> A "goto" is not, in and of itself, dangerous -- it is a language feature,
> one that directly translates to the jump instructions implemented in machine
> code. Like pointers, operator overloading, and a host of other "perceived"
> evils in programming, "goto" is widely hated by those who've been bitten by
> poor programming. &nbsp; ~~_[redacted poorly expressed take]_~~
>
> If you think people can't write spaghetti code in a "goto-less" language, I
> can send you some *lovely* examples to disabuse you of that notion. ;)
>
> Used over short distances with well-documented labels, a "goto" can be more
> effective, faster, and cleaner than a series of complex flags or other
> constructs. The "goto" may also be safer and more intuitive than the
> alternative. A "break" is a goto; a "continue" is a "goto" -- these are
> statements that move the point of execution explicitly.
>
> ~ [Scott Robert Ladd](https://lkml.org/lkml/2003/1/12/245)

Linux kernel is one thing, but if even such restrictive coding standard
as MISRA C (2012 edition) can downgrade the prohibition on `goto` from
_required_ to _advisory_, I think in regular code we can safely use `goto`
in judicious manner.

Thus I want to present some situations and patterns where `goto` could be acceptable
(perhaps the best?) choice and you could maybe want to *consider* using it.
I'll also try to mention `goto`-less alternatives and their potential drawbacks
(you presumably already are familiar with their advantages as well as with
 the possible hitches of `goto` versions).

<aside markdown="1">
**Resources**

* _The C Programming Language, 2nd ed._ by Kernighan & Ritchie
* [Goto # Common usage patterns - Wikipedia](https://en.wikipedia.org/wiki/Goto#Common_usage_patterns)
* [Are there any legitimate use-cases for "goto" in a language that supports loops and functions? - Stack Overflow](https://stackoverflow.com/q/24451/10247460)
* [Beej's Guide to C Programming: `goto`](https://beej.us/guide/bgc/html/split/goto.html)
* [Modern C](https://hal.inria.fr/hal-02383654/file/ModernC.pdf) by Jens Gustedt
* [Using goto for error handling in C](https://eli.thegreenplace.net/2009/04/27/using-goto-for-error-handling-in-c)
* [Structured Programming with _go to_ Statements](https://dl.acm.org/doi/epdf/10.1145/356635.356640) by Donald E. Knuth
* [Error handling using goto : r/C_Programming](https://www.reddit.com/r/C_Programming/comments/g3juie/error_handling_using_goto/)
* [Linux kernel coding style](https://www.kernel.org/doc/html/v6.2/process/coding-style.html#centralized-exiting-of-functions)
* [When to use Goto in C - Cprogramming.com](https://www.cprogramming.com/tutorial/goto.html)
* [Harmful GOTOs, Premature Optimizations, and Programming Myths are the Root of all Evil](https://alvaro-videla.com/2015/02/programming-myths.html)
* [Examples of good gotos in C or C++ - Stack Overflow](https://stackoverflow.com/q/245742/10247460)
* [Should you ever use a goto? - Jacob Sorber - YouTube](https://www.youtube.com/watch?v=8bmEhtMVrhk)
* [GOTO Reconsidered](https://chidiwilliams.com/post/goto/)
* ["GOTO Considered Harmful" Considered Harmful](http://web.archive.org/web/20090320002214/http://www.ecn.purdue.edu/ParaMount/papers/rubin87goto.pdf)
* [When is it appropriate to use GOTO? : r/C_Programming](https://www.reddit.com/r/C_Programming/comments/wimvdf/when_is_it_appropriate_to_use_goto/)
* [Programming With(out) the GOTO](https://dl.acm.org/doi/pdf/10.1145/800194.805859)
* [Ian Mallett - Tutorials: The goto Statement is Good](https://geometrian.com/programming/tutorials/gotogood/index.php)
* [MEM12-C. Consider using a goto chain when leaving a function on error when using and releasing resources -&nbsp;SEI&nbsp;CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/MEM12-C.+Consider+using+a+goto+chain+when+leaving+a+function+on+error+when+using+and+releasing+resources)
* [Valid use of goto for error management in C? - Stack Overflow](https://stackoverflow.com/q/788903/10247460)
* [LKML: Rob Wilkens: Re: any chance of 2.6.0-test\*?](https://lkml.org/lkml/2003/1/12/126)
  * [Linux: Using goto In Kernel Code \| KernelTrap](https://web.archive.org/web/20130521051957/https://kerneltrap.org/node/553/2131)
  * [Using Goto in Linux Kernel Code \| Koblents.com](https://koblents.com/Ches/Links/Month-Mar-2013/20-Using-Goto-in-Linux-Kernel-Code/)
</aside>

* Table of Contents
{:toc}

# Error/exception handling & cleanup

Poster child of using `goto` -- most of the times accepted, often recommended,
sometimes even straight up mandated. This pattern results in a good quality
code, because the operations of the algorithm are _structured_ in a clear order,
while errors and other overhead is handled somewhere else, outside the mainline.
The alternatives make the code less readable as it's hard to spot where the
main code is buried among the error checks.

From SEI CERT C Coding Standard:

> Many functions require the allocation of multiple resources. Failing and
> returning somewhere in the middle of this function without freeing all of
> the allocated resources could produce a memory leak. It is a common error
> to forget to free one (or all) of the resources in this manner, so a `goto`
> chain is the simplest and cleanest way to organize exits while preserving
> the order of freed resources.

```c
int* foo(int bar)
{
    int* return_value = NULL;

    if (!do_something(bar)) {
        goto error_didnt_sth;
    }
    if (!init_stuff(bar)) {
        goto error_bad_init;
    }
    if (!prepare_stuff(bar)) {
        goto error_bad_prep;
    }
    return_value = do_the_thing(bar);

error_bad_prep:
    clean_stuff();
error_bad_init:
    destroy_stuff();
error_didnt_sth:
    undo_something();

    return return_value;
}
```

**Randomly taken real-life [example from Linux kernel](http://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/clk/mmp/clk-audio.c#n345):**
```c
// SPDX-License-Identifier: GPL-2.0-or-later
/*
 * MMP Audio Clock Controller driver
 *
 * Copyright (C) 2020 Lubomir Rintel <lkundrak@v3.sk>
 */

static int mmp2_audio_clk_probe(struct platform_device *pdev)
{
	struct mmp2_audio_clk *priv;
	int ret;

	priv = devm_kzalloc(&pdev->dev,
			    struct_size(priv, clk_data.hws,
					MMP2_CLK_AUDIO_NR_CLKS),
			    GFP_KERNEL);
	if (!priv)
		return -ENOMEM;

	spin_lock_init(&priv->lock);
	platform_set_drvdata(pdev, priv);

	priv->mmio_base = devm_platform_ioremap_resource(pdev, 0);
	if (IS_ERR(priv->mmio_base))
		return PTR_ERR(priv->mmio_base);

	pm_runtime_enable(&pdev->dev);
	ret = pm_clk_create(&pdev->dev);
	if (ret)
		goto disable_pm_runtime;

	ret = pm_clk_add(&pdev->dev, "audio");
	if (ret)
		goto destroy_pm_clk;

	ret = register_clocks(priv, &pdev->dev);
	if (ret)
		goto destroy_pm_clk;

	return 0;

destroy_pm_clk:
	pm_clk_destroy(&pdev->dev);
disable_pm_runtime:
	pm_runtime_disable(&pdev->dev);

	return ret;
}
```

## `goto`-less alternative 1: nested `if`s

Drawbacks:
 * nesting ([_arrow anti-pattern_](https://wiki.c2.com/?ArrowAntiPattern))
 * potentially duplicated code (see example function from Linux)

```c
int* foo(int bar)
{
    int* return_value = NULL;

    if (do_something(bar)) {
        if (init_stuff(bar)) {
            if (prepare_stuff(bar)) {
                return_value = do_the_thing(bar);
            }
            clean_stuff();
        }
        destroy_stuff();
    }
    undo_something();

    return return_value;
}
```

<details>
<summary>Example from Linux kernel rewritten</summary>
<div markdown="1">
```c
static int mmp2_audio_clk_probe(struct platform_device *pdev)
{
    // ...
    pm_runtime_enable(&pdev->dev);

    ret = pm_clk_create(&pdev->dev);
    if (!ret) {
        ret = pm_clk_add(&pdev->dev, "audio");
        if (!ret) {
            ret = register_clocks(priv, &pdev->dev);
            if (!ret) {
                pm_clk_destroy(&pdev->dev);
                pm_runtime_disable(&pdev->dev);
            }
        } else {
            pm_clk_destroy(&pdev->dev);
            pm_runtime_disable(&pdev->dev);
        }
    } else {
        pm_runtime_disable(&pdev->dev);
    }

    return ret; // original was returning 0 explicitly
}
```
</div>
</details>

<span></span>

And here Microsoft provides us with a [lovely example of such "beautiful" nesting](https://learn.microsoft.com/en-us/windows/win32/shell/common-file-dialog#basic-usage)
([archived version](https://web.archive.org/web/20221203064532/https://learn.microsoft.com/en-us/windows/win32/shell/common-file-dialog#basic-usage)).

## `goto`-less alternative 2: if not then clean

Drawbacks:
  * duplicated code
  * multiple exit points

```c
int* foo(int bar)
{
    int* return_value = NULL;

    if (!do_something(bar)) {
        undo_something();
        return return_value;
    }
    if (!init_stuff(bar)) {
        destroy_stuff();
        undo_something();
        return return_value;
    }
    if (!prepare_stuff(bar)) {
        clean_stuff();
        destroy_stuff();
        undo_something();
        return return_value;
    }

    clean_stuff();
    destroy_stuff();
    undo_something();

    return do_the_thing(bar);
}
```

<details>
<summary>Example from Linux kernel rewritten</summary>
<div markdown="1">
```c
static int mmp2_audio_clk_probe(struct platform_device *pdev)
{
    // ...
    pm_runtime_enable(&pdev->dev);

    ret = pm_clk_create(&pdev->dev);
    if (ret) {
        pm_runtime_disable(&pdev->dev);
        return ret;
    }

    ret = pm_clk_add(&pdev->dev, "audio");
    if (ret) {
        pm_clk_destroy(&pdev->dev);
        pm_runtime_disable(&pdev->dev);
        return ret;
    }

    ret = register_clocks(priv, &pdev->dev);
    if (ret) {
        pm_clk_destroy(&pdev->dev);
        pm_runtime_disable(&pdev->dev);
        return ret;
    }

    return 0;
}
```
</div>
</details>

## `goto`-less alternative 3: flags

Drawbacks:
 * additional variables
 * "cascading" booleans
 * potential nesting
 * potential complicated boolean expressions

```c
int* foo(int bar)
{
    int* return_value = NULL;

    bool flag_1 = false;
    bool flag_2 = false;
    bool flag_3 = false;

    flag_1 = do_something(bar);
    if (flag_1) {
        flag_2 = init_stuff(bar);
    }
    if (flag_2) {
        flag_3 = prepare_stuff(bar);
    }
    if (flag_3) {
        return_value = do_the_thing(bar);
    }

    if (flag_3) {
        clean_stuff();
    }
    if (flag_2) {
        destroy_stuff();
    }
    if (flag_1) {
        undo_something();
    }

    return return_value;
}
```

<aside markdown="1">
Rewrite of `mmp2_audio_clk_probe()` function doesn't fit clearly into
this case, thus I've put two variants under alternative 3.5 instead.
</aside>

## `goto`-less alternative 3.5: so-far-ok flag

```c
int foo(int bar)
{
    int return_value = 0;
    bool something_done = false;
    bool stuff_inited = false;
    bool stuff_prepared = false;
    bool oksofar = true;

    if (oksofar) {  // this IF is optional (always execs) but included for consistency
        if (do_something(bar)) {
            something_done = true;
        } else {
            oksofar = false;
        }
    }

    if (oksofar) {
        if (init_stuff(bar)) {
            stuff_inited = true;
        } else {
            oksofar = false;
        }
    }

    if (oksofar) {
        if (prepare_stuff(bar)) {
            stuff_prepared = true;
        } else {
            oksofar = false;
        }
    }

    // Do the thing
    if (oksofar) {
        return_value = do_the_thing(bar);
    }

    // Clean up
    if (stuff_prepared) {
        clean_stuff();
    }
    if (stuff_inited) {
        destroy_stuff();
    }
    if (something_done) {
        undo_something();
    }

    return return_value;
}
```

<details>
<summary>Example from Linux kernel rewritten</summary>
<div markdown="1">
```c
static int mmp2_audio_clk_probe(struct platform_device *pdev)
{
    // ...
    pm_runtime_enable(&pdev->dev);

    bool destroy_pm_clk = false;

    ret = pm_clk_create(&pdev->dev);
    if (!ret) {
        ret = pm_clk_add(&pdev->dev, "audio");
        if (ret) {
            destroy_pm_clk = true;
        }
    }
    if (!ret) {
        ret = register_clocks(priv, &pdev->dev);
        if (ret) {
            destroy_pm_clk = true;
        }
    }

    if (ret) {
        if (destroy_pm_clk) {
            pm_clk_destroy(&pdev->dev);
        }
        pm_runtime_disable(&pdev->dev);
        return ret;
    }

    return 0;
}
```
</div>
</details>
<details>
<summary>Example from Linux kernel rewritten</summary>
<div markdown="1">
```c
static int mmp2_audio_clk_probe(struct platform_device *pdev)
{
    // ...
    pm_runtime_enable(&pdev->dev);

    bool destroy_pm_clk = false;
    bool disable_pm_runtime = false;

    ret = pm_clk_create(&pdev->dev);
    if (ret) {
        disable_pm_runtime = true;
    }
    if (!ret) {
        ret = pm_clk_add(&pdev->dev, "audio");
        if (ret) {
            destroy_pm_clk = true;
        }
    }
    if (!ret) {
        ret = register_clocks(priv, &pdev->dev);
        if (ret) {
            destroy_pm_clk = true;
        }
    }

    if (destroy_pm_clk) {
        pm_clk_destroy(&pdev->dev);
    }
    if (disable_pm_runtime) {
        pm_runtime_disable(&pdev->dev);
    }

    return ret;
}
```
</div>
</details>

## `goto`-less alternative 4: functions

Drawbacks:
 * More objects (not only new functions, but often also `struct`s)
   <span style="font-size: 0.6em" title="Things should not be multiplied beyond what is required">
     "Entia non sunt multiplicanda praeter necessitatem"
   </span>
   * deeper callstack
 * often require passing context around
   * increase in pointing to pointers
   * aforementioned additional `struct`s
 * fragmented code
   * temptation to needlessly abstract it away

```c
static inline int foo_2(int bar)
{
    int return_value = 0;
    if (prepare_stuff(bar)) {
        return_value = do_the_thing(bar);
    }
    clean_stuff();
    return return_value;
}

static inline int foo_1(int bar)
{
    int return_value = 0;
    if (init_stuff(bar)) {
        return_value = foo_2(bar);
    }
    destroy_stuff();
    return return_value;
}

int foo(int bar)
{
    int return_value = 0;
    if (do_something(bar)) {
        return_value = foo_1(bar);
    }
    undo_something();
    return return_value;
}
```

<details>
<summary>Example from Linux kernel rewritten</summary>
<div markdown="1">
```c
static inline int mmp2_audio_clk_probe_3(struct platform_device* pdev)
{
    int ret = register_clocks(priv, &pdev->dev);
    if (ret) {
        pm_clk_destroy(&pdev->dev);
    }
    return ret;
}

static inline int mmp2_audio_clk_probe_2(struct platform_device* pdev)
{
    int ret = pm_clk_add(&pdev->dev, "audio");
    if (ret) {
        pm_clk_destroy(&pdev->dev);
    } else {
        ret = mmp2_audio_clk_probe_3(pdev);
    }
    return ret;
}

static inline int mmp2_audio_clk_probe_1(struct platform_device* pdev)
{
    int ret = pm_clk_create(&pdev->dev);
    if (ret) {
        pm_runtime_disable(&pdev->dev);
    } else {
        ret = mmp2_audio_clk_probe_2(pdev);
        if (ret) {
            pm_runtime_disable(&pdev->dev);
        }
    }
    return ret;
}

static int mmp2_audio_clk_probe(struct platform_device* pdev)
{
    // ...
    pm_runtime_enable(&pdev->dev);

    ret = mmp2_audio_clk_probe_1(pdev);

    return ret;
}
```
</div>
</details>

## `goto`-less alternative 5: abuse of loops

Drawbacks:
  * half of the drawback of `goto`
  * half of the drawback of other alternatives
  * none of the benefits of either of the above
  * not structural anyway
  * creates loop which doesn't loop
  * abuse of one language construct just to avoid using the right tool for the job
  * less readable
  * counter intuitive, confusing
  * adds unnecessary nesting
  * takes more lines
  * don't even think about using a legitimate loop somewhere among this mess

```c
int* foo(int bar)
{
    int* return_value = NULL;

    do {
        if (!do_something(bar)) break;
        do {
            if (!init_stuff(bar)) break;
            do {
                if (!prepare_stuff(bar)) break;
                return_value = do_the_thing(bar);
            } while (0);
            clean_stuff();
        } while (0);
        destroy_stuff();
    } while (0);
    undo_something();

    return return_value;
}
```

<details>
<summary>Example from Linux kernel rewritten</summary>
<div markdown="1">
```c
static int mmp2_audio_clk_probe(struct platform_device *pdev)
{
    // ...
    pm_runtime_enable(&pdev->dev);

    do {
        ret = pm_clk_create(&pdev->dev);
        if (ret) break;

        do {
            ret = pm_clk_add(&pdev->dev, "audio");
            if (ret) break;

            ret = register_clocks(priv, &pdev->dev);
            if (ret) break;
        } while (0);
        pm_clk_destroy(&pdev->dev);
    } while (0);
    pm_runtime_disable(&pdev->dev);

    return ret;
}
```
</div>
</details>

# Restart/retry

Common especially on \*nix systems when dealing with system calls returning
an error after being interrupted by a signal + setting `errno` to `EINTR`
to indicate the it was doing fine and was just interrupted.
Of course, it's not limited to system calls.

```c
#include <errno.h>

int main()
{
retry_syscall:
    if (some_syscall() == -1) {
        if (errno == EINTR) {
            goto retry_syscall;
        }

        // handle real errors
    }

    return 0;
}
```

<aside markdown="1">
I think in this particular case this one level of additional nesting isn't so
bad, but to be fair, without rewriting it I wouldn't be able to fairly present
the `goto`-less alternative.

<details>
<summary>Version with reduced nesting</summary>

<div markdown="1">
```c
#include <errno.h>

int main()
{
    int res;
retry_syscall:
    res = some_syscall();
    if (res == -1 && errno == EINTR) {
        goto retry_syscall;
    }

    if (res) {
        // handle real errors
    }

    return 0;
}
```
</div>
</details>
</aside>

## `goto`-less alternative: loop

We can of course use a `do {} while` loop with conditions in `while`:

```c
#include <errno.h>

int main()
{
    int res;
    do {
        res = some_system_call();
    } while (res == -1 && errno == EINTR);

    if (res == -1) {
        // handle real errors
    }

    return 0;
}
```

I think both versions are comparatively readable, but `goto` has slight advantage
by making it immediately clear the looping is not a desirable situation, while
`while` loop may be misinterpreted as [waiting loop](https://en.wikipedia.org/wiki/Busy_waiting).

## Less trivial example

For those, I'm willing to break the overall monochrome theme of the site and
define colors for syntax highlights. Even with simple parsing done by kramdown
(your code editor would certainty do a better job here), we already notice
labels and `goto` statements standing out a little from the rest of the code.
Flags on the other hand get lost among other variables.

<style>
.k, .kt  { color: #66d9ef; font-weight:bold }
.c1, .cm { color: #75715e }
.cp { color: #75715e; font-weight: bold }
.o  { color: #f92672; font-weight: bold }
.mi { color: #ae81ff }
.nf { color: #a6e22e }
.p  { color: #f7a000 }
.nl { color: #f4f406 }
</style>

### `goto` version

<div markdown="1">
{% highlight C %}
#include <string.h>

enum {
    PKT_THIS_OPERATION,
    PKT_THAT_OPERATION,
    PKT_PROCESS_CONDITIONALLY,
    PKT_CONDITION_SKIPPED,
    PKT_ERROR,
    READY_TO_SEND,
    NOT_READY_TO_SEND
};

int parse_packet()
{
    static int packet_error_count = 0;

    int packet[16] = { 0 };
    int packet_length = 123;
    _Bool packet_condition = 1;
    int packet_status = 4;

    // get packet etc. ...

REPARSE_PACKET:
    switch (packet[0]) {
        case PKT_THIS_OPERATION:
            if (/* problem condition */) {
                goto PACKET_ERROR;
            }
            // ... handle THIS_OPERATION
            break;

        case PKT_THAT_OPERATION:
            if (/* problem condition */) {
                goto PACKET_ERROR;
            }
            // ... handle THAT_OPERATION
            break;

        // ...

        case PKT_PROCESS_CONDITIONALLY:
            if (packet_length < 9) {
                goto PACKET_ERROR;
            }
            if (packet_condition && packet[4]) {
                packet_length -= 5;
                memmove(packet, packet+5, packet_length);
                goto REPARSE_PACKET;
            } else {
                packet[0] = PKT_CONDITION_SKIPPED;
                packet[4] = packet_length;
                packet_length = 5;
                packet_status = READY_TO_SEND;
            }
            break;

        // ...

        default:
PACKET_ERROR:
            packet_error_count++;
            packet_length = 4;
            packet[0] = PKT_ERROR;
            packet_status = READY_TO_SEND;
            break;
    }

    // ...

    return 0;
}
{% endhighlight %}
</div>

### `goto`-less version
<div markdown="1">
{% highlight C %}
#include <string.h>

enum {
    PKT_THIS_OPERATION,
    PKT_THAT_OPERATION,
    PKT_PROCESS_CONDITIONALLY,
    PKT_CONDITION_SKIPPED,
    PKT_ERROR,
    READY_TO_SEND,
    NOT_READY_TO_SEND
};

int parse_packet()
{
    static int packet_error_count = 0;

    int packet[16] = { 0 };
    int packet_length = 123;
    _Bool packet_condition = 1;
    int packet_status = 4;

    // get packet etc. ...

    _Bool REPARSE_PACKET = true;
    _Bool PACKET_ERROR = false;

    while (REPARSE_PACKET) {
        REPARSE_PACKET = false;
        PACKET_ERROR = false;

        switch (packet[0]) {
            case PKT_THIS_OPERATION:
                if (/* problem condition */) {
                    PACKET_ERROR = true;
                    break;
                }
                // ... handle THIS_OPERATION
                break;

            case PKT_THAT_OPERATION:
                if (/* problem condition */) {
                    PACKET_ERROR = true;
                    break;
                }
                // ... handle THAT_OPERATION
                break;

                // ...

            case PKT_PROCESS_CONDITIONALLY:
                if (packet_length < 9) {
                    PACKET_ERROR = true;
                    break;
                }
                if (packet_condition && packet[4]) {
                    packet_length -= 5;
                    memmove(packet, packet+5, packet_length);
                    REPARSE_PACKET = true;
                    break;
                } else {
                    packet[0] = PKT_CONDITION_SKIPPED;
                    packet[4] = packet_length;
                    packet_length = 5;
                    packet_status = READY_TO_SEND;
                }
                break;

                // ...

            default:
                PACKET_ERROR = true;
                break;
        }

        if (PACKET_ERROR) {
            packet_error_count++;
            packet_length = 4;
            packet[0] = PKT_ERROR;
            packet_status = NOT_READY_TO_SEND;
            break;
        }
    }

    // ...

    return 0;
}
{% endhighlight %}
</div>

# Common code in `switch` statement

This situation may be a good opportunity to check if the code doesn't need to
be refactored altogether; that being said, sometimes you want to have `switch`
statement where cases make minor changes then run the same code.

Sure, you could extract the common code into function, but then you need to pass
all the context to it, but that may be inconvenient (for you may need to pass
a lot of parameters or making a dedicated structure, in both cases probably with
pointers) and may increase complexity of the code; in some cases, you may wish
there being only one call to the function instead of multiple.

So why not just jump to the common code?

```c
int foo(int v)
{
    // ...
    int something = 0;
    switch (v) {
        case FIRST_CASE:
            something = 2;
            goto common1;
        case SECOND_CASE:
            something = 7;
            goto common1;
        case THIRD_CASE:
            something = 9;
            goto common1;
common1:
            /* code common to FIRST, SECOND and THIRD cases */
            break;

        case FOURTH_CASE:
            something = 10;
            goto common2;
        case FIFTH_CASE:
            something = 42;
            goto common2;
common2:
            /* code common to FOURTH and FIFTH cases */
            break;
    }
    // ...
}
```

## `goto`-less alternative 1: functions

Drawbacks:
 * <span title="Things should not be multiplied beyond what is required">"Entia non sunt multiplicanda praeter necessitatem"</span>
 * reading bottom-up instead of top-bottom
 * may require passing context around

```c
struct foo_context {
    int* something;
    // ...
};

static void common1(struct foo_context ctx)
{
    /* code common to FIRST, SECOND and THIRD cases */
}

static void common2(struct foo_context ctx)
{
    /* code common to FOURTH and FIFTH cases */
}

int foo(int v)
{
    struct foo_context ctx = { NULL };
    // ...
    int something = 0;
    ctx.something = &something;

    switch (v) {
        case FIRST_CASE:
            something = 2;
            common1(ctx);
            break;
        case SECOND_CASE:
            something = 7;
            common1(ctx);
            break;
        case THIRD_CASE:
            something = 9;
            common1(ctx);
            break;

        case FOURTH_CASE:
            something = 10;
            common2(ctx);
            break;
        case FIFTH_CASE:
            something = 42;
            common2(ctx);
            break;
    }
    // ...
}
```

## `goto`-less alternative 2: `if`s

We can abandon elegance and replace the `switch` statement with `if`s

```c
int foo(int v)
{
    // ...
    int something = 0;
    if (v == FIRST_CASE || v == SECOND_CASE || v == THIRD_CASE) {
        if (v == FIRST_CASE) {
            something = 2;
        } else if (v == SECOND_CASE) {
            something = 7;
        } else if (v == THIRD_CASE) { // it could be just `else`
            something = 9;
        }
        /* code common to FIRST, SECOND and THIRD cases */
    } else if (v == FOURTH_CASE || v == FIFTH_CASE) {
        if (v == FOURTH_CASE) {
            something = 10;
        } else {
            something = 42;
        }
        /* code common to FOURTH and FIFTH cases */
    }
    // ...
}
```

## `goto`-less alternative 3: interlacing `if (0)`

Please, don't, just don't...

```c
int foo(int v)
{
    // ...
    int something = 0;
    switch (v) {
        case FIRST_CASE:
            something = 2;
      if (0) {
        case SECOND_CASE:
            something = 7;
      }
      if (0) {
        case THIRD_CASE:
            something = 9;
      }
            /* code common to FIRST, SECOND and THIRD cases */
            break;

        case FOURTH_CASE:
            something = 10;
      if (0) {
        case FIFTH_CASE:
            something = 42;
      }
            /* code common to FOURTH and FIFTH cases */
            break;
    }
    // ...
}
```

## ~~`goto`-less alternative: capturing lambda~~

Yeah, maybe some day...

# Nested `break`, labeled `continue`

I think this one doesn't require further explanation:

```c
#include <stdio.h>

int main()
{
    for (int i = 1; i <= 5; ++i) {
        printf("outer iteration (i): %d\n", i);

        for (int j = 1; j <= 200; ++j) {
            printf("    inner iteration (j): %d\n", j);
            if (j >= 3) {
                break; // breaks from inner loop, outer loop continues
            }
            if (i >= 2) {
                goto outer; // breaks from outer loop, and directly to "Done!"
            }
        }
    }
outer:

    puts("Done!");

    return 0;
}
```

We can use [analogous mechanism for `continue`](https://beej.us/guide/bgc/html/split/goto.html#labeled-continue).

&nbsp;

_Beej's Guide to C Programming_ has nice example of using this technique alongside the cleanup one:

> ```c
>     for (...) {
>         for (...) {
>             while (...) {
>                 do {
>                     if (some_error_condition) {
>                         goto bail;
>                     }
>                     // ...
>                 } while(...);
>             }
>         }
>     }
>
> bail:
>     // Cleanup here
> ```
>
> Without `goto`, you’d have to check an error condition
> flag in all of the loops to get all the way out.

# Simple state machines

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 130" style="font-family: Times">
  <g fill="#ffffff" stroke="#ffffff">
    <ellipse cx="80"  cy="100" rx="10" ry="10" />
    <ellipse cx="160" cy="101" rx="10" ry="10" />
    <ellipse cx="120" cy="41"  rx="10" ry="10" />
  </g>

  <g fill="black">
    <text x="73" y="106">A</text>
    <text x="154" y="107">B</text>
    <text x="113" y="47">C</text>
  </g>

  <g fill="white">
    <g stroke="white">
      <path d="M 80 91 L 80 51 Q 80 41 90 41 L 105.88 41" fill="none" />
      <path d="M 108.88 41 L 104.88 43 L 105.88 41 L 104.88 39 Z" />

      <path d="M 130 41 L 150 41 Q 160 41 160 51 L 160 86.88" fill="none" />
      <path d="M 160 89.88 L 158 85.88 L 160 86.88 L 162 85.88 Z" />

      <path d="M 152.93 108.07 Q 140 121 120 121 Q 100 121 89.98 110.98" fill="none" />
      <path d="M 87.86 108.86 L 92.1 110.28 L 89.98 110.98 L 89.28 113.1 Z" />

      <path d="M 87.07 93.93 Q 100 81 120 81 Q 140 81 150.02 91.02" fill="none" />
      <path d="M 152.14 93.14 L 147.9 91.72 L 150.02 91.02 L 150.72 88.9 Z" />

      <path d="M 112.93 33.93 Q 113 11 120 11 Q 127 11 127.06 29.81" fill="none" />
      <path d="M 127.00 32.81 L 125.06 28.82 L 127.06 29.81 L 129.06 28.8 Z" />

      <path d="M 80 111 Q 80 131 70 126 Q 60 121 70.02 110.98" fill="none" />
      <path d="M 72.14 108.86 L 70.72 113.1 L 70.02 110.98 L 67.9 110.28 Z" />

      <path d="M 160 111 Q 160 131 170 126 Q 180 121 169.98 110.98" fill="none" />
      <path d="M 167.86 108.86 L 172.1 110.28 L 169.98 110.98 L 169.28 113.1 Z" />

      <path d="M 30 91 L 66 100" fill="none" />
      <path d="M 68.92 100.73 L 64.55 101.7 L 66 100 L 65.52 97.82 Z" />

      <path d="M 170 101 L 206 92" fill="none" />
      <path d="M 208.92 91.27 L 205.52 94.18 L 206 92 L 204.55 90.3 Z" />
    </g>

    <text x="16" y="90">S</text>
    <text x="214" y="90">F</text>

    <g font-size="0.7em">
      <text x="117" y="7">x</text>

      <text x="70" y="55">y</text>
      <text x="165" y="55">z</text>

      <text x="117" y="75">x</text>
      <text x="117" y="115">y</text>

      <text x="55" y="125">z</text>
      <text x="180" y="125">x</text>

      <text x="180" y="90" font-style="italic">nul</text>
    </g>
  </g>
</svg>

The following is a 1:1, not far from **verbatim mathematical notation**,
implementation of the above automata:

```c
_Bool machine(const char* c)
{
qA:
    switch (*(c++)) {
        case 'x': goto qB;
        case 'y': goto qC;
        case 'z': goto qA;
        default: goto err;
    }

qB:
    switch (*(c++)) {
        case 'x': goto qB;
        case 'y': goto qA;
        case '\0': goto F;
        default: goto err;
    }

qC:
    switch (*(c++)) {
        case 'x': goto qC;
        case 'z': goto qB;
        default: goto err;
    }

F:
    return true;

err:
    return false;
}
```

# Jumping into event loop

Yeah, yeah, I know jumping _into_ warrants at least a raised eyebrow.
That being said, there are cases when you may want to do just that.

Here in first iteration program skips increasing variable and goes straight
to allocation. Each following iteration executes code as written, ignoring
completely the label relevant only for the first run; so you do too during
analysis.

```c
#include <stdio.h>
#include <fancy_alloc.h>

int main()
{
    int* buf = NULL;
    size_t pos = 0;
    size_t sz = 8;

    int* temp;

    goto ALLOC;
    do {
        if (pos > sz) { // resize array
            sz *= 2;
ALLOC:      temp = arrayAllocSmart(buf, sz, pos);
            /* check for errors */
            buf = temp;
        }

        /* do something with buf */
    } while (checkQuit());

    return 0;

    /* handle errors ... */
}
```

### `goto`-less alternative 1: guard flag

I probably says more about the state of my sleep deprived brain than anything
else, but I actually managed to make an honest, very dumb mistake in this
simple snippet. I didn't notice until after examining the assembly output
and seeing way less instructions than expected. Since it's simple, yet quite
severe in consequences, I decided to leave it as an exercise for the reader
to spot the bug (should be easy since you already know about its existence).

The drawbacks as per usual: nesting and keeping track of flags.

```c
#include <stdio.h>
#include <fancy_alloc.h>

int main()
{
    int* buf = NULL;
    size_t pos = 0;
    size_t sz = 8;

    int ret = 0

    _Bool firstIter = true;

    do {
        if (pos > sz || firstIter) { // resize array
            if (!firstIter) {
                sz *= 2;
                firstIter = false;
            }

            int* temp = arrayAllocSmart(buf, sz, pos);
            /* handle errors ... */
            buf = temp;
        }

        /* do something with buf */
    } while (checkQuit());

    return 0;
}
```

### `goto`-less alternative 2: code duplication

The drawback is obvious, thus no further comment.

```c
#include <stdio.h>
#include <fancy_alloc.h>

int main()
{
    size_t pos = 0;
    size_t sz = 8;

    int* buf = arrayAllocSmart(NULL, sz, pos);
    /* handle errors ... */

    do {
        if (pos > sz) { // resize array
            sz *= 2;
            int* temp = arrayAllocSmart(buf, sz, pos);
            /* handle errors ... */
            buf = temp;
        }

        /* do something with buf */
    } while (checkQuit());

    return 0;
}
```

# Optimizations

<aside markdown="1">
This section is purely informative, just to appear on list as to mark the
existence of such use-case. Giving an example for this is not so easy as
most of them apply only in very narrow situations, not rarely bordering
on micro-optimizing.
</aside>

<aside markdown="1">
Often extensions like [computed `goto`](https://gcc.gnu.org/onlinedocs/gcc/Labels-as-Values.html) are used
</aside>

<aside markdown="1">
Beej shows [tail call optimization](https://beej.us/guide/bgc/html/split/goto.html#tail-call-optimization)
as an example in his book, unfortunately (from educational standpoint! otherwise very good) modern compilers
easily optimize something as simple as factorial to the very same assembly which we get using the `goto`
optimization. On the other hand, not everybody is blessed with modern, optimizing compiler...
</aside>

# [_Structured Programming with **go to** Statements_](https://dl.acm.org/doi/epdf/10.1145/356635.356640)

Read at:
&nbsp; [[ACM Digital Library]](https://dl.acm.org/doi/epdf/10.1145/356635.356640)
&nbsp; [[PDF]](https://pic.plover.com/knuth-GOTO.pdf)
&nbsp; [[HTML]](http://www.kohala.com/start/papers.others/knuth.dec74.html)

If I started from Dijkstra, it's only natural I need to conclude with Knuth. \
Almost anybody who says anything positive about `goto` refers to this paper.
And rightfully so! To this day it's one of most comprehensive resources
on the topic (it's a go to resource about `goto`). Perhaps some examples
are quite dated, some concerns less crucial today than back in the days,
but nevertheless it's an excellent read.

> One thing we haven't spelled out clearly, however, is what makes some
> **go&nbsp;to**'s bad and others acceptable. The reason is that we've really
> been directing our attention to the wrong issue, to the objective question of
> **go&nbsp;to** elimination instead of the important subjective question of
> program structure. In the words of John Brown, "The act of focusing our
> mightiest intellectual resources on the elusive goal of **go&nbsp;to**-less
> programs has helped us get our minds off all those really tough and possibly
> unresolvable problems and issues with which today's professional programmer
> would otherwise have to grapple." By writing this long article I don't want
> to add fuel to the controversy about go&nbsp;to elimination, since that topic
> has already assumed entirely too much significance; my goal is to lay that
> controversy to rest, and to help direct the discussion towards more fruitful
> channels.
