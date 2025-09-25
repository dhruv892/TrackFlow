export const getAllBugs = (req, res) => {
  res.json({
    message: "Get all bugs endpoint",
    bugs: [], // Empty for now
  });
}

export const createBug = (req, res) => {
	res.json({
		message: "Create bug endpoint",
		data: req.body,
	});
};

export const getBug = (req, res) => {
  res.json({
    message: `Get bug ${req.params.id} endpoint`,
    id: req.params.id,
  });
}