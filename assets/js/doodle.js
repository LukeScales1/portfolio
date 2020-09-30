let drawing = false;

const prev = {
	x: null,
	y: null
};
const curr = {...prev};

let canvas;
let ctx;
let model;
let newDoodle = false;
let resultBox;
let result;
let graph;
let graphBox;

window.onload = () => {
	tf.loadLayersModel("https://lukescales1.github.io/portfolio/assets/model/doodle-digit-classifier/tfjs/model.json")
		.then(r => {
			model = r;
			console.log('MNIST model loaded!', r);
			})
		.catch(e => console.log('Error loading model', e));

	canvas = document.getElementById('doodle-pad');
	ctx = canvas.getContext('2d');
	ctx.strokeStyle = '#ffffff';
	ctx.lineJoin = 'round';
	ctx.lineWidth = '12';

	resultBox = document.getElementById('results-box');
	result = document.getElementById('result');
	graphBox = document.getElementById('result-graph');

	canvas.addEventListener('mousedown', (e) => {
		// if (newDoodle) clearDoodle(); // uncomment this to clear after each predict
		drawing = true;

		updateCoordinates(e);
	});

	canvas.addEventListener('mousemove', (e) => {
		if (drawing === true) {
			updateCoordinates(e);
		}
	});

	canvas.addEventListener('mouseup', (e) => {
		stopDrawing(e);
	});

	canvas.addEventListener('mouseout', (e) => {
		stopDrawing(e);
	});
}

const stopDrawing = (e) => {
	if (drawing === true) {
		updateCoordinates(e);
		drawing = false;
		curr.x = curr.y = null;
	}
}

const updateCoordinates = (e) => {
	prev.x = curr.x ?? e.clientX - canvas.offsetLeft;
	prev.y = curr.y ?? e.clientY - canvas.offsetTop;
	curr.x = e.clientX - canvas.offsetLeft;
	curr.y = e.clientY - canvas.offsetTop;

	drawDoodle();
}

const drawDoodle = () => {
	ctx.beginPath();
	ctx.moveTo(prev.x, prev.y);
	ctx.lineTo(curr.x, curr.y);
	ctx.closePath();
	ctx.stroke();
}

const clearDoodle = () => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	hideResults();
	newDoodle = false;
}

const predictDoodle = async () => {
	const tensor = tf.browser
		.fromPixels(canvas)
		.resizeNearestNeighbor([28, 28])
		.mean(2)
		.expandDims(2)
		.expandDims()
		.toFloat()
		.div(255.0);

	const predictions = await model.predict(tensor).data();
	const bestGuess = await tf.argMax(predictions).data();
	showResults(bestGuess[0]);
	const resultArray = Array.from(predictions);
	makeGraph(resultArray);
	newDoodle = true;
}

const showResults = (x) => {
	result.textContent = x;
	resultBox.classList.remove('hide');
	graphBox.classList.remove('hide');
}

const hideResults = () => {
	resultBox.classList.add('hide');
	graphBox.classList.add('hide');
	graph.destroy();
}

const makeGraph = (data) => {
	if (newDoodle) graph.destroy();
	const labels = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	const context = graphBox.getContext('2d');
	graph = new Chart(context, {
		type: 'bar',
		data: {
			labels: labels,
			datasets: [
			{
				label: "Model Predictions (%)",
				backgroundColor: '#f50057',
				borderColor: 'rgb(255, 99, 132)',
				data: data,
			}]
		},
		options: {}
	});
}
