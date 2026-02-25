// Code execution is now handled by the backend
import axiosInstance from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    console.log("Sending code to backend for execution...");
    
    const response = await axiosInstance.post("/chat/execute", {
      language,
      code,
    });

    console.log("Code execution response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error executing code:", error);
    return {
      success: false,
      error: `Failed to execute code: ${error.response?.data?.error || error.message}`,
    };
  }
}
