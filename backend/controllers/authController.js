exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
      // ✅ Store user ID in session
      req.session.user = { id: user._id, email: user.email, role: user.role };
      
      res.json({ message: "Login successful", user: req.session.user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  