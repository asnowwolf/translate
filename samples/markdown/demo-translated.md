---
title: 译 one
title$$origin: one

---

# Head One

# 译 Head One

inline [one][AbC]

译 inline [译 one][AbC]

inline [two](AbC)

译 inline [译 two](AbC)

<a name="1"></a>

<div>abc</div>

<div>译 abc</div>

<div>

abc

译 abc

</div>

Three

译 Three

no-translate

1. One 11

   译 One 11

1. One 11

   译 One 11

1. Two 12

   译 Two 12

1. Two 21

   译 Two 21

1. Two 31

   译 Two 31

- One 11

  译 One 11

  - Two 11

    译 Two 11

  - Three 11

    译 Three 11

> One 11
>
> 译 One 11
>
> Two 11
>
> 译 Two 11
>
> > Three 11
> >
> > 译 Three 11
>
> > Four 11
> >
> > 译 Four 11

| One 11       | One 12       |
| ------------ | ------------ |
| 译 One 11     | 译 One 12     |
| Two 11       | Two 12       |
| 译 Two 11     | 译 Two 12     |
| no-translate | Two 12       |
| no-translate | 译 Two 12     |
| no-translate | no-translate |
| Three 11     | Three 12     |
| 译 Three 11   | 译 Three 12   |

<code-example src="/abc"></code-example>

<code-example language="html">
  &lt;nav [style.background-color]="expression"&gt;&lt;/nav&gt;

&lt;nav [style.backgroundColor]="expression"&gt;&lt;/nav&gt;
</code-example>

{@a top}

[1]: http://www.google.com
