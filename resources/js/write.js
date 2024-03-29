
function cmsWriteInit() {
    loadCategory()
    loadTags()
}


var cmsWrite = {
    defaultCategoryId: null,
    articleId: null,
    selectTags: []

}

function setSelectTags(sel) {
    if (sel) {
        cmsWrite.selectTags = sel;
    }
}
var beforeTagData = []
var port = window.location.port
var url = location.hostname+":"+port

var protocol = window.location.protocol;
var token = $.cookie('Authorization')

let selectTagsMap = {}
let suggestionsTags = []

Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
function readerlatex() {
    var mathElems = document.getElementsByClassName("katex");
    var elems = [];
    for (const i in mathElems) {
        if (mathElems.hasOwnProperty(i)) elems.push(mathElems[i]);
    }

    elems.forEach(elem => {
        katex.render(elem.textContent, elem, { throwOnError: false, displayMode: elem.nodeName !== 'SPAN', });
    });
    loadImg('markdown-preview')
    mermaid.init({ noteMargin: 10 }, $(".mermaid"));

    $(".markdown-btn").click(function(){
        $(this).siblings(".markdown-btn-content").slideToggle()
    })
}


function loadCategory() {
    $.ajax({
        url: protocol + "//" + url + "/api/category",
        headers: {
            'Content-Type': 'application/json;charset=utf8',
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
        type: "get",
        success: function (data) {
            // console.log(data.data)
            var datas = data.data
            for (var i = 0; i < datas.length; i++) {
                // console.log(datas[i].name)
                $("#categories").append("<option value='" + datas[i].id + "' >" + datas[i].name + "</option>");
            }
            if (cmsWrite.defaultCategoryId) {
                $("#categories").val(cmsWrite.defaultCategoryId)
            }
        }
    });
}


function showTags() {
    $(function () {
        var tags = $('#my-tag-list').tags({
            tagData: beforeTagData,
            suggestions: suggestionsTags,
            excludeList: ["not", "these", "words"],
            beforeAddingTag: function (tag) {
                $.ajax({
                    url: protocol + "//" + url + "/api/tags",
                    headers: {
                        'Content-Type': 'application/json;charset=utf8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    },
                    dataType: "json",
                    type: 'POST',
                    data: JSON.stringify({ "name": tag, "slugName": tag }),
                    success: function (data) {
                        // console.log(data.data.id)
                        cmsWrite.selectTags.push(data.data.id)
                        selectTagsMap[data.data.name] = data.data.id
                        // console.log(cmsWrite.selectTags)
                        // console.log(selectTagsMap)
                        // articleId = data.data.id
                        // Toast("更新文章" + data.data.title + "成功！", 'success')
                    }
                });
            },
            afterDeletingTag: function (tag) {
                cmsWrite.selectTags.remove(selectTagsMap[tag])
                // console.log(cmsWrite.selectTags)
                // console.log(selectTagsMap)
            }
        });
    })
}



function loadTags() {
    $.ajax({
        url: protocol + "//" + url + "/api/tags",
        headers: {
            'Content-Type': 'application/json;charset=utf8',
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
        type: "get",
        success: function (data) {
            // console.log(data.data)
            data.data.forEach(item => {
                if (cmsWrite.selectTags.includes(item.id)) {
                    beforeTagData.push(item.name)
                    // console.log(item.name)
                }
                suggestionsTags.push(item.name)
                selectTagsMap[item.name] = item.id
                showTags()
            });
        }
    });
}




/***基于markdownit */
// var md = window.markdownit({
//     html: true,
// });
// function formatHtml() {

//     var result = md.render($("#textInput").val());
//     $("#preview").html(result);
// }
// $(function () {

//     $("#textInput").bind('input propertychange', function () {
//         this.style.height = this.scrollHeight + 'px';
//         // console.log(this.style.height)
//         // console.log(this.scrollHeight)

//         var result = md.render($(this).val());
//         $("#preview").html(result);
//     });
// })

 
function articleOption() {
    function createArticle() {
        let textInput = $("#textInput").val()
        let categories = $("#categories").val()
        let title = $("#title").val()
        let picPath = $("#picPath").val()
        let css = $("#css").val()
        let js = $("#js").val()

        let bilibili = $("#bilibili").val()
        let youtube = $("#youtube").val()
        let video = $("#video").val()



        let picThumbPath = $("#picThumbPath").val()
        if (title == "") {
            // alert("文章标题不能为空")
            handleMessage("文章标题不能为空")
            return
        }
        // if (categories == "" || categories == 0) {
        //     // alert("文章分类不能为空")
        //     Toast("文章分类不能为空", 'error')
        //     return
        // }
        if (textInput == "") {
            // alert("文章内容不能为空")
            handleMessage("文章内容不能为空")
            return
        }
        let summary = $("#summary").val()
        return {
            originalContent: textInput, // 输入的markdown
            tagIds: cmsWrite.selectTags,
            categoryId: categories,
            title: title,
            css:css,
            js:js,
            summary: summary,
            picPath: picPath,
            picThumbPath: picThumbPath,
            bilibili:bilibili,
            youtube: youtube,
            video: video
        };
    }
    $("#previewNet").click(function () {
        if (cmsWrite.articleId) {
            window.open("/preview/article/" + cmsWrite.articleId, "_blank");
        } else {
            handleMessage("没有任何文章不能预览！")
        }
    })
    $("#submitUpdate").click(function () {
        var params = createArticle()
        if (params) {
            // console.log(params.categoryId)
            if (params.categoryId == "" || params.categoryId == null) {
                // alert("文章分类不能为空")
                handleMessage("发布文章时，文章分类不能为空")
                return
            }
            jsonData = JSON.stringify(params)
            // console.log(jsonData)

            let address = protocol + "//" + url + "/api/article/update/" + cmsWrite.articleId

            $.ajax({
                url: address,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                type: 'POST',
                data: jsonData,
                success: function (data) {
                    // console.log(data)
                    cmsWrite.articleId = data.data.id
                    handleMessage("更新文章" + data.data.title + "成功！")
                    let linkPath = $("#linkPath").val()
                    // console.log(linkPath)
                    window.location.href = linkPath //"/" + data.data.path + "/" + data.data.viewName + ".html"

                }
            });
        }

    })
    $("#submitCreate").click(function () {

        if (createArticle()) {

            var params = createArticle()
            // console.log(params.categoryId)
            if (params.categoryId == "" || params.categoryId == null) {
                // alert("文章分类不能为空")
                handleMessage("发布文章时，文章分类不能为空")
                return
            }
            let address = protocol + "//" + url + "/api/article"
            $.ajax({
                url: address,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                type: 'POST',
                data: JSON.stringify(params),
                success: function (data) {
                    // console.log(data.data.id)
                    cmsWrite.articleId = data.data.id
                    handleMessage("添加文章" + data.data.title + "成功！")
                    window.location.href = "/" + data.data.path + "/" + data.data.viewName + ".html"
                }
            });
        }

    })

    /**
         * 保存文章
         */
    function save(more) {
        console.log(more)
        let article = createArticle();
        if (article) {
            let jsonData = JSON.stringify(article)
            // console.log(jsonData)
            if (cmsWrite.articleId) {
                $.ajax({
                    url: more ? protocol + "//" + url + "/api/article/save/" + cmsWrite.articleId + "?more=true" : protocol + "//" + url + "/api/article/save/" + cmsWrite.articleId,
                    headers: {
                        'Content-Type': 'application/json;charset=utf8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    },
                    type: 'POST',
                    data: jsonData,
                    success: function (data) {
                        // console.log(data.data)
                        $("#markdown-preview").html(data.data.formatContent)
                        readerlatex()
                        // console.log(data.data.id)
                        cmsWrite.articleId = data.data.id
                        // Toast("更新文章" + data.data.title + "成功！", 'success')
                        handleMessage("更新文章" + data.data.title + ", " + data.message)

                    }, error: function (data) {
                        handleMessage("更新文章" + data.data.title + ", " + data.message)
                    }
                });
            } else {
                $.ajax({
                    url: more ? protocol + "//" + url + "/api/article/save?more=true" : protocol + "//" + url + "/api/article/save",
                    headers: {
                        'Content-Type': 'application/json;charset=utf8',
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    },
                    // dataType: "json",
                    type: 'POST',
                    data: jsonData,
                    success: function (data) {
                        $("#markdown-preview").html(data.data.formatContent)
                        readerlatex()
                        cmsWrite.articleId = data.data.id
                        // Toast("添加文章" + data.data.title + "成功！", 'success')
                        handleMessage("添加文章" + data.data.title + "成功！")
                        history.pushState("state", "", "/user/edit/" + cmsWrite.articleId)
                        $("#submitCreate").css("display", "none")
                        $("#submitUpdate").css("display", "inline-block")

                    }
                });
            }
        }

    }

    $("#save").click(function () {
        save(true)
    })

    document.addEventListener("keydown", function (event) {
        if (event.altKey && event.keyCode === 83) {
            event.preventDefault();
            save(false)
        }
    })
    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.keyCode === 83) {
            event.preventDefault();
            save(true)
        }
    })
}










// 复制的方法
function copyText(text, callback) { // text: 要复制的内容， callback: 回调
    var tag = document.createElement('input');
    tag.setAttribute('id', 'cp_hgz_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('cp_hgz_input').select();
    document.execCommand('copy');
    document.getElementById('cp_hgz_input').remove();
    if (callback) { callback(text) }
}


// $("#uploadPanel").click(function (event) {
//     event.stopPropagation();
// })

function handleType(attachment) {
    var mediaType = attachment.mediaType;
    // 判断文件类型
    let result = ""

    if (mediaType) {
        var prefix = mediaType.split("/")[0];
        if (prefix === "image") {
            result = "<img src='" + attachment.path + "'>"
            console.log("image")
        } else if (prefix === "audio") {
            result = "<audio controls src='" + attachment.path + "'></audio>"
            console.log("audio")
        } else if (prefix === "video") {
            result = "<video style='width:100%' controls src='" + attachment.path + "'></video>"
            console.log("video")
        } else {
            result = "<a href='" + attachment.path + "' >点击下载</a>"
            console.log("附件")
        }

        // $("#textInput").insertAtCaret(result)

    }
    // 没有获取到文件返回false
    return result;
}


// $("#file").change(function () {
//     var fd = new FormData();
//     // 如果有多张图片一块上传，下面直接使用fd.append()继续追加即可
//     if (document.getElementById("file").files[0]) {
//         fd.append("file", document.getElementById("file").files[0]);
//         $.ajax({
//             url: protocol + "//" + url + "/api/attachment/upload",
//             headers: {
//                 'Content-Type': 'application/json;charset=utf8',
//                 'Authorization': 'Bearer ' + token,
//                 'Accept': 'application/json'
//             },
//             type: 'post',
//             data: fd,
//             dataType: 'json',
//             contentType: "application/json;charset=UTF-8",
//             processData: false,
//             contentType: false,
//             xhr: function () {
//                 var xhr = new XMLHttpRequest();
//                 //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
//                 xhr.upload.addEventListener('progress', function (e) {
//                     console.log(e);
//                     //loaded代表上传了多少
//                     //total代表总数为多少
//                     var progressRate = (e.loaded / e.total) * 100;
//                     console.log(progressRate)

//                     //通过设置进度条的宽度达到效果
//                     $('.progress > div').css('width', progressRate + '%');
//                     $('.progress > div').html(progressRate + '%')
//                     if (progressRate == 100) {
//                         $('.progress > div').html("上传服务器完成，请等待！")
//                     }
//                 })

//                 return xhr;
//             },
//             success: function (data) {
//                 testEditor.insertValue(handleType(data.data));
//                 $('.progress > div').html("上传完成！")
//                 uploadPanel();
//             }
//         });
//     }

// })
function uploadFile(){
    $("#file").change(function () {
        var fd = new FormData();
        // 如果有多张图片一块上传，下面直接使用fd.append()继续追加即可
        if (document.getElementById("file").files[0]) {
            fd.append("file", document.getElementById("file").files[0]);
            $.ajax({
                url: protocol + "//" + url + "/api/attachment/upload",
                headers: {
    
                    'Authorization': 'Bearer ' + token
                },
                type: 'post',
                data: fd,
                dataType: 'json',
                contentType: "application/json;charset=UTF-8",
                processData: false,
                contentType: false,
                xhr: function () {
                    var xhr = new XMLHttpRequest();
                    //使用XMLHttpRequest.upload监听上传过程，注册progress事件，打印回调函数中的event事件
                    xhr.upload.addEventListener('progress', function (e) {
                        console.log(e);
                        //loaded代表上传了多少
                        //total代表总数为多少
                        var progressRate = (e.loaded / e.total) * 100;
                        console.log(progressRate)
                     
                        //通过设置进度条的宽度达到效果
                        $('.progress > div').css('width', progressRate + '%');
                        $('.progress > div').html(progressRate + '%')
                        if (progressRate == 100) {
                            $('.progress > div').html("上传服务器完成，请等待！")
                        }
                    })
    
                    return xhr;
                },
                success: function (data) {
                    // testEditor.insertValue(handleType(data.data));
                    $('.progress > div').html("上传完成！")
                    uploadPanel();
                    handleMessage("上传成功")
                    loadAttachment(0)
                    console.log(data)
                    
                }
            });
        }
    
    })
}

// 拷贝附件路径到剪切板
function copyImgPath(path, mediaType) {
    // console.log(path + "-" + mediaType)
    let result = ""

    if (mediaType) {
        var prefix = mediaType.split("/")[0];
        if (prefix === "image") {
            result = path
            console.log("image")
        } else if (prefix === "audio") {
            result = "<audio controls src='" + path + "'></audio>"
            console.log("audio")
        } else if (prefix === "video") {
            result = "<video style='width:100%' controls src='" + path + "'></video>"
            console.log("video")
        } else {
            result = "<a href='" + path + "' >点击下载</a>"
            console.log("附件")
        }
    }
    copyText(result, function () {
        handleMessage("成功复制到剪切板！")
    })
}


function deleteAttachment(id) {
    let address = protocol + "//" + url + "/api/attachment/delete/" + id;
    fetch(address, {
        headers: {
            'Content-Type': 'application/json;charset=utf8',
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
        credentials: "include",
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data)
        loadAttachment()
    })
}

let totalPages;
//分页加载附件数据
function loadAttachment(page) {
    let address = protocol + "//" + url + "/api/attachment?page=" + page;
    fetch(address, {
        headers: {
            'Content-Type': 'application/json;charset=utf8',
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
        credentials: "include",
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        totalPages = data.data.totalPages;
        console.log(data)
        var content = ""
        for (var i = 0; i < data.data.content.length; i++) {
            console.log()
            content += " <li   class=\"list-group-item \">"
                + "<a href='javascript:;' onclick=\"updateAttachmentInput(" + data.data.content[i].id + ")\">修改</a>"
                + "<a href='javascript:;' onclick=\"deleteAttachment(" + data.data.content[i].id + ")\">删除</a>"
                + "<a  href='javascript:;' onclick=\"copyImgPath('" + data.data.content[i].path + "','" + data.data.content[i].mediaType + "')\" >复制</a>"

                + handleType(data.data.content[i])
                + "</li>"
        }
        $("#attachment-list").html(content)
    });
}

$('.attachment').pagination({
    pageCount: totalPages,
    jump: true,
    callback: function (api) {
        var data = {
            page: api.getCurrent(),
            name: 'mss',
            say: 'oh'
        };
        console.log(data.page)
        loadAttachment(data.page - 1)
    }

});


function attachmentPanel() {

    if ($(".drawer-attachment").css("display") == "none") {
        // console.log("kkkkk")
        $(".drawer-attachment").css({ display: 'block' });
        $(".drawer-attachment").animate({ width: '40%' });
        loadAttachment(0)
    } else {
        $(".drawer-attachment").animate({ width: '0px' }, function () {
            $(".drawer-attachment").css({ display: 'none' });
        });
    }

}


// 打开附件快捷键
document.addEventListener("keydown", function (event) {
    if (event.altKey && event.keyCode === 67) {
        attachmentPanel();
    }
})
$("#attachment").click(function () { attachmentPanel(); })





/***************************************** */
function uploadPanel() {
    if ($("#uploadPanel").css("display") == "none") {
        $("#uploadPanel").slideToggle("fast");
        $("body").css("overflow", "hidden");
    } else {
        $("#uploadPanel").slideToggle("fast");
        $("body").css("overflow", "auto");
    }
}


$("#uploadFile").click(function (event) {
    uploadPanel()


})
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.keyCode === 81) {
        uploadPanel()
    }
})

