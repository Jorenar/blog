---
layout: post
title:  "Retrieving array length across computer languages"
---

The upcoming revision of the C language standard (for now called C2y) is
about to feature a new operator that essentially is a standardization of
ages old `sizeof arr / sizeof arr[0]` trick for getting number of elements
in an array. But as we all know, beside cache invalidation, and off-by-one
errors, the 2nd hard problem in Computer Science is naming things.

Initially it was supposed to be just a quick e-mail during the discussion
with just few examples, but as I've gone into the rabbit hole, it somehow
ended in a white paper format. You can read that version on the WG14 website
as document [N3402](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3402.pdf).

I'm fairly sure over 100 languages listed in the "official" document is good
enough sample size of a prior art to decide upon good name for C language,
thus to not spam the committee further, any updates and additions I'll list
here, in this blogpost copy of the paper.

Enjoy!

* Table of Contents
{:toc}

## Popular high-level computer languages

<ul style="column-count: 3">
  <li>Ada</li>
  <li>ABAP</li>
  <li>ALGOL</li>
  <li>Apex</li>
  <li>APL</li>
  <li>AWK
    <ul>
      <li>gawk</li>
    </ul>
  </li>
  <li>BASIC</li>
  <li>Batch files</li>
  <li>C</li>
  <li>C#</li>
  <li>C++</li>
  <li>CHILL</li>
  <li>CLIPS</li>
  <li>CMake</li>
  <li>COBOL</li>
  <li>Cobra</li>
  <li>ColdFusion</li>
  <li>Crystal</li>
  <li>Curl</li>
  <li>D</li>
  <li>Dart</li>
  <li>ECMAScript
    <ul>
      <li>ActionScript</li>
      <li>JavaScript
        <ul>
          <li>CoffeeScript</li>
          <li>JScript</li>
          <li>TypeScript</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>Elixir</li>
  <li>Elm</li>
  <li>Erlang</li>
  <li>Flutter</li>
  <li>Forth</li>
  <li>Fortran</li>
  <li>FoxPro</li>
  <li>GAMS</li>
  <li>GDScript</li>
  <li>GLSL</li>
  <li>Go</li>
  <li>Groovy</li>
  <li>Hack</li>
  <li>Haskell</li>
  <li>Icon</li>
  <li>Java</li>
  <li>Julia</li>
  <li>Kotlin</li>
  <li>LabVIEW</li>
  <li>Lisp
    <ul>
      <li>Clojure</li>
      <li>Common Lisp</li>
      <li>Emacs Lisp</li>
      <li>Racket</li>
      <li>Scheme</li>
    </ul>
  </li>
  <li>Logo</li>
  <li>Lua</li>
  <li>Makefile
    <ul>
      <li>GNU Make</li>
    </ul>
  </li>
  <li>Maple</li>
  <li>MATLAB</li>
  <li>Modula-2</li>
  <li>Mojo</li>
  <li>ML
    <ul>
      <li>F#</li>
      <li>OCaml</li>
      <li>Standard ML</li>
    </ul>
  </li>
  <li>MQL5</li>
  <li>Nim</li>
  <li>occam 2</li>
  <li>Objective-C</li>
  <li>Odin</li>
  <li>Pascal
    <ul>
      <li>Delphi</li>
      <li>Object Pascal</li>
    </ul>
  </li>
  <li>Perl</li>
  <li>PHP</li>
  <li>PL/I</li>
  <li>PostScript</li>
  <li>PowerShell</li>
  <li>Prolog</li>
  <li>Python</li>
  <li>R</li>
  <li>Raku</li>
  <li>Ring</li>
  <li>RPG</li>
  <li>Ruby</li>
  <li>Rust</li>
  <li>SAS</li>
  <li>Scala</li>
  <li>Shell script
    <ul>
      <li>Bash</li>
      <li>Korn Shell</li>
    </ul>
  </li>
  <li>Simula</li>
  <li>Simulink</li>
  <li>Smalltalk</li>
  <li>Solidity</li>
  <li>SPARK</li>
  <li>SQL
    <ul>
      <li>PL/SQL</li>
      <li>PostgreSQL</li>
      <li>Snowflake</li>
    </ul>
  </li>
  <li>Swift</li>
  <li>SystemVerilog</li>
  <li>TeX
    <ul>
      <li>LaTeX</li>
    </ul>
  </li>
  <li>Tcl</li>
  <li>V</li>
  <li>Vala</li>
  <li>VBA</li>
  <li>VBScript</li>
  <li>VHDL</li>
  <li>Vim script</li>
  <li>Visual Basic</li>
  <li>Wolfram Language</li>
  <li>X++</li>
  <li>Zig</li>
