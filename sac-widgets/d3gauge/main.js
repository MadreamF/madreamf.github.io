(function() { 

	let d3Script = document.createElement('script');
	// d3Script.src = 'https://d3js.org/d3.v5.min.js';
	d3Script.src = 'https://d3js.org/d3.v3.min.js';
	d3Script.async = false;
	document.head.appendChild(d3Script);

	// let testCSS = document.createElement('link');
	// testCSS.href = 'https://madreamf.github.io/test.css';
	// testCSS.type = 'text/css';
	// testCSS.rel = 'stylesheet';
	// document.head.appendChild(testCSS);

	let template = document.createElement("template");
	template.innerHTML = `
		<div id="power-gauge"></div>
	`;

	var gauge = function(container, configuration) {
		var that = {};
		var config = {
			size						: 200,
			clipWidth					: 200,
			clipHeight					: 110,
			ringInset					: 20,
			ringWidth					: 20,
			
			pointerWidth				: 10,
			pointerTailLength			: 5,
			pointerHeadLengthPercent	: 0.9,
			
			minValue					: 0,
			maxValue					: 10,
			
			minAngle					: -90,
			maxAngle					: 90,
			
			transitionMs				: 750,
			
			majorTicks					: 5,
			labelFormat					: d3.format(',g'),
			labelInset					: 10,
			
			arcColorFn					: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
		};
		var range = undefined;
		var r = undefined;
		var pointerHeadLength = undefined;
		var value = 0;
		
		var svg = undefined;
		var arc = undefined;
		var scale = undefined;
		var ticks = undefined;
		var tickData = undefined;
		var pointer = undefined;
	
		var donut = d3.layout.pie();
		
		function deg2rad(deg) {
			return deg * Math.PI / 180;
		}
		
		function newAngle(d) {
			var ratio = scale(d);
			var newAngle = config.minAngle + (ratio * range);
			return newAngle;
		}
		
		function configure(configuration) {
			var prop = undefined;
			for ( prop in configuration ) {
				config[prop] = configuration[prop];
			}
			
			range = config.maxAngle - config.minAngle;
			r = config.size / 2;
			pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);
	
			// a linear scale that maps domain values to a percent from 0..1
			scale = d3.scale.linear()
				.range([0,1])
				.domain([config.minValue, config.maxValue]);
				
			ticks = scale.ticks(config.majorTicks);
			tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});
			
			arc = d3.svg.arc()
				.innerRadius(r - config.ringWidth - config.ringInset)
				.outerRadius(r - config.ringInset)
				.startAngle(function(d, i) {
					var ratio = d * i;
					return deg2rad(config.minAngle + (ratio * range));
				})
				.endAngle(function(d, i) {
					var ratio = d * (i+1);
					return deg2rad(config.minAngle + (ratio * range));
				});
		}
		that.configure = configure;
		
		function centerTranslation() {
			return 'translate('+r +','+ r +')';
		}
		
		function isRendered() {
			return (svg !== undefined);
		}
		that.isRendered = isRendered;
		
		function render(newValue, currentValue) {
			if( !isRendered ) {
				svg = window.d3.select(container)
				.append('svg:svg')
					.attr('class', 'gauge')
					.attr('width', config.clipWidth)
					.attr('height', config.clipHeight);
			} else {
				window.d3.select(container).selectAll("*").remove();
				svg = window.d3.select(container)
				.append('svg:svg')
					.attr('class', 'gauge')
					.attr('width', config.clipWidth)
					.attr('height', config.clipHeight);
			}
			
			
			var centerTx = centerTranslation();
			
			var arcs = svg.append('g')
					.attr('class', 'arc')
					.attr('transform', centerTx);
			
			arcs.selectAll('path')
					.data(tickData)
				.enter().append('path')
					.attr('fill', function(d, i) {
						return config.arcColorFn(d * i);
					})
					.attr('d', arc);
			
			var lg = svg.append('g')
					.attr('class', 'label')
					.attr('transform', centerTx);
			lg.selectAll('text')
					.data(ticks)
				.enter().append('text')
					.attr('transform', function(d) {
						var ratio = scale(d);
						var newAngle = config.minAngle + (ratio * range);
						return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
					})
					.text(config.labelFormat);
	
			var lineData = [ [config.pointerWidth / 2, 0], 
							[0, -pointerHeadLength],
							[-(config.pointerWidth / 2), 0],
							[0, config.pointerTailLength],
							[config.pointerWidth / 2, 0] ];
			var pointerLine = d3.svg.line().interpolate('monotone');
			var pg = svg.append('g').data([lineData])
					.attr('class', 'pointer')
					.attr('transform', centerTx);
					
            var currentAngle = config.minAngle;
			if( typeof currentValue !== 'undefined') {
				var currentRatio = scale(currentValue);
				currentAngle = config.minAngle + (currentRatio * range);
			}
			pointer = pg.append('path')
				.attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
				.attr('transform', 'rotate(' + currentAngle +')');
				
			update(newValue === undefined ? 0 : newValue);
		}
		that.render = render;
		
		function update(newValue, currentValue, newConfiguration) {
			if ( newConfiguration  !== undefined) {
				configure(newConfiguration);
			}
			var ratio = scale(newValue);
			//var currentRatio = scale(currentValue);
			//current_angle = ((typeof current_angle === 'undefined') ? config.minAngle: current_angle)
			var newAngle = config.minAngle + (ratio * range);
			pointer.transition()
				.duration(config.transitionMs)
				.ease('elastic')
				.attr('transform', 'rotate(' +newAngle +')');
		}
		that.update = update;
	
		configure(configuration);
		
		return that;
	};

	class D3Gauge extends HTMLElement {
		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			//this._container = this._shadowRoot.querySelector('#power-gauge');

			if(d3) {
				var para = document.createElement('p');
				this._shadowRoot.appendChild(para);
			} else {
				var lk = document.createElement('a');
				this._shadowRoot.appendChild(lk);
			}
			
			//this.$container = this._shadowRoot.querySelector('#power-gauge');			
			//this.$svg = shadowRoot.querySelector('svg');
			
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			
			this._props = {};
		}
		
		render(newVal, currentVal, min, max, transitionMs, colorFrom, colorTo, majorTicks) {
			var powerGauge = gauge(this._shadowRoot, {
				size: 300,
				clipWidth: 300,
				clipHeight: 300,
				ringWidth: 60,
				minValue: min,
				maxValue: max,
				transitionMs: transitionMs,
				majorTicks: majorTicks,
				arcColorFn: d3.interpolateHsl(d3.rgb(colorFrom), d3.rgb(colorTo))
			});
			powerGauge.render(newVal, currentVal);
			powerGauge.update(newVal, currentVal);
		}
		  
		
		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("value" in changedProperties) {
				this.$currentValue = this.$value;
				this.$value = changedProperties["value"];
			}
			if ("minValue" in changedProperties) {
				this.$minValue = changedProperties["minValue"];
			}
			if ("maxValue" in changedProperties) {
				this.$maxValue = changedProperties["maxValue"];
			}
			if ("transitionMs" in changedProperties) {
				this.$transitionMs = changedProperties["transitionMs"];
			}
			if ("colorFrom" in changedProperties) {
				this.$colorFrom = changedProperties["colorFrom"];
			}
			if ("colorTo" in changedProperties) {
				this.$colorTo = changedProperties["colorTo"];
			}
			if ("majorTicks" in changedProperties) {
				this.$majorTicks = changedProperties["majorTicks"];
			}
			
			this.render(this.$value, this.$currentValue, this.$minValue, this.$maxValue, this.$transitionMs, this.$colorFrom, this.$colorTo, this.$majorTicks);
		}
	}
	
	d3Script.onload = () => customElements.define("com-demo-d3gauge", D3Gauge);
})();