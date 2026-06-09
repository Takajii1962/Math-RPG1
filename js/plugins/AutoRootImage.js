/*:
 * @target MZ
 * @plugindesc ルート自動画像描画プラグイン（完全自動・複数対応版）
 * @author AI
 */
(() => {
    // -------------------------------------------------------------
    // 【設定】ここにお手持ちの「ルートの画像名」を書いてください（.pngは不要）
    // -------------------------------------------------------------
    const MY_IMAGE_NAME = "root_line"; 

    // ゲーム開始時およびマップ切り替え時に、画像をあらかじめ内部に完全に読み込ませておく
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        ImageManager.loadPicture(MY_IMAGE_NAME);
    };

    // \ROOT[数字] をシステム用の制御文字（\x1bROT）に変換する
    const _Window_Base_convertEscapeCharacters = Window_Base.prototype.convertEscapeCharacters;
    Window_Base.prototype.convertEscapeCharacters = function(text) {
        let converted = _Window_Base_convertEscapeCharacters.call(this, text);
        converted = converted.replace(/\\ROOT\[(.*?)\]/gi, '\x1bROT[$1]');
        return converted;
    };

    // 文字を描画する瞬間に、ウィンドウに直接画像を「スタンプ」する処理
    const _Window_StatusBase_processEscapeCharacter = Window_StatusBase.prototype.processEscapeCharacter;
    Window_StatusBase.prototype.processEscapeCharacter = function(code, textState) {
        if (code === 'ROT') {
            let innerText = "";
            if (textState.text[textState.index] === '[') {
                textState.index++;
                while (textState.index < textState.text.length && textState.text[textState.index] !== ']') {
                    innerText += textState.text[textState.index];
                    textState.index++;
                }
                if (textState.text[textState.index] === ']') {
                    textState.index++;
                }
            }

            const bitmap = ImageManager.loadPicture(MY_IMAGE_NAME);

            // 画像の読み込みが完了しているか、または1フレ待ってでも確実に描画する
            if (bitmap) {
                if (!bitmap.isReady()) {
                    textState.index -= (innerText.length + 6); // 読み込みが間に合わない場合は1フレ待つ
                    return;
                }

                // 文字の描画位置（今文字を書いているまさにその場所）を取得
                const tx = textState.x;
                const ty = textState.y;

                // 数字の文字幅（桁数）を自動で1ドット単位で計算する
                const textWidth = this.textWidth(innerText);
                
                // お持ちのルート画像の元の幅をベースに、数字の長さに合わせて自動でジャストフィットさせる計算
                // ※お持ちの画像サイズに合わせて自動調整されます
                const targetWidth = bitmap.width + (textWidth - this.textWidth("2"));
                
                // ウィンドウのキャンバスに直接ルート画像を転記（スタンプ）する
                // ※ ty - 4 の数字を変えることで、上下の位置を1ドット単位で微調整できます
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, tx, ty - 4, targetWidth, bitmap.height);
            }

            // 画像の描画が終わったので、その上に重なるように数字を描く
            this.contents.drawText(innerText, textState.x, textState.y, this.textWidth(innerText), textState.height);
            textState.x += this.textWidth(innerText);
            return;
        }
        _Window_StatusBase_processEscapeCharacter.call(this, code, textState);
    };
})();