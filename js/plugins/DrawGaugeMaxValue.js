// DrawGaugeMaxValue.js Ver.1.1.0
// MIT License (C) 2023 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ
* @orderBefore LayoutForWvga
* @plugindesc ゲージに最大値を表示します。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/517817776.html
* @help
* [更新履歴]
* 2023/01/22：Ver.1.0.0　公開。
* 2025/08/28：Ver.1.0.1　微修正。
* 2025/08/29：Ver.1.1.0　外観を修正。
*
* @param digits
* @text 桁
* @desc これを基準にスペースを調節します。
* @type number
* @default 4
*
* @param width
* @text 幅
* @desc この幅以上の場合は最大値を描写します。
* @type number
* @default 120
*
* @param fontSize
* @text フォントサイズ
* @desc 数値の大きさを変更します。
* 0でデフォルト。
* @type number
* @default 16
*
* @param inBattle
* @text 戦闘時に表示
* @desc 戦闘時に最大値を表示します。
* @type boolean
* @default false
*
* @param types
* @text タイプ
* @desc ここに含まれるタイプのゲージで最大値を描写します。
* @type string[]
* @default ["hp","mp"]
*
*/

'use strict';
{

	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const params = PluginManager.parameters(pluginName);
	const width = Number(params["width"]);
	const padZero = "".padStart(Number(params["digits"] || 4), 0);
	const fontSize = Number(params["fontSize"]);
	const inBattle = params["inBattle"] === "true";
	const types = new Set(JSON.parse(params["types"] || "[]"));

	const _Sprite_Gauge_drawValue = Sprite_Gauge.prototype.drawValue;	
	Sprite_Gauge.prototype.drawValue = function() {
		if (types.has(this._statusType) && (inBattle || !$gameParty.inBattle()) && this.bitmapWidth() >= width) {
			const currentValue = this.currentValue();
			const currentMaxValue = this.currentMaxValue();
			const width = this.bitmapWidth();
			const height = this.textHeight();
			this.setupValueFont();
			const maxWidth = this.bitmap.measureTextWidth(padZero);
			const slashWidth = this.bitmap.measureTextWidth("/");
			this.bitmap.drawText(currentValue, width-maxWidth*2-slashWidth, 0, maxWidth, height, "right");
			this.bitmap.drawText("/", width-maxWidth-slashWidth, 0, slashWidth, height, "right");
			this.bitmap.drawText(currentMaxValue, width-maxWidth, 0, maxWidth, height, "right");
		} else {
			_Sprite_Gauge_drawValue.call(this);
		}
	};

	Sprite_Gauge.prototype.gaugeHeight = function() {
		if (this._statusType === "time") {
			return 12;
		} else {
			return 9;
		}
	};

	Sprite_Gauge.prototype.gaugeX = function() {
		if (this._statusType === "time") {
			return 0;
		} else {
			return this.measureLabelWidth() + 4;
		}
	};

	Sprite_Gauge.prototype.labelFontSize = function() {
		return $gameSystem.mainFontSize() - 6;
	};

	if (fontSize) {
		Sprite_Gauge.prototype.valueFontSize = function() {
			return fontSize;
		};
	}
}