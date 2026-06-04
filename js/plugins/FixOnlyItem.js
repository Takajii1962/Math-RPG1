/*:
 * @target MZ
 * @plugindesc アイテム画面から不要な選択を消し、開いた瞬間にアイテムとアクターを同時表示します。
 */
(() => {
    // 1. カテゴリウィンドウ（上のメニュー）を最初から非表示にする
    const _Window_ItemCategory_initialize = Window_ItemCategory.prototype.initialize;
    Window_ItemCategory.prototype.initialize = function(rect) {
        _Window_ItemCategory_initialize.call(this, rect);
        this.hide();
        this.deactivate();
    };

    // コマンドの選択肢を「アイテム」だけにする
    Window_ItemCategory.prototype.makeCommandList = function() {
        this.addCommand(TextManager.item, "item");
    };

    // 2. アイテム画面が開いた直後の処理（アイテム欄をアクティブにする）
    const _Scene_Item_create = Scene_Item.prototype.create;
    Scene_Item.prototype.create = function() {
        _Scene_Item_create.call(this);
        this._categoryWindow.deactivate();
        this._itemWindow.setCategory('item');
        this._itemWindow.show();
        this._itemWindow.activate();
        this._itemWindow.select(0);
    };

    // 【修正箇所】画面が動き出す最初のアップデート時に、安全に主人公（アクター）を表示する
    const _Scene_Item_start = Scene_Item.prototype.start;
    Scene_Item.prototype.start = function() {
        _Scene_Item_start.call(this);
        // 主人公のデータを安全に読み込み、最初に選択されている人をセットして表示する
        this._actorWindow.refresh();
        this._actorWindow.select(0);
        this._actorWindow.show();
    };

    // 3. 左右の自動移動を禁止し、位置を完全に固定する
    Scene_Item.prototype.showActorWindow = function() {
        this._actorWindow.activate();
    };

    // 4. アイテム選択中に「キャンセル（戻る）」を押した時、画面を閉じる
    Scene_Item.prototype.onItemCancel = function() {
        this._itemWindow.deactivate();
        this.popScene(); 
    };

    // =========================================================================
    // 5. アクター選択ウィンドウの位置（ここで細かく場所を調整してください）
    // =========================================================================
    Scene_Item.prototype.actorWindowRect = function() {
        const wx = 280;      // 画面の左端からの位置
        const wy = 200;    // 縦の位置（上側が切れないように少し下へ）
        const ww = 525;    // ウィンドウの横幅
        const wh = 412;    // ウィンドウの縦幅（かおや名前が収まる高さ）

        return new Rectangle(wx, wy, ww, wh);
    };
})();