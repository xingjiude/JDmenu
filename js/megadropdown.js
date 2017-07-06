$(document).ready(function() {
	//1.1 声明一个变量指向子菜单
	var sub = $('#sub');
	//1.5 声明一个变量代表激活的行 和 二级菜单
	var activeRow;
	var activeMenu;
	//2 加入延迟来优化 切换子菜单的时候，用setTimeOut设置延迟 。
	//用debounce去抖技术，在事件频繁触发的时候只执行最后一次。
	//2.1声明一个变量来保存 setTimeOut返回的计时器id
	var timer;
	//2.3 声明一个变量来记录鼠标是否在子菜单里面
	var mouseInSub = false;
	//2.4 鼠标进入的时候变为true，离开的时候还原
	sub.on('mouseenter',function(e){
		mouseInSub = true;
	}).on('mouseleave',function(e){
		mouseInSub = false;
	})
	//3 创建一个数组来跟踪记录鼠标的位置
	var mouseTrack = [];
	//3.2 保存鼠标位置 超过三个就删除第一个
	var moveHandler = function(e){
		mouseTrack.push({
			x:e.pageX,
			y:e.pageY
		})
		if (mouseTrack.length > 3){
			mouseTrack.shift();
		}
	}
	// 1,开发普通的二级菜单  事件代理的方式进行绑定  
	// 知识点：mouseenter/mouserover/mouseout/mouseleave的区别

	//1.2 给一级菜单添加事件
	$('#test')
		.on('mouseenter',function(e) {
			//1.3 当鼠标移动到一级菜单，就把二级菜单显示出来
			sub.removeClass('none');
			//3.1 给mousemove绑定一个事件，绑定在$(document)上  <-常识
			$(document).bind('mousemove',moveHandler);
		})
		.on('mouseleave',function(e) {
			//1.4 鼠标离开的时候 隐藏二级菜单
			sub.addClass('none');
			//1.6 如果存在激活的行，就把样式去掉，并把变量指空 二级菜单也是同理
			if (activeRow){
				activeRow.removeClass('active');
				activeRow = null;
			}
			if (activeMenu) {
				activeMenu.addClass('none');
				activeMenu = null;
			}
			//3.3 当鼠标离开的时候要解绑，以免影响其他组件
			$(document).unbind('mousemove',moveHandler);	
		})
		//1.7 通过事件代理的方式绑定，如果添加或者删除节点，不用再添加代码和绑定事件，事件冒泡特性？
		.on('mouseenter','li', function(e){
			//1.7 如果没有激活的列表项，把激活的列表项指向事件的目标，选中对应的二级菜单
			if (!activeRow) {
				activeRow = $(e.target);
				activeRow.addClass('active');
				activeMenu = $('#'+activeRow.data('id'));
				activeMenu.removeClass('none');
				return;
			}
			//2.6 如果事件触发的时候计时器还没有执行，就把计时器清掉
			if(timer) {
				clearTimeout(timer);
			}
			//3.6 p点是现在的点命名为currMousePos a点是上一点命名为leftCorner 在数组中取得
			var currMousePos = mouseTrack[mouseTrack.length - 1];
			var leftCorner = mouseTrack[mouseTrack.length - 2];
			//3.13 判断是否需要延迟
			var delay = needDelay(sub,leftCorner,currMousePos);
			//3.14 如果在三角形内 需要延迟 否则直接进行菜单的切换
			if(delay) {
				//2.2 设置一个延迟 延迟300毫秒
				timer = setTimeout(function(){
					//2.5判断一下 如果鼠标在子菜单里就不处理 
					if (mouseInSub){
						return;
					}
					//1.8 当从一个激活的一级菜列表项移动到另一个的时候 把上一个状态清除
					activeRow.removeClass('active');
					activeMenu.addClass('none');
					//1.9然后指向当前的
					activeRow = $(e.target);
					activeRow.addClass('active');
					activeMenu = $('#'+activeRow.data('id'));
					activeMenu.removeClass('none');
					//2.7 计时器回调之后 设置为null  这就是debounce去抖
					timer = null;
				},300);	
			} else {
				//3.15 把之前的行和块隐藏，展示现在的行和块
				var prevActiveRow = activeRow;
				var prevActiveMenu = activeMenu;

				activeRow = $(e.target);
				activeMenu = $('#' + activeRow.data('id'));

				prevActiveRow.removeClass('active');
				prevActiveMenu.addClass('none');

				activeRow.addClass('active');
				activeMenu.removeClass('none');

			}
		})
})