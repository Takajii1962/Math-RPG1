(function() {
    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        if (code === "SQRT") {
            const match = /\{(.+?)\}/.exec(textState.text.slice(textState.index));
            if (match) {
                const val = match[1];
                const startX = textState.x;
                const startY = textState.y;
                const fullText = "√" + val;
                
                // 1. ルート部分の描画
                for (let i = 0; i < fullText.length; i++) {
                    const char = fullText[i];
                    this.contents.drawText(char, textState.x, textState.y, this.textWidth(char), this.lineHeight());
                    textState.x += this.textWidth(char);
                }
                this.contents.fillRect(startX + 12, startY + 5, this.textWidth(val) + 6, 2, "#ffffff");
                
                // 2. 文字列のインデックスを進める
                textState.index += match[0].length;
                
                // 【重要】DTextPictureの本来の描画処理を完全にスキップさせる
                return; 
            }
        }
        _Window_Base_processEscapeCharacter.call(this, code, textState);
    };
})();