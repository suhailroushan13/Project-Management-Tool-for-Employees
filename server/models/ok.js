router.get("/phone/verify/:token", async (req, res) => {
  try {
    let { token } = req.params;
    const phonePayload = jwt.verify(token, "phoneToken@cs");
    if (!phonePayload)
      return res.status(401).json({
        error: "Token expired. Request to resend a new Phone verification Link",
      });
    {
      let userData = await Users.findOne({
        "userverifytoken.phone": phonePayload.phoneToken,
      });

      if (!userData)
        userData = await Members.findOne({
          "userverifytoken.phone": phonePayload.phoneToken,
        });
    }
    userData.userverified.phone = true;
    // userData.userverifytoken.phone = null
    await userData.save();
    res
      .status(200)
      .json({ success: "The Mobile number has been Verified Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
