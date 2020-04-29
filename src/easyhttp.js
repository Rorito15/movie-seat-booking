/* eslint-disable class-methods-use-this */
class EasyHttp {
  // GET
  async get(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response.json();
  }

  // POST
  async post(url, data) {
    const response = await fetch(url, {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response.json();
  }

  // PUT
  async put(url, data) {
    const response = await fetch(url, {
      method: "put",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    return response.json();
  }

  // DELETE
  async delete(url) {
    const response = await fetch(url, {
      method: "delete"
    });

    if (!response.ok) {
      throw Error(response.statusText);
    }

    return "Post deleted";
  }
}

export const http = new EasyHttp();
