export function setURLParam(params) {
  const searchParams = new URLSearchParams(window.location.search);
  for (var [key, value] of Object.entries(params)) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);
    // Use URLSearchParams for easier manipulation of query strings
    // Set the new or updated key-value pair
    searchParams.set(key, value);
  }
  // Construct the new query string
  const newQueryString = searchParams.toString();
  // Reload page with new query string
  window.location.href = window.location.pathname + "?" + newQueryString;
}

export function getURLParams() {
  // Use URLSearchParams for easier manipulation of query strings
  const searchParams = new URLSearchParams(window.location.search);
  // Return the value associated with the given key
  const params = {};
  searchParams.entries().forEach(([k, v]) => {
    const key = decodeURIComponent(k);
    const value = decodeURIComponent(v);
    params[key] = value;
  });
  return params;
}
