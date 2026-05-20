/*:
 * @target MZ
 * @plugindesc ショップ画面で購入時に装備品も所持数に含めるプラグイン
 * @author AI_Fix
 */
(() => {
    // MPP様(Op1)が作った独自の「ショップステータス画面」の数値描画をピンポイントで上書き
    const _Window_ShopStatus_drawPossession = Window_ShopStatus.prototype.drawPossession;
    Window_ShopStatus.prototype.drawPossession = function(x, y) {
        if (this._item) {
            const width = this.contents.width - x - this.itemPadding();
            const possessionWidth = this.textWidth("0000");
            
            // 「持っている数」のラベルを描画
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.possession, x, y, width - possessionWidth);
            this.resetTextColor();
            
            // ★ここが正解！装備中のアイテムも所持数に含めて計算する（末尾に true を指定）
            const count = $gameParty.numItems(this._item, true);
            this.drawText(count, x, y, width, "right");
        } else {
            _Window_ShopStatus_drawPossession.call(this, x, y);
        }
    };
})();