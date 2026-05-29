const fs = require("fs");
const path = require("path");

const files = [
  "ChatWindow.tsx",
  "BranchNavigator.tsx",
  "FileViewer.tsx",
  "MessageView.tsx",
  "ModelsConfig.tsx",
  "SessionSidebar.tsx",
  "TabBar.tsx",
];

for (const file of files) {
  const fp = path.join(__dirname, "..", "components", file);
  let content = fs.readFileSync(fp, "utf8");
  const original = content;

  // Pattern: "export function Name({\n  const t = useTranslation(); params..." 
  // Fix by moving const t to after the function body opening brace
  content = content.replace(
    /(export (function|const) \w+[^\{]*)\{\n(  const t = useTranslation\(\); )([^\}]+\}[\s\S]*?)\{\n/,
    (match, prefix, _kw, _hook, paramsAndRest, _brace) => {
      // prefix ends with "Name(" or "Name<T>("
      // paramsAndRest contains "params }: Props) {" or similar
      // We need to find the closing ") {" that starts the body
      const idx = paramsAndRest.indexOf("{");
      if (idx === -1) return match;
      const beforeBody = paramsAndRest.slice(0, idx);
      const afterBodyOpen = paramsAndRest.slice(idx + 1);
      return prefix + "{" + beforeBody + "{\n  const t = useTranslation();" + afterBodyOpen;
    }
  );

  if (content !== original) {
    fs.writeFileSync(fp, content, "utf8");
    console.log("Fixed", file);
  } else {
    console.log("No fix needed", file);
  }
}
