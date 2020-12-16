import _app from './app.js';
import QRCodeAlg from './QRCodeAlg.js';
const ShreUserPosterBackgroundKey = 'ShrePosterBackground_'; // 背景图片缓存名称前缀

export default function getSharePoster(obj) {
	return new Promise(async (resolve, reject) => {
		try {
			const result1 = await returnPromise(obj);
			resolve(result1);
		} catch (e) {
			//TODO handle the exception
			removePosterStorage(obj.type);
			try {
				_app.log('------------清除缓存后, 开始第二次尝试------------');
				const result2 = await returnPromise(obj);
				resolve(result2);
			} catch (e) {
				//TODO handle the exception
				reject(e);
			}
		}
	})

}

function returnPromise(obj) {
	let {
		type,
		background,
		posterCanvasId,
		backgroundImage,
		reserve,
		textArray,
		qrCodeArray,
		imagesArray,
		setCanvasWH,
		setCanvasToTempFilePath,
		setDraw,
		bgScale,
		Context
	} = obj;
	return new Promise(async (rs, rj) => {
		try {
			_app.showLoading('正在准备海报数据');
			if (!Context)
				Context = uni.createCanvasContext(posterCanvasId);
			let bgObj;
			if (background && background.width && background.height) {
				bgObj = background;
			} else {
				bgObj = await getShreUserPosterBackground({
					backgroundImage,
					type
				});
			}
			// 为了ios 缩放一些
			bgScale = bgScale || .75;
			bgObj.width = bgObj.width * bgScale;
			bgObj.height = bgObj.height * bgScale;

			_app.log('获取背景图信息对象成功:' + JSON.stringify(bgObj));
			const params = {
				bgObj,
				type,
				bgScale
			};
			if (setCanvasWH && typeof(setCanvasWH) == 'function') setCanvasWH(params);
			if (imagesArray) {
				if (typeof(imagesArray) == 'function')
					imagesArray = imagesArray(params);
				_app.showLoading('正在生成需绘制图片的临时路径');
				imagesArray = await setImagesArray(imagesArray);
				_app.hideLoading();
			}
			if (textArray) {
				if (typeof(textArray) == 'function')
					textArray = textArray(params);
				textArray = setTextArray(Context, textArray);

			}
			if (qrCodeArray) {
				if (typeof(qrCodeArray) == 'function')
					qrCodeArray = qrCodeArray(params);
				_app.showLoading('正在生成需绘制图片的临时路径');
				for (let i = 0; i < qrCodeArray.length; i++) {
					if (qrCodeArray[i].image)
						qrCodeArray[i].image = await _app.downloadFile_PromiseFc(qrCodeArray[i].image);
				}
				_app.hideLoading();
			}
			const poster = await drawShareImage({
				Context,
				type,
				posterCanvasId,
				reserve,
				textArray,
				imagesArray,
				bgObj,
				qrCodeArray,
				setCanvasToTempFilePath,
				setDraw,
				bgScale
			});
			_app.hideLoading();
			rs({
				bgObj,
				poster,
				type
			});
		} catch (e) {
			//TODO handle the exception
			rj(e);
		}
	});
}