</ul>

&nbsp;

[[so2024]] [[tiobe]] [[ieee]] [[github]] [[godbolt]] [[so-tags]]

## Getting length of array-like objects
### Languages using "size"

* ALGOL [[algol]] &nbsp;&nbsp; (for ClearPath MCP Software by Unisys)
  ```
  SIZE(myArray)
  ```
  <aside markdown="1">
  While there are some indicators some other implementations might have
  ways to compute the size from array bounds, I wasn't able to confirm.
  Classic dialects seems to be void of any such capabilities.
  </aside>

* Apex [[apex]]
  ```
  myArray.size()
  ```

* C++ [[cpp1]] [[cpp2]] [[cpp3]]
  ```
  std::size(myArray)
  myVector.size()
  myStdArray.size()       // `myStdArray` being of type std::array
  ```

* CHILL [[chill]]
  ```
  SIZE(myArray)
  ```

* Common Lisp [[common-lisp-1]]
  ```
  (size myArray)
  ```

* Crystal [[crystal]]
  ```
  myArray.size
  ```

* Curl [[curl]]
  ```
  size(myArray)
  ```

* GDScript [[gdscript]]
  ```
  myArray.size()
  ```

* Erlang [[erlang1]]
  ```
  array:size(myArray)
  ```

* Fortran [[fortran1]] [[fortran2]]
  ```
  SIZE(myArray)
  ```

* Groovy [[groovy1]] [[groovy2]]
  ```
  myArray.size()
  ```

* Java [[java2]]
  ```
  ArrayList.size()
  ```

* Julia [[julia1]] [[julia2]]
  ```
  size(myArray)[1]
  ```

* Kotlin [[kotlin1]] [[kotlin2]]
  ```
  myArray.size
  ```

* LabVIEW [[labview]]

  &nbsp;&nbsp;&nbsp;&nbsp; _Array Size_ function

  &nbsp;

* Maple [[maple]]
  ```
  Size(myArray)
  ```

* MATLAB [[matlab]]
  ```
  size(myArray)
  ```

* MQL5 [[mql5]]
  ```
  ArraySize(myArray)
  ```

* occam 2 [[occam]]
  ```
  SIZE myArray
  ```

* PHP [[php2]] &nbsp;&nbsp; <sub>(alias for <code>count()</code>)</sub>
  ```
  sizeof($myArray)
  ```

* Ruby [[ruby2]] [[ruby4]] &nbsp;&nbsp; <sub>(alias for <code>.length</code>)</sub>
  ```
  myArray.size
  ```

* Smalltalk [[smalltalk]]
  ```
  myArray size.
  ```

* Snowflake [[snowflake]]
  ```
  SELECT ARRAY_SIZE(ARRAY_CONSTRUCT(1, 2, 3)) AS SIZE;
  ```

* SPARK [[spark]]
  ```
  size($"myArray")
  ```

* SystemVerilog [[verilog]]
  ```
  myArray.size
  $size(myArray)
  ```

* Tcl [[tcl]]
  ```
  array size myArray
  ```

### Languages using "length"

* ActionScript [[actionscript]]
  ```
  myArray.length
  ```

* Ada [[ada1]] [[ada2]] [[ada3]]
  ```
  myArray'Length
  ```

