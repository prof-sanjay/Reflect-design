export const uploadMedia = (req, res) => {
  try {
    const files = req.files.map((file) => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      originalname: file.originalname,
    }));

    res.status(200).json({
      message: "Media uploaded successfully",
      files,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
};
