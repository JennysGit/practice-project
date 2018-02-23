
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.goto('http://h5.izhangchu.com/dishes_view/index.html?&dishes_id=274');
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    // 标题
    let title = document.querySelector('#DishesView-wrap > div:nth-child(2) > div.goods-show > div > h5').innerText;
    // 标题说明
    let subtitle = document.querySelector('#DishesView-wrap > div:nth-child(2) > div.goods-show > div > p').innerText;
    // 制作步骤
    let step = { 
      step1: document.querySelector('#DishesStep-wrap > li:nth-child(1) > div').innerText,
      step2: document.querySelector('#DishesStep-wrap > li:nth-child(2) > div').innerText,
      step3: document.querySelector('#DishesStep-wrap > li:nth-child(3) > div').innerText,
      step4: document.querySelector('#DishesStep-wrap > li:nth-child(4) > div').innerText,
      step5: document.querySelector('#DishesStep-wrap > li:nth-child(5) > div').innerText,
      step6: document.querySelector('#DishesStep-wrap > li:nth-child(6) > div').innerText,
      step7: document.querySelector('#DishesStep-wrap > li:nth-child(7) > div').innerText,
      step8: document.querySelector('#DishesStep-wrap > li:nth-child(8) > div').innerText,
    };
    // 食材
    let $el = document.getElementsByClassName('material-list');
    let ingredients = {
      ingredient1: $el.getElementsByTagName('li')[0].innerText,
      ingredient2: $el.getElementsByTagName('li')[1].innerText,
      ingredient3: $el.getElementsByTagName('li')[2].innerText,
      ingredient4: $el.getElementsByTagName('li')[3].innerText,
    }
    // 相关常识
    let common = {
      title: document.getElementById('DishesCommensense-wrap').getElementsByTagName('h5')[0].innerText,
      txt: document.getElementById('DishesCommensense-wrap').getElementsByClassName('txt')[0].innerText,
    };
    // 制作指导
    let guide = {
      title: document.getElementById('DishesCommensense-wrap').getElementsByClassName('txt')[1].innerText,
      txt: document.getElementById('DishesCommensense-wrap').getElementsByClassName('txt')[1].innerText,
    };
    // 标签
    let tag1 = document.querySelector('#linksWrap > li:nth-child(2) > div > a:nth-child(1) > span').innerText;
    let tag2 = document.querySelector('#linksWrap > li:nth-child(2) > div > a:nth-child(2) > span').innerText;
    let tag3 = document.querySelector('#linksWrap > li:nth-child(2) > div > a:nth-child(3) > span').innerText;
    // 返回
    let content = {
      title: title,
      subtitle: subtitle,
      step: step,
      ingredients: ingredients,
      common: common,
      guide: guide,
      tag: [tag1, tag2, tag3],
    };
    return content;
  });
  console.log(result);
  browser.close();
})()