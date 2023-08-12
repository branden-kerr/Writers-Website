
exports.getOverview = async (req, res, next) => {

  res.status(200).render('overview', {
    page_name: 'overview'
  });
};

exports.getShop = async (req, res, next) => {
  res.status(200).render('shop', {
    page_name: 'shop'
  });
};

exports.getLogin = async (req, res, next) => {
  res.status(200).render('login', {
    age: 16,
    page_name: 'login'
  });
};

exports.getSignup = async (req, res, next) => {
  res.status(200).render('signup', {
    page_name: 'signup'
  })
};

exports.getMyAccount = async (req, res, next) => {
  try {
    res.status(200).render('account', {
      page_name: 'account'
    });
  } catch (error) {
    console.log(error);
  }
}

exports.getNewStory = async (req, res, next) => {

  res.status(200).render('newStory', {
    page_name: 'newStory'
  })
};

