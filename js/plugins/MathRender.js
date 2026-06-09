/*:
 * @target MZ
 * @plugindesc DTextPictureの描画を1回に制限する修正
 */
(function() {
    // 描画済みかを確認するためのフラグ
    let drawnMap = new WeakMap();

    const _Sprite_DTextPicture_drawText = Sprite_DTextPicture.prototype.drawText;
    Sprite_DTextPicture.prototype.drawText = function(text, x, y, maxWidth, align) {
        // 同じ座標に対して2回目に呼ばれたら強制終了する
        const key = this.bitmap;
        if (drawnMap.get(key) === (x + "," + y + "," + text)) {
            return;
        }
        drawnMap.set(key, (x + "," + y + "," + text));

        if (text && text.includes("\\SQRT")) {
            // ルート描画
            const parts = text.split("\\SQRT{");
            const baseText = parts[0];
            const val = parts[1].split("}")[0];
            
            // 本体のみを描画（二重にならないよう直接描画）
            this.bitmap.drawText(baseText + "√" + val, x, y, maxWidth, this.lineHeight(), align);
            const w1 = this.bitmap.measureTextWidth(baseText);
            this.bitmap.fillRect(x + w1 + 12, y + 5, this.bitmap.measureTextWidth(val) + 6, 2, "#ffffff");
        } else {
            _Sprite_DTextPicture_drawText.call(this, text, x, y, maxWidth, align);
        }
    };
})();