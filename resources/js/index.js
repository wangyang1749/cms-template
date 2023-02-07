// console.log(document.body.clientWidth )
// console.log($("body").innerWidth())
// console.log($(window).width())
// 吸顶
$(function () {
    if (document.body.clientWidth < 977) {
        // console.log("aa")
        var navBar = $("#mobile-nav1");
        var navBar2 = $("#mobile-nav2");
        var titleTop = navBar.offset().top;

        $(window).scroll(function () {
            var btop = $(window).scrollTop();
            if (btop > titleTop) {
                navBar.addClass('mobile-fix');
                // console.log(navBar.outerHeight()+16)
                let navBarOuterHeight = navBar.outerHeight() + 16
                navBar2.css("margin-top", navBarOuterHeight + "px");
            } else {
                navBar.removeClass('mobile-fix');
                navBar2.css("margin-top", 0);
            }
        })
    }

});

//手机搜索

$(function () {
    $("#mobile-search").click(function () {
        $("#search-panel").slideToggle("fast");
    });
});




function move() {
    var divMove = document.getElementById("content-table");
    if (divMove == null) return;
    divMove.onmousedown = function (e) {
        var ev = e || window.event;  //兼容ie浏览器
        //鼠标点击物体那一刻相对于物体左侧边框的距离=点击时的位置相对于浏览器最左边的距离-物体左边框相对于浏览器最左边的距离  
        var distanceX = ev.clientX - divMove.offsetLeft;
        var distanceY = ev.clientY - divMove.offsetTop;
        document.onmousemove = function (e) {
            var ev = e || window.event;  //兼容ie浏览器  
            divMove.style.left = ev.clientX - distanceX + 'px';
            divMove.style.top = ev.clientY - distanceY + 'px';
        };
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };
}
// move();

function move(header, panel, closeBtn) {
    var _move = false;//移动标记  
    var _x, _y;//鼠标离控件左上角的相对位置  
    $("#" + header).click(function () {
        //alert("click");//点击（松开后触发）  
    }).mousedown(function (e) {
        _move = true;

        if ($("#" + panel).css("position") != "fixed") {
            $("#" + panel).css("position", "fixed");
            $("#" + panel).css("z-index", "9999");
            $("#" + panel).css("left", e.clientX);
            $("#" + panel).css("top", e.clientY);
            $("#" + closeBtn).css("display", "block");

        }
        _x = e.pageX - parseInt($("#" + panel).css("left"));
        _y = e.pageY - parseInt($("#" + panel).css("top"));

        $("#" + panel).fadeTo(20, 0.5);//点击后开始拖动并透明显示  
    });
    $(document).mousemove(function (e) {
        if (_move) {
            var x = e.pageX - _x;//移动时根据鼠标位置计算控件左上角的绝对位置  
            var y = e.pageY - _y;
            $("#" + panel).css({ top: y, left: x });//控件新位置  
        }
    }).mouseup(function () {
        _move = false;
        $("#" + panel).fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明  "fast":规定褪色效果的速度。
    });
    $("#" + closeBtn).click(function () {
        $("#" + panel).css("position", "");
        $("#" + closeBtn).css("display", "none");
    })
}


function setHeight(id) {
    let siderbarHeight = $(id).outerHeight(true);
    let windowHeight = $(window).height()
    var divtop = $(id).offset().top
    // console.log(siderbarHeight+divtop)
    // console.log(windowHeight)
    if((siderbarHeight+divtop) > windowHeight){
        $(id).height(windowHeight - divtop);
    }
  
}


