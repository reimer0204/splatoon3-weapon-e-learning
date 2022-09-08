const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// const list = require('./src/list.mjs');

const SUB_WEAPONS = { 1: 2,  2: 1,  3: 27,  4: 3,  5: 10,  6: 4,  7: 12,  8: 31,  9: 24,  10: 15,  11: 9,  12: 17,  13: 20,  14: 8, };
const SPECIAL_WEAPONS = { 1: 1, 2: 19, 3: 29, 4: 10, 5: 53, 6: 5, 7: 30, 8: 23, 9: 7, 10: 51, 11: 3, 12: 25, 13: 16, 14: 13, 15: 2, };

(async () => {

    // 画像切り出し
    // Promise使ってるけど並列で走らせるとファイル開きすぎで死ぬので1つ1つやる
    let files = await fs.readdir(path.resolve('./screenshots'));
    for(let file of files) {
        await sharp(path.resolve('./screenshots', file))
            .extract({ width: 128, height: 128, left: 428, top: 296 })
            .toFile(path.resolve('./src/public/weapon', file));
    }

    for(let [subId, weaponId] of Object.entries(SUB_WEAPONS)) {
        await sharp(path.resolve('./screenshots', weaponId + '.jpg'))
            .extract({ width: 49, height: 49, left: 578, top: 369 })
            .toFile(path.resolve('./src/public/sub', subId + '.jpg'));
    }

    for(let [specialId, weaponId] of Object.entries(SPECIAL_WEAPONS)) {
        await sharp(path.resolve('./screenshots', weaponId + '.jpg'))
            .extract({ width: 49, height: 49, left: 578, top: 427 })
            .toFile(path.resolve('./src/public/special', specialId + '.jpg'));
    }

    // await process('sub', { width: 200, height: 200, left: 100, top: 100 });
    // await process('special', { width: 200, height: 200, left: 100, top: 100 });

})();