function drawShareImage(obj) { //绘制海报方法
	let {
		Context,
		type,
		posterCanvasId,
		reserve,
		bgObj,
		textArray,
		qrCodeArray,
		imagesArray,
		setCanvasToTempFilePath,
		setDraw,
		bgScale
	} = obj;
	return new Promise((rs, rj) => {
		try {
			_app.showLoading('正在绘制海报');
			if (bgObj && bgObj.path) {
				Context.drawImage(bgObj.path, 0, 0, bgObj.width, bgObj.height);
			} else {
				if (bgObj.backgroundColor) {
					Context.setFillStyle(bgObj.backgroundColor)
					Context.fillRect(0, 0, bgObj.width, bgObj.height);
				}
			}

			_app.showLoading('准备绘制图片');
			drawImage(Context, imagesArray);

			_app.showLoading('准备绘制自定义内容');
			if (setDraw && typeof(setDraw) == 'function') setDraw({
				Context,
				bgObj,
				type,
				bgScale
			});

			_app.showLoading('准备绘制文本');
			drawText(Context, textArray, bgObj);

			_app.showLoading('准备绘制二维码');
			if (qrCodeArray && qrCodeArray.length > 0) {
				for (let i = 0; i < qrCodeArray.length; i++) {
					drawQrCode(Context, qrCodeArray[i]);
				}
			}
			_app.showLoading('绘制中')
			Context.draw((typeof(reserve) == 'boolean' ? reserve : false), () => {
				_app.showLoading('准备输出图片');
				let setObj = {};
				if (setCanvasToTempFilePath && typeof(setCanvasToTempFilePath) == 'function')
					setObj = setCanvasToTempFilePath(bgObj, type);
				// #ifdef H5
				rs({
					tempFilePath: document.querySelector(`uni-canvas[canvas-id=${posterCanvasId}]>canvas`).toDataURL(
						'image/jpeg', setObj.quality || .8)
				});
				// #endif
				// #ifndef H5
				const data = {
					x: 0,
					y: 0,
					width: bgObj.width,
					height: bgObj.height,
					destWidth: bgObj.width * 2, // 若H5使用这里请不要乘以二
					destHeight: bgObj.height * 2, // 若H5使用这里请不要乘以二
					quality: .8,
					...setObj
				};
				_app.log('canvasToTempFilePath的data对象:' + JSON.stringify(data));
				_app.showLoading('正在输出图片');
				const canvasToTempFilePathFn = function () {
					uni.canvasToTempFilePath({ //输出为图片
						...data,
						canvasId: posterCanvasId,
						success(res) {
							_app.hideLoading();
							rs(res);
						},
						fail(err) {
							_app.hideLoading();
							_app.log('输出图片失败:' + JSON.stringify(err));
							rj('输出图片失败:' + JSON.stringify(err))
						}
					})
				}
				// #ifdef MP
				let textLength = 0;
				if(qrCodeArray) {
					qrCodeArray.forEach(item=>{
						if(item.text) {
							textLength = Number(item.text.length);
						}
					})
				}
				setTimeout(canvasToTempFilePathFn, textLength * 10);
				// #endif
				// #ifndef MP
				canvasToTempFilePathFn();
				// #endif
				// #endif
			});
		} catch (e) {
			//TODO handle the exception
			_app.hideLoading();
			rj(e);
		}
	});
}

export function setTextArray(Context, textArray) { // 设置文本数据
	for (let i = 0; i < textArray.length; i++) {
		const textItem = textArray[i];
		_app.log('字符串信息-初始化之前:' + JSON.stringify(textArray[i]));
		if (textItem.text && typeof(textItem.text) == "string" && textItem.text.length > 0) {
			textItem.alpha = textItem.alpha !== undefined ? textItem.alpha : 1;
			textItem.color = textItem.color || 'black';
			textItem.size = textItem.size !== undefined ? textItem.size : 10;
			textItem.textAlign = textItem.textAlign || 'left';
			textItem.textBaseline = textItem.textBaseline || 'middle';
			textItem.dx = textItem.dx || 0;
			textItem.dy = textItem.dy || 0;
			textItem.size = Math.ceil(Number(textItem.size));
			_app.log('字符串信息-初始化默认值后:' + JSON.stringify(textArray[i]));
			const textLength = countTextLength(Context, {
				text: textItem.text,
				size: textItem.size
			});
			_app.log('字符串信息-初始化时的文本长度:' + textLength);
			let infoCallBackObj = {};
			if (textItem.infoCallBack && typeof(textItem.infoCallBack) === 'function')
				infoCallBackObj = textItem.infoCallBack(textLength);
			textArray[i] = {
				...textItem,
				textLength,
				...infoCallBackObj
			}
			_app.log('字符串信息-infoCallBack后:' + JSON.stringify(textArray[i]));
		}
	}
	return textArray;
}

