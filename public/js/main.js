// [refact] - то что надо переписать 


let canvas, 
	webgl,
	vertexShader,
	fragmentShader,
	shaderProgram,
	vertexPositionLocation,
	buffer,
	vertices = [
		-1.0, -1.0,
		1.0, 1.0,
		-1.0, 1.0,

		-1.0, 1.0, 
		1.0, -1.0,
		1.0, 1.0
	];


// Актуализация размера окна для канвас 
function resize(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// webgl.viewport(0, 0, canvas.width, canvas.height);

}


// отрисовка кадра 
function drawScene(){
	webgl.drawArrays(webgl.TRIANGLES, 0, 6);
}


// функция рендера кадра 
function render(){
	requestAnimationFrame(render);

	drawScene();
}


// функция получения шейдера 
function getShader(id){
	if(!id) return false

	let shaderDOMElement = document.getElementById(id),
		shaderSource = '',
		shader,
		line = shaderDOMElement.firstChild;
	

	// пробигаем по тегу контейнеру и собираем все текстовые ноды в одну строку
	while(line){
		// 3 - TEXT NODE
		if(line.nodeType == 3){
			shaderSource += line.textContent;
		}
		line = line.nextSibling;
	}

	// проверяем исходники какого шейдера к нам пришли, вершинный или фрагментный
	// и отправляем в соответствующую обработку
	if(shaderDOMElement.type === 'x-shader/x-vertex'){
		shader = compileShader(shaderSource, webgl.VERTEX_SHADER);
	}else if(shaderDOMElement.type === 'x-shader/x-fragment'){
		shader = compileShader(shaderSource, webgl.FRAGMENT_SHADER);
	}else{
		return null
	}

	return shader
}


// компилируем шейдер 
function compileShader(shaderSource, shaderType){
 
 	// refact
 	// по мойму тут должен быть shaderType (shader) 
	let shader = webgl.createShader(shaderType);

	webgl.shaderSource(shader, shaderSource);
	webgl.compileShader(shader);

	return shader;	

}

// инициализация функционала 
function init(){
	canvas = document.createElement('canvas');

	// refact
	webgl = canvas.getContext('webgl');

	// refact
	// компилируем шейдеры
	vertexShader = getShader('shader-vs');
	fragmentShader = getShader('shader-fs');


	// Создаем "програму";
	shaderProgram = webgl.createProgram();


	// Линкуем шейдеры к программе ([к какой программе], [какой шейдер])
	webgl.attachShader(shaderProgram, vertexShader);
	webgl.attachShader(shaderProgram, fragmentShader);

	// Применяем программу к контексту 
	webgl.linkProgram(shaderProgram);

	// Применяем программу 
	webgl.useProgram(shaderProgram);

	// Можно удалить исходники шейдеров для экономии памяти 
	webgl.deleteShader(vertexShader);
	webgl.deleteShader(fragmentShader);


	// положение вершин в памяти 
	vertexPositionLocation = webgl.getAttribLocation(shaderProgram, "aVertexPosition");

	// создаем буфер
	buffer = webgl.createBuffer();

	// указываем параметры 
	webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer); 

	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

	webgl.enableVertexAttribArray(vertexPositionLocation);

	webgl.vertexAttribPointer(vertexPositionLocation, 2, webgl.FLOAT, false, 0, 0);


	document.body.appendChild(canvas);

	addEventListener("resize", resize);

	resize();

	render();
}


init();