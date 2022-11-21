
const useracct = require("../helpers/useracct");

module.exports = {
  userpage: async (req, res) => {
    let userid=req.session.userdata._id
    detail = await useracct.getuser(userid);
    req.session.username = detail.fname;
    user = detail.fname;
    res.render("user/userprofile", { detail, user});
  },
  updateuser: (req, res) => {
    console.log(req.body);
    useracct.updateuser(req.body, req.session.userdata._id).then(() => {
      res.json({ status: true });
    });
  },
  changepassword: (req, res) => {
    useracct
      .password(req.session.userdata._id, req.body)
      .then(() => {
        res.json({ status: true });
      })
      .catch(() => {
        res.json({ status: false });
      });
  },
};
