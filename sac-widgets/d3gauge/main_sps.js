(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Value</legend>
				<table>
					<tr>
						<td>Value</td>
						<td><input id="sps_value" type="text" size="10" maxlength="10"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
			</fieldset>
		</form>
		<style>
		:host {
			display: block;
			padding: 1em 1em 1em 1em;
		}
		</style>
	`;

	class D3GaugeSps extends HTMLElement {
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
							value: this.value
						}
					}
			}));
		}

		set value(newValue) {
			this._shadowRoot.getElementById("sps_value").value = newValue;
		}

		get value() {
			return this._shadowRoot.getElementById("sps_value").value;
		}
	}

	customElements.define("com-demo-d3gauge-sps", D3GaugeSps);
})();