* C\# [[csharp1]] [[csharp2]]
  ```
  myArray.Length
  myArray.GetLength()
  ```

* CLIPS [[clips1]] [[clips2]]
  ```
  (length$ ?myArray)
  ```

* Clojure [[clojure1]] [[clojure2]]
  ```
  (alength myArray)
  ```

* CMake [[cmake]]
  ```
  list(LENGTH myList n)
  ```

* Cobra [[cobra1]]
  ```
  myArray.length
  ```

* ColdFusion [[cfml]]
  ```
  ArrayLen(myArray)
  ```

* D [[dlang]]
  ```
  myArray.length
  ```

* Dart [[dart]]
  ```
  myList.length
  ```

* Emacs Lisp [[emacs]]
  ```
  (length mySeq)
  ```

* Elixir [[elixir]]
  ```
  length(myList)
  ```

* Elm [[elm]]
  ```
  length(myArray)
  ```

* Erlang [[erlang2]]
  ```
  length(myList)
  ```

* F\# [[fsharp]]
  ```
  myArray |> Array.Length
  myArray |> Array.length
  ```

* Flutter [[flutter]]
  ```
  myList.length
  ```

* FoxPro [[foxpro1]] [[foxpro2]] [[foxpro3]]
  ```
  ALEN(myArray)
  ```

* gawk [[gawk]]
  ```
  length(myArray)
  ```

* GLSL [[glsl]]
  ```
  myArray.length()
  ```

* Go [[go]]
  ```
  len(myArray)
  ```

* Haskell [[haskell]]
  ```
  length myList
  ```

* Java [[java1]] [[java2]]
  ```
  myArray.length
  ```

* JavaScript / TypeScript / CoffeeScript / JScript  [[js]]
  ```
  myArray.length
  ```

* Julia [[julia1]] [[julia2]]
  ```
  length(myArray)
  ```

* Mojo [[mojo]]
  ```
  len(myList)
  ```

* Nim [[nim1]] [[nim2]]
  ```
  len(myArray)
  myArray.len
  ```

* OCaml [[ocaml1]] [[ocaml2]]
  ```
  Array.length myArray
  ```

* Odin [[odin]]
  ```
  len(myArray)
  ```

* Pascal / Object Pascal / Delphi [[pascal1]] [[pascal2]]
  ```
  Length(myArray)
  ```

* PostgreSQL [[postgresql]]
  ```
  SELECT array_length(myArray, 1) FROM table;
  ```

* PostScript [[postscript1]] [[postscript2]] [[postscript3]]
  ```
  myArray length
  ```

* PowerShell [[ps1]] [[ps2]]
  ```
  $myArray.Length
  ```

* Prolog [[prolog1]] [[prolog2]]
  ```
  length(myList, L)
  ```

* Python [[python]]
  ```
  len(myList)
  ```

* R [[r1]] [[r2]] [[r3]]
  ```
  length(myArray)
  ```

* Racket [[racket]]
  ```
  (array-length myArray)
  ```

* Ring [[ring]]
  ```
  Len(myList)
  ```

* Ruby [[ruby1]] [[ruby4]]
  ```
  myArray.length
  ```

* Rust [[rust]]
  ```
  myArray.len()
  ```

* Scala [[scala]]
  ```
  myArray.length
  ```

* Scheme [[scheme1]] [[scheme2]]
  ```
  (length myList)
  (vector-length myVector)
  ```

* Solidity [[solidity1]] [[solidity2]]
  ```
  myArray.length
  ```

* Standard ML [[std-ml]]
  ```
  Array.length myArray
  ```

* V [[vlang]]
  ```
  myArray.len
  ```

* Vala [[vala]]
  ```
  myArray.length[0]
  ```

* VHDL [[vhdl1]] [[vhdl2]]
  ```
  myArray'LENGTH
  ```

* Vim script [[vim]]
  ```
  len(myList)
  myList->len()
  ```

* Visual Basic [[vb]]
  ```
  myArray.Length
  myArray.GetLength()
  ```

