import Profile from "../models/Profile.js";

// SAVE or UPDATE Profile
export const saveProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, alias, phone, gender, dob, starSign, prompts } = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (profile) {
      // Update existing profile
      profile.name = name;
      profile.alias = alias;
      profile.phone = phone;
      profile.gender = gender;
      profile.dob = dob;
      profile.starSign = starSign;
      profile.prompts = prompts;

      await profile.save();

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    }

    // Create new profile
    const newProfile = await Profile.create({
      user: userId,
      name,
      alias,
      phone,
      gender,
      dob,
      starSign,
      prompts,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    console.log("Profile error:", error);
    res.status(500).json({ message: "Server error while saving profile" });
  }
};


// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.log("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
