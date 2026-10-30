
export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.response?.status === 404) {
    return "The requested application was not found.";
  }

  if (error.request) {
    return "Unable to connect to the server. Please try again later.";
  }

  return fallback;
};