// document.addEventListener("click",function(e){
//     console.log(event.target.id)
//     var _list = $('#uploadFile');
//     if ($("#uploadPanel").css("display") == "block"&&!_list.is(e.target) && _list.has(e.target).length === 0) {
//         uploadPanel()
//     }
// })










// // mermaid 图渲染
// function renderMermaid(componentInput, componentPreview) {
//     var needsUniqueId = "render" + (Math.floor(Math.random() * 10000)).toString(); //should be 10K attempts before repeat user finger stops working before then hopefully
//     function mermaidApiRenderCallback(graph) {
//         // $('#mermaidPreview').html(graph);
//         componentPreview.html(graph)
//     }
//     try {
//         mermaid.mermaidAPI.render(needsUniqueId, componentInput, mermaidApiRenderCallback);
//     } catch (e) {
//         componentPreview.html(componentPreview.html() + e)
//     }
// }

// // latex 服务器渲染
// function renderLatex(componentInput, componentPreview) {
//     $.ajax({
//         url: protocol + "//" + url + "/api/latex/svg",
//         headers: {
//             'Authorization': 'Bearer ' + token,
//             'Accept': 'application/json'
//         },
//         type: 'post',
//         // dataType: 'xml',
//         contentType: "application/json;charset=UTF-8",
//         data: JSON.stringify({ "latex": componentInput }),
//         success: function (data) {
//             componentPreview.html(data)
//         }
//     });
// }






