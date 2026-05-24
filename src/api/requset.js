import axios from "axios";

const baseURL = "http://127.0.0.1:3300";

const request = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export function post(url, data) {
  return request.post(url, data);
}

export function get(url, params) {
  return request.get(url, { params });
}

// 流式输出
export async function fetchStream(url, data, onChunk, onComplete, onError) {
  const controller = new AbortController();
  const signal = controller.signal;

  const fullUrl = `${baseURL}/travel${url}`;

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      signal,
    });

    const reader = response.body.getReader();

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter((line) => line.trim());
      for (const line of lines) {
        try {
          console.log(line);
          if (line.startsWith("data: ")) {
            console.log(line);
            const jsonStr = line.substring(6);
            console.log(jsonStr);
            const jsonData = JSON.parse(jsonStr);
            if (jsonData.type === "chunk") {
              console.log(jsonData.content);
              onChunk(jsonData.content);
            } else if (jsonData.done) {
              onComplete(jsonData.data);
            } else if (jsonData.error) {
              onError(jsonData.error);
            }
          }
        } catch (error) {
          onError("流式数据解析错误");
        }
      }
    }
  } catch (error) {
    console.error("流式请求错误:", error);
    onError(error);
  } finally {
    controller.abort();
  }
}

export default request;
