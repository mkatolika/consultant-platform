const configuredApiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
  "https://ca-qhawe-api-dev-001.wittytree-334dca11.southafricanorth.azurecontainerapps.io";

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");