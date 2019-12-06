(function()  {
	let template = document.createElement("template");
	template.innerHTML = '<form id="form"><fieldset><legend>Colored Box Properties</legend><table><tr><td>Opacity</td><td><input id="bps_opacity" type="text" size="5" maxlength="5"></td></tr><tr><td>Inner text</td><td><input id="bps_innertext" type="text" size="5" maxlength="50"></td></tr></table><input type="submit" style="display:none;"></fieldset></form><style>:host {display: block;padding: 1em 1em 1em 1em;}</style>';

	class ColoredBoxBps extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							opacity: this.opacity,
							innertext: this.innertext
						}
					}
			}));
		}

		set opacity(newOpacity) {
			this._shadowRoot.getElementById("bps_opacity").value = newOpacity;
			console.log(newOpacity);
		}

		get opacity() {
			return this._shadowRoot.getElementById("bps_opacity").value;
		}
		
		set innertext(newInnertext) {
			this._shadowRoot.getElementById("bps_innertext").value = newInnertext;
			console.log(newInnertext);
		}
		
		get innertext() {
			return this._shadowRoot.getElementById("bps_innertext").value;
		}
	}

	customElements.define("com-sap-sample-coloredbox-bps", ColoredBoxBps);
})();