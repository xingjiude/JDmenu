//3    a点为鼠标上一个点，b点是子菜单上面的点，c点是子菜单下面的点，p是鼠标现在的点，如果p在abc的三角形内的其他一级菜单行路过就不切换菜单
//  向量：Vab = Pb - Pa
//  二维向量叉乘公式：a(x1,y1)*b(x2,y2) = x1*y2 - x2*y1
//  用叉乘法判断点在三角形内

//3.8 (a ^ b) >= 0证明符号相同 原理二进制正负位表示是最高位 1是负0是正 
// 抑或预算是仅当一位是1时才返回1 所以如果不是负 就代表两个数符号相同
function sameSign(a, b) {
	return (a ^ b) >= 0;
}

//3.4 根据向量公式 Vab = Pb - Pa 两个向量就是终点坐标减去起点坐标
function vector(a,b) {
	return {
		x: b.x - a.x,
		y: b.y - a.y
	}
}
//3.5 根据叉乘公式 向量1的x坐标乘以向量2的y坐标减去向量2的x坐标乘以向量1的y坐标
function vectorProduct(v1, v2) {
	return v1.x * v2.y - v2.x * v1.y;
}
//3.7 如果pa乘以pb pb乘以pc pc乘以pa符号相同的话就可以证明p在三角形内
function isPointInTrangle(p,a,b,c) {
	var pa = vector(p, a);
	var pb = vector(p, b);
	var pc = vector(p, c);

	var t1 = vectorProduct(pa, pb);
	var t2 = vectorProduct(pb, pc);
	var t3 = vectorProduct(pc, pa);
	//3.9 判断t1 t2 t3相同
	return sameSign(t1, t2) && sameSign(t2, t3);
}
//3.10 添加一个函数来判断是否需要延迟
function needDelay(elem, leftCorner, currMousePos) {
	//3.11 用offset方法来计算上下边缘的坐标
	var offset = elem.offset()
	//3.11 上边缘
	var topLeft = {
		x:offset.left,
		y:offset.top
	}
	//3.11 下边缘
	var bottomLeft = {
		x:offset.left,
		y:offset.top + elem.height()
	}
	//3.12  把p a b c位置传进去
	return isPointInTrangle(currMousePos,leftCorner,topLeft,bottomLeft)
}