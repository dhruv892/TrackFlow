const DATA = [
	{
		id: 101,
		title: "Login button unresponsive",
		description:
			"Clicking the login button on the homepage does nothing on first attempt in Chrome 126.",
		status: "open",
		priority: "high",
		created_date: "2025-09-20T09:15:00Z",
		updated_date: "2025-09-24T01:30:00Z",
	},
	{
		id: 102,
		title: "Profile avatar upload fails",
		description:
			"Uploading JPG over 2MB returns 500 instead of 413 and no user-facing error.",
		status: "working",
		priority: "medium",
		created_date: "2025-09-18T14:05:00Z",
		updated_date: "2025-09-22T10:42:00Z",
	},
	{
		id: 103,
		title: "Dark mode ignored on refresh",
		description:
			"Theme resets to light after hard reload due to missing persistence in localStorage.",
		status: "open",
		priority: "low",
		created_date: "2025-09-21T17:22:00Z",
		updated_date: "2025-09-21T17:22:00Z",
	},
	{
		id: 104,
		title: "Payments page 404",
		description:
			"Navigating from cart to payments intermittently hits a 404 when route param is empty.",
		status: "working",
		priority: "critical",
		created_date: "2025-09-16T08:00:00Z",
		updated_date: "2025-09-23T12:10:00Z",
	},
	{
		id: 105,
		title: "Incorrect tooltip on save icon",
		description:
			"Tooltip reads 'Delete' instead of 'Save' on project detail header.",
		status: "closed",
		priority: "low",
		created_date: "2025-09-10T11:10:00Z",
		updated_date: "2025-09-19T09:55:00Z",
	},
	{
		id: 106,
		title: "CSV export encodes UTF-8 incorrectly",
		description:
			"Non-ASCII characters appear garbled when opening in Excel due to BOM handling.",
		status: "open",
		priority: "medium",
		created_date: "2025-09-22T06:45:00Z",
		updated_date: "2025-09-24T15:05:00Z",
	},
	{
		id: 107,
		title: "Search results pagination off-by-one",
		description:
			"Last page repeats records due to incorrect totalPages calculation.",
		status: "closed",
		priority: "medium",
		created_date: "2025-09-05T13:37:00Z",
		updated_date: "2025-09-12T16:20:00Z",
	},
	{
		id: 108,
		title: "Accessibility: focus ring missing",
		description:
			"Focusable controls lack visible focus state in Safari with keyboard navigation.",
		status: "working",
		priority: "high",
		created_date: "2025-09-15T07:25:00Z",
		updated_date: "2025-09-23T18:00:00Z",
	},
	{
		id: 109,
		title: "Notification badge count negative",
		description:
			"Badge shows -1 when all notifications are read due to underflow in decrement logic.",
		status: "open",
		priority: "high",
		created_date: "2025-09-24T13:00:00Z",
		updated_date: "2025-09-24T13:00:00Z",
	},
	{
		id: 110,
		title: "Session timeout not enforced",
		description:
			"API accepts expired JWT for ~60s after expiry because of clock skew tolerance.",
		status: "closed",
		priority: "critical",
		created_date: "2025-09-01T09:00:00Z",
		updated_date: "2025-09-11T09:30:00Z",
	},
];

export const getAllBugs = (req, res) => {
	return res.status(200).json(DATA);
};

export const getBug = (req, res) => {
	const id = parseInt(req.params.id);
	const bug = DATA.find((bug) => bug.id === id);

	if (bug) return res.status(200).json(bug);
	res.status(404).json({ msg: `Bug with id ${id} doesnt exist.` });
};
