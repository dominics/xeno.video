export default () => (router) => {
  router.get("/401", (req, res) => {
    res.render("error", {
      message: "You are not allowed to log in to this app.",
      error: {},
    });
  });

  router.use((req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  return router;
};