* Wolfram Language [[wolfram]]
  ```
  Length[myArray]
  ```

* Zig [[zig1]] [[zig2]]
  ```
  myArray.len
  ```

### Languages using "count"

* Clojure [[clojure3]]
  ```
  (count myCollection)
  ```

* Cobra [[cobra2]]
  ```
  myList.count
  ```

* Eiffel [[eiffel]]
  ```
  myArray.count
  ```

* Hack [[hack]]
  ```
  C\count($myArray)
  ```

* Logo [[logo]]
  ```
  count :myArray
  ```

* PHP [[php1]]
  ```
  count($myArray)
  ```

* PL/SQL [[plsql1]]
  ```
  myTable.COUNT
  ```

* PowerShell [[ps1]]
  ```
  $myArray.Count
  ```

* Ruby [[ruby3]] [[ruby4]]
  ```
  myArray.count
  ```

* SQL [[sql1]] [[sql2]]
  ```
  SELECT COUNT(*) FROM table;
  ```

* Swift [[swift]]
  ```
  myArray.count
  ```

### Languages using other words

* ABAP [[abap1]] [[abap2]]
  ```
  LINES(myTable)
  ```

* C++ [[cpp4]] [[cpp5]] [[cpp6]]
  ```
  myVector.capacity()

  std::extent<decltype(myArray)>::value
  std::extent_v<decltype(myArray)>
  ```

* Common Lisp [[common-lisp-2]]
  ```
  (array-dimension myArray 0)
  ```

* GAMS [[gams1]] [[gams2]]
  ```
  card(mySet)
  ```

* GNU Make [[gmake]]
  ```
  $(words $(myList))
  ```

* Lua [[lua]]
  ```
  table.getn(myArray)
  ```

* Modula-2 [[modula]]
  ```
  HIGH(myArray)+1
  ```

* PL/I [[pli1]] [[pli2]]
  ```
  DIM(myArray,1)
  ```

* PL/SQL [[plsql2]]
  ```
  CARDINALITY(myTab)
  ```

* Raku [[raku]]
  ```
  @myArray.elems
  ```

* RPG [[rpg]]
  ```
  %ELEM(myArray)
  ```

* Simulink [[simulink1]] [[simulink2]]

  &nbsp;&nbsp;&nbsp;&nbsp; _Width_ block

  &nbsp;

* SAS [[sas]]
  ```
  dim(myArray)
  ```

* X++ [[xpp]]
  ```
  dimOf(myArray)
  ```

### Languages using symbols

* APL [[apl]]
  ```
  ⍴ myArray
  ≢ myArray
  ```

* Bash [[bash]]
  ```
  ${#myArray[@]}
  ```

* Icon [[icon]]
  ```
  *myArray
  ```

* Korn Shell [[korn1]] [[korn2]]
  ```
  ${#myArray[*]}
  ${#myArray[@]}
  ```

* Perl [[perl]]
  ```
  @myArray
  ```

* Shell script [[sh]]
  ```
  $#
  ```
  <aside markdown="1">
  (only one array per script/subshell/function in standard POSIX Shell)
  </aside>

### Languages where length is computed

* AWK
  ```
  n = 0; for (a in myArray) n++
  ```

* BASIC
  ```
  n = 0
  FOR i = 0 TO N  ' assuming N as an upper limit for all arrays
          ON ERROR GOTO FoundLength
          temp = myArray(i)
          n = length + 1
  NEXT i
  FoundLength:
  ```

* Batch files [[batch]]
  ```
  set n=0
  :Loop
  if define myArray[%n%] (
     set /a n += 1
     goto :Loop
  )
  ```

* C / C++ / Objective-C  [[n3369]]
  ```
  sizeof myArray / sizeof myArray[0]
  ```

* COBOL [[cobol1]] [[cobol2]] [[cobol3]]
  ```
  COMPUTE n = LENGTH OF myArray / LENGTH OF myArray-element
  ```

