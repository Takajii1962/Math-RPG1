/*:
 * @target MZ
 * @plugindesc 通常メニューと戦闘中のアイテム表示を完全に分けるプラグイン
 * @author AI
 */
(() => {
    const _Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
    Window_ItemList.prototype.makeItemList = function() {
        // 【超重要】現在選択中のタブが「大事なもの」や「武器・防具」などの場合は、100%絶対に通常ルールで表示する
        if (this._category !== "item") {
            _Window_ItemList_makeItemList.apply(this, arguments);
            return;
        }

        // 通常のメニュー画面（マップ上など）からアイテムを開いた場合も、絶対に本来の通常ルールで表示する
        if (SceneManager._stack.length > 0 && SceneManager._stack[SceneManager._stack.length - 1] === Scene_Menu) {
            _Window_ItemList_makeItemList.apply(this, arguments);
            return;
        } 

        // 戦闘中（計算問題のイベント中）に呼び出された場合のみ、51〜55番に限定する
        if ($gameParty.inBattle()) {
            var myTargetIds = new Array();
            myTargetIds.push(51);
            myTargetIds.push(52);
            myTargetIds.push(53);
            myTargetIds.push(54);
            myTargetIds.push(55);
            
            this._data = new Array();
            for (var i = 0; i < myTargetIds.length; i++) {
                var item = $dataItems[myTargetIds[i]];
                if (item) this._data.push(item);
            }
        } 
        // それ以外の場合は通常ルールで表示する
        else {
            _Window_ItemList_makeItemList.apply(this, arguments);
        }
    };
})();