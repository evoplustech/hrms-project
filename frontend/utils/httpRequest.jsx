const httpRequest = async ({path,method='',params='',data={}}) => {
  let result = '';
  try {
    let url = path;
    const options = {
      method: method.toUpperCase(),
      headers: { "Content-Type": "application/json", 'Cache-Control': 'no-cache' },
    };

    // Handle GET request: Add query params if `params` is provided
    // if (method.toLowerCase() === 'get' && params) {
    //   const queryParams = new URLSearchParams(params).toString();
    //   url = `${path}?${queryParams}`;
    // }

    // Handle POST, PUT, PATCH: Add body data if `data` is provided
    if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put' || method.toLowerCase() === 'patch') {
      if (data) {
        options.body = JSON.stringify(data);
      }
    }

    // Handle PUT, PATCH, DELETE: Append `params` to URL if required 
    if (method.toLowerCase() === 'put' || method.toLowerCase() === 'patch' || method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') {
      if (params) {
        url = `${path}/${params}`; // Adding params to the URL (like /resource/{id})
      }
    }

    // Perform the HTTP request
    const response = await fetch(url, options);
    
    if (!response.ok) throw new Error("Http Request Failed. Try Again");

    result = await response.json();

  } catch (error) {
    console.log(error.message);
    result = { "Error": error.message,success:false};
  } finally {
    return result;
  }
};

export default httpRequest;