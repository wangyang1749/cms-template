```html
<!DOCTYPE html>
<html th:fragment="layout (head,content)" xmlns:th="http://www.thymeleaf.org">
<!-- th:replace="~{html/article/base :: layout(~{::head}, ~{::body})}" -->
<head th:replace="${head}">
    <!-- <title th:replace="${title}">Layout Title</title> -->
</head>

<body>
    <div th:insert="html/components/header :: #header"></div>
    <div th:replace="${content}">
        <p>Layout content</p>
    </div>
    <div th:insert="html/components/footer :: #footer"></div>

</body>

</html>
```

```html
<div th:text="${DEFAULT_CATEGORY_LIST}"></div>


<div class="g-bg p-2">
    <div cms:replace="~{${view.parentCategories.get(0).path}+'/CATEGORY_PARTNER/'+${view.parentCategories.get(0).viewName}} ?:_"
        parser>sss
    </div>
</div>
```