function countTextLength(Context, obj) {
	_app.log('进入计算文字长度, obj:' + JSON.stringify(obj));
	const {
		text,
		size
	} = obj;
	Context.setFontSize(size);
	let textLength = Context.measureText(text); // 官方文档说 App端自定义组件编译模式暂时不可用measureText方法
	_app.log('measureText计算文字长度, textLength:' + JSON.stringify(textLength));
	textLength = textLength && textLength.width ? textLength.width : 0;
	if (!textLength) {
		let l = 0;
		for (let j = 0; j < text.length; j++) {
			let t = text.substr(j, 1);
			if (/[\u4e00-\u9fa5]/.test(t)) {
				l += 1;
			} else {
				if (/[A-Za-z0-9]/.test(t)) {
					l += 0.75;
				} else {
					let c = text.charAt(j);
					if (/^[\u0000-\u00ff]$/.test(c)) //匹配双字节
					{
						l += 0.2;
					} else {
						l += 1;
					}
				}
			}
		}
		textLength = l * size;
	}
	return textLength;
}

export function setImagesArray(imagesArray) { // 设置图片数据
	return new Promise(async (resolve, rejcet) => {
		try {
			for (let i = 0; i < imagesArray.length; i++) {
				if (imagesArray[i].url) {
					let imgUrl = imagesArray[i].url;
					imgUrl = await _app.downloadFile_PromiseFc(imgUrl);
					imagesArray[i].url = imgUrl;
					const imageInfo = await _app.getImageInfo_PromiseFc(imgUrl);
					if (imagesArray[i].infoCallBack && typeof(imagesArray[i].infoCallBack) === 'function') {
						imagesArray[i] = {
							...imagesArray[i],
							...imagesArray[i].infoCallBack(imageInfo)
						};
					}
					imagesArray[i].dx = imagesArray[i].dx || 0;
					imagesArray[i].dy = imagesArray[i].dy || 0;
					imagesArray[i].dWidth = imagesArray[i].dWidth || imageInfo.width;
					imagesArray[i].dHeight = imagesArray[i].dHeight || imageInfo.height;
					imagesArray[i] = {
						...imagesArray[i],
						imageInfo
					}
				}
			}
			resolve(imagesArray);
		} catch (e) {
			//TODO handle the exception
			rejcet(e);
		}
	})
}

export function drawText(Context, textArray, bgObj) { // 先遍历换行再绘制
	const newArr = [];
	if (textArray && textArray.length > 0) {
		for (let j = 0; j < textArray.length; j++) {
			const textItem = textArray[j];
			if (textItem.text && textItem.lineFeed) {
				let lineNum = -1,
					maxWidth = bgObj.width,
					lineHeight = textItem.size,
					dx = textItem.dx;
				if (textItem.lineFeed instanceof Object) {
					const lineFeed = textItem.lineFeed;
					lineNum = (lineFeed.lineNum !== undefined && typeof(lineFeed.lineNum) === 'number') && lineFeed.lineNum >= 0 ?
						lineFeed.lineNum : lineNum;
					maxWidth = (lineFeed.maxWidth !== undefined && typeof(lineFeed.maxWidth) === 'number') ? lineFeed.maxWidth :
						maxWidth;
					lineHeight = (lineFeed.lineHeight !== undefined && typeof(lineFeed.lineHeight) === 'number') ? lineFeed.lineHeight :
						lineHeight;
					dx = (lineFeed.dx !== undefined && typeof(lineFeed.dx) === 'number') ? lineFeed.dx : dx;
				}
				const chr = (textItem.text).split("");
				let temp = "";
				const row = [];
				//循环出几行文字组成数组
				for (let a = 0, len = chr.length; a < len; a++) {
					if (countTextLength(Context, {
							text: temp,
							size: textItem.size
						}) <= maxWidth && countTextLength(Context, {
							text: (temp + chr[a]),
							size: textItem.size
						}) <= maxWidth) {
						temp += chr[a];
						if (a == (chr.length - 1)) {
							row.push(temp);
						}
					} else {
						row.push(temp);
						temp = chr[a];
					}
				}
				_app.log('循环出的文字数组:' + JSON.stringify(row));
				//只显示几行 变量间距lineHeight  变量行数lineNum
				let allNum = (lineNum >= 0 && lineNum < row.length) ? lineNum : row.length;

				for (let i = 0; i < allNum; i++) {
					let str = row[i];
					if (i == (allNum - 1) && allNum < row.length) {
						str = str.substring(0, str.length - 1) + '...';
					}
					const obj = { ...textItem,
						text: str,
						dx: i === 0 ? textItem.dx : (dx >= 0 ? dx : textItem.dx),
						dy: textItem.dy + (i * lineHeight),
						textLength: countTextLength(Context, {
							text: str,
							size: textItem.size
						})
					};
					_app.log('重新组成的文字对象:' + JSON.stringify(obj));
					newArr.push(obj);
				}
			} else {
				newArr.push(textItem);
			}
		}
	}
	drawTextFc(Context, newArr);
}

