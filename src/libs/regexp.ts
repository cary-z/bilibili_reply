export function stringToRegexp(str: string) {
  const escapeArr = [
    "^",
    "$",
    ".",
    "*",
    "+",
    "?",
    "|",
    "\\",
    "/",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "-",
    ",",
  ];
  const regexp_special = new RegExp(`(\\${escapeArr.join("|\\")})`, "g");
  const new_str = str.replace(regexp_special, "\\$1");
  return new RegExp(new_str, "g")
}