/*:
 * @target MZ
 * @plugindesc LatinModern-Math 強制適用とパス確認用
 */

(() => {
    // コンソールに現状のパス情報を出力させる
    console.log("現在の実行ルート: " + window.location.href);
    console.log("参照しようとしているパス: " + window.location.origin + "/fonts/lmmath-regular.otf");

    const FONT_NAME = 'LatinModern-Math';
    const FONT_URL = 'fonts/lmmath-regular.otf';
    
    const font = new FontFace(FONT_NAME, 'url(' + FONT_URL + ')');
    
    document.fonts.add(font);
    font.load().then(() => {
        console.log("フォント読み込み成功");
    }).catch(e => {
        console.error("フォント読み込み失敗:", e);
    });

    const _Window_Base_standardFontFace = Window_Base.prototype.standardFontFace;
    Window_Base.prototype.standardFontFace = function() {
        return "'" + FONT_NAME + "', " + _Window_Base_standardFontFace.call(this);
    };
})();