function setFont(textItem = {}) {
	if(textItem.font && typeof(textItem.font) === 'string') {
		_app.log(textItem.font)
		return textItem.font;
	}else{
		let fontStyle = 'normal';
		let fontVariant = 'normal';
		let fontWeight = 'normal';
		let fontSize = textItem.size || 10;
		let fontFamily = 'sans-serif';
		fontSize = Math.ceil(Number(fontSize));
		if(textItem.fontStyle && typeof(textItem.fontStyle) === 'string')
			fontStyle = textItem.fontStyle.trim();
		if(textItem.fontVariant && typeof(textItem.fontVariant) === 'string')
			fontVariant = textItem.fontVariant.trim();
		if(textItem.fontWeight && (typeof(textItem.fontWeight) === 'string' || typeof(textItem.fontWeight) === 'number'))
			fontWeight = textItem.fontWeight.trim();
		if(textItem.fontFamily && typeof(textItem.fontFamily) === 'string')
			fontFamily = textItem.fontFamily.trim();
		return fontStyle + ' ' + 
			   fontVariant + ' ' + 
			   fontWeight + ' ' + 
			   fontSize + 'px' + ' ' + 
			   fontFamily;
	}
}

function drawTextFc(Context, textArray) { // 绘制文本
	if (textArray && textArray.length > 0) {
		for (let i = 0; i < textArray.length; i++) {
			const textItem = textArray[i];
			if (textItem instanceof Object && textItem.text) {
				Context.font = setFont(textItem);
				Context.setFillStyle(textItem.color);
				Context.setGlobalAlpha(textItem.alpha);
				Context.setTextAlign(textItem.textAlign);
				Context.setTextBaseline(textItem.textBaseline);
				Context.fillText(textItem.text, textItem.dx, textItem.dy);
				if (textItem.lineThrough && textItem.lineThrough instanceof Object) {
					_app.log('有删除线');
					let lineThrough = textItem.lineThrough;
					lineThrough.alpha = lineThrough.alpha !== undefined ? lineThrough.alpha : textItem.alpha;
					lineThrough.style = lineThrough.style || textItem.color;
					lineThrough.width = lineThrough.width !== undefined ? lineThrough.width : textItem.size / 10;
					lineThrough.cap = lineThrough.cap !== undefined ? lineThrough.cap : 'butt';
					_app.log('删除线对象:' + JSON.stringify(lineThrough));
					Context.setGlobalAlpha(lineThrough.alpha);
					Context.setStrokeStyle(lineThrough.style);
					Context.setLineWidth(lineThrough.width);
					Context.setLineCap(lineThrough.cap);
					let mx, my;
					switch (textItem.textAlign) {
						case 'left':
							mx = textItem.dx;
							break;
						case 'center':
							mx = textItem.dx - (textItem.textLength) / 2;
							break;
						default:
							mx = textItem.dx - (textItem.textLength);
							break;
					}
					switch (textItem.textBaseline) {
						case 'top':
							my = textItem.dy + (textItem.size * .5);
							break;
						case 'middle':
							my = textItem.dy;
							break;
						default:
							my = textItem.dy - (textItem.size * .5);
							break;
					}
					Context.beginPath();
					Context.moveTo(mx, my);
					Context.lineTo(mx + textItem.textLength, my);
					Context.stroke();
					Context.closePath();
					_app.log('删除线完毕');
				}
				Context.setGlobalAlpha(1);
				Context.font = '10px sans-serif';
			}
		}
	}
}

