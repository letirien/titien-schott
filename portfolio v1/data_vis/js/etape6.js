window.onload = async function () {
	'use strict';
	let options = {
		width: 1500,
		height: 600,
		padding: 20,
		bgcolor: 'lightgray',
	};
	let dynamic = document.querySelector('.dynamic-value');
	let divInfo = document.querySelector('.info')
	let currentArray = []

	let container = d3.select('#container');
	let svg = container
		.append('svg')
		.attr('width', options.width)
		.attr('height', options.height)
		.attr('style', 'background-color: ' + options.bgcolor);

	async function loadData(path) {
		let response = await fetch(path);
		let data = await response.json();
		return data;
	}
	let testdata = await loadData('./data/liste-et-localisation-des-musees-de-france.json');


	let filterArray = (filter) => {
		let final = []
		testdata.forEach(el => {
			let region = final.find(x => x[filter] === el.fields[filter])
			if (region) {
				region.counter++
			} else {
				final.push({
					[filter]: el.fields[filter],
					counter: 1
				})
			}
		})
		console.timeEnd('testArray')
		currentArray = final
		return final
	}
	filterArray('region')
	redraw(currentArray)
	let filters = Array.from(document.querySelector('.filter-container').children)
	filters.forEach(el => {

		el.addEventListener('click', () => {

			dynamic.innerHTML = el.dataset.filter + 's'
			filterArray(el.dataset.filter)
			deleteGraph()
			redraw(currentArray)


		})
	})


	function deleteGraph() {
		svg.selectAll('rect')
			.data([])
			.exit()
			.remove();

		svg.selectAll('text')
			.data([])
			.exit()
			.remove();
	}

	let mydata = await loadData(currentArray);



	function redraw(data) {
		let max = d3.max(data, (item) => item.counter);
		let selection = svg.selectAll('rect').data(data);
		let colorScale = d3.scaleLinear().domain([0, max]).range(['green', 'pink']);



		let rects =
			selection
			.enter()
			.append('rect')
		rects
			.attr('height', 0)
			.attr('width', (d) => (options.width - 2 * options.padding) / data.length)
			.attr(
				'x',
				(d, i) =>
				(i * (options.width - 2 * options.padding)) / data.length +
				options.padding
			)
			.attr('y', options.height - options.padding)
			.on('mouseover', (d, i) => {
				let textTabs = svg.selectAll('text')._groups[0];
				let el = textTabs[(textTabs.length / 2) + i];
				el.style.fontSize = "20px"
				el.style.fontWeight = "600"
				el.style.display = "block"
			})
			.on('mouseout', (d, i) => {

				let textTabs = svg.selectAll('text')._groups[0];
				let el = textTabs[(textTabs.length / 2) + i]
				el.style.fontSize = "11px"
				el.style.display = "none"
			})
			.on('click', (d) => {
				let current
				if (d.region) {
					current = d.region
				}
				if (d.departement) {
					current = d.departement
				}
				divInfo.innerHTML = current + ' il y a : ' + d.counter + ' musée(s)'
				console.log(d.counter)
			})
			.transition()
			.delay((d, i) => i * 50)
			.duration(500)
			.attr('height', (d) =>
				d.counter == 0 ?
				1 :
				((options.height - 2 * options.padding) * d.counter) / max
			)
			.attr('y', (d) =>
				d.counter == 0 ?
				options.height - options.padding - 5 :
				options.height -
				options.padding -
				((options.height - 2 * options.padding) * d.counter) / max
			)
			.attr('stroke', 'blue')
			.attr('fill', (d, i) => colorScale(d.counter));



		let text = svg.selectAll('text')

		function textAppear() {
			text
				.data(data)
				.enter()
				.append("text")
				// .style('display', 'none')
				.style('font-weight', '400')
				.style('font-size', '11px')
				.style('display', 'none')
				.attr('text-anchor', 'middle')
				.attr('fill', 'black')
				.attr(
					'x',
					(d, i) => {
						if (d.region == "AUVERGNE-RHÔNE-ALPES") {
							return (i * (options.width - 2 * options.padding)) / data.length +
								options.padding + 110
						} else {
							return (i * (options.width - 2 * options.padding)) / data.length +
								options.padding + ((options.width / data.length) / 2)
						}
					}
				)

				.attr('y', (d) =>
					d.counter == 0 ?
					options.height - options.padding - 1 : (
						options.height -
						options.padding -
						((options.height - 2 * options.padding) * d.counter) / max) + 20
				)
				.on('click', (d) => {
					let current
					if (d.region) {
						current = d.region
					}
					if (d.departement) {
						current = d.departement
					}
					divInfo.innerHTML = current + ' il y a : ' + d.counter + ' musée(s)'
					console.log(d.counter)
				})
				// .attr("tra", '90')
				.transition()
				.delay((d, i) => i * 50)
				.duration(500)
				.text(function (d) {
					if (d.region) {
						return d.region
					}
					if (d.departement) {
						return d.departement
					}
				});

		}

		setTimeout(textAppear, 600)

		text
			.data(data)
			.enter()
			.append("text")
			.attr('fill', 'black')
			.attr('font-size', 8)
			.attr(
				'x',
				(d, i) =>{
					if(d.region){
						return (i * (options.width - 2 * options.padding)) / data.length +
						options.padding * 2.6
					}
					else{
						return (i * (options.width - 2 * options.padding)) / data.length +
						options.padding 
					}
				}


			)
		//  .attr('x', 0)
			.attr('y', options.height - 5)
		// 	.attr('y', (d) =>
		// 	d.counter == 0 ?
		// 	options.height - options.padding - 5 :
		// 	options.height -
		// 	options.padding -
		// 	((options.height - 2 * options.padding) * d.counter) / max
		// )

			.text(function (d) {
				if (d.region) {
					return d.counter
				}
				if (d.departement) {
					return d.counter
				}
			})


	}


	redraw(mydata);
};