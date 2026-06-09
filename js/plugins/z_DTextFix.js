/*:
 * @target MZ
 * @plugindesc 【完全修正版】座標管理を分離してズレを排除
 */
(function() {
    const _Window_Base_obtainEscapeCode = Window_Base.prototype.obtainEscapeCode;
    Window_Base.prototype.obtainEscapeCode = function(textState) {
        if (/^SQRT/i.test(textState.text.slice(textState.index))) {
            textState.index += 4;
            return "SQRT";
        }
        return _Window_Base_obtainEscapeCode.call(this, textState);
    };

    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        if (code === "SQRT") {
            const match = /\{(.+?)\}/.exec(textState.text.slice(textState.index));
            if (match) {
                const val = match[1];
                textState.index += match[0].length;
                
                // 1. 現在の開始位置を記録
                const startX = textState.x;
                const startY = textState.y;

                // 2. ツクール標準の描画処理をそのまま実行（これが最もズレない）
                // √ と val を一文字ずつ標準処理に流し込む
                const fullText = "√" + val;
                for (let i = 0; i < fullText.length; i++) {
                    const char = fullText[i];
                    this.processNormalCharacter({ char: char }, textState);
                }

                // 3. 描画終了後に、線を「記録しておいた座標」に対して描く
                const valWidth = this.textWidth(val);
                this.contents.fillRect(startX + 11, startY + 10, valWidth + 6, 2, "#ffffff");
            }
        } else {
            _Window_Base_processEscapeCharacter.call(this, code, textState);
        }
    };
})();