
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const DATA = require('./models/data');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  const URL = 'http://h5.izhangchu.com/dishes_view/index.html?&dishes_id=276';

  const FOODS_TITLE_SELECTOR = '#DishesView-wrap > div:nth-child(2) > div.goods-show > div > h5';
  const FOODS_SUBTITLE_SELECTOR = '#DishesView-wrap > div:nth-child(2) > div.goods-show > div > p';
  const FOODS_IMAGE_SELECTOR = '#playerPlayPoster > img';
  const FOODS_TAG1_SELECTOR = '#linksWrap > li:nth-child(2) > div > a:nth-child(1) > span';
  const FOODS_TAG2_SELECTOR = '#linksWrap > li:nth-child(2) > div > a:nth-child(2) > span';
  const FOODS_TAG3_SELECTOR = '#linksWrap > li:nth-child(2) > div > a:nth-child(3) > span';

  try {
    await page.goto(URL);
    await page.setDefaultNavigationTimeout(50000);
    await page.waitFor(2000);

    // 标题
    const title = await page.evaluateHandle(($title) => {
      return document.querySelector($title).innerHTML;
    }, FOODS_TITLE_SELECTOR);
    console.log(await title.jsonValue());
    // 标题说明
    const subtitle = await page.evaluateHandle(($subtitle) => {
      return document.querySelector($subtitle).innerHTML;
    }, FOODS_SUBTITLE_SELECTOR);
    console.log(await subtitle.jsonValue());
    // 图片
    const image = await page.evaluateHandle(($img) => {
      return document.querySelector($img).src;
    }, FOODS_IMAGE_SELECTOR);
    console.log(await image.jsonValue());
    // 制作步骤
    const step = await page.evaluateHandle(() => {
      return Array.from(document.getElementById('DishesStep-wrap').getElementsByTagName('li')).map(a => {
        let obj = {
          title: a.children[1].innerHTML.replace('<span class="num">', '').replace('</span>', ''),
          img: a.children[0].src
        };
        return obj;
      })
    });
    console.log(await step.jsonValue());
    // 食材
    const ingredients = await page.evaluateHandle(() => {
      return Array.from(document.getElementsByClassName('material-list')[0].getElementsByTagName('li')).map(a => a.innerHTML.replace('<span>', '').replace('</span>', ''));
    });
    console.log(await ingredients.jsonValue());
    // 相关常识
    const common = await page.evaluateHandle(() => {
      return {
        title: document.getElementById('DishesCommensense-wrap').getElementsByTagName('h5')[0].innerHTML,
        txt: document.getElementById('DishesCommensense-wrap').getElementsByClassName('txt')[0].innerHTML.trim(),
      };
    });
    console.log(await common.jsonValue());
    // 制作指导
    const guide = await page.evaluateHandle(() => {
      return {
        title: document.getElementById('DishesCommensense-wrap').getElementsByTagName('h5')[1].innerHTML,
        txt: document.getElementById('DishesCommensense-wrap').getElementsByClassName('txt')[1].innerHTML.trim(),
      };
    });
    console.log(await guide.jsonValue());
    // 相宜
    const suit = await page.evaluateHandle(() => {
      return Array.from(document.getElementsByClassName('suit-list')[0].getElementsByTagName('li')[0].getElementsByClassName('rows')).map(a => a.outerText.trim().replace(/\n/, ':'));
    });
    console.log(await suit.jsonValue());
    // 相克
    const restraint = await page.evaluateHandle(() => {
      return Array.from(document.getElementsByClassName('suit-list')[0].getElementsByTagName('li')[1].getElementsByClassName('rows')).map(a => a.outerText.trim().replace(/\n/, ':'));
    });
    console.log(await restraint.jsonValue());
    // 标签
    const tag = await page.evaluateHandle(($tag1, $tag2, $tag3) => {
      return [
        document.querySelector($tag1).innerText,
        document.querySelector($tag2).innerText,
        document.querySelector($tag3).innerText
      ];
    }, FOODS_TAG1_SELECTOR, FOODS_TAG2_SELECTOR, FOODS_TAG3_SELECTOR);
    console.log(await tag.jsonValue());

    let result = {
      title: await title.jsonValue(),
      subtitle: await subtitle.jsonValue(),
      image: await image.jsonValue(),
      steps: JSON.stringify(await step.jsonValue()),
      ingredients: JSON.stringify(await ingredients.jsonValue()),
      common: JSON.stringify(await common.jsonValue()),
      guide: JSON.stringify(await guide.jsonValue()),
      suits: JSON.stringify(await suit.jsonValue()),
      restraints: JSON.stringify(await restraint.jsonValue()),
      tags: JSON.stringify(await tag.jsonValue()),
    };
    console.log(result);
    updateData(result); // 更新数据库
  } catch (err) {
    console.log('ERR:', err.message);
  } finally {
    browser.close();
  }
})()

function updateData (obj) {
  const DB_URL = 'mongodb://localhost/healthcare';
  if (mongoose.connection.readyState == 0) {
    mongoose.connect(DB_URL);

    //On connection
    mongoose.connection.once('open', () => {
      console.log('connected to database: ' + DB_URL);
    })

    //Error connection
    mongoose.connection.on('error', (err) => {
      console.log('database error' + err);
    })
  }

  try {
    let newData = new DATA(obj);
    console.log('mongoose:', newData);
    newData.save( (err, newData) => {
      if (err) throw err;
      console.log('Saved successfully');
    });
  } catch (err) {
    console.log(err);
  }
};