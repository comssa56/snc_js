
const fs = require('fs');
const csv = require('csv');
const csvSync = require('csv-parse/lib/sync'); // requiring sync module

const INDEX_S_FILE =__dirname +  "/index_s.csv";
const INDEX_H_FILE =__dirname +  "/index_h.csv";

let mp1 = null;
let mp2 = null;

const K = 34;

///////////////////////////////////
//  便利関数群
///////////////////////////////////

const min = function(a,b){
    return a>b ? b :a;    
}

const min3 = function(a,b,c){
    return min(a, min(b,c));
}

const add1 = function(lhs, rhs, m) 
{
    for(let j=m+5; j>=5; --j){
        let sht = min(lhs[j]+rhs[0], lhs[0]+rhs[j]);

        for(let k=5; k<j; ++k){
            sht = min3(sht, lhs[k]+rhs[j-k], lhs[j-k]+rhs[k]);
        }
        lhs[j] = sht;
    }

    for(let j=m; j>=0; --j){
        let sht = lhs[j]+rhs[0];

        for(let k=0; k<j; ++k){
            sht = min(sht, lhs[k]+rhs[j-k]);
        }
        lhs[j] = sht;
    }

    return lhs;
}

const add2 = function(lhs, rhs, m) 
{
  let j = m+5;
  let sht = min(lhs[j]+rhs[0], lhs[0]+rhs[j]);

  for(let k=5; k<j; ++k){
    sht = min(sht, lhs[k]+rhs[j-k], lhs[j-k]+rhs[k]);
  }
  lhs[j] = sht;

  return lhs;
}

const read_csv = function(file) 
{
    let data = fs.readFileSync(file);    
    mp = csvSync(data);
    for(let i in mp) 
    {
        for(let j in mp[i])
        {
            mp[i][j] = parseInt(mp[i][j]);
        } 
    }
    return mp;
}

const accum = function(v, from,to,base)
{
    let ret = base;
    for(let i=from;i<to;++i)
    {
        ret = 5*ret +v[i];
    }
    return ret;
}


///////////////////////////////////
///  メインの処理
///////////////////////////////////

/// 初期化 
const initialize = function(dir) {
    mp1 = read_csv(INDEX_S_FILE);
    mp2 = read_csv(INDEX_H_FILE);
}


/// 通常のメンツ手
const calc_lh = function(t, m) 
{
  let ret = mp1[accum(t, 1, 9, t[0])];
  ret = add1(ret, mp1[accum(t, 10, 18, t[9])], m);
  ret = add1(ret, mp1[accum(t, 19, 27, t[18])], m);
  ret = add2(ret, mp2[accum(t, 28, 34, t[27])], m);
  return ret[5+m];
}

/// 七対子
const calc_sp = function(t) 
{
  let pair = 0;
  let kind = 0;

  for(let i=0; i<K; ++i){
    if(t[i]>0){
      ++kind;
      if(t[i]>=2) ++pair;
    }
  }
  return 7-pair+(kind<7 ? 7-kind:0);
}

/// 国士無双
const calc_to = function(t) 
{
  let pair = 0;
  let kind = 0;

  for(let i of [0,8,9,17,18,26,27,28,29,30,31,32,33]){
    if(t[i]>0){
      ++kind;
      if(t[i]>=2) ++pair;
    }
  }
  return 14-kind-(pair>0 ? 1:0);
}

/// シャン点数計算メイン
const calc = function(t, m, mode)
{

  let ret = [1024, 0];

  if(mode & 1){
    let sht=calc_lh(t,m);
    if(sht < ret[0]){
      ret = [sht, 1];
    }
    else if(sht == ret[0]){
      ret[1] |= 1;
    }
  }

  if((mode&2) && m==4){
    let sht=calc_sp(t);
    if( sht < ret[0]){
      ret = [sht, 2];
    }
    else if(sht == ret[0]){
      ret[1] |= 2;
    }
  }

  if((mode&4) && m==4){
    let sht=calc_to(t);
    if(sht < ret[0]){
      ret = [sht, 4];
    }
    else if(sht == ret[0]){
      ret[1] |= 4;
    }
  }

  return ret;
}

exports.shanten = function(hand){
    initialize();   
    return result = calc(hand, 4, 7);
}
