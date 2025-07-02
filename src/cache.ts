/*
1: JSON.stringfy --> set --> get --> JSON.parse
2: data format well return as set`s
3: undefined in array will be null after stringfy+parse
4: NS --> namespace
*/
let keyNS = "mydoge-faucet-";

function get(key: string) {
  /*
    legal data: "" [] {} null flase true

    illegal: undefined
        1: key not set
        2: key is cleared
        3: key removed
        4: wrong data format
    */
  const tempKey = keyNS + key;
  if (!isKeyExist(tempKey)) {
    return null;
  }
  // maybe keyNS could avoid conflict
  let val: { data: any; type: string } | null = null;
  try {
    const data: string = window.localStorage.getItem(tempKey) || window.sessionStorage.getItem(tempKey) || "";
    val = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  // val format check
  if (
    val !== null &&
    Object.prototype.hasOwnProperty.call(val, "type") &&
    Object.prototype.hasOwnProperty.call(val, "data")
  ) {
    return val["data"];
  }
  return null;
}
// isPersistent
function set(key: string, val: any, isTemp: boolean) {
  let store;
  if (isTemp) {
    store = window.sessionStorage;
  } else {
    store = window.localStorage;
  }

  const data = JSON.stringify({
    data: val,
    time: new Date().getTime(), //for manage by time limit
    type: typeof val,
  });
  try {
    store.setItem(keyNS + key, data);
    return true;
  } catch (e) {
    // if (e.name.toUpperCase().indexOf("QUOTA") >= 0) {
    //   window.localStorage.clear();
    //   store.setItem(keyNS + key, data);
    // }
  }
}

function remove(key: string) {
  const tempKey = keyNS + key;
  window.localStorage.removeItem(tempKey);
  window.sessionStorage.removeItem(tempKey);
}

function isKeyExist(key: string) {
  // do not depend on value cause of "",0
  return (
    Object.prototype.hasOwnProperty.call(window.localStorage, key) ||
    Object.prototype.hasOwnProperty.call(window.sessionStorage, key)
  );
}

function setKeyNS(NS: string) {
  const isString = typeof NS === "string";
  if (isString && NS !== "") {
    keyNS = NS;
  }
}

export { get, remove, set, setKeyNS };