// function updateAttachmentInput(id) {
//     svgAttachmentId = id;
//     let componentPreview = $("#componentPreview")
//     $("#fixed-card").css("display", "block")
//     $.ajax({
//         url: protocol + "//" + url + "/api/attachment/find/" + id,
//         headers: {
//             'Content-Type': 'application/json;charset=utf8',
//             'Authorization': 'Bearer ' + token,
//             'Accept': 'application/json'
//         },
//         type: 'get',
//         dataType: 'json',
//         contentType: "application/json;charset=UTF-8",
//         success: function (data) {
//             $("#componentInput").val(data.data.originContent)
//             if (data.data.renderType == "mermaid") {
//                 renderMermaid(data.data.originContent, componentPreview)
//                 $("#componentInput").attr("data-render", "mermaid")
//                 $("#svg-header").html("修改mermaid")
//             } else if (data.data.renderType == "latex") {

//                 $("#componentInput").attr("data-render", "latex")
//                 $("#svg-header").html("修改Latex")

//                 renderLatex(data.data.originContent, componentPreview)
//             } else {
//                 $("#componentInput").attr("data-render", "svg")
//                 $("#svg-header").html("修改Svg")
//                 componentPreview.html(data.data.originContent)
//             }
//         }
//     });
//     // uploadStrContentChange($("#componentInput").val(), $("#componentPreview").html(),true,id)
//     // $("#fixed-card").css("display", "none")
//     // console.log(id)
// }

