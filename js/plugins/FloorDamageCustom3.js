/*:
 * @target MZ
 * @plugindesc 所持アイテム数に応じて床ダメージを変動させる
 * @author User
 * 
 * @help アイテムID 1, 2, 3, 4, 5, 6, 7, 8 の所持数をカウントします。
 * IDを変えたい場合は、コード内の itemIds の数字を書き換えてください。
 */

(() => {
    'use strict';

    Game_Actor.prototype.basicFloorDamage = function() {
        // --- 設定：ここに使用する8つのアイテムIDを入れます ---
        // 例: アイテムIDが 10, 11, 12... なら [10, 11, 12, 13, 14, 15, 16, 17] にする
        const itemIds = [61, 62, 63, 64, 65, 66, 67, 68]; 
        
        let count = 0;
        itemIds.forEach(id => {
            if ($dataItems[id] && $gameParty.hasItem($dataItems[id])) {
                count++;
            }
        });

        const damageTable = {
            8: 0, 7: 0, 6: 0, 5: 1, 4: 2, 3: 3, 2: 5, 1: 7, 0: 10
        };

        return damageTable[count] !== undefined ? damageTable[count] : 10;
    };
})();