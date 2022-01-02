---
title$$origin: abc
title: 'abc[译]'

---

# Head 1

# Head 1[译]

[one][1]

[one][1][译]

[two](2)

[two](2)[译]

<a name="1"></a>

<a name="1"></a>[译]

Test

Test[译]

1. a11

   a11[译]

1. b11

   b11[译]

1. b12

   b12[译]

1. b21

   b21[译]

1. b31

   b31[译]

- a11

  a11[译]

  - b11

    b11[译]

  - c11

    c11[译]

> a11
>
> a11[译]
>
>
> b11
>
> b11[译]
>
>
> > c11
> >
> > c11[译]
> >
>
> > d11
> >
> > d11[译]
> >

| a11 | a12 |
| --- | --- |
| a11[译] | a12[译] |
| b11 | b12 |
| b11[译] | b12[译] |
| no-translate | b12 |
| no-translate | b12[译] |
| c11 | c12 |
| c11[译] | c12[译] |

<code-example src="/abc"></code-example>

<code-example language="html">
  &lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;

&lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;
</code-example>

{@a top}

[1]: http://www.google.com
