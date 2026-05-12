export interface QuizQuestion {
  question: string;
  code: string;
  options: string[];
  correctIndex: number;
}

export const quiz1: QuizQuestion[] = [
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x;
    printf("%d", y);
}`,
    options: [
      "Undefined variable | متغير غير معرف",
      "Infinite loop | لوب لا نهائي",
      "Missing semicolon | فاصلة ناقصة",
      "Wrong include | مكتبة خاطئة",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x = 5;
    if(x > 2)
        printf("Hi")
}`,
    options: [
      "Missing semicolon | فاصلة منقوطة ناقصة",
      "Wrong variable type | نوع متغير خاطئ",
      "Infinite loop | لوب لا نهائي",
      "Missing scanf | scanf ناقصة",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x = 5;
    while(x < 10)
    {
        printf("%d", x);
    }
}`,
    options: [
      "Infinite loop | لوب لا نهائي",
      "Wrong printf | printf خاطئة",
      "Missing include | مكتبة ناقصة",
      "Wrong variable | متغير خاطئ",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    float x = 5.5;
    printf("%d", x);
}`,
    options: [
      "Wrong format specifier | فورمات خاطئ",
      "Missing semicolon | فاصلة ناقصة",
      "Infinite loop | لوب لا نهائي",
      "Wrong include | مكتبة خاطئة",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x = 5;
    if(x == 5)
    {
        printf("Hello");

}`,
    options: [
      "Missing closing brace | قوس إغلاق ناقص",
      "Wrong variable type | نوع بيانات خاطئ",
      "Infinite loop | لوب لا نهائي",
      "Missing scanf | scanf ناقصة",
    ],
    correctIndex: 0,
  },
];

export const quiz2: QuizQuestion[] = [
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x = 5
    printf("%d", x);
}`,
    options: [
      "Missing semicolon | فاصلة منقوطة ناقصة",
      "Infinite loop | لوب لا نهائي",
      "Wrong variable type | نوع متغير خاطئ",
      "Missing printf | printf ناقصة",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x;
    scanf("%f", &x);
}`,
    options: [
      "Wrong format specifier | فورمات خاطئ",
      "Missing variable | متغير ناقص",
      "Infinite loop | لوب لا نهائي",
      "Wrong include | مكتبة خاطئة",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int i;
    for(i = 0; i < 5; i--)
    {
        printf("%d", i);
    }
}`,
    options: [
      "Infinite loop | لوب لا نهائي",
      "Missing printf | printf ناقصة",
      "Wrong data type | نوع بيانات خاطئ",
      "Missing braces | أقواس ناقصة",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x = "5";
    printf("%d", x);
}`,
    options: [
      "Wrong data type | نوع بيانات خاطئ",
      "Missing semicolon | فاصلة ناقصة",
      "Infinite loop | لوب لا نهائي",
      "Wrong include | مكتبة خاطئة",
    ],
    correctIndex: 0,
  },
  {
    question: "ما الخطأ في هذا الكود؟",
    code:
`#include <stdio.h>

main()
{
    int x = 10;
    if(x = 5)
    {
        printf("Hello");
    }
}`,
    options: [
      "Used = instead of == | استعمل = بدل ==",
      "Missing printf | printf ناقصة",
      "Wrong loop | لوب خاطئ",
      "Missing include | مكتبة ناقصة",
    ],
    correctIndex: 0,
  },
];
