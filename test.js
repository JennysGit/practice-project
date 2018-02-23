const phantom = require('phantom');
let _ph, _page, _outObj;

phantom
  .create()
  .then(ph => {
    _ph = ph;
    return _ph.createPage();
  })
  .then(page => {
    _page = page;
    return _page.open('http://h5.izhangchu.com/dishes_view/index.html?&dishes_id=274');
  })
  .then(status => {
    console.log(status);
    return _page.property('content');
  })
  .then(content => {
    console.log(content);
    _page.close();
    _ph.exit();
  })
  .catch(e => console.log(e));