import axios from "axios";

export const client = axios.create();
client.defaults.headers.patch["Content-Type"] = "application/json";
client.defaults.headers.post["Content-Type"] = "application/json";

export const BACK_URL = "http://127.0.0.1:9898";
