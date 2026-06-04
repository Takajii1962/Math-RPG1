/*:
 * @target MZ
 * @plugindesc シーンカスタマイズプラグイン v1.1.0
 * @author トリアコンタン
 *
 * @param windowVisibilityList
 * @text ウィンドウ非表示リスト
 * @desc 特定の条件で非表示にしたいウィンドウの設定です。
 * @type struct<WindowVisibility>[]
 * @default []
 *
 * @help SceneCustomizer.js
 * * 画面上のウィンドウの表示・非表示を、スイッチやスクリプトで
 * 自由にコントロールできるようにする公式のカスタムプラグインです。
 */

/*~struct~WindowVisibility:
 * @param windowName
 * @text ウィンドウ名
 * @desc 非表示にしたいウィンドウのオブジェクト名です（例: Window_ItemCategory）
 * @type combo
 * @option Window_ItemCategory
 * @default 
 *
 * @param switchId
 * @text 条件スイッチID
 * @desc このスイッチがONのとき、ウィンドウを非表示にします（0指定で無視）。
 * @type switch
 * @default 0
 *
 * @param scriptCondition
 * @text 条件スクリプト
 * @desc このJavaScript式が正しい(true)とき、ウィンドウを非表示にします。
 * @type string
 * @default 
 */

(() => {
    'use strict';
    const script = document.currentScript.src.match(/^.*\/(.+)\.js$/) ? RegExp.$1 : 'SceneCustomizer';
    const parameters = PluginManager.parameters(script);

    // ツクールの文字解析用関数
    function parseArgs(param) {
        if (param === undefined) return;
        try {
            return JSON.parse(param, (key, value) => {
                try { return parseArgs(value); } catch (e) { return value; }
            });
        } catch (e) {
            return param;
        }
    }

    const windowVisibilityList = parseArgs(parameters['windowVisibilityList']) || [];

    // ウィンドウが表示される瞬間の処理に割り込み
    const _Window_Base_initialize = Window_Base.prototype.initialize;
    Window_Base.prototype.initialize = function(rect) {
        _Window_Base_initialize.call(this, rect);
        this._customizerChecked = false;
    };

    const _Window_Base_update = Window_Base.prototype.update;
    Window_Base.prototype.update = function() {
        _Window_Base_update.call(this);
        this.updateSceneCustomizerVisibility();
    };

    // 条件に合わせてウィンドウを隠す核心部分
    Window_Base.prototype.updateSceneCustomizerVisibility = function() {
        const name = this.constructor.name;
        const config = windowVisibilityList.find(item => item.windowName === name);
        if (config) {
            let isHide = false;
            if (config.switchId > 0 && $gameSwitches.value(config.switchId)) {
                isHide = true;
            }
            if (config.scriptCondition) {
                try {
                    if (eval(config.scriptCondition)) isHide = true;
                } catch (e) {
                    console.error(e);
                }
            }
            if (isHide) {
                this.hide();
                this.deactivate();
                // アイテム画面でカテゴリが隠れた場合、下のアイテム欄を自動でアクティブにする
                if (name === 'Window_ItemCategory' && this._itemWindow && !this._itemWindow.active && $gameMap.isEventRunning()) {
                    this._itemWindow.activate();
                    this._itemWindow.select(0);
                }
            } else {
                if (!this._customizerChecked && name === 'Window_ItemCategory' && !$gameMap.isEventRunning()) {
                    this.show();
                    this._customizerChecked = true;
                }
            }
        }
    };
})();