// 引入mockjs
const Mock = require("mockjs");

import GetWaterworksCurve from './data/GetWaterworksCurve.json'



// Mock.mock( url, post/get , 返回的数据)；

Mock.mock("/api/GetWaterworksCurve", "post", GetWaterworksCurve);