* Makefile
  ```
  N := `echo $(myList) | wc -w`
  ```
  <aside markdown="1">
  (unreliable and requires "passing" the list to another language)
  </aside>

* Simula [[simula]]
  ```
  upperbound(myArray,1) - lowerbound(myArray,1) + 1
  ```

* VBA / VBScript  [[vba]] [[vbscript]]
  ```
  UBound(myArray) - LBound(myArray) + 1
  ```

### Languages where arrays are implemented by users

* Forth
* TeX / LaTeX

## Observations

* Some of the listed languages provide multiple ways of retrieving number
  of elements. Sometimes the ways are equivalent, but usually the underlying
  mechanism is different.

  * e.g. Ruby has `.length`, but `.count` without condition also gives
    the number of elements;
  * e.g. C++ allows to calculate array length via `sizeof arr / sizeof arr[0]`,
    by using `std::size()` function, by passing the type to `std::extent_v<T>`
    trait template, and couple other ways.

  If such additional method was not a primary or prominent way,
  or at least from the focus group, it might be missing from the list.

* The vast majority of languages use derivatives of either "length" or "size",
  with "length" being the dominat base.

* "Length" and "size" are also often used for other linear data structures
  beside arrays, like strings, linked lists, queues, etc.

* Documentations, specifications and communities use terms "length" and "size"
  quite freely and interchangeably in the meaning of "the number of elements
  in data structure". Sometimes languages make them alias one another.

  * Other words also sometimes are seen as synonyms, although rarely and/or in
    specific contexts (e.g. "dimension" or "extent" would primarily be present
    when generalizing to multi-dimensional arrays).

* "Count" is 3rd most popular choice, albeit significantly lesser number of
  languages represent this category. Sometimes it is a side effect of more
  versatile feature (e.g. in meaning "count of X in Y", where Y might contain
  more than just Xs).

* 4th most common word is "dimension"; 5th are ex aequo "elements" and "cardinality".
  Including methods of calculating number of elements puts "bounds" in top 5 too.

## 

