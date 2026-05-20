/*:
 * @target MZ
 * @plugindesc ショップ画面の所持数表示に、メンバーが装備中の数も含めるプラグインです。
 * @author AI
 *
 * @help
 * このプラグインは、ショップ画面の「所持数」のカウントに、
 * パーティ全員が現在装備している武器・防具の数を合算して表示します。
 * 袋の中が0個でも、誰かが装備していれば「1」と表示されます。
 */

(() => {
    const _Window_ShopStatus_drawPossession = Window_ShopStatus.prototype.drawPossession;
    Window_ShopStatus.prototype.drawPossession = function(x, y) {
        if (this._item && (DataManager.isWeapon(this._item) || DataManager.isArmor(this._item))) {
            let count = $gameParty.itemContainer(this._item) ? $gameParty.itemContainer(this._item)[this._item.id] || 0 : 0;
            $gameParty.members().forEach(actor => {
                actor.equips().forEach(equip => {
                    if (equip && equip.id === this._item.id && DataManager.isWeapon(this._item) === DataManager.isWeapon(equip)) {
                        count++;
                    }
                });
            });
            const width = this.contents.width - this.itemPadding() * 2;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.possession, x, y, width - this.textWidth(count));
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(count, x, y, width, "right");
        } else {
            _Window_ShopStatus_drawPossession.apply(this, arguments);
        }
    };
})();