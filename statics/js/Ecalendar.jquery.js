$.fn.ECalendar = function(config){
        var con = {
            offset : [0,0],
            type : 1,
            skin : false,
            stamp : true,
            step : 10,
            disableds : []
        };
        config = $.extend(con,config);//
        var _this = $(this), //表单
        ECalendar, //主面板
        day, //日期列表
        imonth,//当前月份
        iday,//当前日期
        iyear,//当前年份
        ilast,//日期差
        itimebox,//当前时间
        select, //快速选择
        getFullYear, //选择的年份
        getMonth, //选择的月份
        getDate, //选择的日期
        weekday,//选择的星期
        getHour,//选择的小时
        getMinutes,//选择的分钟
        oper, //上下月选择
        currenttime,
        x,y,mx,my,
        timestep = config.step, // 拖动时间的步长
        drag,
        input, //存储时间的隐藏表单
        dragnum,
        isinit = false, //是否初始化
        pointer, //时间指针
        callback,
        formatTime = config.format ? config.format : "yyyy-mm-dd hh:ii",
        formatDate = config.format ? config.format : "yyyy-mm-dd",
        tmp = ['#ee3f2f','#1bbc9b','#297fb8','#985aa6','#e67f22','#2d3e50','#27ae61','#7e8c8d'];
        config.type = config.type == "time" ? 0 : 1;
        callback = config.callback;
        disableds = config.disableds;
        
        //判断客户端
        if(!IsPC())
        {
            if(config.type == 0)
            {
                _this.attr("type","datetime-local");
            }
            else
            {
                 _this.attr("type","date");
            }
            if(callback)
            {
                _this.change(function(){
                    callback(_this.val(),ECalendar);
                })
            }
            return false;
        }
        config.format = config.type == 0 ? formatTime : formatDate;
        if(config.skin === false)  config.skin = Math.floor(Math.random()*tmp.length)
        config.skin = tmp[config.skin] ? tmp[config.skin] : config.skin;



        init();
        _this.click(function(event){
        	
        	config.disableds = disableds;
        	//启用禁止当前时间选中功能
        	if(config.disableds == disableds){
        		//如果传false则不禁选
        		if(disableds == false){
            		$(".oper li:first-child").css("pointer-events","auto");
                    $("ul .prve").css("pointer-events","auto");
                	$(".day li[data]").css("pointer-events","auto");
                	$("ul .next").css("pointer-events","auto");
        		}else{
        			
        			//禁止选中小于传入日期
        			var nowyear1 = disableds[0];
        			var nowmonth1 = disableds[1];
        			var nowday1 = disableds[2];
        			if(nowyear1 > getFullYear){
        				$(".oper li:first-child").css("pointer-events","none");
        				$("ul .prve").css("pointer-events","none");
        				$(".day li[data]").css("pointer-events","none");
        				$("ul .next").css("pointer-events","none");
        			}else if(nowyear1 == getFullYear && nowmonth1 > getMonth){
        				$(".oper li:first-child").css("pointer-events","none");
        				$("ul .prve").css("pointer-events","none");
        				$(".day li[data]").css("pointer-events","none");
        				
        				//遍历next小于穿入日期不能选
                        $("ul .next").each(function(index){
                        	var nowyear2 = disableds[0];
                        	var nowmonth2 = disableds[1];
                			var nowday2 = disableds[2];
                        	var nowselected2 = $("ul .next").eq(index).text();
                        	if(nowselected2<nowday2){
                        		$("ul .next").eq(index).css("pointer-events","none");
                        	}
                        });
        			}else if(nowyear1 == getFullYear && nowmonth1 == getMonth){
        				$(".oper li:first-child").css("pointer-events","none");
        				$("ul .prve").css("pointer-events","none");
        				
        				//小于当天禁止选中
                        $(".day li[data]").each(function(index){
                        	var nowyear3 = disableds[0];
                        	var nowmonth3 = disableds[1];
                			var nowday3 = disableds[2];
                        	var nowselected3 = $(".day li[data]").eq(index).text();
                        	if(nowselected3<nowday3){
                        		$(".day li[data]").eq(index).css("pointer-events","none");
                        	}
                        });
        				
        			}else if(nowyear1 == getFullYear && nowmonth1 < getMonth){
        				$(".oper li:first-child").css("pointer-events","auto");
        				//遍历next小于穿入日期不能选
                        $("ul .prve").each(function(index){
                        	var nowyear4 = disableds[0];
                        	var nowmonth4 = disableds[1];
                			var nowday4 = disableds[2];
                        	var nowselected4 = $("ul .prve").eq(index).text();
                        	if(nowselected4<nowday4){
                        		$("ul .prve").eq(index).css("pointer-events","none");
                        	}
                        });
        			}else{
                		$(".oper li:first-child").css("pointer-events","auto");
                		$("ul .prve").css("pointer-events","auto");
                		$(".day li[data]").css("pointer-events","auto");
                		$("ul .next").css("pointer-events","auto");
                	}
        			
                   
        		}
        		
        	}
        	
        	
            
        	
            var itime = _this.attr("data-ec") ? _this.attr("data-ec") : _this.val();
            var date = itime ? new Date(itime.replace(/-/g, "/")) : new Date();
            if(date == 'Invalid Date') date = new Date();
            setData(date);

            //判断元素相对可视窗口的位置
            var top = _this.offset().top - $(document).scrollTop();
            var height = $(window).height();
            var offset = _this.offset();
            var post = _this.position();
            if(height/2 < top)
            {
                 ECalendar.css({
                    "left":post.left + config.offset[0],
                    "top":post.top  - config.offset[1] - ECalendar.height() - 1,
                });
            }else
            {
                 ECalendar.css({
                    "left":post.left + config.offset[0],
                    "top":post.top + _this.outerHeight() + config.offset[1],
                });
            }
            _this.parent(".calendarWarp").css("zIndex",+10)
            ECalendar.show();
        });

        //点击外面关闭
        ECalendar.mousedown(function(event){event.stopPropagation()});
        $(document).mousedown(function(){
            if(ECalendar.is(":visible"))
            {
                ECalendar.hide(0,function(){
                    if(callback) callback(input.val(),ECalendar);
                })
                .parent(".calendarWarp")
                .css("zIndex",1);
            }
        });

        _this.on("change",function(){
            var date = _this.val() ? new Date(_this.val().replace(/-/g, "/")) : null;
            if(date == null || date == 'Invalid Date')
            {
                input.val("");
                _this.val("");
            }else
            {
                setData(date);
            }

        });

        
        //快速选择日期
        ilast.click(function(){
            if(select.height() > 0)
                select.animate({"height":0},200);
            else
                select.animate({"height":20},200);
        });
        select.children("li").click(function(){
             var date = new Date();
             var li = $(this);
             var index = li.index();
             if(index === 0) setData(date);
             if(index === 1) setData(new Date(date.getFullYear(),date.getMonth(),date.getDate() + 7,date.getHours(),date.getMinutes()));
             if(index === 2) setData(new Date(date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes()));
             if(index === 3) setData(new Date(date.getFullYear(),date.getMonth()+3,date.getDate(),date.getHours(),date.getMinutes()));
             if(index === 4) setData(new Date(date.getFullYear()+1,date.getMonth(),date.getDate(),date.getHours(),date.getMinutes()));
             select.animate({"height":0},200);
             if(callback) callback(input.val(),ECalendar);
             
        });

        //选择日期
        day.on("mousedown","li",function(e){
        	
            var li = $(this);
            if(li.hasClass("prve")) getMonth -= 1;
            if(li.hasClass("next")) getMonth += 1;
            
            getDate = li.text();
            li.siblings('li.activ').removeClass('activ').removeAttr('style');
            drag = $(this);
            
            if(config.type == 0)
            {
              li.addClass('activ').css({"overflow":"visible","background":config.skin}).append('<div class="at12"><div class="pointer"></div></div>');
              pointer = li.find(".pointer");
              x = e.pageX;
              y = e.pageY;
              dragnum = parseInt($(this).text());
              $("body").addClass("ECalendarNoneSelect");
              _this.attr("readonly","readonly");
              drag.attr("data-settime",(getHour < 10 ? "0" + getHour : getHour) + ":" + (getMinutes < 10 ? "0" + getMinutes : getMinutes));
              //根据时间计算角度
              var a = getHour * 30;
              var a = a + (getMinutes / 2);
              pointer.css({"transform":"rotate("+(a-90)+"deg)"});
            }

            setData(new Date(getFullYear,getMonth - 1,getDate,getHour,getMinutes));
            
        });

        
        //上下月选择
        oper.click(function(){
        	
            var li = $(this);
            if(li.index() == 0) getMonth -= 2;
            setData(new Date(getFullYear,getMonth,getDate,getHour,getMinutes));
            if(callback) callback(input.val(),ECalendar) ;
            
            //config.disableds = disableds;
            //启用禁止当前时间选中功能
        	if(config.disableds == disableds){
        		//如果传false则不禁选
        		if(disableds == false){
            		$(".oper li:first-child").css("pointer-events","auto");
                    $("ul .prve").css("pointer-events","auto");
                	$(".day li[data]").css("pointer-events","auto");
                	$("ul .next").css("pointer-events","auto");
        		}else{
        			//禁止选中小于传入日期
        			var nowyear1 = disableds[0];
        			var nowmonth1 = disableds[1];
        			var nowday1 = disableds[2];
        			if(nowyear1 > getFullYear){
        				$(".oper li:first-child").css("pointer-events","none");
        				$("ul .prve").css("pointer-events","none");
        				$(".day li[data]").css("pointer-events","none");
        				$("ul .next").css("pointer-events","none");
        			}else if(nowyear1 == getFullYear && nowmonth1 > getMonth){
        				$(".oper li:first-child").css("pointer-events","none");
        				$("ul .prve").css("pointer-events","none");
        				$(".day li[data]").css("pointer-events","none");
        				
        				//遍历next小于穿入日期不能选
                        $("ul .next").each(function(index){
                        	var nowyear2 = disableds[0];
                        	var nowmonth2 = disableds[1];
                			var nowday2 = disableds[2];
                        	var nowselected2 = $("ul .next").eq(index).text();
                        	if(nowselected2<nowday2){
                        		$("ul .next").eq(index).css("pointer-events","none");
                        	}
                        });
        			}else if(nowyear1 == getFullYear && nowmonth1 == getMonth){
        				$(".oper li:first-child").css("pointer-events","none");
        				$("ul .prve").css("pointer-events","none");
        				
        				//小于当天禁止选中
                        $(".day li[data]").each(function(index){
                        	var nowyear3 = disableds[0];
                        	var nowmonth3 = disableds[1];
                			var nowday3 = disableds[2];
                        	var nowselected3 = $(".day li[data]").eq(index).text();
                        	if(nowselected3<nowday3){
                        		$(".day li[data]").eq(index).css("pointer-events","none");
                        	}
                        });
        				
        			}else if(nowyear1 == getFullYear && nowmonth1 < getMonth){
        				$(".oper li:first-child").css("pointer-events","auto");
        				//遍历next小于穿入日期不能选
                        $("ul .prve").each(function(index){
                        	var nowyear4 = disableds[0];
                        	var nowmonth4 = disableds[1];
                			var nowday4 = disableds[2];
                        	var nowselected4 = $("ul .prve").eq(index).text();
                        	if(nowselected4<nowday4){
                        		$("ul .prve").eq(index).css("pointer-events","none");
                        	}
                        });
        			}else{
                		$(".oper li:first-child").css("pointer-events","auto");
                		$("ul .prve").css("pointer-events","auto");
                		$(".day li[data]").css("pointer-events","auto");
                		$("ul .next").css("pointer-events","auto");
                		
                	}
        			
                   
        		}
        		
        	}
            
            
            
        });

        
        $(imonth).mousedown(function(e){
        	
            x = e.pageX;
            y = e.pageY;
            drag = $(this);
            dragnum = parseInt(drag.children('span').text());
            var prehtml = '<i class="r3" data="'+(dragnum - 3)+'">'+(dragnum - 3)+'</i>' + '<i class="r2" data="'+(dragnum - 2)+'">'+(dragnum - 2)+'</i>' + '<i class="r1" data="'+(dragnum - 1)+'">'+(dragnum - 1)+'</i>';
            var apphtml = '<i class="a1" data="'+(dragnum + 1)+'">'+(dragnum + 1)+'</i>' + '<i class="a2" data="'+(dragnum + 2)+'">'+(dragnum + 2)+'</i>' + '<i class="a3" data="'+(dragnum + 3)+'">'+(dragnum + 3)+'</i>';
            drag.prepend(prehtml);
            drag.append(apphtml)
            drag.children('i').each(function(){
               var temp = parseInt($(this).attr("data"));
               if(temp > 12) $(this).text(12).hide();
               if(temp < 1) $(this).text(1).hide();
            })
            currenttime.animate({opacity:.1}, 600);
            $("body").addClass("ECalendarNoneSelect");
            _this.attr("readonly","readonly");
            
        });
        //选择年
        $(iyear).mousedown(function(e){
            x = e.pageX;
            y = e.pageY;
            drag = $(this);
            dragnum = parseInt(drag.children('span').text());
            var prehtml = '<i class="r3" data="'+(dragnum - 3)+'">'+(dragnum - 3)+'</i>' + '<i class="r2" data="'+(dragnum - 2)+'">'+(dragnum - 2)+'</i>' + '<i class="r1" data="'+(dragnum - 1)+'">'+(dragnum - 1)+'</i>';
            var apphtml = '<i class="a1" data="'+(dragnum + 1)+'">'+(dragnum + 1)+'</i>' + '<i class="a2" data="'+(dragnum + 2)+'">'+(dragnum + 2)+'</i>' + '<i class="a3" data="'+(dragnum + 3)+'">'+(dragnum + 3)+'</i>';
            drag.prepend(prehtml);
            drag.append(apphtml)
            currenttime.animate({opacity:.1}, 600);
            $("body").addClass("ECalendarNoneSelect");
            _this.attr("readonly","readonly");
        });

        $(document).mousemove(function(e){
            if(drag)
            {
                my = parseInt((e.pageY - y) / 10);
                mx = parseInt((e.pageX - x) / 10);
                if(drag[0].tagName == "LI")
                {
                    if(Math.abs(my) > 1 || Math.abs(mx) > 1) //防误触
                    {
                        //根据坐标计算方位角
                        var ay = (e.pageX - x);
                        var ax = (y - e.pageY);
                        var s = 90 / Math.atan(1/0);
                        var a = Math.atan(ay/ax) * s;

                        if(ax < 0 && ay > 0) a = 180 + a; //第二象限
                        if(ax < 0 && ay <= 0) a = 180 + a; //第三象限
                        if(ax >= 0 && ay < 0) a = 360 + a; //第四象限

                        //根据角度算时间
                        var atime = a / 30;
                        var ahours = parseInt(atime);
                        var amin = parseInt(((atime - ahours) * 60) / timestep) * timestep ;

                        //24小时
                        if(Math.abs(my) > 5 || Math.abs(mx) > 5)
                        {
                          drag.children('div').attr("class","at24")
                          ahours += 12;
                        }else {
                            drag.children('div').attr("class","at12")
                        }

                        getHour = ahours;
                        getMinutes = amin;
                        drag.attr("data-settime",(ahours < 10 ? "0" + ahours : ahours) + ":" + (amin < 10 ? "0" + amin : amin));
                        itimebox.text((ahours < 10 ? "0" + ahours : ahours) + ":" + (amin < 10 ? "0" + amin : amin));
                        pointer.css({"transform":"rotate("+(a-90)+"deg)"});
                    }

                }else
                {
                    var offsetTemp = my;
                    var m = dragnum + offsetTemp;
                    if(drag.hasClass("imonth") && m >= 1 && m <= 12)  {
                      drag.children('i').each(function(){
                         var temp = parseInt($(this).attr("data")) + offsetTemp;
                         if(temp > 12 || temp < 1)
                           $(this).hide();
                         else
                           $(this).text(temp).show();
                      })
                      if(m == 12){
                        drag.children('span').nextAll().hide();
                      }else if(m == 1){
                        drag.children('span').prevAll().hide();
                      }
                      drag.children('span').text(m);
                    }
                    if(drag.hasClass("iyear"))
                    {
                        drag.children('i').each(function(){
                           var temp = parseInt($(this).attr("data")) + offsetTemp;
                            $(this).text(temp).show();
                        })
                        drag.children('span').text(m);
                    }

                }
            }

        });
        $(document).mouseup(function(){
            if(drag)
            {

                if(drag[0].tagName == "LI")
                {
                    var m = drag.text();
                     setData(new Date(getFullYear,getMonth - 1,getDate,getHour,getMinutes));
                     drag.removeAttr("data-settime").css({"overflow":"hidden"}).children("div").remove();
                     ECalendar.hide(0,function(){
                                      if(callback) callback(input.val(),ECalendar);
                               })
                        .parent(".calendarWarp")
                        .css("zIndex",1);
                }else
                {
                    drag.children('i').remove();
                    var m = drag.text();
                    if(drag.hasClass("imonth")) setData(new Date(getFullYear,m - 1,getDate,getHour,getMinutes));
                    if(drag.hasClass("iyear"))
                    {
                        setData(new Date(m,getMonth - 1,getDate,getHour,getMinutes));
                    }

                    currenttime.animate({opacity:1}, 600);
                    if(callback) callback(input.val(),ECalendar);
                }
                drag = false;
                $("body").removeClass("ECalendarNoneSelect");
                _this.removeAttr("readonly");
            }
        })
        //初始化
        function init()
        
        {
            isinit = true;
            var html = '<div class="ECalendarBox ECalendarNoneSelect" style="display:none"><input type="hidden"/><div class="head"><div class="currentdate"><h2><span class="iyear"><span class="activ"></span></span>/<span class="imonth"><span class="activ"></span></span></h2><ul class="oper"><li>&lt;</li><li>&gt;</li></ul></div><div class="currenttime"><span class="ilasttext"></span><span class="itime itimebox"></span></div><ul class="select"><li>今天</li><li>一周后</li><li>一月后</li><li>三月后</li><li>一年后</li></ul><ul class="week"><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li></ul></div><ul class="day"></ul></div></div>';

            ECalendar = $(html);

            //设置颜色
            ECalendar.css("border-color",config.skin);
            ECalendar.children('div.head').css({"border-color":config.skin,"background":config.skin});

            day = ECalendar.find("ul.day");
            imonth = ECalendar.find("span.imonth");
            iday = ECalendar.find("span.iday");
            ilast = ECalendar.find("span.ilasttext");
            itimebox = ECalendar.find("span.itimebox");
            iyear = ECalendar.find("span.iyear");
            select = ECalendar.find("ul.select");
            oper = ECalendar.find("ul.oper li");
            currenttime = ECalendar.find("div.currenttime,ul.week");
            input = ECalendar.children("input[type='hidden']");
            //替换INPUT标签的NAME
            var name = _this.attr("name");
            _this.removeAttr("name");
            input.attr("name",name);
            _this.after('<svg t="1493098552635" class="icon" style="position: absolute;right:'+ (_this.height() - 20) / 2 +'px;top:50%;margin-top: -10px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1006" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><defs><style type="text/css"></style></defs><path d="M856.576 200.192v54.784h58.368V814.08H109.568V256.512h56.832v-56.32H51.2V870.4h921.6V200.192h-116.224z" fill="#666666" p-id="1007"></path><path d="M819.2 102.4h-204.288v255.488L819.2 358.4V102.4z" fill="#EF4848" p-id="1008"></path><path d="M563.712 664.064h256V716.8h-256zM563.712 512h256v51.2h-256zM461.312 200.192h102.4v56.32h-102.4zM205.312 664.064h256V716.8h-256zM205.312 512h256v51.2h-256z" fill="#666666" p-id="1009"></path><path d="M410.112 102.4H204.8v256l205.312-0.512V102.4z" fill="#EF4848" p-id="1010"></path></svg>');
            _this.after(ECalendar);
            var itime = _this.attr("data-ec") ? _this.attr("data-ec") : _this.val();
            var date = itime ? new Date(itime.replace(/-/g, "/")) : null;
            if(date != 'Invalid Date' && date != null)  setData(date);
        }

        function setData(date)
        {
            getFullYear = date.getFullYear();
            getMonth = date.getMonth()+1;
            getDate = date.getDate();
            weekday = date.getDay();
            getHour = config.type ? 0 : date.getHours();
            getMinutes = config.type ? 0 : date.getMinutes();
            if(ECalendar.data("date") != (getFullYear+"-"+getMonth))
            {
                //获取当前月一号的星期
                var oneday = new Date(getFullYear, getMonth - 1,1);
                    oneday = oneday.getDay() ? oneday.getDay() : 7;
                    oneday = oneday === 1 ? 8 : oneday;
                //获取当前月的总天数
                var count = new Date(getFullYear,getMonth,0).getDate();

                //获取当前日历的最后一天
                var max = 42;

                //获取上一月的最后一天
                var prevcount = new Date(getFullYear,getMonth-1,0).getDate();

                var list = "";
                for(var i = 1; i<=max; i++)
                {
                    if(i < oneday) list += "<li class='other prve'>"+ (prevcount - (oneday - i) + 1) +"</li>";
                    else if(i >= oneday && i < count+oneday)
                    {
                        if((i - oneday + 1) == getDate)
                            list += "<li class='activ' data='"+(i - oneday + 1)+"' style='background:"+config.skin+"'>"+ (i - oneday + 1) +"</li>";
                        else
                            list += "<li data='"+(i - oneday + 1)+"'>"+ (i - oneday + 1) +"</li>";
                    }
                    else list += "<li class='other next'>"+ (i - (count + oneday) + 1) +"</li>";
                }
                day.html(list);
            }
            //day.children('li.active').removeClass('active').siblings('li[data='+getDate+']').addClass('active');
            //获取当前时间的时间差
            var now = new Date();
            var diff = new Date(getFullYear,getMonth - 1,getDate).getTime() - new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();
                diff = parseInt(diff/(24*3600*1000));
             
            ECalendar.data("date",(getFullYear+"-"+getMonth));
            imonth.children('span').text(getMonth);
            iyear.children('span').text(getFullYear);
            var iilast = "";
            
            if(diff == 0)
            {
                iilast = "今天";
            }
            else
            {
                iilast = "<span class='itime'>" + Math.abs(diff) + "</span> ";
                if(diff > 0)
                    iilast += "天后";
                else
                    iilast += "天前";
            }
            ilast.html(iilast);

            if(config.type == 0)
              itimebox.text((getHour < 10 ? "0"+getHour : getHour) + ":" + (getMinutes < 10 ? "0"+getMinutes : getMinutes));

          
            
           var val = config.format.replace('yyyy', getFullYear)
                        .replace('mm', getMonth)
                        .replace('dd', getDate)
                        .replace('hh', getHour < 10 ? "0"+getHour:getHour)
                        .replace('ii', getMinutes < 10 ? "0"+getMinutes:getMinutes);
           
            _this.attr("data-ec",date);
            _this.val(val);//**
            stamp = val.replace(/-/g,"/")
            stamp = Date.parse(stamp) / 1000
            ECalendar.data("thistime",stamp);
            if(config.stamp) {
            	input.val(stamp);
            }else {
            	input.val(val);
            }
            
            
            
        }
        function IsPC()
        {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                        "SymbianOS", "Windows Phone",
                        "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        }
    }
