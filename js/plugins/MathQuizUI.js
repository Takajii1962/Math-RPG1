/*:
 * @target MZ
 * @plugindesc Auto Root Image Customizer
 * @author AI
 * 
 * @param imageName
 * @text 画像名
 * @desc img/picturesに入れた画像名（.pngは不要）
 * @default root_line
 */
(() => {
    const params = PluginManager.parameters("AutoRootImage");
    const imgName = params["imageName"] || "root_line";

    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        ImageManager.loadPicture(imgName);
    };

    // メッセージウィンドウが実際に文章の文字を描画し始める瞬間（更新タイミング）を狙って画像を出す
    const _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
    Window_Message.prototype.updateMessage = function() {
        const result = _Window_Message_updateMessage.call(this);
        
        // メッセージが表示中であり、まだルート画像（ピクチャ90番）が出ていない場合のみ1回だけ実行
        if (this.isOpen() && this.isVisualUpdated() && !$gameScreen.picture(90)) {
            const textValue = String($gameVariables.value(11) || "");
            if (textValue) {
                const textLength = textValue.length;
                // 1文字のときを100%とし、文字数に応じて横幅を自動計算して引き伸ばす
                const scaleX = 100 + (textLength - 1) * 35;
                
                // メッセージウィンドウの左上に合わせてルート画像を確実に表示
                // ※上下の位置がズレている場合は「440」の数字を変えることで調整できます
                $gameScreen.showPicture(90, imgName, 0, 32, 440, scaleX, 100, 255, 0);
            }
        }
        return result;
    };

    // メッセージが閉じたら、表示していたルート画像を自動で100%消去する
    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        _Window_Message_terminateMessage.call(this);
        $gameScreen.erasePicture(90);
    };
})();