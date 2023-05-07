var url = location.hostname;
var protocol = window.location.protocol;
var port = window.location.port
const service = axios.create({
    baseURL: protocol+"//"+url+":"+port,
    timeout: 10000,
    withCredentials: true,
})


service.interceptors.request.use(function (config) {
    // let user = JSON.parse(window.sessionStorage.getItem('access-user'));
    // if (user) {
    //     token = user.token;
    // }
    var token = localStorage.getItem('Authorization');
    console.log(token)
    // let user = JSON.parse(localStorage.getItem("user"));
    // if(user){
        
    // }
    // if (token) {
    //     service.defaults.headers.common["Authorization"] = "Bearer " + token;
    //     console.log(token)
    // }
    config.headers.common["Authorization"] = "Bearer " + token;
    //console.dir(config);
    return config;
}, function (error) {
    // Do something with request error
    // console.info("error: ");
    message.error(error);
    return Promise.reject(error);
});


const articleApi = {}
articleApi.list = (categortId, page) => {
    return service({
        url: `/option/categoryAjax/${categortId}`,
        params: { page: page },
        method: 'get'
    })
}
articleApi.getVisit=(id)=>{
    return service({
        url: `/option/visit/${id}`,
        method: 'get'
    })
}


const commentApi={}
commentApi.add=(data_)=>{
    return service({
        url:'/api/comment',
        method:'post',
        data:data_
    })
}

commentApi.delete=(id)=>{
    return service({
        url:`/api/comment/deleteById/${id}`,
        method:'delete',
    })
}


const literatureApi = {}
literatureApi.syncLiterature = () => {
    return service({
        url: `/api/literature/sync`,
        method: 'get'
    })
}