export function drawImage(Context, imagesArray) { // 绘制图片
	if (imagesArray && imagesArray.length > 0) {
		for (let i = 0; i < imagesArray.length; i++) {
			let img = imagesArray[i];
			_app.log('imageArrayItem: ' + JSON.stringify(img));
			if (img.url) {
				if (img.circleSet) {
					setImageCircle(Context, img);
				} else if (img.roundRectSet) {
					setImageRoundRect(Context, img);
				}
				if (img.dWidth && img.dHeight && img.sx && img.sy && img.sWidth && img.sHeight) {
					Context.drawImage(img.url, img.dx || 0, img.dy || 0,
						img.dWidth || false, img.dHeight || false,
						img.sx || false, img.sy || false,
						img.sWidth || false, img.sHeight || false);
				} else if (img.dWidth && img.dHeight) {
					Context.drawImage(img.url, img.dx || 0, img.dy || 0,
						img.dWidth || false, img.dHeight || false);
				} else {
					Context.drawImage(img.url, img.dx || 0, img.dy || 0);
				}
				if (img.circleSet || img.roundRectSet) {
					Context.restore();
				}

			}
		}
	}
}

function setImageCircle(Context, obj) {
	Context.save();
	let {
		dx,
		dy,
		dWidth,
		dHeight,
		circleSet,
		imageInfo
	} = obj;
	let x, y, r;
	if (typeof circleSet === 'object') {
		x = circleSet.x;
		y = circleSet.y;
		r = circleSet.r;
	}
	if (!r) {
		let d;
		d = dWidth > dHeight ? dHeight : dWidth;
		r = d / 2;
	}

	 x = x?dx + x:(dx || 0) + r;
	 y = y?dy + y:(dy || 0) + r;
	Context.beginPath();
	Context.arc(x, y, r, 0, 2 * Math.PI, false);
	Context.clip();
	Context.closePath();
}

function setImageRoundRect(Context, obj) { // 绘制矩形
	Context.save();
	let {
		dx,
		dy,
		dWidth,
		dHeight,
		roundRectSet,
		imageInfo
	} = obj;
	let r;
	if (typeof roundRectSet === 'object') {
		r = roundRectSet.r;
	}
	r = r || dWidth * .1;

	if (dWidth < 2 * r) {
		r = dWidth / 2;
	}
	if (dHeight < 2 * r) {
		r = dHeight / 2;
	}
	Context.beginPath();
	Context.moveTo(dx + r, dy);
	Context.arcTo(dx + dWidth, dy, dx + dWidth, dy + dHeight, r);
	Context.arcTo(dx + dWidth, dy + dHeight, dx, dy + dHeight, r);
	Context.arcTo(dx, dy + dHeight, dx, dy, r);
	Context.arcTo(dx, dy, dx + dWidth, dy, r);
	Context.clip();
	Context.closePath();
}

