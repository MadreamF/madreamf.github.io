(function() { 
	let d3Script = document.createElement('script');
	// d3Script.src = 'https://d3js.org/d3.v5.min.js';
	d3Script.src = 'http://d3js.org/d3.v3.min.js';
	d3Script.async = false;
	document.head.appendChild(d3Script);

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
			this._paragr.setAttribute('class', 'paragraph');
			if( this.hasAttribute('innertext') ) {
				const text = this.getAttribute('innertext');
				this._paragr.textContent = text;
			} else {
				this._paragr.textContent = 'How are you?';
				this.setAttribute('innertext', 'How are you?');
			}
			
			shadowRoot.appendChild(this._paragr);
			
			this.$svg = document.createElement('svg');
			shadowRoot.appendChild(this.$svg);
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
		
		// get innertext() {
			// return this._innertext;
		// }
		// set innertext(value) {
			// this._innertext = value;
		// }
		
		render() {
			var width = 960,
				height = 500;

			var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
				root = nodes[0],
				color = d3.scale.category10();
			
			root.radius = 0;
			root.fixed = true;
			
			var force = d3.layout.force()
				.gravity(0.05)
				.charge(function(d, i) { return i ? 0 : -2000; })
				.nodes(nodes)
				.size([width, height]);
			
			force.start();
			
			this.$svg = d3.select("svg")
				.attr("width", width)
				.attr("height", height);
				// this.$svg.setAttribute("width", width);
				// this.$svg.setAttribute("height", height);
			
			this.$svg.selectAll("circle")
				.data(nodes.slice(1))
			.enter().append("circle")
				.attr("r", function(d) { return d.radius; })
				.style("fill", function(d, i) { return color(i % 3); });
			
			force.on("tick", function(e) {
			var q = d3.geom.quadtree(nodes),
				i = 0,
				n = nodes.length;
			
			while (++i < n) q.visit(this.collide(nodes[i]));
			
			this.$svg.selectAll("circle")
				.attr("cx", function(d) { return d.x; })
				.attr("cy", function(d) { return d.y; });
			});
			
			this.$svg.on("mousemove", function() {
			var p1 = d3.mouse(this);
			root.px = p1[0];
			root.py = p1[1];
			force.resume();
			});
		}
		
		collide(node) {
			var r = node.radius + 16,
				nx1 = node.x - r,
				nx2 = node.x + r,
				ny1 = node.y - r,
				ny2 = node.y + r;
			return function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== node)) {
				var x = node.x - quad.point.x,
					y = node.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = node.radius + quad.point.radius;
				if (l < r) {
					l = (l - r) / l * .5;
					node.x -= x *= l;
					node.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			};
		}
		
	}

	d3Script.onload = () => customElements.define("com-sap-sample-coloredbox", ColoredBox);
})();
//jQuery('body').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.bundle.js"></script>');