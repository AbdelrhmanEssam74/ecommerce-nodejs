exports.getProfile = async (req, res) => {
  try {
    // كود جلب بيانات البروفايل من الداتابيز
    res.json({ message: 'User Profile' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};