// var bolb = new Blob([ss],{type:"audio/mpeg"});
// var url = window.URL.createObjectURL(bolb);
/******************************单词点击发音***************************** */
var sound = $(".sound")
if (sound.length != 0) {
    // console.log("exist sound"+sound.length)
    var audio = document.createElement("audio");


    // console.log($(".sound").length)
    sound.each(function (i) {
        // console.log(  $(sound[i]).attr('naudio'))
        $(sound[i]).click(function () {
            // console.log($(sound[i]).attr('naudio'))
            audio.src = $(sound[i]).attr('naudio');
            // audio.controls = "controls";
            document.body.appendChild(audio);
            audio.play();
        })
    })
}





// sound.click(function(){
//   var a=$(this).index;
//   console.log(a)
// })
/***************************分享代码****************************** */
function shareTo(stype) {
    var ftit = '';
    var flink = '';
    var lk = '';
    var summary = '生命科学知识分享';
    //获取文章标题
    ftit = $('title').text();
    console.log(ftit)
    //获取网页中内容的第一张图片
    flink = $('.markdown').find('img').eq(0).attr('src');
    if (typeof flink == 'undefined') {
        flink = '';
    }
    // console.log(flink)
    //当内容中没有图片时，设置分享图片为网站logo
    // if (flink == '') {
    //   lk = 'http://' + window.location.host + '/static/images/logo.png';
    // }
    //如果是上传的图片则进行绝对路径拼接
    if (flink.indexOf('/uploads/') != -1) {
        lk = 'http://' + window.location.host + flink;
    }
    if (document.querySelector('meta[name="description"]')) {
        summary = document.querySelector('meta[name="description"]').getAttribute('content')
    }


    //qq空间接口的传参
    if (stype == 'qzone') {
        // console.log('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + document.location.href + '&sharesource=qzone&title=' + ftit + '&pics=' + flink + '&summary=' + "122")
        window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=' + document.location.href + '&sharesource=qzone&title=' + ftit + '&pics=' + flink + '&summary=' + summary);
    }


    // //新浪微博接口的传参
    // if (stype == 'sina') {
    //     window.open('http://service.weibo.com/share/share.php?url=' + document.location.href + '?sharesource=weibo&title=' + ftit + '&pic=' + lk + '&appkey=2706825840');
    // }
    // //qq好友接口的传参
    // if (stype == 'qq') {
    //     window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + document.location.href + '?sharesource=qzone&title=' + ftit + '&pics=' + lk + '&summary=' + document.querySelector('meta[name="description"]').getAttribute('content') + '&desc=php自学网，一个web开发交流的网站');
    // }
    // //生成二维码给微信扫描分享
    // if (stype == 'wechat') {
    //     window.open('inc/qrcode_img.php?url=http://zixuephp.net/article-1.html');
    // }
}

// 图片居中
$('.markdown p').find('> img').parent().css({ "display": 'flex', "justify-content": "center", "align-items": "center" });


// 图片点击放大
$(".markdown img").click(function () {
    var imgsrc = $(this).attr("src");
    var opacityBottom = '<div id="opacityBottom" style="display: none"><img class="bigImg" src="' + imgsrc + '" ></div>';
    $(document.body).append(opacityBottom);
    toBigImg();//变大函数
});

function toBigImg() {

    $("#opacityBottom").addClass("opacityBottom");
    $("#opacityBottom").show();
    $("html,body").addClass("none-scroll");//下层不可滑动
    $(".bigImg").addClass("bigImg");
    /*隐藏*/
    $("#opacityBottom").bind("click", clickToSmallImg);
    $(".bigImg").bind("click", clickToSmallImg);
    var imgHeight = $(".bigImg").prop("height");
    // if (imgHeight < h) {
    //     $(".bigImg").css({ "top": (h - imgHeight) / 2 + 'px' });

    // } else {
    //     $(".bigImg").css({ "top": '0px' });
    // }
    function clickToSmallImg() {
        $("html,body").removeClass("none-scroll");
        $("#opacityBottom").remove();
    }
};

// 增加浏览量
var url = location.hostname;
var protocol = window.location.protocol;
// var token = $.cookie('viewId')
var port = window.location.port

function downloadPDF(articleId) {
    let httpUrl = protocol + "//" + url;
    if (port) {
        httpUrl += ":" + port;
    }
    // console.log()
    window.open(httpUrl + "/download/article/" + articleId);
}

function downloadSheetPDF(id) {
    let httpUrl = protocol + "//" + url;
    if (port) {
        httpUrl += ":" + port;
    }
    // console.log()
    window.open(httpUrl + "/download/sheet/" + id);
}


