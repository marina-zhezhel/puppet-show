(function($){
	$.fn.imgShow = function(o){
		var o = $.extend({
			showPanel:'animate',
			timeShow: 3000,
			speedShow: 1000,
			speedHide: 1000,
			speedShowDesc: 500,
			speedHideDesc: 100
		}, o);
		return $(this).each(function(){
	    		var folder = $(this);
	    		var images = folder.find('img');
	    		var imgCount = images.length;
	       	        images.hide().each(function(i){
		    		$(this).attr('id','i_' + i);
			});
			var first = images.filter('#i_0');
			folder.width(first.width()).height(first.height());
			if (o.showPanel != 'none') {
				folder.append('<div class="desc"><div class="text">&nbsp;</div></div>');
				var desc = folder.children('.desc');
				var offset = folder.offset();
				desc.css('top', offset.top + 'px').css('left', offset.left + 'px').width(folder.width());
				if (o.showPanel == 'animate') desc.hide();
				var descText = desc.children('div');
			}
			var id;
			function ImgList() {
				id = id || 0;
				var currImg = images.filter('#i_' + id);
				currImg.fadeIn(o.speedShow,function(){
					if (o.showPanel != 'none') {
						var title = '';
						title = $(this).attr('alt');
						descText.html(title);
						if (title && o.showPanel == 'animate') desc.slideDown(o.speedShowDesc);
					}
					setTimeout(function(){
						if (o.showPanel == 'animate') {
							desc.slideUp(o.speedHideDesc);
						}
						if (o.showPanel == 'always')  {
							descText.html('');
						}
						currImg.fadeOut(o.speedHide,function(){
							id ++;
							if (id == imgCount) id = 0;
							ImgList();
						});

					}, o.timeShow);
				});
			}
		    ImgList();
		});
	}
})(jQuery)