// 添加svg
// $(".openSvgPanel").click(function () {
//     let dataRender = $(this).attr("data-render")
//     if (dataRender == "mermaid") {
//         $("#componentInput").attr("data-render", "mermaid")
//         $("#svg-header").html("插入Mermaid")
//         $("#fixed-card").css("display", "block")
//     } else if (dataRender == "latex") {

//         $("#componentInput").attr("data-render", "latex")
//         $("#svg-header").html("插入Latex")
//         $("#fixed-card").css("display", "block")
//     } else if (dataRender == "svg") {

//         $("#componentInput").attr("data-render", "svg")
//         $("#svg-header").html("插入SVG")
//         $("#fixed-card").css("display", "block")
//     }
// })


// $("#closeBtn").click(function () {
//     $("#fixed-card").css("display", "none")
// })





function createCategory() {
    let textInput = $("#textInput").val()
    // let categories = $("#categories").val()
    let name = $("#name").val()
    let cssClass = $("#cssClass").val()
    let picPath = $("#picPath").val()
    let picThumbPath = $("#picThumbPath").val()
    let parse = $("#parse").val()
    if (name == "") {
        // alert("文章标题不能为空")
        handleMessage("分类标题不能为空")
        return
    }
    // if (categories == "" || categories == 0) {
    //     // alert("文章分类不能为空")
    //     Toast("文章分类不能为空", 'error')
    //     return
    // }
    // if (textInput == "") {
    //     // alert("文章内容不能为空")
    //     Toast("文章内容不能为空", 'error')
    //     return
    // }
    // let summary = $("#summary").val()
    return {
        originalContent: textInput, // 输入的markdown
        name: name,
        cssClass:cssClass,
        picPath: picPath,
        picThumbPath: picThumbPath,
        parse: parse
    };
}



