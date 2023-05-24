const sendToWhisper = async (uri: string, openai_key: string): Promise<any> => {
  const model = "whisper-1";
  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "audio/wav",
    name: "recording.wav",
  });
  formData.append("model", model);
  formData.append("language", "fi");
  try {
    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openai_key}`,
        },
        body: formData,
      }
    );
    const data = await response.json();
    console.log("data:", data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
