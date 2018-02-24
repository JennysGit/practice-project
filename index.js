
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Data = require('./models/data');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250 // slow down by 250ms
  });
  const page = await browser.newPage();

  const FOODS_TITLE_SELECTOR = '#DishesView-wrap > div:nth-child(2) > div.goods-show > div > h5';
  const FOODS_SUBTITLE_SELECTOR = '#DishesView-wrap > div:nth-child(2) > div.goods-show > div > p';
  const FOODS_IMAGE_SELECTOR = '#linksWrap > li:nth-child(2) > a > div.img > img';
  const FOODS_TAG1_SELECTOR = '#linksWrap > li:nth-child(2) > div > a:nth-child(1) > span';
  const FOODS_TAG2_SELECTOR = '#linksWrap > li:nth-child(2) > div > a:nth-child(2) > span';
  const FOODS_TAG3_SELECTOR = '#linksWrap > li:nth-child(2) > div > a:nth-child(3) > span';

  try {
    await page.goto('http://h5.izhangchu.com/dishes_view/index.html?&dishes_id=274');
    await page.waitFor(2000);
  
    const result = await page.evaluate(($title, $subtitle, $img, $tag1, $tag2, $tag3) => {
      // 标题
      let title = document.querySelector($title).innerText;
      // 标题说明
      let subtitle = document.querySelector($subtitle).innerText;
      // 图片
      let image = document.querySelector($img).src;
      // 制作步骤
      let step = [];
      let steps = document.getElementById('DishesStep-wrap').getElementsByTagName('li');
      for (let i of steps) {
        let $step = {
          title: i.children[1].innerText,
          img: i.children[0].src
        };
        step.push($step);
      }
      // 食材
      debugger; 
      let $els = document.getElementsByClassName('material-list')[0].getElementsByTagName('li');
      let ingredients = [];
      for (let ele of $els) {
        ingredients.push(ele.innerText);
      }
      // 相关常识
      let common = {
        title: document.getElementById('DishesCommensense-wrap').getElementsByTagName('h5')[0].innerText,
        txt: document.getElementById('DishesCommensense-wrap').getElementsByClassName('txt')[0].innerText,
      };
      // 制作指导
      let guide = {
        title: document.getElementById('DishesCommensense-wrap').getElementsByTagName('h5')[1].innerText,
        txt: document.getElementById('DishesCommensense-wrap').getElementsByClassName('txt')[1].innerText,
      };
      // 相宜相克
      let suit = [];
      let restraint = [];
      let suits = document.getElementsByClassName('suit-list')[0].getElementsByTagName('li')[0].getElementsByClassName('rows');
      let restraints = document.getElementsByClassName('suit-list')[0].getElementsByTagName('li')[1].getElementsByClassName('rows');
      for (let el of suits) {
        suit.push(el.innerText.trim().replace(/\n/, ':'));
      }
      for (let element of restraints) {
        restraint.push(element.innerText.trim().replace(/\n/, ':'));
      }
      // 标签
      let tag1 = document.querySelector($tag1).innerText;
      let tag2 = document.querySelector($tag2).innerText;
      let tag3 = document.querySelector($tag3).innerText;
      // 返回
      let content = {
        title: title,
        subtitle: subtitle,
        image: image,
        steps: step,
        ingredients: ingredients,
        common: common,
        guide: guide,
        suits: suit,
        restraints: restraint,
        tags: [tag1, tag2, tag3],
      };
      // updateData(content); // 更新数据库
      return content;
    }, FOODS_TITLE_SELECTOR, FOODS_SUBTITLE_SELECTOR, FOODS_IMAGE_SELECTOR, FOODS_TAG1_SELECTOR, FOODS_TAG2_SELECTOR, FOODS_TAG3_SELECTOR);
    console.log(result);
  } catch (err) {
    console.log('ERR:', err.message);
  } finally {
    browser.close();
  }
})()

function updateData (obj) {
  const DB_URL = 'mongodb://localhost/health-foods';
  if (mongoose.connection.readyState == 0) {
    mongoose.connect(DB_URL, {
      useMongoClient: true,
    });

    //On connection
    mongoose.connection.on('connected', () => {
      console.log('connected to database' + config.database);
    })

    //Error connection
    mongoose.connection.on('error', (err) => {
      console.log('database error' + err);
    })
  }

  // 如果存在，就更新实例，不新增
  const conditions = {
    title: obj.title
  };
  const options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  };

  Data.findOneAndUpdate(conditions, obj, options, (err, result) => {
    if (err) {
      throw err;
    }
  });
};