function saveCategory(id) {
    function save(){
        var params = createCategory()
        console.log(params)
       
        if (params) {

            jsonData = JSON.stringify(params)
            // console.log(jsonData)

            let address = protocol + "//" + url  + "/api/category/save/" + id
            console.log(address)
            $.ajax({
                url: address,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                type: 'POST',
                data: jsonData,
                success: function (data) {
                    $("#markdown-preview").html(data.data.formatContent)
                    handleMessage("保存分类" + data.data.name + "成功！", 'success')
                    // window.location.href = "/" + data.data.path + "/" + data.data.viewName + ".html"

                }
            });
        }
    }
    $("#saveCategory").click(function () {
       
        save()
    })


    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.keyCode === 83) {
            event.preventDefault();
            save()
        }
    })
}



function categoryUpdate(id) {
    $("#categoryUpdate").click(function () {
        var params = createCategory()
        console.log(params)
        if (params) {

            jsonData = JSON.stringify(params)
            // console.log(jsonData)

            let address = protocol + "//" + url  + "/api/category/update/" + id

            $.ajax({
                url: address,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                type: 'POST',
                data: jsonData,
                success: function (data) {
                    handleMessage("更新分类" + data.data.name + "成功！", 'success')
                    window.location.href = "/" + data.data.path + "/" + data.data.viewName + ".html"

                }
            });
        }

    })

}





