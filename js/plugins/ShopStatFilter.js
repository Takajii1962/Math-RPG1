/*:
 * @target MZ
 * @plugindesc 防具屋で攻撃力と防御力のみを完全に表示するプラグイン
 * @help ツクールMZ本体のショップステータス表示を、攻撃力と防御力のみに限定します。
 */

(() => {
    // ショップ画面に表示するステータスの番号を「2(攻撃力)」と「3(防御力)」だけに制限します
    Window_ShopStatus.prototype.statusParams = function() {
        return [2, 3];
    };
})();