function increaseViewCount(articleId) {
    if ($.cookie("viewId") != articleId) {
        $.ajax({
            url: protocol + "//" + url + "/option/increaseViewCount/" + articleId,
            headers: {
                'Content-Type': 'application/json;charset=utf8',
                'Accept': 'application/json'
            },
            type: "get",
            success: function (data) {
                $.cookie(
                    "viewId",
                    articleId,//需要cookie写入的业务
                    {
                        "path": "/", //cookie的默认属性
                    }
                );
                document.getElementById("visits").innerHTML = data.data
            }, error: function (e) {
                // console.log(e)
                console.log(e.status);
                // console.log(e.responseJSON.message);
            }

        });
    } else {
        $.ajax({
            url: protocol + "//" + url + "/option/getVisitsCount/" + articleId,
            headers: {
                'Content-Type': 'application/json;charset=utf8',
                'Accept': 'application/json'
            },
            type: "get",
            success: function (data) {
                document.getElementById("visits").innerHTML = data.data
            }, error: function (e) {
                // console.log(e)
                console.log(e.status);
                // console.log(e.responseJSON.message);
            }

        });
    }

}

// 点赞状态
function likeStatus(articleId) {

    if ($.cookie("likeId") == articleId) {
        $("#like-img").attr("src", "/templates/resources/img/like_.svg");
    }
}

// 点赞
function increaseLikeCount(articleId) {
    if ($.cookie("likeId") != articleId) {
        $.ajax({
            url: protocol + "//" + url + " /option/increaseLikeCount/" + articleId,
            type: "get",
            success: function (data) {
                $.cookie(
                    "likeId",
                    articleId,//需要cookie写入的业务
                    {
                        "path": "/", //cookie的默认属性
                    }
                );
                document.getElementById("like").innerHTML = data.data
                $("#like-img").attr("src", "/templates/resources/img/like_.svg");
            }
        });
    }
}
// console.log(userCard)
// 目录导航高度
function setContentTableHeight() {
    let headerHeight = $("#header").outerHeight(true)
    let windowHeight = $(window).height()
    let userCard = $("#user-card").outerHeight(true)
    let footerHeight = $("#footer").outerHeight(true)
    let documentHeight = $(document).height()
    let mainContentHeight = $("#main-content").outerHeight(true)
    let scrollTop = $(document).scrollTop()
    let bottom = footerHeight - (documentHeight - windowHeight)

    // console.log(mainContentHeight > siderbarHeight)
    let contentTableHeight = windowHeight - headerHeight - userCard - 18
    if (bottom > 0) {
        contentTableHeight = contentTableHeight - bottom
    }
    // console.log(contentTableHeight)
    $("#content-table").css("max-height", contentTableHeight + "px");
}

if (document.body.clientWidth >= 977) {
    setContentTableHeight()
}


var url = location.hostname;
var protocol = window.location.protocol;
var token = $.cookie('Authorization')
function deleteArticle(id,path, viewName) {

    if (confirm("确定删除该文章?")) {
        $.ajax({
            url: protocol + "//" + url + "/api/article/delete/" + id,
            headers: {
                'Content-Type': 'application/json;charset=utf8',
                'Authorization': 'Bearer ' + token
            },
            type: "get",
            success: function (data) {
                console.log(viewName)
                var datas = data.data
                // Toast("删除文章" + data.data.title + "成功！", 'success')
                window.location.href = "/"+path+"/" + viewName + ".html";
            }
        });

    }

}

function deleteArticleReturn(id,path, viewName) {

    if (confirm("确定删除该文章?")) {
        $.ajax({
            url: protocol + "//" + url + "/api/article/delete/" + id,
            headers: {
                'Content-Type': 'application/json;charset=utf8',
                'Authorization': 'Bearer ' + token
            },
            type: "get",
            success: function (data) {
                // console.log(data.data)
                var datas = data.data
                // Toast("删除文章" + data.data.title + "成功！", 'success')
                window.location.href = "/"+path+"/" + viewName + ".html";
            }
        });

    }

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

function loadImg() {
    var lazys = document.querySelectorAll(".lazy");
    var arr = [...lazys]
    arr.forEach((val) => {
        console.log(val.dataset.original)
        loadImage(val, val.dataset.original, showImage);
    })
}


// const onAllImgLoaded = async (root) => { 
//     const imgNodes = root instanceof HTMLImageElement ? [root] : root.querySelectorAll('img');         
//     let imgArr = Array.prototype.slice.call(imgNodes);         
//     return await Promise.all(imgArr.map(img=> {  new Promise(resolve=>{ img.addEventListener('load',()=> resolve(img)) })  })  ) 
// }
function loadImgCall(fun, id) {
    var lazys = document.querySelectorAll(".lazy");
    var arr = [...lazys]
    arr.forEach((val) => {
        console.log(val.dataset.original)
        loadImage(val, val.dataset.original, showImage);
    })
    fun(id)
    // onAllImgLoaded(document.getElementById(id)).then(()=>{  }).catch(()=>{console.log(1111111)})
    
}