function createLiterature() {
    let title = $("#title").val()
    // let categories = $("#categories").val()
    let originalContent = $("#originalContent").val()
    
   
    // if (categories == "" || categories == 0) {
    //     // alert("文章分类不能为空")
    //     Toast("文章分类不能为空", 'error')
    //     return
    // }
    // if (textInput == "") {
    //     // alert("文章内容不能为空")
    //     Toast("文章内容不能为空", 'error')
    //     return
    // }
    // let summary = $("#summary").val()
    return {
        title: title, // 输入的markdown
        originalContent: originalContent,
        tagIds: cmsWrite.selectTags
    };
}



function saveLiterature(id) {
    function save(){
        var params = createLiterature()
        console.log(params)
       
        if (params) {

            jsonData = JSON.stringify(params)
            // console.log(jsonData)

            let address = protocol + "//" + url  + "/api/literature/save/" + id
            console.log(address)
            $.ajax({
                url: address,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                type: 'POST',
                data: jsonData,
                success: function (data) {
                    $("#markdown-preview").html(data.data.formatContent)
                    handleMessage("保存分类" + data.data.name + "成功！", 'success')
                    // window.location.href = "/" + data.data.path + "/" + data.data.viewName + ".html"

                }
            });
        }
    }
    $("#saveLiterature").click(function () {
       
        save()
    })


    document.addEventListener("keydown", function (event) {
        if (event.ctrlKey && event.keyCode === 83) {
            event.preventDefault();
            save()
        }
    })
}



function literatureUpdate(id) {
    $("#literatureUpdate").click(function () {
        var params = createLiterature()
        console.log(params)
        if (params) {

            jsonData = JSON.stringify(params)
            // console.log(jsonData)

            let address = protocol + "//" + url  + "/api/literature/update/" + id

            $.ajax({
                url: address,
                headers: {
                    'Content-Type': 'application/json;charset=utf8',
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                },
                type: 'POST',
                data: jsonData,
                success: function (data) {
                    handleMessage("更新分类" + data.data.name + "成功！", 'success')
                    window.location.href = "/" + data.data.path + "/" + data.data.viewName + ".html"

                }
            });
        }

    })

}