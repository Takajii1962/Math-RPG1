/*:
 * @target MZ
 * @plugindesc 大型船の速度を完全に固定し、乗り降り時の速度リセットを防ぎます
 * 
 * @help このプラグインは、大型船（ship）の速度を強制的に固定します。
 * 陸に上がって再度乗り直しても、速度が速くなるのを完全に防ぎます。
 */

(() => {
    // ★ここで大型船（ship）の速度を好きな数字に固定します（3 = ゆっくり、2 = かなり遅い）
    const FIXED_SHIP_SPEED = 3;

    // 船の基本速度を固定
    const _Game_Vehicle_speed = Game_Vehicle.prototype.speed;
    Game_Vehicle.prototype.speed = function() {
        if (this._type === "ship") {
            return FIXED_SHIP_SPEED;
        }
        return _Game_Vehicle_speed.call(this);
    };

    // 【重要】乗り物に「乗った瞬間」に、強制的に速度を固定値に上書きする処理
    const _Game_Player_getOnVehicle = Game_Player.prototype.getOnVehicle;
    Game_Player.prototype.getOnVehicle = function() {
        const result = _Game_Player_getOnVehicle.call(this);
        if (result && this._vehicleType === "ship") {
            this.setMoveSpeed(FIXED_SHIP_SPEED); // プレイヤーの引き継ぎ速度を強制上書き
        }
        return result;
    };
})();