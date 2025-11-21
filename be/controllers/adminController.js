// be/controllers/adminController.js
import User from "../models/userModel.js";
import Prompt from "../models/Prompt.js";
import Notification from "../models/Notification.js";
import AdminAlert from "../models/AdminAlert.js";
import Reflection from "../models/Reflection.js";

// Get all users with filters
export const getAllUsers = async (req, res) => {
  try {
    const { role, riskLevel, isActive } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const users = await User.find(filter)
      .select('-password')
      .populate('assignedTherapist', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user role or risk level
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true })
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign therapist to user
export const assignTherapist = async (req, res) => {
  try {
    const { userId, therapistId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { assignedTherapist: therapistId },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create alert
    await AdminAlert.create({
      user: userId,
      alertType: "therapist_assigned",
      severity: "medium",
      description: `Therapist assigned to user ${user.username}`,
      relatedData: { therapistId },
    });

    res.status(200).json({ message: "Therapist assigned successfully", user });
  } catch (error) {
    console.error("Assign therapist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create prompt
export const createPrompt = async (req, res) => {
  try {
    const { text, category } = req.body;
    const adminId = req.user._id;

    const prompt = await Prompt.create({
      text,
      category,
      createdBy: adminId,
    });

    res.status(201).json({ message: "Prompt created successfully", prompt });
  } catch (error) {
    console.error("Create prompt error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all prompts
export const getAllPrompts = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const prompts = await Prompt.find(filter).sort({ createdAt: -1 });
    res.status(200).json(prompts);
  } catch (error) {
    console.error("Get prompts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update prompt
export const updatePrompt = async (req, res) => {
  try {
    const { promptId } = req.params;
    const updates = req.body;

    const prompt = await Prompt.findByIdAndUpdate(promptId, updates, { new: true });

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    res.status(200).json({ message: "Prompt updated successfully", prompt });
  } catch (error) {
    console.error("Update prompt error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete prompt
export const deletePrompt = async (req, res) => {
  try {
    const { promptId } = req.params;

    const prompt = await Prompt.findByIdAndUpdate(
      promptId,
      { isActive: false },
      { new: true }
    );

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }

    res.status(200).json({ message: "Prompt deleted successfully" });
  } catch (error) {
    console.error("Delete prompt error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Send broadcast notification
export const sendBroadcastNotification = async (req, res) => {
  try {
    const { title, message, priority } = req.body;
    const adminId = req.user._id;

    // Get all active users
    const users = await User.find({ isActive: true, role: 'user' });

    // Create notifications for all users
    const notifications = users.map(user => ({
      user: user._id,
      type: 'broadcast',
      title,
      message,
      priority: priority || 'medium',
      sentBy: adminId,
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      message: "Broadcast sent successfully",
      recipientCount: users.length,
    });
  } catch (error) {
    console.error("Broadcast notification error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all alerts
export const getAlerts = async (req, res) => {
  try {
    const { isResolved, severity } = req.query;
    const filter = {};
    
    if (isResolved !== undefined) filter.isResolved = isResolved === 'true';
    if (severity) filter.severity = severity;

    const alerts = await AdminAlert.find(filter)
      .populate('user', 'username email riskLevel')
      .populate('resolvedBy', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json(alerts);
  } catch (error) {
    console.error("Get alerts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resolve alert
export const resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const adminId = req.user._id;

    const alert = await AdminAlert.findByIdAndUpdate(
      alertId,
      {
        isResolved: true,
        resolvedBy: adminId,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.status(200).json({ message: "Alert resolved successfully", alert });
  } catch (error) {
    console.error("Resolve alert error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Monitor user risk levels
export const monitorRiskLevels = async (req, res) => {
  try {
    // Find users with high/critical risk
    const riskyUsers = await User.find({
      riskLevel: { $in: ['high', 'critical'] },
      isActive: true,
    }).select('-password');

    // Check for recent negative moods
    const negativeMoods = ['sad', 'angry', 'anxious'];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    for (const user of riskyUsers) {
      const recentReflections = await Reflection.find({
        user: user._id,
        date: { $gte: weekAgo },
        mood: { $in: negativeMoods },
      });

      if (recentReflections.length >= 3) {
        // Create alert if not already exists
        const existingAlert = await AdminAlert.findOne({
          user: user._id,
          alertType: 'multiple_negative_moods',
          isResolved: false,
        });

        if (!existingAlert) {
          await AdminAlert.create({
            user: user._id,
            alertType: 'multiple_negative_moods',
            severity: 'high',
            description: `User ${user.username} has ${recentReflections.length} negative moods in the past week`,
            relatedData: { count: recentReflections.length },
          });
        }
      }
    }

    res.status(200).json({
      message: "Risk monitoring completed",
      riskyUsersCount: riskyUsers.length,
    });
  } catch (error) {
    console.error("Monitor risk levels error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
