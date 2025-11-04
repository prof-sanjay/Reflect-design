export const uploadMedia = async (formData) => {
  try {
    const res = await fetch("http://localhost:5000/api/media/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};
