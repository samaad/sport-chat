module.exports = function(Users, async){
   return {
    SetRouting: function(router){
      router.get('/group/:name', this.groupPage);
      router.post('/group/:name', this.groupPostPage);
      
      router.get('/logout', this.logout);
    },
    groupPage: function(req, res){
      const name = req.params.name;
      res.render('groupchat/group', {title: 'Footballkik - Group',  user:req.user, groupName:name})
    },
    groupPostPage: function(req, res){
      
    },
    
    logout: function(req, res){
      req.logout();
      req.session.destroy((err) => {
          res.redirect('/');
      });
    }
  }
}