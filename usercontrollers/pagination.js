const usersHelper = require("../helpers/users-helper");

module.exports = {
    pagination: (req, res, next) => {
        usersHelper.removeorder(req.session.userdata._id).then(async() => {
            let uid = req.session.userdata._id;
            let pagenum = 1
            if (req.query.page) {
             pagenum =parseInt(req.query.page) 
            }
            let limit = 3;
            let firstindex = (pagenum - 1) * limit;
            let order = await usersHelper.order(uid, firstindex, limit);
            let count= await usersHelper.ordercount(uid)
            let length = Math.ceil(count / 5);
            let prevpage
            if (pagenum > 1) {
                prevpage = {
                    page: pagenum - 1,
                    limit:5
                }
                
            }
            let nextpage 
            if (pagenum < length) {
                nextpage = {
                    page: pagenum + 1,
                    limit: 5,
                  };
           }
        
            console.log(prevpage);
            console.log(nextpage);
            
            let paginationnum = [];
            for (i = 1; i <= length; i++){
                paginationnum.push({page:i})
            }
        res.next=nextpage
        res.prevpage=prevpage
        req.pag = paginationnum
            req.order = order;
            next();
        })
     
  
  },
};