export function drawQrCode(Context, qrCodeObj) { //生成二维码方法， 参考了 诗小柒 的二维码生成器代码
	_app.showLoading('正在生成二维码');
	let qrcodeAlgObjCache = [];
	let options = {
		text: qrCodeObj.text || '', // 生成内容
		size: qrCodeObj.size || 200, // 二维码大小
		background: qrCodeObj.background || '#ffffff', // 背景色
		foreground: qrCodeObj.foreground || '#000000', // 前景色
		pdground: qrCodeObj.pdground || '#000000', // 定位角点颜色
		correctLevel: qrCodeObj.correctLevel || 3, // 容错级别
		image: qrCodeObj.image || '', // 二维码图标
		imageSize: qrCodeObj.imageSize || 40, // 二维码图标大小
		dx: qrCodeObj.dx || 0, // x轴距离
		dy: qrCodeObj.dy || 0 // y轴距离
	}
	let qrCodeAlg = null;
	let d = 0;
	for (var i = 0, l = qrcodeAlgObjCache.length; i < l; i++) {
		d = i;
		if (qrcodeAlgObjCache[i].text == options.text && qrcodeAlgObjCache[i].text.correctLevel == options.correctLevel) {
			qrCodeAlg = qrcodeAlgObjCache[i].obj;
			break;
		}
	}
	if (d == l) {
		qrCodeAlg = new QRCodeAlg(options.text, options.correctLevel);
		qrcodeAlgObjCache.push({
			text: options.text,
			correctLevel: options.correctLevel,
			obj: qrCodeAlg
		});
	}
	let getForeGround = function(config) {
		let options = config.options;
		if (options.pdground && (
				(config.row > 1 && config.row < 5 && config.col > 1 && config.col < 5) ||
				(config.row > (config.count - 6) && config.row < (config.count - 2) && config.col > 1 && config.col < 5) ||
				(config.row > 1 && config.row < 5 && config.col > (config.count - 6) && config.col < (config.count - 2))
			)) {
			return options.pdground;
		}
		return options.foreground;
	}
	let count = qrCodeAlg.getModuleCount();
	let ratioSize = options.size;
	let ratioImgSize = options.imageSize;
	//计算每个点的长宽
	let tileW = (ratioSize / count).toPrecision(4);
	let tileH = (ratioSize / count).toPrecision(4);
	//绘制
	for (let row = 0; row < count; row++) {
		for (let col = 0; col < count; col++) {
			let w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
			let h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
			let foreground = getForeGround({
				row: row,
				col: col,
				count: count,
				options: options
			});
			Context.setFillStyle(qrCodeAlg.modules[row][col] ? foreground : options.background);
			Context.fillRect(options.dx + Math.round(col * tileW), options.dy + Math.round(row * tileH), w, h);
		}
	}
	if (options.image) {
		let x = options.dx + Number(((ratioSize - ratioImgSize) / 2).toFixed(2));
		let y = options.dy + Number(((ratioSize - ratioImgSize) / 2).toFixed(2));
		drawRoundedRect(Context, x, y, ratioImgSize, ratioImgSize, 2, 6, true, true)
		Context.drawImage(options.image, x, y, ratioImgSize, ratioImgSize);
		// 画圆角矩形
		function drawRoundedRect(ctxi, x, y, width, height, r, lineWidth, fill, stroke) {
			ctxi.setLineWidth(lineWidth);
			ctxi.setFillStyle(options.background);
			ctxi.setStrokeStyle(options.background);
			ctxi.beginPath(); // draw top and top right corner 
			ctxi.moveTo(x + r, y);
			ctxi.arcTo(x + width, y, x + width, y + r, r); // draw right side and bottom right corner 
			ctxi.arcTo(x + width, y + height, x + width - r, y + height, r); // draw bottom and bottom left corner 
			ctxi.arcTo(x, y + height, x, y + height - r, r); // draw left and top left corner 
			ctxi.arcTo(x, y, x + r, y, r);
			ctxi.closePath();
			if (fill) {
				ctxi.fill();
			}
			if (stroke) {
				ctxi.stroke();
			}
		}
	}
	_app.hideLoading();
}

function getShreUserPosterBackground(objs) { //检查背景图是否存在于本地， 若存在直接返回， 否则调用getShreUserPosterBackgroundFc方法
	let {
		backgroundImage,
		type
	} = objs;
	return new Promise(async (resolve, reject) => {
		try {
			_app.showLoading('正在获取海报背景图');
			let pbg;
			// #ifndef H5
			pbg = getPosterStorage(type);
			// #endif
			// #ifdef H5
			pbg = false;
			// #endif
			_app.log('获取的缓存:' + JSON.stringify(pbg));
			if (pbg && pbg.path && pbg.name) {
				_app.log('海报有缓存, 准备获取后端背景图进行对比');
				const image = await _app.getPosterUrl(objs);
				_app.log('准备对比name是否相同');
				if (pbg.name === _app.fileNameInPath(image)) {
					_app.log('name相同, 判断该背景图是否存在于本地')
					const index = await _app.checkFile_PromiseFc(pbg.path)
					if (index >= 0) {
						_app.log('海报save路径存在, 对比宽高信息, 存储并输出');
						const imageObj = await _app.getImageInfo_PromiseFc(pbg.path);
						let obj = { ...pbg
						};
						if (!pbg.width || !pbg.height || pbg.width !== imageObj.width || pbg.height !== imageObj.height) {
							_app.log('宽高对比不通过， 重新获取');
							const savedFilePath = await getShreUserPosterBackgroundFc(objs, image)
							_app.hideLoading();
							resolve(savedFilePath);
						} else {
							_app.log('宽高对比通过, 再次存储, 并返回路径');
							obj = {
								...pbg,
								width: imageObj.width,
								height: imageObj.height
							};
							// #ifndef H5
							setPosterStorage(type, { ...obj
							});
							// #endif
							_app.hideLoading();
							resolve(obj);
						}
					} else {
						_app.log('海报save路径不存在, 重新获取海报');
						const savedFilePath = await getShreUserPosterBackgroundFc(objs, image)
						_app.hideLoading();
						resolve(savedFilePath);
					}
				} else {
					_app.log('name不相同, 重新获取海报');
					const savedFilePath = await getShreUserPosterBackgroundFc(objs, image)
					_app.hideLoading();
					resolve(savedFilePath);
				}
			} else {
				_app.log('海报背景图没有缓存, 准备获取海报背景图');
				const savedFilePath = await getShreUserPosterBackgroundFc(objs)
				_app.hideLoading();
				resolve(savedFilePath);
			}
		} catch (e) {
			_app.hideLoading();
			_app.showToast('获取分享用户背景图失败:' + JSON.stringify(e));
			_app.log(JSON.stringify(e));
			reject(e);
		}
	})
}

