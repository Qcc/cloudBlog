// 生成随机数文件名
var chars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
function generateMixed(n) {
  var res = "";
  for(var i = 0; i < n ; i ++) {
    var id = Math.ceil(Math.random()*35);
    res += chars[id];
  }
  return res;
}
function run (x){
  var start = new Date();
  for(var i = 0; i < x; i++){
    generateMixed(32)
  }
  var end = new Date();
  console.log(end - start)
  }
  run(100000);