(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Params</legend>
				<table>
					<tr>
						<td>Value</td>
						<td><input id="bps_value" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>Min Value</td>
						<td><input id="bps_minvalue" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>Max Value</td>
						<td><input id="bps_maxvalue" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>Transitions Miliseconds</td>
						<td><input id="bps_transition" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>Color From</td>
						<td><input id="bps_colorfrom" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>Color To</td>
						<td><input id="bps_colorto" type="text" size="10" maxlength="10"></td>
					</tr>
					<tr>
						<td>Bins</td>
						<td><input id="bps_majorticks" type="text" size="10" maxlength="10"></td>
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

	class D3GaugeBps extends HTMLElement {
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
							value: this.value,
							minValue: this.minValue,
							maxValue: this.maxValue,
							transitionMs: this.transition,
							colorFrom: this.colorFrom,
							colorTo: this.colorTo,
							majorTicks: this.majorTicks
						}
					}
			}));
		}

		set value(newValue) {
			this._shadowRoot.getElementById("bps_value").value = newValue;
		}

		get value() {
			return this._shadowRoot.getElementById("bps_value").value;
		}

		set minValue(newValue) {
			this._shadowRoot.getElementById("bps_minvalue").value = newValue;
		}

		get minValue() {
			return this._shadowRoot.getElementById("bps_minvalue").value;
		}

		set maxValue(newValue) {
			this._shadowRoot.getElementById("bps_maxvalue").value = newValue;
		}

		get maxValue() {
			return this._shadowRoot.getElementById("bps_maxvalue").value;
		}

		set transition(newValue) {
			this._shadowRoot.getElementById("bps_transition").value = newValue;
		}

		get transition() {
			return this._shadowRoot.getElementById("bps_transition").value;
		}
		
		set colorFrom(newValue) {
			this._shadowRoot.getElementById("bps_colorfrom").value = newValue;
		}

		get colorFrom() {
			return this._shadowRoot.getElementById("bps_colorfrom").value;
		}

		set colorTo(newValue) {
			this._shadowRoot.getElementById("bps_colorto").value = newValue;
		}

		get colorTo() {
			return this._shadowRoot.getElementById("bps_colorto").value;
		}

		set majorTicks(newValue) {
			this._shadowRoot.getElementById("bps_majorticks").value = newValue;
		}

		get majorTicks() {
			return this._shadowRoot.getElementById("bps_majorticks").value;
		}
	}

	customElements.define("com-demo-d3gauge-bps", D3GaugeBps);
})();