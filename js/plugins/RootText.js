/*:
 * @target MZ
 * @plugindesc Root Text for DTextPicture
 * @author ChatGPT
 */

(() => {

    const _processEscapeCharacter =
        Window_Base.prototype.processEscapeCharacter;

    Window_Base.prototype.processEscapeCharacter = function(code, textState) {

        if (code === "RT") {

            const value = this.obtainEscapeParamText(textState);
            const width = this.textWidth(value);

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
                width + 4,
                2,
                this.contents.textColor
            );

            // 数字
            this.contents.drawText(
                value,
                x + 18,
                y,
                width + 10,
                this.lineHeight()
            );

            textState.x += width + 26;
            return;
        }

        _processEscapeCharacter.call(this, code, textState);
    };

    Window_Base.prototype.obtainEscapeParamText = function(textState) {
        const arr = /^\[(.*?)\]/.exec(
            textState.text.slice(textState.index)
        );

        if (arr) {
            textState.index += arr[0].length;
            return arr[1];
        }
        return "";
    };

})();