function siderBar(id,divtop,siderbarBoxTop,siderbarBoxH,siderbarWidth) {
    // console.log("siderbarHeight" + $("#siderbar").outerHeight(true))
    // console.log("siderbarWidth" + $("#siderbar").width())
    // console.log("window" + $(window).height())
    // console.log("document scrollTop" + $(document).scrollTop())
    // console.log("header" + $("#header").outerHeight(true))
    // console.log("footer" + $("#footer").outerHeight(true))
    // console.log("document height" + $(document).height());
    // console.log($("#main-content").outerHeight(true))

    
   
    let headerHeight = $("#header").outerHeight(true)
    let footerHeight = $("#footer").outerHeight(true)
    let windowHeight = $(window).height()
    let scrollTop = $(document).scrollTop()
    let documentHeight = $(document).height()
    let mainContentHeight = $("#main-content").outerHeight(true)
    let siderbarHeight = $(id).outerHeight(true);
   


    // console.log(divtop-headerHeight )
    // console.log(headerHeight )

    // console.log(scrollTop )
    if(divtop-headerHeight-scrollTop<0  ){
        if( documentHeight-windowHeight-scrollTop-footerHeight > 0){
            // console.log("aaaaaaaaaaa")
            $("#siderbar-flexd").css({ "position": "fixed", "top": headerHeight + "px" ,"width":siderbarWidth+"px"})
            if((siderbarHeight+divtop) > windowHeight){
                $(id).height(windowHeight - headerHeight-siderbarBoxH-3);
            }
           
           
        }else{
            if((siderbarHeight+divtop) > windowHeight){
                $("#siderbar-flexd").css({ "position": "absolute", "bottom": "0", "top": "auto" })
            }
            // console.log("aaaaaaaaaaa")
            
        }
      
        // if()
    }else{
      
        setHeight("#siderbar-main")
        $("#siderbar-flexd").css({ "position": "relative","top":"auto" })
    }
    // console.log(divtop)
    // console.log(divtop - headerHeight - scrollTop)

    // if ((divtop - headerHeight - scrollTop) <= 0) {
    //     $(id).css({ "position": "fixed", "top": headerHeight + "px" })

    // } else {
    //     $(id).css({ "position": "relative","top":"auto" })
    // }
    // console.log(documentHeight - windowHeight - scrollTop > footerHeight)
    // console.log(windowHeight - headerHeight - footerHeight > siderbarHeight)
    // 底部导航是否出现并且 浏览器窗口不能同时显示头部侧栏和底部
    // if (mainContentHeight > siderbarHeight) {
    //     if (documentHeight - windowHeight - scrollTop < footerHeight && windowHeight - headerHeight - footerHeight < siderbarHeight) {
    //         $(id).css({ "position": "absolute", "bottom": "0", "top": "" })
    //     } else {
    //         // 窗口高度是否大于左侧面板高度
    //         if (windowHeight > siderbarHeight + headerHeight) {
    //             $(id).css({ "position": "fixed", "top": headerHeight + "px", "width": siderbarWidth + "px" })
    //         } else {
    //             // console.log("2222")
    //             // 窗口大小+滚动的距离是否=左侧面板的距离
    //             if (scrollTop + windowHeight > siderbarHeight + headerHeight) {
    //                 // console.log("ok")
    //                 $(id).css({ "position": "fixed", "bottom": "0", "width": siderbarWidth + "px" })
    //             } else {
    //                 $(id).css({ "position": "", "bottom": "" })

    //             }
    //         }
    //     }
    // }

}
if (document.body.clientWidth >= 977) {
    setHeight("#siderbar-main")
    var divtop = $("#siderbar-main").offset().top



    let siderbarBoxTop = $("#siderbar-box").offset().top
    let siderbarWidth = $("#siderbar-box").width()
    let siderbarBoxH = $("#siderbar-box").outerHeight(true);
    siderBar("#siderbar-main",divtop,siderbarBoxTop,siderbarBoxH,siderbarWidth)
   
    $(document).scroll(function () {
        siderBar("#siderbar-main",divtop,siderbarBoxTop,siderbarBoxH,siderbarWidth)
    })
}

// 增加浏览量
var url = location.hostname;
var protocol = window.location.protocol;
// var token = $.cookie('viewId')
var port = window.location.port

/**文章ajax预览 */
function previewArticle(articleId, viewName) {
    // console.log(articleId + viewName)
    // console.log($("#"+viewName).html().replace(/\s+/g,"")=="")
    let httpUrl = protocol + "//" + url;
    if (port) {
        httpUrl += ":" + port;
    }
    if ($("#" + viewName).html().replace(/\s+/g, "") == "") {
        $.ajax({
            url: httpUrl + "/preview/simpleArticle/" + articleId,
            type: "get",
            success: function (data) {
                // console.log(data)
                $("#" + viewName).html("<div class='p-3'>" + data + "</div>")
            }
        });
    } else {
        $("#" + viewName).html(" ")
    }
    // str=str.replace(/\s+/g,"");  

}

function loadImage(obj, url, callback) {
    var img = new Image();
    img.src = url;

    // 判断图片是否在缓存中
    if (img.complete) {
        callback.call(img, obj);
        return;
    }

    // 图片加载到浏览器的缓存中回调函数
    img.onload = function () {
        callback.call(img, obj);
    }
}

function showImage(obj) {
    obj.src = this.src;
}

function loadImg(id) {
    var root = document.getElementById(id)
    // console.log(root)
    var lazys = root.querySelectorAll(".lazy");
    var arr = [...lazys]
    arr.forEach((val) => {
        console.log(val.dataset.original)
        loadImage(val, val.dataset.original, showImage);
    })
}