function getPosterStorage(type) {
	return _app.getStorageSync(getStorageKey(type));
}

function removePosterStorage(type) {
	const ShreUserPosterBackgroundKey = getStorageKey(type);
	const pbg = _app.getStorageSync(ShreUserPosterBackgroundKey);
	if (pbg && pbg.path) {
		_app.removeSavedFile(pbg.path);
		_app.removeStorageSync(ShreUserPosterBackgroundKey);
	}
}

function setPosterStorage(type, data) {
	_app.setStorage(getStorageKey(type), data);
}

function getStorageKey(type) {
	return ShreUserPosterBackgroundKey + (type || 'default');
}

function getShreUserPosterBackgroundFc(objs, upimage) { //下载并保存背景图方法
	let {
		backgroundImage,
		type
	} = objs;
	_app.log('获取分享背景图, 尝试清空本地数据');
	removePosterStorage(type);
	return new Promise(async (resolve, reject) => {
		try {
			_app.showLoading('正在下载海报背景图');
			if (upimage) {
				_app.log('有从后端获取的背景图片路径');
				_app.log('尝试下载并保存背景图');
				const name = _app.fileNameInPath(upimage);
				const savedFilePath = await _app.downLoadAndSaveFile_PromiseFc(upimage);
				if (savedFilePath) {
					_app.log('下载并保存背景图成功:' + savedFilePath);
					const imageObj = await _app.getImageInfo_PromiseFc(savedFilePath);
					const returnObj = {
						path: savedFilePath,
						width: imageObj.width,
						height: imageObj.height,
						name
					}
					// #ifndef H5
					setPosterStorage(type, { ...returnObj
					});
					// #endif
					_app.hideLoading();
					resolve(returnObj);
				} else {
					_app.hideLoading();
					reject('not find savedFilePath');
				}
			} else {
				_app.log('没有从后端获取的背景图片路径, 尝试从后端获取背景图片路径');
				const image = await _app.getPosterUrl(objs);
				_app.log('尝试下载并保存背景图:' + image);
				const savedFilePath = await _app.downLoadAndSaveFile_PromiseFc(image);
				if (savedFilePath) {
					_app.log('下载并保存背景图成功:' + savedFilePath);
					const imageObj = await _app.getImageInfo_PromiseFc(savedFilePath);
					_app.log('获取图片信息成功');
					const returnObj = {
						path: savedFilePath,
						width: imageObj.width,
						height: imageObj.height,
						name: _app.fileNameInPath(image)
					}
					_app.log('拼接背景图信息对象成功:' + JSON.stringify(returnObj));

					// #ifndef H5
					setPosterStorage(type, { ...returnObj
					});
					// #endif

					_app.hideLoading();
					_app.log('返回背景图信息对象');
					resolve({ ...returnObj
					});
				} else {
					_app.hideLoading();
					reject('not find savedFilePath');
				}
			}
		} catch (e) {
			//TODO handle the exception
			reject(e);
		}
	});
}
