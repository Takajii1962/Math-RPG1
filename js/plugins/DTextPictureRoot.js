/*:
 * @target MZ
 * @plugindesc DTextPicture Root Extension
 * @author ChatGPT
 */

(() => {

    const _processEscapeCharacter =
        Window_Base.prototype.processEscapeCharacter;

    Window_Base.prototype.processEscapeCharacter = function(code, textState) {

        if (code === "RT") {

            const match = /^\[(.*?)\]/.exec(
                textState.text.slice(textState.index)
            );

            if (!match) return;

            textState.index += match[0].length;

            const value = match[1];

            const numWidth = this.textWidth(value);

            const x = textState.x;
            const y = textState.y;

            // √
            this.contents.drawText(
                "√",
                x,
                y,
                24,
                this.lineHeight()
            );

            // 上線
            this.contents.fillRect(
                x + 14,
                y + 8,
                numWidth + 4,
                2,
                ColorManager.normalColor()
            );

            // 数字
            this.contents.drawText(
                value,
                x + 18,
                y,
                numWidth + 8,
                this.lineHeight()
            );

            textState.x += numWidth + 24;
            return;
        }

        _processEscapeCharacter.call(this, code, textState);
    };

})();