function previewArticleHTML(path, viewName) {
    let httpUrl = protocol + "//" + url;
    if (port) {
        httpUrl += ":" + port;
    }
    // console.log(httpUrl + "/" + path + "/" + viewName + ".html")
    if ($("#" + viewName).html().replace(/\s+/g, "") == "") {
        $.ajax({
            url: httpUrl + "/" + path + "/" + viewName + ".html",
            headers: {
                'Content-Type': 'application/json;charset=utf8',
                'Accept': 'application/json'
            },
            type: "get",
            success: function (data) {
                // console.log(data);
                // console.log($(data).find(".markdown").html())
                $("#article-expand-" + viewName).css("display", "none")
                $("#article-shrink-" + viewName).css("display", "inline")
                $("#article-shrink-bottom-" + viewName).css("display", "inline")
                $("#" + viewName).html("<div class='p-3 ' style='box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;border: 3px #e7e7e7 solid;'> <hr>" + $(data).find(".markdown").html() + "<hr></div>")

                loadImg(viewName)

            }, error: function (e) {
                // console.log(e)

                console.log(e.status);
                console.log(e.responseJSON.message);
            }
        });
    } else {
        $("#article-expand-" + viewName).css("display", "inline")
        $("#article-shrink-" + viewName).css("display", "none")
        $("#article-shrink-bottom-" + viewName).css("display", "none")
        $("#" + viewName).html(" ")
    }

}


const msg = "我是弹框消息";
// 弹窗消息
function handleMessage(message = msg) {
    // console.log(message)
    const parentDiv = document.createElement("div");
    const div = document.createElement("div");
    div.className = "message-content";
    div.innerHTML = message;
    parentDiv.appendChild(div);
    parentDiv.className = "message-notice";
    document.getElementById("message").appendChild(parentDiv);

    setTimeout(() => {
        parentDiv.remove();
    }, 2000);
}



function copyContent(id) {
    let editor = document.getElementById(id);//要复制的结点
    let range = document.createRange();
    window.getSelection().removeAllRanges();//先清除掉选中区域
    range.selectNode(editor);
    window.getSelection().addRange(range);
    let res = document.execCommand("copy");
    window.getSelection().removeAllRanges();
    handleMessage("拷贝成功!")
}



// let weixin = document.getElementById("weixin");

// let support = document.getElementById("support");




(function ($) {
    var status = false;
    $.fn.scrollQ = function (options) {
        var defaults = {
            line: 2,
            scrollNum: 1,
            scrollTime: 6000
        }
        var options = jQuery.extend(defaults, options);
        var _self = this;
        return this.each(function () {
            $("li", this).each(function () {
                $(this).css("display", "none");
            })
            $("li:lt(" + options.line + ")", this).each(function () {
                $(this).css("display", "block");
            })
            function scroll() {
                for (i = 0; i < options.scrollNum; i++) {
                    var start = $("li:first", _self);
                    start.fadeOut(100);
                    start.css("display", "none");
                    start.appendTo(_self);
                    $("li:eq(" + (options.line - 1) + ")", _self).each(function () {
                        $(this).fadeIn(500);
                        $(this).css("display", "block");
                    })
                }
            }
            var timer;
            timer = setInterval(scroll, options.scrollTime);
            _self.bind("mouseover", function () {
                clearInterval(timer);
            });
            _self.bind("mouseout", function () {
                timer = setInterval(scroll, options.scrollTime);
            });

        });
    }
})(jQuery);




$(document).on("mouseover", ".support", function () {

    function loadImage(obj, url, callback) {
        var img = new Image();
        img.src = url;

        // console.log(url)

        // 判断图片是否在缓存中
        if (img.complete) {
            callback.call(img, obj);
            return;
        }

        // 图片加载到浏览器的缓存中回调函数
        img.onload = function () {
            callback.call(img, obj);
        }
    }

    function showImage(obj) {
        obj.attr("src", this.src)
    }
    var targetId = $(this).data("target")
    // loadImage($(targetId + ' img'), $(targetId + ' img').data("slide"), showImage);
    // console.log($(targetId + ' img').data("slide"))
    loadImage($(targetId + ' img'), $(targetId + ' img').data("slide"), showImage);
    $(targetId).css("width", "13rem")
});
// $(".support").mouseover(function () {

//     var targetId = $(".support").data("target")
//     loadImage($(targetId + ' img'), $(targetId + ' img').data("slide"), showImage);
//     console.log(targetId)
//     $(targetId).css("width", "13rem")
//     // weixin.setAttribute("style","display:inline;;")
// })
$(document).on("mouseleave", ".support", function () {
    var targetId = $(this).data("target")
    $(targetId).css("width", "0")
    // weixin.attr("style","display:none")
})


$(document).ready(function () {
    if ($("#sItem")) {
        $("#sItem").scrollQ();
    }

});