[![ProgrammerHumor](https://i.redd.it/yexhn9of1i2e1.png)][ProgrammerHumor]

[n3369]: https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3369.pdf

[ProgrammerHumor]: https://www.reddit.com/r/ProgrammerHumor/comments/1gxf7ll/pleaseagreeononename/

[so2024]: https://survey.stackoverflow.co/2024/technology#1-programming-scripting-and-markup-languages
[so-tags]: https://stackoverflow.com/tags?tab=popular
[tiobe]: https://www.tiobe.com/tiobe-index/
[ieee]: https://spectrum.ieee.org/top-programming-languages-2024
[github]: https://innovationgraph.github.com/global-metrics/programming-languages
[godbolt]: https://godbolt.org/api/languages

[abap1]: https://help.sap.com/doc/abapdocu_752_index_htm/7.52/en-US/abendescriptive_functions_table.htm
[abap2]: https://stackoverflow.com/q/394375
[actionscript]: https://www.oreilly.com/library/view/actionscript-the-definitive/1565928520/re07.html
[ada1]: https://www.adaic.org/resources/add_content/standards/22rm/rm-final.pdf
[ada2]: https://learn.adacore.com/courses/intro-to-ada/chapters/arrays.html
[ada3]: https://ada-lang.io/docs/arm/AA-3/AA-3.6/#p9_3.6.2
[algol]: https://public.support.unisys.com/aseries/docs/ClearPath-MCP-21.0/86000098-519/86000098-519.pdf
[apex]: https://stackoverflow.com/a/18043420
[apl]: https://stackoverflow.com/a/56243457
[bash]: https://www.gnu.org/software/bash/manual/html_node/Shell-Parameter-Expansion.html
[batch]: https://www.geeksforgeeks.org/batch-script-length-of-an-array/
[cfml]: https://helpx.adobe.com/coldfusion/cfml-reference/coldfusion-functions/functions-a-b/arraylen.html
[chill]: https://www.itu.int/rec/dologin_pub.asp?lang=e&id=T-REC-Z.200-199911-I!!PDF-E
[clips1]: https://clipsrules.net/documentation/v641/apg641.pdf
[clips2]: https://stackoverflow.com/a/44165009
[clojure1]: https://clojuredocs.org/clojure.core/alength
[clojure2]: http://clojure.github.io/clojure/clojure.core-api.html#clojure.core/alength
[clojure3]: http://clojure.github.io/clojure/clojure.core-api.html#clojure.core/count
[cmake]: https://cmake.org/cmake/help/latest/command/list.html#length
[cobol1]: https://www.ibm.com/docs/en/cobol-zos/6.4?topic=functions-length
[cobol2]: https://www.ibm.com/docs/en/cobol-zos/6.4?topic=registers-length
[cobol3]: https://godbolt.org/z/KMMv58MoK
[cobra1]: http://cobra-language.com/how-to/UseArrays/
[cobra2]: http://cobra-language.com/how-to/UseLists/
[common-lisp-1]: https://quickref.common-lisp.net/array-operations.html#index-size
[common-lisp-2]: https://lispcookbook.github.io/cl-cookbook/data-structures.html#sizes
[cpp1]: https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2023/n4950.pdf
[cpp2]: https://en.cppreference.com/w/cpp/container/array/size
[cpp3]: https://en.cppreference.com/w/cpp/iterator/size
[cpp4]: https://en.cppreference.com/w/cpp/container/vector/capacity
[cpp5]: https://en.cppreference.com/w/cpp/types/extent
[cpp6]: https://godbolt.org/z/nEPKP79fY
[crystal]: https://crystal-lang.org/api/1.13.3/Array.html#size%3AInt32-instance-method
[csharp1]: https://learn.microsoft.com/en-us/dotnet/api/system.array.length
[csharp2]: https://learn.microsoft.com/en-us/dotnet/api/system.array.length
[curl]: https://www.curlap.com/support/developers/curl/docs/rte/latest/en/docs/en/api-ref/Array-of.html#size
[dart]: https://dart.dev/language/collections#lists
[dlang]: https://dlang.org/spec/arrays.html#array-length
[eiffel]: https://www.maths.tcd.ie/~odunlain/eiffel/html/base/ARRAY.html
[elixir]: https://hexdocs.pm/elixir/1.17.3/Kernel.html#length/1
[elm]: https://package.elm-lang.org/packages/elm/core/latest/Array#length
[emacs]: https://ftp.gnu.org/old-gnu/Manuals/elisp-manual-20-2.5/html_chapter/elisp_7.html
[erlang1]: https://www.erlang.org/doc/apps/stdlib/array.html#size/1
[erlang2]: https://www.erlang.org/docs/26/man/erlang#length-1
[flutter]: https://api.flutter.dev/flutter/dart-core/List/length.html
[fortran1]: https://www.intel.com/content/www/us/en/docs/fortran-compiler/developer-guide-reference/2024-2/size-function.html
[fortran2]: https://gcc.gnu.org/onlinedocs/gcc-13.3.0/gfortran/SIZE.html
[foxpro1]: https://learn.microsoft.com/en-us/previous-versions/visualstudio/foxpro/aa977250(v=vs.71)
[foxpro2]: https://hackfox.github.io/section4/s4g214.html
[foxpro3]: https://www.vfphelp.com/help/html/8496659e-83b9-4e08-847b-f93b1e791ee5.htm
[fsharp]: https://fsharp.github.io/fsharp-core-docs/reference/fsharp-collections-arraymodule.html#length
[gams1]: https://www.gams.com/latest/docs/index.html
[gams2]: https://forum.gams.com/t/finding-length-of-set/578
[gawk]: https://www.gnu.org/software/gawk/manual/gawk.html
[gdscript]: https://docs.godotengine.org/en/stable/classes/class_array.html#class-array-method-size
[glsl]: https://www.khronos.org/opengl/wiki/Data_Type_(GLSL)#Arrays
[gmake]: https://www.gnu.org/software/make/manual/html_node/Text-Functions.html#index-words
[go]: https://pkg.go.dev/builtin#len
[groovy1]: https://docs.groovy-lang.org/latest/html/documentation/core-syntax.html#_arrays
[groovy2]: https://docs.groovy-lang.org/next/html/groovy-jdk/primitives-and-primitive-arrays/int[].html#size()
[hack]: https://docs.hhvm.com/hsl/reference/function/HH.Lib.C.count/
[haskell]: https://hackage.haskell.org/package/base-4.20.0.1/docs/Data-List.html#v:length
[icon]: https://www2.cs.arizona.edu/icon/refernce/prefix.htm#size
[java1]: https://stackoverflow.com/a/27673843
[java2]: https://docs.oracle.com/javase/8/docs/api/java/util/Arrays.html
[js]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
[julia1]: https://docs.julialang.org/en/v1/base/arrays/
[julia2]: https://stackoverflow.com/a/57515368
[korn1]: https://docstore.mik.ua/orelly/unix3/korn/ch06_04.htm
[korn2]: https://linux.die.net/man/1/ksh
[kotlin1]: https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-array/size.html
[kotlin2]: https://kotlinandroid.org/kotlin/array/kotlin-array-size/
[labview]: https://labviewwiki.org/wiki/Array_Size_function
[logo]: https://www.calormen.com/jslogo/language.html
[lua]: https://www.lua.org/pil/19.1.html
[maple]: https://www.maplesoft.com/support/help/maple/view.aspx?path=ArrayTools%2FSize
[matlab]: https://www.mathworks.com/help/matlab/ref/double.size.html
[modula]: https://www.modula2.org/tutor/chapter6.php
[mojo]: https://docs.modular.com/mojo/stdlib/builtin/len/
[mql5]: https://www.mql5.com/en/docs/array/arraysize
[nim1]: https://nim-lang.org/docs/manual.html#types-array-and-sequence-types
[nim2]: https://nimbyexample.com/arrays.html
[ocaml1]: https://ocaml.org/manual/5.2/api/Array.html
[ocaml2]: https://stackoverflow.com/a/57106170
[occam]: https://homepages.inf.ed.ac.uk/stark/ipp/manuals/occam-2-1.pdf
[odin]: https://pkg.odin-lang.org/base/builtin/#len
[pascal1]: https://www.freepascal.org/docs-html/rtl/system/length.html
[pascal2]: https://smartpascal.github.io/help/assets/length.htm
[perl]: https://stackoverflow.com/a/7407036
[php1]: https://www.php.net/manual/en/function.count.php
[php2]: https://www.php.net/manual/en/function.sizeof.php
[pli1]: https://www.ibm.com/docs/en/SSY2V3_5.1.0/com.ibm.ent.pl1.zos.doc/lrm.pdf
[pli2]: https://www.microfocus.com/documentation/openpli/80/pfbltn.htm#dimension
[plsql1]: https://docs.oracle.com/cd/E11882_01/appdev.112/e25519/composites.htm#CIHGJCHF
[plsql2]: https://docs.oracle.com/cd/B28359_01/server.111/b28286/functions015.htm#SQLRF06305
[postgresql]: https://www.postgresql.org/docs/current/functions-array.html#ARRAY-FUNCTIONS-TABLE
[postscript1]: https://www.adobe.com/jp/print/postscript/pdfs/PLRM.pdf
[postscript2]: http://www.linuxfocus.org/English/July1999/article100.html
[postscript3]: https://github.com/Chubek/postscript-dossier/blob/master/ps-arrays.md#operations-on-arrays
[prolog1]: https://www.swi-prolog.org/pldoc/man?predicate=length/2
[prolog2]: https://en.wikipedia.org/w/index.php?title=Prolog&oldid=1246276957#Predicates_and_programs
[python]: https://docs.python.org/3/library/functions.html#len
[ps1]: https://devblogs.microsoft.com/scripting/powertip-find-number-elements-in-a-powershell-array/
[ps2]: https://learn.microsoft.com/en-us/powershell/scripting/lang-spec/chapter-07?view=powershell-7.4#7141-subscripting-an-array
[r1]: https://cran.r-project.org/doc/manuals/r-release/R-intro.html
[r2]: https://rforhealthcare.org/array-sizes/
[r3]: https://www.educative.io/answers/how-to-obtain-the-length-of-an-array-in-r
[racket]: https://docs.racket-lang.org/array/index.html#%28def._%28%28lib._array%2Fmain..rkt%29._array-length%29%29
[raku]: https://docs.raku.org/type/Array#method_elems
[ring]: https://ring-lang.github.io/doc1.20/lists.html#get-list-size
[rpg]: https://www.ibm.com/docs/en/i/7.5?topic=functions-elem-get-number-elements
[ruby1]: https://docs.ruby-lang.org/en/master/Array.html#method-i-length
[ruby2]: https://docs.ruby-lang.org/en/master/Array.html#method-i-size
[ruby3]: https://docs.ruby-lang.org/en/master/Array.html#method-i-count
[ruby4]: https://www.rubyinrails.com/2014/01/15/ruby-count-vs-length-vs-size/
[rust]: https://doc.rust-lang.org/std/primitive.array.html
[sas]: https://support.sas.com/resources/papers/97529_Using_Arrays_in_SAS_Programming.pdf
[scala]: https://docs.scala-lang.org/overviews/collections-2.13/arrays.html
[scheme1]: https://docs.scheme.org/schintro/schintro_41.html
[scheme2]: https://groups.csail.mit.edu/mac/ftpdir/scheme-7.4/doc-html/scheme_9.html
[sh]: https://pubs.opengroup.org/onlinepubs/9799919799/utilities/V3_chap02.html
[simula]: https://portablesimula.github.io/github.io/doc/SimulaStandard.pdf
[simulink1]: https://www.mathworks.com/matlabcentral/answers/51183-get-array-size-in-simulink
[simulink2]: https://www.mathworks.com/help/simulink/slref/width.html
[smalltalk]: https://wiki.squeak.org/squeak/3235
[snowflake]: https://docs.snowflake.com/en/sql-reference/functions/array_size
[solidity1]: https://docs.soliditylang.org/en/latest/types.html
[solidity2]: https://www.geeksforgeeks.org/solidity-arrays/
[spark]: https://sparkbyexamples.com/spark/spark-get-size-length-of-array-map-column/
[sql1]: https://learn.microsoft.com/en-us/sql/t-sql/functions/count-transact-sql
[sql2]: https://www.sqltutorial.org/sql-aggregate-functions/sql-count/
[std-ml]: https://smlfamily.github.io/Basis/array.html
[swift]: https://developer.apple.com/documentation/swift/array/count
[tcl]: https://wiki.tcl-lang.org/page/array+size
[vala]: https://docs.vala.dev/tutorials/programming-language/main/02-00-basics/02-04-data-types.html#arrays
[vb]: https://learn.microsoft.com/en-us/dotnet/visual-basic/programming-guide/language-features/arrays/
[vba]: https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/ubound-function#remarks
[vbscript]: https://stackoverflow.com/a/73277957
[verilog]: https://stackoverflow.com/a/33671359
[vhdl1]: https://vhdlguide.com/2018/05/28/attribute-length/
[vhdl2]: https://nandland.com/list-of-tick-attributes/
[vim]: https://vimhelp.org/builtin.txt.html#len%28%29
[vlang]: https://docs.vlang.io/v-types.html#array-fields
[wolfram]: https://reference.wolfram.com/language/ref/Length.html
[xpp]: https://learn.microsoft.com/en-us/dynamics365/fin-ops-core/dev-itpro/dev-ref/xpp-reflection-run-time-functions#dimof
[zig1]: https://ziglang.org/documentation/master/#Arrays
[zig2]: https://zig-by-example.com/arrays
