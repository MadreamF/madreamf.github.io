(function() { 
	let template = document.createElement("template");
	//template.innerHTML = "<style>:host {border-radius: 25px;border-width: 4px;border-color: black;border-style: solid;display: block;} </style> ";
	//template.innerHTML = '<canvas id="myChart" width="400" height="400"></canvas><script>var ctx=document.getElementById("myChart"),myRadarChart=new Chart(ctx,{type:"radar",data:{labels:["Running","Swimming","Eating","Cycling"],datasets:[{data:[20,10,4,2],fill:1},{data:[28,15,2,25]}]},options:{scale:{angleLines:{display:!1},ticks:{suggestedMin:10,suggestedMax:100}}}});</script>';
	template.innerHTML = '<style></style>';
	
	class ColoredBox extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};
			this._innertext = 'Initial text';
			
			this._paragr = document.createElement('p');
			paragr.setAttribute('class', 'paragraph');
			if( this.hasAttribute('innertext') ) {
				const text = this.getAttribute('innertext');
				paragr.textContent = text;
			} else {
				paragr.textContent = 'How are you?';
				this.setAttribute('innertext', 'How are you?');
			}
			
			shadowRoot.appendChild(paragr);
		}
		
		// attributeChangedCallback(name, oldValue, newValue) {
			// console.log('Custom square element attributes changed.');
			// this.shadowRoot.querySelector(".paragraph").textContent = this.getAttribute('innertext');
			
		// }

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("color" in changedProperties) {
				this.style["background-color"] = changedProperties["color"];
			}
			if ("opacity" in changedProperties) {
				this.style["opacity"] = changedProperties["opacity"];
			}
			if ("innertext" in changedProperties) {
				//this.setAttribute("innertext", changedProperties["innertext"]);
				//this.setAttribute("innertext", 'Changed!');
				console.log('innertext was in changedProperties');
				this.style["color"] = changedProperties["innertext"];
				this._paragr.textContent = changedProperties["innertext"];
			}
		}
		
		get innertext() {
			return this._innertext;
		}
		set innertext(value) {
			this._innertext = value;
		}
		
	}

	customElements.define("com-sap-sample-coloredbox", ColoredBox);
})();
//jQuery('body').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.js"></script>');