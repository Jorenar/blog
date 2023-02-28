---
layout: post
title:  "When VLA in C doesn't smell of rotten eggs"
---

An earlier version of my [Pitfalls of VLA in C](/vla-pitfalls) article contained
an example of useful case of VLA, which I pulled out of it as I decided the two
-- although I'd be overjoyed being presented with more -- cases where VLA
are clearly useful, deserve their dedicated, if low effort, post.

# Size check when passing to function

"Only" a bit over two decades after the introduction of VLA to C language,
GCC started giving warnings about passing to functions bigger than declared
size of arrays when we actually decide to utilize VLA syntax in parameters.

```c
#include <stdio.h>

void f(const size_t size, const int buf[static size]);

int main(void)
{
    int arr[50] = { 0 };
    f(10, arr);  // acceptable
    f(50, arr);  // correct
    f(100, arr); // *WARNING*
    return 0;
}
```

**Added bonus:** explicit size annotation

# Multidimensional arrays

Dynamically allocating multi-dimensional arrays where the inner dimensions
are not known until runtime is really simplified using VM types.
It isn't even as unsafe as aVLA since there's no arbitrary stack allocation.

```c
int (*arr)[n][m] = malloc(sizeof *arr); // `n` and `m` are variables with dimensions
if (arr) {
    // (*arr)[i][j] = ...;
    free(arr);
}
```

The VLA-free alternatives aren't as sexy:

  * **piecemeal allocation**
```c
int** arr = malloc(n * (sizeof *arr));
if (arr) {
        for (int i = 0; i < n; ++i) {
            arr[i] = malloc(m * (sizeof *arr[i]));
        }
        // arr[i][j] = ...
        for (int i = 0; i < n; ++i) {
            free(arr[i]);
        }
        free(arr);
}
```

  * **1D array with offsets**
```c
int* arr = malloc(n * m * (sizeof *arr));
if (arr) {
        // arr[i*n + j] = ...
        free(arr);
}
```

  * **big fixed array**
```c
int arr[SAFE_SIZE][SAFE_SIZE]; // SAFE_SIZE must be safe for SAFE_SIZE*SAFE_SIZE
// arr[i][j] = ...;
```

<!-- Some bug(?) eats 4 first spaces of indent, thus 8 spaces used -->
