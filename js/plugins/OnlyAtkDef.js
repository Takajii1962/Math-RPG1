/*:
 * @target MZ
 * @plugindesc ステータス画面の能力値を攻撃力と防御力のみにします
 * @author 制作サポート
 */
Window_StatusParams.prototype.maxItems = function() {
    return 2; // 表示する能力値の数を「攻撃力・防御力」の2つだけに制限
};