"use strict";

const {
  readContentTxt,
  zeroFill,
  createCommentsList,
  createOffer,
  createComment,
} = require(`./utils.js`);

describe(`createComment`, () => {
  test(`createComment should generate object with id key`, () => {
    expect(createComment(`test`)).toHaveProperty(`id`);
  });

  test(`createComment should generate object type with key value pair equal to 'text': 'test'`, () => {
    expect(createComment(`test`)).toHaveProperty(`text`, `test`);
  });
});

describe(`createOffer`, () => {
  const expected = {
    category: [`Категория 2`],
    description:
      `Предложение 1 Предложение 2 Таких предложений больше нет! Если товар не понравится — верну всё до последней копейки.`,
    picture: `item1.jpg`,
    title: `Куплю антиквариат`,
    type: `SALE`,
    sum: 64382,
  };

  test(`createOffer should generate object with same properties as expected variable`, () => {
    expect(createOffer(expected)).toMatchObject(expected);
  });
});

describe(`createCommentsList`, () => {
  test(`createCommentsList should generate array with 2 items length`, () => {
    expect(createCommentsList([`test1`, `test2`], 2)).toHaveLength(2);
  });
  // TODO: add negative test case
});

describe(`zeroFill `, () => {
  test(`zeroFill should generate number with leading zeros, amount of zeros is zerosAmount prop and nub as number`, () => {
    expect(zeroFill(1, 2)).toBe(`01`);
    expect(zeroFill(9, 2)).toBe(`09`);
    expect(zeroFill(9, 3)).toBe(`009`);
  });
});

describe(`readContentTxt `, () => {
  const FILE_TITLES_PATH = `./data/titles.txt`;
  const FILE_CATEGORIES_PATH = `./data/categories.txt`;

  test(`readContentTxt should return data of txt file`, async () => {
    const categoriesData = await readContentTxt(FILE_CATEGORIES_PATH);
    const titlesData = await readContentTxt(FILE_TITLES_PATH);
    expect(categoriesData).toEqual([
      `Книги`,
      `Разное`,
      `Посуда`,
      `Игры`,
      `Животные`,
      `Журналы`,
      `Категория 1`,
      `Категория 2`,
    ]);

    expect(titlesData).toEqual([
      `Продам книги Стивена Кинга`,
      `Продам новую приставку Sony Playstation 5`,
      `Продам отличную подборку фильмов на VHS`,
      `Куплю антиквариат`,
      `Куплю породистого кота`,
      `Заголовок 1`,
      `Заголовок 2`,
    ]);
  });
});
