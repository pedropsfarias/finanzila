const healthController = {
  handle: (_req, res) => {
    res.status(200).json({ status: "ok" });
  }
};

export default healthController;
